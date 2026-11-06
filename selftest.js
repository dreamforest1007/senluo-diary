const fs=require('fs'),vm=require('vm'),assert=require('assert');
let notices=[];let answer='';
const d={settings:{},tx:[{type:'expense',category:'飲食',amount:120,date:'2026-11-07'},{type:'expense',category:'飲食',subcategory:'飲料',amount:50,date:'2026-11-07'}]};
const ctx={
 db:d,esc:s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'),
 num:n=>Number(n)||0,money:n=>'NT$ '+n.toLocaleString('zh-TW'),
 document:{addEventListener(){},createElement(){return {textContent:''}},head:{appendChild(){}}},
 v6Mutate:cb=>{cb();return true},toast:s=>notices.push(s),prompt:()=>answer
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/finance-categories.js','utf8'),ctx);
assert.equal(vm.runInContext('v11Tree("expense").length',ctx),13);
assert.equal(vm.runInContext('v11Tree("income").length',ctx),5);
assert(vm.runInContext('v11FinanceFields({type:"expense",category:"飲食"})',ctx).includes('飲料'));
assert(vm.runInContext('v11FinanceFields({type:"income",category:"工作收入"})',ctx).includes('正職薪資'));
assert(vm.runInContext('v11FinanceSubSummary(db.tx)',ctx).includes('飲食｜未細分'));
assert(vm.runInContext('v11FinanceSubSummary(db.tx)',ctx).includes('飲食｜飲料'));
assert.equal(vm.runInContext('v11FinanceNormalize({type:"income",category:"工作收入",subcategory:"正職薪資"}).subcategory',ctx),'正職薪資');
assert.equal(d.tx.length,2,'old transactions remain untouched');
const sel={type:{value:'expense'},category:{value:'飲食',innerHTML:''},subcategory:{value:'飲料',innerHTML:''}};
const mg={querySelector(q){return q==='[data-v11-manage-main]'?{value:'0'}:q==='[data-v11-manage-sub]'?{value:'0'}:null},innerHTML:''};
const form={querySelector(q){if(q==='[name="type"]')return sel.type;if(q==='[name="category"]')return sel.category;if(q==='[name="subcategory"]')return sel.subcategory;if(q==='[data-v11-manager]')return mg;return null}};
ctx.testForm=form;answer='手搖飲';vm.runInContext('v11SaveCategoryAction(testForm,"addSub")',ctx);
assert(d.settings.financeCategories.expense[0].children.some(c=>c.name==='手搖飲'));
assert.equal(d.tx.length,2);
console.log('PASS: defaults, picker, legacy stats, independent income, custom subcategory, old record preservation');
