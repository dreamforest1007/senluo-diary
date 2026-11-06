/* 森羅生活｜收支主分類＋子分類（11.1）。不清除舊帳目，不覆蓋雲端資料。 */
'use strict';
const V11_FINANCE_DEFAULTS = {
  expense: [
    ['飲食',['早餐','午餐','晚餐','宵夜','飲料','甜點','零食','食材','外送','聚餐']],
    ['居住',['房租','水費','電費','瓦斯','家具','清潔用品','維修']],
    ['通訊',['手機月租','網路費','通話費','訂閱服務']],
    ['交通',['公車','火車','捷運','計程車','加油','停車','車輛保養']],
    ['購物',['服飾','鞋子','包包','飾品','美妝','保養','生活用品','電子產品']],
    ['醫療健康',['門診掛號','藥品','牙科','健康檢查','心理諮商','運動健身']],
    ['娛樂休閒',['電影','動漫','遊戲','旅遊','演唱會','追星','興趣用品']],
    ['學習',['書籍','課程','文具','學費','技能培訓']],
    ['人情社交',['禮物','紅包','捐款','聚會','節日支出']],
    ['財務',['利息','手續費','貸款還款','分期付款']],
    ['寵物',['飼料','零食','玩具','醫療','美容']],
    ['保險稅務',['保險費','稅金']],
    ['其他',['雜項']]
  ],
  income: [
    ['工作收入',['正職薪資','兼職薪資','加班費','獎金','津貼']],
    ['副業收入',['接案','創作收入','商品販售','平台收益']],
    ['投資收益',['銀行利息','股息','投資獲利']],
    ['補助與禮金',['政府補助','獎學金','紅包','親友贈與']],
    ['其他收入',['退款','報銷','二手物品出售','其他']]
  ]
};
function v11DefaultTree(type){return (V11_FINANCE_DEFAULTS[type]||V11_FINANCE_DEFAULTS.expense).map(([name,children])=>({name,disabled:false,children:children.map(n=>({name:n,disabled:false}))}));}
function v11Tree(type){const data=db?.settings?.financeCategories?.[type];return Array.isArray(data)?data:v11DefaultTree(type);}
function v11Prepare(){if(!db.settings||typeof db.settings!=='object')db.settings={};if(!db.settings.financeCategories||typeof db.settings.financeCategories!=='object')db.settings.financeCategories={expense:v11DefaultTree('expense'),income:v11DefaultTree('income')};for(const type of ['expense','income'])if(!Array.isArray(db.settings.financeCategories[type]))db.settings.financeCategories[type]=v11DefaultTree(type);return db.settings.financeCategories;}
function v11Option(value,label,selected,disabled=false){return `<option value="${esc(value)}" ${String(value)===String(selected)?'selected':''} ${disabled?'disabled':''}>${esc(label)}</option>`;}
function v11MainOptions(type,selected){const cats=v11Tree(type),active=cats.filter(x=>!x.disabled);let html=active.map(x=>v11Option(x.name,x.name,selected)).join('');if(selected&&!active.some(x=>x.name===selected))html+=v11Option(selected,selected+'（舊分類／已停用）',selected);return html;}
function v11ChildOptions(type,category,selected){const cat=v11Tree(type).find(x=>x.name===category),active=(cat?.children||[]).filter(x=>!x.disabled);let html=v11Option('','未細分（選填）',selected);html+=active.map(x=>v11Option(x.name,x.name,selected)).join('');if(selected&&!active.some(x=>x.name===selected))html+=v11Option(selected,selected+'（舊子分類／已停用）',selected);return html;}
function v11ManagerMarkup(form,mainIndex){const type=form.querySelector('[name="type"]')?.value==='income'?'income':'expense',tree=v11Tree(type);const k=tree.length?Math.min(Math.max(0,Number(mainIndex)||0),tree.length-1):0,c=tree[k],children=c?.children||[];return `<p class="note">可以自行新增、改名、排序或停用分類；舊帳目維持原本的分類與金額。</p>
<div class="field"><label>要管理的主分類</label><select data-v11-manage-main>${tree.map((x,i)=>v11Option(i,x.name+(x.disabled?'（已停用）':''),k)).join('')}</select></div>
<div class="v11Tools"><button type="button" class="btn sm subtle" data-v11-act="addMain">＋新增主分類</button><button type="button" class="btn sm subtle" data-v11-act="renameMain">重新命名</button><button type="button" class="btn sm subtle" data-v11-act="moveMainUp">上移</button><button type="button" class="btn sm subtle" data-v11-act="moveMainDown">下移</button><button type="button" class="btn sm ${c?.disabled?'subtle':'danger'}" data-v11-act="toggleMain">${c?.disabled?'重新啟用':'停用分類'}</button></div>
<div class="field"><label>要管理的子分類</label><select data-v11-manage-sub>${children.map((x,i)=>v11Option(i,x.name+(x.disabled?'（已停用）':''),0)).join('')||'<option value="">尚無子分類</option>'}</select></div>
<div class="v11Tools"><button type="button" class="btn sm subtle" data-v11-act="addSub">＋新增子分類</button><button type="button" class="btn sm subtle" data-v11-act="renameSub">重新命名</button><button type="button" class="btn sm subtle" data-v11-act="moveSubUp">上移</button><button type="button" class="btn sm subtle" data-v11-act="moveSubDown">下移</button><button type="button" class="btn sm ${children[0]?.disabled?'subtle':'danger'}" data-v11-act="toggleSub">停用／重新啟用</button></div>`;}
function v11FinanceFields(r={}){const type=r.type==='income'?'income':'expense',tree=v11Tree(type),category=tree.some(x=>x.name===r.category)?r.category:(r.category||tree.find(x=>!x.disabled)?.name||''),sub=r.subcategory||'';return `<div class="row v11CategoryFields"><div class="field"><label>主分類</label><select name="category" required>${v11MainOptions(type,category)}</select></div><div class="field"><label>子分類（選填）</label><select name="subcategory">${v11ChildOptions(type,category,sub)}</select></div></div><details class="v11CategoryManager"><summary>⚙ 管理與自訂分類</summary><div data-v11-manager>${v11ManagerMarkup({querySelector:q=>({value:type})},0)}</div></details>`;}
function v11FinanceNormalize(f){const type=f.type==='income'?'income':'expense',cat=String(f.category||'').trim().slice(0,40),sub=String(f.subcategory||'').trim().slice(0,40);if(!cat)throw Error('請先選擇收支主分類');return {category:cat,subcategory:sub};}
function v11UpdateFields(form,category='',subcategory='',managerIndex){if(!form?.querySelector('[name="subcategory"]'))return;const type=form.querySelector('[name="type"]')?.value==='income'?'income':'expense',catSel=form.querySelector('[name="category"]'),subSel=form.querySelector('[name="subcategory"]');if(!catSel||!subSel)return;const cats=v11Tree(type).filter(c=>!c.disabled);const oldCat=category||catSel.value;const chosen=cats.some(c=>c.name===oldCat)?oldCat:(cats[0]?.name||oldCat);catSel.innerHTML=v11MainOptions(type,chosen);catSel.value=chosen;subSel.innerHTML=v11ChildOptions(type,chosen,subcategory);subSel.value=subcategory;const mgr=form.querySelector('[data-v11-manager]');if(mgr)mgr.innerHTML=v11ManagerMarkup(form,managerIndex??(Number(mgr.querySelector('[data-v11-manage-main]')?.value)||0));}
function v11RefreshManager(form){const mgr=form.querySelector('[data-v11-manager]');if(!mgr)return;const m=mgr.querySelector('[data-v11-manage-main]')?.value||0;mgr.innerHTML=v11ManagerMarkup(form,m);}
function v11AskName(label,current=''){const answer=prompt(label,current);if(answer===null)return null;const name=answer.trim();if(!name||name.length>30||/[\r\n<>]/.test(name)){toast('分類名稱應為 1～30 字，且不可包含換行或尖括號');return null;}return name;}
function v11SaveCategoryAction(form,act){const type=form.querySelector('[name="type"]')?.value==='income'?'income':'expense',mgr=form.querySelector('[data-v11-manager]');if(!mgr)return;const i=Number(mgr.querySelector('[data-v11-manage-main]')?.value||0),j=Number(mgr.querySelector('[data-v11-manage-sub]')?.value||0),existing=v11Tree(type),cat=existing[i],child=cat?.children?.[j];let name=null;
  if(act==='addMain'||act==='addSub')name=v11AskName('請輸入新分類名稱');
  if(act==='renameMain'&&cat)name=v11AskName('修改主分類名稱',cat.name);
  if(act==='renameSub'&&child)name=v11AskName('修改子分類名稱',child.name);
  if(['addMain','addSub','renameMain','renameSub'].includes(act)&&name===null)return;
  if(act==='toggleMain'&&!cat)return;
  if(act==='toggleMain'&&!cat.disabled&&existing.filter(c=>!c.disabled).length<=1){toast('請至少保留一個啟用中的主分類');return;}
  const currentCat=form.querySelector('[name="category"]')?.value||'',currentSub=form.querySelector('[name="subcategory"]')?.value||'';let nextCat=currentCat,nextSub=currentSub,nextIndex=i;
  const ok=v6Mutate(()=>{const tree=v11Prepare()[type],item=tree[i],leaf=item?.children?.[j];const unique=(items,n,exclude=-1)=>!items.some((x,idx)=>idx!==exclude&&x.name===n);
    switch(act){
      case 'addMain': if(tree.length>=60)throw Error('主分類最多 60 個');if(!unique(tree,name))throw Error('已有同名主分類');tree.push({name,disabled:false,children:[]});nextCat=name;nextSub='';nextIndex=tree.length-1;break;
      case 'addSub':if(!item)throw Error('請先選擇主分類');if(item.children.length>=60)throw Error('子分類最多 60 個');if(!unique(item.children,name))throw Error('已有同名子分類');item.children.push({name,disabled:false});nextCat=item.name;nextSub=name;break;
      case 'renameMain':if(!item)throw Error('找不到分類');if(!unique(tree,name,i))throw Error('已有同名主分類');if(nextCat===item.name)nextCat=name;item.name=name;break;
      case 'renameSub':if(!leaf)throw Error('請先選擇子分類');if(!unique(item.children,name,j))throw Error('已有同名子分類');if(nextCat===item.name&&nextSub===leaf.name)nextSub=name;leaf.name=name;break;
      case 'toggleMain':item.disabled=!item.disabled;break;
      case 'toggleSub':if(!leaf)throw Error('請先選擇子分類');leaf.disabled=!leaf.disabled;break;
      case 'moveMainUp':if(i>0){[tree[i-1],tree[i]]=[tree[i],tree[i-1]];nextIndex=i-1;}break;
      case 'moveMainDown':if(i<tree.length-1){[tree[i+1],tree[i]]=[tree[i],tree[i+1]];nextIndex=i+1;}break;
      case 'moveSubUp':if(!leaf)return;if(j>0)[item.children[j-1],item.children[j]]=[item.children[j],item.children[j-1]];break;
      case 'moveSubDown':if(!leaf)return;if(j<item.children.length-1)[item.children[j+1],item.children[j]]=[item.children[j],item.children[j+1]];break;
      default:throw Error('未知操作');
    }
  });
  if(ok){v11UpdateFields(form,nextCat,nextSub,nextIndex);toast('分類已儲存');}
}
function v11FinanceSubSummary(tx){const sums={};tx.filter(t=>t.type==='expense').forEach(t=>{const main=t.category||'其他',sub=t.subcategory||'未細分',key=main+'｜'+sub;sums[key]=(sums[key]||0)+num(t.amount);});const rows=Object.entries(sums).sort((a,b)=>b[1]-a[1]);return `<details class="v11Breakdown"><summary>查看支出子分類統計（${rows.length} 項）</summary>${rows.map(([name,value])=>`<div class="row between v11BreakdownRow"><span>${esc(name)}</span><strong>${money(value)}</strong></div>`).join('')||'<p class="note">這個月尚無支出紀錄。</p>'}</details>`;}
document.addEventListener('change',event=>{const el=event.target,form=el.closest('form');if(!form||!form.querySelector('[name="subcategory"]'))return;if(el.matches('[name="type"]'))v11UpdateFields(form,'','',0);else if(el.matches('[name="category"]'))v11UpdateFields(form,el.value,'');else if(el.matches('[data-v11-manage-main]'))v11RefreshManager(form);});
document.addEventListener('click',event=>{const btn=event.target.closest('button[data-v11-act]');if(!btn)return;const form=btn.closest('form');if(!form)return;event.preventDefault();try{v11SaveCategoryAction(form,btn.dataset.v11Act);}catch(error){toast(error.message||'分類操作失敗');}});
(function(){const style=document.createElement('style');style.textContent='.v11CategoryManager{padding:12px;border:1px solid #d8e6d8;border-radius:13px;background:#f5f8f1}.v11CategoryManager summary,.v11Breakdown summary{font-size:13px;color:var(--forest,#275c45);font-weight:700;cursor:pointer}.v11CategoryManager [data-v11-manager]{display:grid;gap:12px;padding-top:10px}.v11Tools{display:flex;flex-wrap:wrap;gap:7px}.v11Tools button{white-space:normal}.v11Breakdown{margin-top:18px;padding-top:13px;border-top:1px solid #dfe9df}.v11BreakdownRow{padding:9px 0;border-bottom:1px solid #edf0eb;font-size:13px}.v11CategoryFields .field{min-width:125px}@media(max-width:560px){.v11Tools button{flex:1 1 40%}}';document.head.appendChild(style);})();
