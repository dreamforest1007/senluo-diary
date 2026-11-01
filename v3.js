'use strict';
// Dates verified against CWA calendar tables, retrieved 2026-11-01.
// https://www.cwa.gov.tw/Data/astronomy/{2026,2027,2028}cal.pdf
const V4_CALENDAR={
 2026:{spring:'02-17',lantern:'03-03',dragon:'06-19',moon:'09-25'},
 2027:{spring:'02-06',lantern:'02-20',dragon:'06-09',moon:'09-15'},
 2028:{spring:'01-26',lantern:'02-09',dragon:'05-28',moon:'10-03'}
};
const V4_FESTIVALS={
 spring:{name:'春節團圓',symbol:'🏮',wish:'新春平安，日子慢慢有光。',detail:'暖紅・米金・燈籠窗花',colors:['#fff5e8','#a33232','#f1d9a7']},
 lantern:{name:'元宵燈火',symbol:'✦',wish:'萬家燈火，照亮每一個小願望。',detail:'夜紫・燈金・星點燈火',colors:['#f9f1fa','#694573','#eac77b']},
 dragon:{name:'端午青粽',symbol:'🌿',wish:'一葉清香，願妳自在安康。',detail:'竹青・糯米白・粽葉',colors:['#f1f6e9','#46693d','#c9d6a4']},
 moon:{name:'中秋月桂',symbol:'☾',wish:'月色溫柔，留一份團圓給自己。',detail:'月藍・桂花金・圓月',colors:['#f5f3ec','#3e557a','#dfbc75']},
 pumpkin:{name:'萬聖南瓜',symbol:'🎃',wish:'收集一點甜，也留一點小小魔法。',detail:'暖橙・莓紫・南瓜',colors:['#fff4e9','#794553','#eead69']},
 christmas:{name:'聖誕松林',symbol:'🎄',wish:'願平安與喜樂，住進日常裡。',detail:'松綠・莓紅・雪花',colors:['#f5f8f3','#275b48','#bb4e57']}
};
const V4_ORIGINAL={
 sunny:{name:'晴空漫遊',group:'天氣',symbol:'☀',wish:'留一片晴空，給今天的自己。',detail:'天藍・雲白・暖陽',colors:['#eff8ff','#356982','#ecc774']},
 rainy:{name:'雨聲書窗',group:'天氣',symbol:'☂',wish:'聽雨落下，讓心慢慢安靜。',detail:'霧藍・灰綠・窗邊雨滴',colors:['#edf3f3','#496c77','#c8d6ce']},
 snow:{name:'初雪小屋',group:'天氣',symbol:'❄',wish:'窗外落雪，屋裡留一盞暖光。',detail:'雪白・冰藍・木色',colors:['#f5f9fc','#526d88','#dbc2a6']},
 cat:{name:'黑貓茶館',group:'動物',symbol:'🐈‍⬛',wish:'一杯熱茶，一隻貓，慢慢過生活。',detail:'奶茶・墨棕・黑貓',colors:['#f7f0e6','#57463d','#cdaa75']},
 rabbit:{name:'白兔草原',group:'動物',symbol:'🐇',wish:'在柔軟的草地上，歇一會兒吧。',detail:'草綠・奶白・柔粉',colors:['#f5f7ec','#63764b','#edc9bf']},
 deer:{name:'小鹿林徑',group:'動物',symbol:'🦌',wish:'循著葉隙的光，走自己的小路。',detail:'苔綠・栗棕・林間小鹿',colors:['#f3f3e8','#5a6843','#c99f73']},
 fern:{name:'蕨葉秘境',group:'植物',symbol:'🌿',wish:'讓日常像新葉，一點一點舒展。',detail:'深綠・苔青・蕨葉',colors:['#eef5e9','#37664b','#aac58b']},
 lotus:{name:'荷風小築',group:'植物',symbol:'🪷',wish:'荷風輕輕，心事也可以慢慢說。',detail:'荷粉・水綠・漣漪',colors:['#fbf2f2','#557b72','#e6b5bc']},
 camellia:{name:'山茶花信',group:'植物',symbol:'🌸',wish:'把溫柔留給自己，靜候花開。',detail:'茶白・玫紅・花瓣',colors:['#fff5f1','#914d60','#e3b2ad']}
};
const V4_SCENES={...V4_FESTIVALS,...V4_ORIGINAL};
function v4TaipeiDate(date=new Date()){const p=new Intl.DateTimeFormat('en',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);const get=t=>p.find(x=>x.type===t).value;return `${get('year')}-${get('month')}-${get('day')}`;}
function v4Holiday(date=new Date()){
 const key=v4TaipeiDate(date),md=key.slice(5),year=Number(key.slice(0,4));
 if(md==='10-31')return 'pumpkin';
 if(md==='12-24'||md==='12-25')return 'christmas';
 const table=V4_CALENDAR[year];if(!table)return null;
 // Spring theme spans New Year's Eve through the fifth lunar day.
 const diff=(Date.parse(key+'T00:00:00Z')-Date.parse(year+'-'+table.spring+'T00:00:00Z'))/86400000;
 if(diff>=-1&&diff<=4)return 'spring';
 return ['lantern','dragon','moon'].find(name=>table[name]===md)||null;
}
function v4EffectiveTheme(date=new Date()){
 const selected=Object.hasOwn(V3_THEMES,db.settings.theme)?db.settings.theme:'forest';
 return db.settings.holidayAuto===true?(v4Holiday(date)||selected):selected;
}
function v4FestivalBanner(theme){const f=V4_SCENES[theme];if(!f)return '';return `<section class="festivalBanner festival-${theme}" aria-label="${f.name}主題"><div class="festivalDecor" aria-hidden="true"><span class="festivalSymbol">${f.symbol}</span><span class="festivalAccent">${theme==='spring'?'福':theme==='christmas'?'❄':V4_ORIGINAL[theme]?'·':'✦'}</span></div><div class="festivalCopy"><div class="festivalLabel">${f.name}</div><p>${f.wish}</p></div></section>`;}
function v4ThemeChooser(){const effective=v4EffectiveTheme();return `<h3>日常色調</h3><div class="chiprow">${Object.entries(V3_THEMES).filter(([key])=>!V4_SCENES[key]).map(([key,name])=>`<button class="btn ${effective===key?'':'subtle'}" data-v3-theme="${key}" aria-pressed="${effective===key}">${name}</button>`).join('')}</div><h3 style="margin-top:24px">節日衣櫥</h3><p class="note">喜歡就能隨時換上，不必等節日。手動選主題時，會關閉自動切換。</p><div class="festivalChoices">${Object.entries(V4_FESTIVALS).map(([key,f])=>`<button class="festivalChoice ${effective===key?'selected':''}" data-v3-theme="${key}" aria-pressed="${effective===key}"><span class="themeSwatches" aria-hidden="true">${f.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span><strong><span aria-hidden="true">${f.symbol}</span> ${f.name}</strong><span>${f.detail}</span></button>`).join('')}</div>${v4OriginalChooser(effective)}<div class="festivalAuto"><button class="btn ${db.settings.holidayAuto===true?'':'subtle'}" data-v4-auto aria-pressed="${db.settings.holidayAuto===true}">節日自動換色：${db.settings.holidayAuto===true?'開啟':'關閉'}</button><p class="note">開啟後，依臺灣日期在節日套用主題，平日回到妳手選的「${esc(V3_THEMES[db.settings.theme]||V3_THEMES.forest)}」。春節為除夕至初五；元宵、端午、中秋為當天；萬聖節 10/31；聖誕節 12/24–25。重新開啟或回到 APP 時更新。</p><p class="note">農曆節日已核對 2026–2028 年；其他年份仍可手動選用所有主題。</p></div><div class="festivalPreview">${v4FestivalBanner(effective)||'<div class="notice">目前使用日常主題。點選節日或原創卡片，就能預覽專屬裝飾。</div>'}</div>`;}
function v4OriginalChooser(effective){return ['天氣','動物','植物'].map(group=>`<h3 style="margin-top:24px">原創・${group}</h3><div class="festivalChoices">${Object.entries(V4_ORIGINAL).filter(([,f])=>f.group===group).map(([key,f])=>`<button class="festivalChoice ${effective===key?'selected':''}" data-v3-theme="${key}" aria-pressed="${effective===key}"><span class="themeSwatches" aria-hidden="true">${f.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span><strong><span aria-hidden="true">${f.symbol}</span> ${f.name}</strong><span>${f.detail}</span></button>`).join('')}</div>`).join('');}
document.addEventListener('click',e=>{if(!e.target.closest('[data-v4-auto]'))return;const old=db.settings.holidayAuto;db.settings.holidayAuto=old!==true;if(save()){render();toast(db.settings.holidayAuto?'已開啟節日自動換色':'已關閉節日自動換色');}else{db.settings.holidayAuto=old;toast('設定未能儲存，請先下載備份');}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&typeof db!=='undefined'&&!(authMode==='account'&&!accountUser))v3Apply();});
const V3_VERSION='4.0.0';
const V3_WIDGETS=['本月日記','待辦事項','本月支出','本月結餘','智慧提醒','快捷入口','近期待辦','目標進度'];
const V3_THEMES={forest:'陽光森林',tea:'暖茶書房',sea:'聽瀾海岸',lavender:'暮色花園',spring:'春節團圓',lantern:'元宵燈火',dragon:'端午青粽',moon:'中秋月桂',pumpkin:'萬聖南瓜',christmas:'聖誕松林',sunny:'晴空漫遊',rainy:'雨聲書窗',snow:'初雪小屋',cat:'黑貓茶館',rabbit:'白兔草原',deer:'小鹿林徑',fern:'蕨葉秘境',lotus:'荷風小築',camellia:'山茶花信'};
function v3Order(){const a=db.settings.widgetOrder;return [...new Set([...(Array.isArray(a)?a:[]),...V3_WIDGETS.map((_,i)=>i)])].filter(i=>Number.isInteger(i)&&i>=0&&i<V3_WIDGETS.length);}
function v3MetaKey(){return (authMode==='account'&&accountUser?accountKey(accountUser.uid):K)+'_backup_status_v3';}
function v3Meta(){try{return JSON.parse(localStorage.getItem(v3MetaKey()))||{};}catch{return {};}}
function v3MarkBackup(snapshot){try{localStorage.setItem(v3MetaKey(),JSON.stringify({at:new Date().toISOString(),snapshot:JSON.stringify(snapshot)}));return true;}catch{return false;}}
function v3BackupStatus(){const m=v3Meta();return `<div class="notice v3BackupStatus ${m.snapshot!==JSON.stringify(db)?'warning':''}" role="status"><strong>${!m.at?'此裝置尚無新版上傳紀錄':m.snapshot===JSON.stringify(db)?'目前資料與此裝置上次上傳一致':'有尚未備份到雲端的變更'}</strong><div class="note">${m.at?'此裝置上次完成上傳：'+esc(new Date(m.at).toLocaleString('zh-TW')):'舊版與其他裝置的備份，請從歷史清單查閱。'}<br>雲端備份需手動上傳；此提示只比較本裝置。</div></div>`;}
function v3Settings(){const order=v3Order();return `<div class="card span12"><div class="sectionhead"><h2>我的外觀與首頁</h2><span class="tag">V${V3_VERSION}</span></div><p class="note">選擇喜歡的色調，調整首頁卡片的先後順序。</p>${v4ThemeChooser()}<h3 style="margin-top:24px">首頁小工具排序</h3><div class="stack">${order.map((id,i)=>`<div class="item"><span class="grow">${V3_WIDGETS[id]}</span><button class="btn subtle sm" data-v3-move="${id}" data-direction="-1" aria-label="將${V3_WIDGETS[id]}上移" ${i===0?'disabled':''}>↑</button><button class="btn subtle sm" data-v3-move="${id}" data-direction="1" aria-label="將${V3_WIDGETS[id]}下移" ${i===order.length-1?'disabled':''}>↓</button></div>`).join('')}</div><div class="sep"></div><h3>版本與更新</h3><p class="note">森羅生活 V${V3_VERSION} · 手動雲端備份<br>更新只重新載入程式，會保留已儲存的本機紀錄。操作前請先儲存正在編輯的內容。</p><button class="btn subtle" data-v3-update>檢查程式更新</button><p id="v3UpdateStatus" class="note" role="status"></p></div>`;}
function v3Apply(){const theme=v4EffectiveTheme();document.documentElement.dataset.theme=theme;document.querySelector('#content > .festivalBanner')?.remove();document.querySelector('#content > .v3BackupStatus')?.remove();const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=getComputedStyle(document.documentElement).getPropertyValue('--dark').trim();if(view==='home'){const banner=v4FestivalBanner(theme);if(banner)document.querySelector('#content').insertAdjacentHTML('afterbegin',banner);const grid=document.querySelector('#content > .grid');if(grid){if(!grid.dataset.widgetIds){[...grid.children].forEach((card,i)=>card.dataset.widgetId=String(i));grid.dataset.widgetIds='1';}const cards=[...grid.children];v3Order().forEach(i=>{const card=cards.find(card=>card.dataset.widgetId===String(i));if(card)grid.append(card);});}if(authMode==='account'&&accountUser)document.querySelector('#content').insertAdjacentHTML('afterbegin',v3BackupStatus());}}
function v3Dialog(){let d=document.querySelector('#v3History');if(!d){d=document.createElement('dialog');d.id='v3History';d.setAttribute('aria-labelledby','v3HistoryTitle');document.body.append(d);}return d;}
window.addEventListener('sylva-auth-state',()=>{const d=document.querySelector('#v3History');if(d?.open)d.close();});
function v3DialogBody(d,title,body){d.innerHTML=`<div class="installSheet"><div class="sectionhead"><h2 id="v3HistoryTitle">${title}</h2><button class="btn subtle" data-v3-close>關閉</button></div>${body}</div>`;if(!d.open)d.showModal();}
function v3DialogChoice(title,body,selector,value){return new Promise(resolve=>{
 const d=v3Dialog();let answer=null;
 const closed=()=>{d.removeEventListener('click',clicked);resolve(answer);};
 const clicked=e=>{const button=e.target.closest(selector+', [data-v3-close]');if(!button)return;answer=button.hasAttribute('data-v3-close')?null:value(button);d.close();};
 d.addEventListener('close',closed,{once:true});d.addEventListener('click',clicked);v3DialogBody(d,title,body);
});}
function v3PickVersion(versions){return v3DialogChoice('歷史備份 · 最近 5 份',`<p class="note">點選版本先查看筆數摘要；查看不會更動資料。</p><div class="stack">${versions.map((v,i)=>`<button class="btn subtle versionCard" data-v3-version="${esc(v.id)}"><strong>${i===0?'最近一份 · ':''}${esc(v.savedAtText)}</strong><span>${Number(v.count)||0} 筆紀錄 · 查看摘要 →</span></button>`).join('')}</div>`,'[data-v3-version]',b=>b.dataset.v3Version);}
function v3Preview(result,clean){const labels={diaries:'日記',tasks:'任務',events:'行程',tx:'收支',recurring:'固定收支',goals:'目標',health:'健康',shopping:'購物',inventory:'收納',habits:'習慣'};return v3DialogChoice('歷史版本摘要',`<p>${esc(result.savedAtText)}</p><table class="simple-table"><thead><tr><th>類別</th><th>此手機</th><th>歷史版本</th></tr></thead><tbody>${Object.entries(labels).map(([k,n])=>`<tr><td>${n}</td><td>${db[k].length}</td><td>${clean[k].length}</td></tr>`).join('')}</tbody></table><p class="notice warning">還原將取代目前帳號在此手機的資料，不會合併。請先關閉此視窗，下載目前的 JSON 備份。</p><button class="btn" data-v3-restore>選擇這份版本，進入還原確認</button>`,'[data-v3-restore]',()=>true);}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.v3Theme){db.settings.theme=b.dataset.v3Theme;db.settings.holidayAuto=false;if(save()){render();toast('已切換主題');}else toast('設定未能儲存，請先下載備份');}
 if(b.dataset.v3Move!==undefined){const order=v3Order(),i=order.indexOf(Number(b.dataset.v3Move)),j=i+Number(b.dataset.direction);if(i<0||j<0||j>=order.length)return;[order[i],order[j]]=[order[j],order[i]];db.settings.widgetOrder=order;if(save()){render();toast('首頁順序已儲存');}else toast('設定未能儲存');}
 if(b.hasAttribute('data-v3-update')){const label=document.querySelector('#v3UpdateStatus');b.disabled=true;try{if(!navigator.onLine)throw new Error('offline');const r=await navigator.serviceWorker?.getRegistration();if(r)await r.update();label.textContent='已檢查更新。';const reload=document.createElement('button');reload.className='btn subtle';reload.textContent='重新載入程式';reload.addEventListener('click',()=>location.reload());label.append(' ',reload);}catch{label.textContent='目前無法檢查更新，請確認網路後重試。';}finally{b.disabled=false;}}
});
