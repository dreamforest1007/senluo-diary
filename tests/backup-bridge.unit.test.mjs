import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Tests the actual cloud bridge body extracted from index.html, with a fake,
// in-memory Firestore API. No network, production Firebase, or personal data.
const html=readFileSync(new URL('../index.html', import.meta.url),'utf8');
const begin=html.indexOf('function checkedBackupRef(uid){');
const end=html.indexOf('const provider=new GoogleAuthProvider();',begin);
assert.ok(begin!==-1&&end>begin,'Cloud bridge must be present in the deployed HTML');
const bridgeSource=html.slice(begin,end);
function makeFakeDatabase(initial={}){
 const storage=new Map(Object.entries(initial));
 const auth={currentUser:{uid:'test-user-a'}};
 let counter=0, commits=0, failCommit=false;
 const clone=v=>structuredClone(v);
 const ref=(path)=>({path});
 function doc(parent,...parts){
  if(typeof parent==='object'&&parent.path){
   if(parts.length===0)return ref(parent.path+'/auto-'+(++counter));
   return ref(parent.path+'/'+parts.join('/'));
  }
  return ref(parts.join('/'));
 }
 function collection(parent,...parts){return ref(parts.join('/'));}
 const query=(p,...args)=>({path:p.path,args});
 const orderBy=(key,dir)=>({orderBy:key,dir});
 const limit=n=>({limit:n});
 const toSnap=(path)=>({id:path.split('/').at(-1),exists:()=>storage.has(path),data:()=>clone(storage.get(path))});
 const getDocFromServer=async r=>toSnap(r.path);
 const getDocsFromServer=async q=>{
  const prefix=q.path+'/';
  const entries=[...storage.keys()].filter(k=>k.startsWith(prefix)&&k.slice(prefix.length).split('/').length===1);
  entries.sort((a,b)=>{
   const x=storage.get(a).savedAt, y=storage.get(b).savedAt;
   return y.value-x.value;
  });
  const max=q.args.find(a=>a.limit)?.limit??Infinity;
  const docs=entries.slice(0,max).map(toSnap);
  return {empty:docs.length===0,docs};
 };
 const writeBatch=()=>{
  const mutations=[];
  return {set:(p,data)=>mutations.push([p.path,clone(data)]),commit:async()=>{
   commits++;
   if(failCommit)throw Object.assign(new Error('simulated commit failure'),{code:'unavailable'});
   for(const [key,value] of mutations)storage.set(key,value);
  }};
 };
 const serverTimestamp=()=>({value:Date.now()+counter});
 const ctx={auth,firestore:{},window:{},TextEncoder,doc,collection,query,orderBy,limit,getDocFromServer,getDocsFromServer,writeBatch,serverTimestamp,Error,JSON,Date};
 vm.runInNewContext(bridgeSource,ctx,{timeout:2000});
 return {api:ctx.window.sylvaCloud,auth,storage,get commits(){return commits;},set failCommit(v){failCommit=v;}};
}
const latest='users/test-user-a/backups/latest';
const versions=latest+'/versions/';
const snapshot=(n)=>({diaries:[],tasks:[{id:n}],tx:[]});
const record=(n)=>({format:'sylva-life-snapshot-v1',payload:JSON.stringify(snapshot(n)),savedAt:{value:n*1000},clientSavedAt:'2026-10-27T01:00:00.000Z'});

test('New Google account: write latest and one immutable version together',async()=>{
 const db=makeFakeDatabase();
 await db.api.save('test-user-a',snapshot(1));
 assert.equal(db.commits,1);
 assert.equal(db.storage.get(latest).format,'sylva-life-snapshot-v1');
 const vers=[...db.storage.keys()].filter(k=>k.startsWith(versions));
 assert.equal(vers.length,1);
 assert.equal(db.storage.get(latest).payload,db.storage.get(vers[0]).payload);
});

test('First V1->V2 upload preserves original latest AND new version',async()=>{
 const old=record(7);
 const db=makeFakeDatabase({[latest]:old});
 await db.api.save('test-user-a',snapshot(8));
 const vers=[...db.storage.keys()].filter(k=>k.startsWith(versions));
 assert.equal(vers.length,2);
 assert.ok(vers.some(k=>db.storage.get(k).payload===old.payload));
 assert.ok(vers.some(k=>db.storage.get(k).payload===JSON.stringify(snapshot(8))));
 assert.equal(db.storage.get(latest).payload,JSON.stringify(snapshot(8)));
 assert.deepEqual(old,record(7));
});

test('Later uploads append history; none of prior history is overwritten',async()=>{
 const db=makeFakeDatabase();
 await db.api.save('test-user-a',snapshot(1));
 const originalKey=[...db.storage.keys()].find(k=>k.startsWith(versions));
 await db.api.save('test-user-a',snapshot(2));
 assert.equal([...db.storage.keys()].filter(k=>k.startsWith(versions)).length,2);
 assert.equal(db.storage.get(originalKey).payload,JSON.stringify(snapshot(1)));
});

test('Failed batch leaves both latest and history unchanged',async()=>{
 const db=makeFakeDatabase({[latest]:record(3)});
 db.failCommit=true;
 await assert.rejects(db.api.save('test-user-a',snapshot(4)));
 assert.equal(db.storage.size,1);
 assert.equal(db.storage.get(latest).payload,record(3).payload);
});

test('Other UID cannot use read/write API for account owner',async()=>{
 const db=makeFakeDatabase({[latest]:record(1)});
 db.auth.currentUser={uid:'test-user-b'};
 await assert.rejects(db.api.read('test-user-a'),/unauthorized-user/);
 await assert.rejects(db.api.save('test-user-a',snapshot(2)),/unauthorized-user/);
 assert.equal(db.storage.size,1);
});

test('Too-large UTF-8 payload rejected before write',async()=>{
 const db=makeFakeDatabase();
 await assert.rejects(db.api.save('test-user-a',{diaries:[],tasks:[],tx:[],note:'多'.repeat(210000)}),/too-large/);
 assert.equal(db.storage.size,0);
});

test('History listing returns 5 newest versions and readVersion restores correct snapshot',async()=>{
 const initial={[latest]:record(50)};
 for(let i=1;i<=7;i++)initial[versions+`version-${i}`]=record(i);
 const db=makeFakeDatabase(initial);
 const found=await db.api.listVersions('test-user-a');
 assert.equal(found.length,5);
 assert.deepEqual(Array.from(found,v=>v.id),['version-7','version-6','version-5','version-4','version-3']);
 const result=await db.api.readVersion('test-user-a','version-6');
 assert.equal(result.snapshot.tasks[0].id,6);
 await assert.rejects(db.api.readVersion('test-user-a','../../another-account'),/bad-version-id/);
});

test('Broken old latest aborts V1 migration without destroying it',async()=>{
 const malformed={foo:'bar'};
 const db=makeFakeDatabase({[latest]:malformed});
 await assert.rejects(db.api.save('test-user-a',snapshot(1)),/bad-data/);
 assert.deepEqual(db.storage.get(latest),malformed);
 assert.equal(db.storage.size,1);
});
