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
const V3_VERSION='12.1.0';
const V3_WIDGETS=['本月日記','待辦事項','本月支出','本月結餘','智慧提醒','快捷入口','近期待辦','目標進度'];
const V3_THEMES={forest:'陽光森林',tea:'暖茶書房',sea:'聽瀾海岸',lavender:'暮色花園',spring:'春節團圓',lantern:'元宵燈火',dragon:'端午青粽',moon:'中秋月桂',pumpkin:'萬聖南瓜',christmas:'聖誕松林',sunny:'晴空漫遊',rainy:'雨聲書窗',snow:'初雪小屋',cat:'黑貓茶館',rabbit:'白兔草原',deer:'小鹿林徑',fern:'蕨葉秘境',lotus:'荷風小築',camellia:'山茶花信'};
function v3Order(){const a=db.settings.widgetOrder;return [...new Set([...(Array.isArray(a)?a:[]),...V3_WIDGETS.map((_,i)=>i)])].filter(i=>Number.isInteger(i)&&i>=0&&i<V3_WIDGETS.length);}
function v3MetaKey(){return (authMode==='account'&&accountUser?accountKey(accountUser.uid):K)+'_backup_status_v3';}
function v3Meta(){try{return JSON.parse(localStorage.getItem(v3MetaKey()))||{};}catch{return {};}}
function v3MarkBackup(snapshot){try{localStorage.setItem(v3MetaKey(),JSON.stringify({at:new Date().toISOString(),snapshot:JSON.stringify(snapshot)}));return true;}catch{return false;}}
function v3BackupStatus(){if(v7Enabled())return v7StatusHtml();const m=v3Meta();return `<div class="notice v3BackupStatus ${m.snapshot!==JSON.stringify(db)?'warning':''}" role="status"><strong>${!m.at?'此裝置尚無新版上傳紀錄':m.snapshot===JSON.stringify(db)?'目前資料與此裝置上次上傳一致':'有尚未備份到雲端的變更'}</strong><div class="note">${m.at?'此裝置上次完成上傳：'+esc(new Date(m.at).toLocaleString('zh-TW')):'舊版與其他裝置的備份，請從歷史清單查閱。'}<br>雲端備份需手動上傳；此提示只比較本裝置。</div></div>`;}
function v3Settings(){return v5LayoutSettings();}
function v3Apply(){if(authMode==='account'&&!accountUser)return;const theme=v4EffectiveTheme();document.documentElement.dataset.theme=theme;v5ApplyPalette(theme);document.querySelector('#content > .festivalBanner')?.remove();document.querySelector('#content > .v3BackupStatus')?.remove();const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=getComputedStyle(document.documentElement).getPropertyValue('--dark').trim();document.querySelector('#content > .v5FirstSteps')?.remove();if(view==='overview'){const welcome=v5WelcomeHome();if(welcome)document.querySelector('#content').insertAdjacentHTML('afterbegin',welcome);const banner=v4FestivalBanner(theme);if(banner)document.querySelector('#content').insertAdjacentHTML('afterbegin',banner);const grid=document.querySelector('#content > .grid');if(grid){if(!grid.dataset.widgetIds){[...grid.children].forEach((card,i)=>card.dataset.widgetId=String(i));grid.dataset.widgetIds='1';}const cards=[...grid.children];v3Order().forEach(i=>{const card=cards.find(card=>card.dataset.widgetId===String(i));if(card)grid.append(card);});}}}
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
function v3Preview(result,clean){const labels={diaries:'日記',tasks:'任務',events:'行程',tx:'收支',recurring:'固定收支',goals:'目標',health:'健康',shopping:'購物',inventory:'收納',habits:'習慣'};return v3DialogChoice('歷史版本摘要',`<p>${esc(result.savedAtText)}</p><table class="simple-table"><thead><tr><th>類別</th><th>此手機</th><th>歷史版本</th></tr></thead><tbody>${Object.entries(labels).map(([k,n])=>`<tr><td>${n}</td><td>${db[k].length}</td><td>${clean[k].length}</td></tr>`).join('')}<tr><td>生理期</td><td>${v8PeriodRecords().length}</td><td>${v8PeriodRecords(clean).length}</td></tr><tr><td>專注回顧</td><td>${v9FocusRecords().length}</td><td>${v9FocusRecords(clean).length}</td></tr></tbody></table><p class="notice warning">還原將取代目前帳號在此手機的資料，不會合併。請先關閉此視窗，下載目前的 JSON 備份。</p><button class="btn" data-v3-restore>選擇這份版本，進入還原確認</button>`,'[data-v3-restore]',()=>true);}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.v3Theme){db.settings.theme=b.dataset.v3Theme;db.settings.holidayAuto=false;if(save()){render();toast('已切換主題');}else toast('設定未能儲存，請先下載備份');}
 if(b.dataset.v3Move!==undefined){const order=v3Order(),i=order.indexOf(Number(b.dataset.v3Move)),j=i+Number(b.dataset.direction);if(i<0||j<0||j>=order.length)return;[order[i],order[j]]=[order[j],order[i]];db.settings.widgetOrder=order;if(save()){render();toast('首頁順序已儲存');}else toast('設定未能儲存');}
 if(b.hasAttribute('data-v3-update')){const label=document.querySelector('#v3UpdateStatus');b.disabled=true;try{if(!navigator.onLine)throw new Error('offline');const r=await navigator.serviceWorker?.getRegistration();if(r)await r.update();label.textContent='已檢查更新。';const reload=document.createElement('button');reload.className='btn subtle';reload.textContent='重新載入程式';reload.addEventListener('click',()=>location.reload());label.append(' ',reload);}catch{label.textContent='目前無法檢查更新，請確認網路後重試。';}finally{b.disabled=false;}}
});

// V5: standalone theme gallery, launch cover and clear entry points.
const V5_EXTRA={};
const v5Zodiac=[
 ['aries','牡羊座','♈','#a14e58','#fceee9','把勇氣，放進今天的一小步。'],
 ['taurus','金牛座','♉','#657448','#f5f5e9','在穩穩的日子裡，收藏小美好。'],
 ['gemini','雙子座','♊','#8a6c32','#fff8e9','讓好奇心，帶你看看新的風景。'],
 ['cancer','巨蟹座','♋','#607a89','#f1f7fa','留一個柔軟角落，照顧自己。'],
 ['leo','獅子座','♌','#a66532','#fff5e8','今天也有，屬於你的光。'],
 ['virgo','處女座','♍','#587466','#f0f6ef','整理一小格，生活就輕一點。'],
 ['libra','天秤座','♎','#886684','#faf0f7','在忙碌與留白之間，找到平衡。'],
 ['scorpio','天蠍座','♏','#795070','#f6eff8','把深藏的心意，溫柔安放。'],
 ['sagittarius','射手座','♐','#526d9b','#eff4fd','心裡有遠方，腳下也有路。'],
 ['capricorn','摩羯座','♑','#686450','#f6f3e9','慢慢累積，也是一種抵達。'],
 ['aquarius','水瓶座','♒','#3e7f86','#edf8f8','留一點空間，讓靈感流動。'],
 ['pisces','雙魚座','♓','#7374a4','#f3f2fd','讓想像，為平凡添一點色彩。']
];
const v5Terms=[
 ['lichun','立春','芽','#61815b','#f1f7eb','一點新綠，慢慢開始。'],
 ['jingzhe','驚蟄','雨','#547a66','#eef7ef','細雨之後，聽見甦醒的聲音。'],
 ['qingming','清明','柳','#4d7c77','#edf8f4','清風拂過，把思念輕輕安放。'],
 ['lixia','立夏','葉','#4d7b52','#f0f7e9','讓日子，長出明亮的葉子。'],
 ['mangzhong','芒種','穗','#8e7b3f','#faf6e5','種下小小心願，等待自己的季節。'],
 ['xiaoshu','小暑','風','#53818b','#eef9f9','樹影與涼風，替今天留白。'],
 ['liqiu','立秋','秋','#9a6b46','#fff5e8','第一縷秋意，收進生活裡。'],
 ['bailu','白露','露','#647e8d','#f1f7fb','晨光與露水，清亮而溫柔。'],
 ['hanlu','寒露','楓','#97634f','#fcf2ea','添一件暖意，慢慢過秋天。'],
 ['lidong','立冬','暖','#7f6a5c','#f8f3ed','把溫暖，留在自己的小屋。'],
 ['daxue','大雪','雪','#607994','#f2f8fd','一片雪，一盞燈，一段安靜。'],
 ['xiaohan','小寒','梅','#8d657a','#fbf2f6','天冷了，也記得對自己溫柔。']
];
for(const [key,name,symbol,color,bg,wish] of [...v5Zodiac,...v5Terms])V5_EXTRA[key]={name,group:v5Zodiac.some(x=>x[0]===key)?'星座':'十二節期',symbol,colors:[bg,color,'#dfcba7'],wish,detail:(v5Zodiac.some(x=>x[0]===key)?'星光・專屬色盤':'節令・自然色盤')};
Object.assign(V4_SCENES,V5_EXTRA);Object.assign(V3_THEMES,Object.fromEntries(Object.entries(V5_EXTRA).map(([k,v])=>[k,v.name])));
const V5_PALETTE_KEYS=['--bg','--card','--forest','--dark','--sage','--ink','--muted','--line','--festive-accent'];
function v5ApplyPalette(theme){const root=document.documentElement;for(const key of V5_PALETTE_KEYS)root.style.removeProperty(key);const f=V5_EXTRA[theme];if(f){const values=[f.colors[0],'#fffefa',f.colors[1],f.colors[1],f.colors[0],'#293b35','#62736a','#dddeda',f.colors[2]];V5_PALETTE_KEYS.forEach((key,i)=>root.style.setProperty(key,values[i]));}}
let v5ThemeGroup='全部',v5ThemeSearch='';
function v5Catalog(){return Object.entries(V3_THEMES).map(([id,name])=>({id,name,...(V4_SCENES[id]||{group:'日常',symbol:'◌',colors:({forest:['#f5f7ef','#275c45','#e2eee4'],tea:['#f8f2e7','#795238','#eee0ce'],sea:['#eef7f7','#286d7b','#dceef0'],lavender:['#f5f0f9','#765488','#ece0f1']})[id],detail:'日常・舒適色調'}),group:V4_FESTIVALS[id]?'節日':V4_SCENES[id]?.group||'日常'}));}
function v5Favorites(){return Array.isArray(db.settings.favoriteThemes)?db.settings.favoriteThemes.filter(id=>Object.hasOwn(V3_THEMES,id)):[];}
function v5ThemeCards(){const fav=v5Favorites(),active=v4EffectiveTheme();const list=v5Catalog().filter(t=>(v5ThemeGroup==='全部'||v5ThemeGroup==='收藏'&&fav.includes(t.id)||t.group===v5ThemeGroup)&&(!v5ThemeSearch||(t.name+t.group+t.detail).includes(v5ThemeSearch)));return `<p class="note">${list.length} 款主題</p><div class="v5ThemeGrid">${list.map(t=>`<article class="v5ThemeCard ${active===t.id?'selected':''}"><button class="v5ThemeApply" data-v3-theme="${t.id}" aria-pressed="${active===t.id}" aria-label="套用${t.name}"><span class="v5ThemeArt ${t.group==='星座'?'zodiacArt':''}" style="--tile-bg:${t.colors[0]};--tile-ink:${t.colors[1]}"><span aria-hidden="true">${t.symbol}</span><i aria-hidden="true">✦</i></span><span class="v5ThemeName">${esc(t.name)}</span><span class="v5ThemeDesc">${t.group} · ${active===t.id?'使用中':esc(t.detail)}</span></button><button class="v5Favorite" data-v5-favorite="${t.id}" aria-label="${fav.includes(t.id)?'取消收藏':'收藏'}${t.name}" aria-pressed="${fav.includes(t.id)}">${fav.includes(t.id)?'★':'☆'}</button></article>`).join('')}</div>${list.length?'':'<div class="empty">沒有符合的主題，試試其他關鍵字或分類。</div>'}`;}
function themesPage(){return `<section class="v5GalleryIntro"><span class="overline">讓生活換一種心情</span><h2>你的主題館</h2><p class="note">43 款色調與裝飾，隨時換成喜歡的樣子。選擇後自動儲存。</p><div class="row"><span class="tag">目前：${esc(V3_THEMES[v4EffectiveTheme()]||'陽光森林')}</span><button class="btn subtle sm" data-v4-auto>節日自動換色：${db.settings.holidayAuto===true?'開啟':'關閉'}</button></div></section><div class="v5ThemeToolbar"><label for="v5ThemeSearch" class="note">搜尋主題</label><input id="v5ThemeSearch" class="control" type="search" placeholder="搜尋星座、節日、貓、立春…" value="${esc(v5ThemeSearch)}"/><div class="v5ThemeTabs" role="group" aria-label="主題分類">${['全部','收藏','日常','節日','天氣','動物','植物','星座','十二節期'].map(group=>`<button class="chip ${group===v5ThemeGroup?'active':''}" data-v5-group="${group}" aria-pressed="${group===v5ThemeGroup}">${group}</button>`).join('')}</div></div><div id="v5ThemeResults">${v5ThemeCards()}</div><details class="v5Details"><summary>自動換色與節期說明</summary><p class="note">自動換色預設關閉，開啟後會在節日換色，平日回到你選的主題；手動選主題會關閉自動切換。農曆節日已核對 2026–2028 年。星座與十二節期皆可全年手選，不參與自動切換。</p><p class="note">十二節期採二十四節氣中的十二個「節」：立春、驚蟄、清明、立夏、芒種、小暑、立秋、白露、寒露、立冬、大雪、小寒。</p></details>`;}
function v5LayoutSettings(){const order=v3Order();return `<div class="card span12"><div class="sectionhead"><h2>首頁與外觀</h2><button class="btn subtle" data-page="themes">前往主題館</button></div><details class="v5Details"><summary>調整首頁卡片順序</summary><div class="stack">${order.map((id,i)=>`<div class="item"><span class="grow">${V3_WIDGETS[id]}</span><button class="btn subtle sm" data-v3-move="${id}" data-direction="-1" aria-label="將${V3_WIDGETS[id]}上移" ${i===0?'disabled':''}>↑</button><button class="btn subtle sm" data-v3-move="${id}" data-direction="1" aria-label="將${V3_WIDGETS[id]}下移" ${i===order.length-1?'disabled':''}>↓</button></div>`).join('')}</div></details><div class="sep"></div><h3>關於森羅生活</h3><p class="note">森羅之心 × 森日記 · V12 · 你的生活空間 · 可選擇自動雲端同步</p><p class="note">程式版本：${V3_VERSION}</p><button class="btn subtle" data-v3-update>檢查程式更新</button><p id="v3UpdateStatus" class="note" role="status"></p></div>`;}
function morePage(){const links=[['themes','主題館','星座、節日與自然色調','✦'],['settings','帳號與備份','登入、資料匯出與歷史備份','☁'],['overview','月度總覽','統計與自訂首頁小工具','▥'],['calendar','行事曆','安排接下來的日子','▦'],['goals','目標管理','把長期心願拆成小步','◎'],['health','健康紀錄','記錄生理期、心情、睡眠與飲水','♡'],['lists','購物與收納','採買清單與物品位置','▤'],['habits','習慣打卡','每天留下一次小小累積','✓'],['focus','專注計時','留一段專心的時間','◷'],['hub','生活提醒','查看依紀錄產生的提示','◌']];return `<div class="v5MoreGrid">${links.map(([page,title,note,symbol])=>`<button class="v5MoreCard" data-page="${page}"><span class="v5MoreSymbol" aria-hidden="true">${symbol}</span><span><strong>${title}</strong><small>${note}</small></span><span aria-hidden="true">›</span></button>`).join('')}</div><details class="v5Details"><summary>第一次使用？從這裡開始</summary><ol class="note"><li>選擇本機使用，或以 Google 登入建立自己的空間。</li><li>用「新增」記一筆日記、任務、收支或行程。</li><li>到主題館選喜歡的風格，再到帳號與備份保留 JSON。</li></ol><p class="note">資料先儲存在目前裝置。登入 Google 並不等於已備份；可在帳號與備份開啟自動同步。切換帳號會使用各自獨立的本機資料區。</p></details>`;}
let v5AuthSlow=false,v5AuthFailure=false;
function v5CoverHtml(){return `<section class="v5Cover" role="status" aria-live="polite"><div class="v5CoverMark" aria-hidden="true" style="background:transparent;box-shadow:none"><img src="./icon-192-v5.png?v=5.0.1" alt="" width="82" height="82" style="display:block;border-radius:25px"/></div><span class="v5CoverEyebrow">把日子，過成喜歡的樣子。</span><h1>森羅生活</h1><p>${v5AuthFailure?'目前無法連接登入服務':v5AuthSlow?'登入確認比平常久一點':'正在開啟你的生活空間'}</p><div class="v5CoverLine" aria-hidden="true"></div>${v5AuthSlow||v5AuthFailure?'<p class="note">本機紀錄仍會保留。請確認網路後重試。</p><button class="btn" data-v5-retry>重新連線</button>':''}</section>`;}
function v5LoginHtml(){return `<section class="v5Welcome card"><div class="v5CoverMark" aria-hidden="true" style="background:transparent;box-shadow:none"><img src="./icon-192-v5.png?v=5.0.1" alt="" width="82" height="82" style="display:block;border-radius:25px"/></div><h2>歡迎來到森羅生活</h2><p>記下心情，安排生活，留一點時間給自己。</p><button class="btn" data-action="googleLogin">以 Google 登入</button><button class="btn subtle" data-action="guestMode">先在此裝置使用</button><p class="note">Google 帳號有各自的資料空間，可選擇自動同步或手動備份。</p></section>`;}
function v5SessionStyle(state){document.documentElement.dataset.session=state;}
function v5WelcomeHome(){if(datasetCount(db)>0)return '';return `<div class="v5FirstSteps"><strong>從一件小事，開始你的生活紀錄。</strong><p class="note">先記一筆，再慢慢找到自己的節奏。</p><div class="chiprow"><button class="btn" data-page="diary">寫第一篇日記</button><button class="btn subtle" data-page="tasks">建立待辦</button><button class="btn subtle" data-page="themes">選個主題</button></div></div>`;}
function v5QuickAdd(){v6QuickPicker();}
document.addEventListener('input',e=>{if(e.target.id==='v5ThemeSearch'){v5ThemeSearch=e.target.value.trim();document.querySelector('#v5ThemeResults').innerHTML=v5ThemeCards();}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.v5Group){v5ThemeGroup=b.dataset.v5Group;render();}
 if(b.dataset.v5Favorite){const key=b.dataset.v5Favorite,fav=v5Favorites();db.settings.favoriteThemes=fav.includes(key)?fav.filter(x=>x!==key):[...fav,key];if(save()){render();toast('已更新收藏');}else toast('收藏未能儲存');}
 if(b.hasAttribute('data-v5-quick'))v5QuickAdd();
 if(b.hasAttribute('data-v5-close-quick')||b.dataset.page)document.querySelector('#v5QuickAdd')?.close();
 if(b.hasAttribute('data-v5-retry'))location.reload();
});
window.addEventListener('sylva-auth-error',()=>{v5AuthFailure=true;if(authMode==='account'&&!accountUser)render();});
window.addEventListener('sylva-auth-state',()=>{v5AuthFailure=false;v5AuthSlow=false;});
setTimeout(()=>{if(typeof authInitialized!=='undefined'&&!authInitialized){v5AuthSlow=true;if(authMode==='account'&&!accountUser)render();}},12000);

// V6: existing storage schema, manual cloud snapshots and UID isolation are preserved.
const V6_KINDS={diary:{key:'diaries',name:'日記',symbol:'▤'},task:{key:'tasks',name:'待辦',symbol:'✓'},transaction:{key:'tx',name:'收支',symbol:'＄'},event:{key:'events',name:'行程',symbol:'▦'},health:{key:'health',name:'健康',symbol:'♡'}};
let v6Editor=null,v6UndoQueue=[],v6UndoTimer=null,v6LastOwner=null,v6LastDb=null;
const v6Copy=x=>JSON.parse(JSON.stringify(x));
function v6Owner(){return authMode==='account'?(accountUser?'account:'+accountUser.uid:'locked'):'guest';}
function v6SyncContext(){const owner=v6Owner();if(v6LastOwner!==null&&(owner!==v6LastOwner||v6LastDb!==db)){v6UndoQueue=[];clearTimeout(v6UndoTimer);const d=document.querySelector('#v6Composer');if(d?.open)d.close();if(d)d.innerHTML='';v6Editor=null;}v6LastOwner=owner;v6LastDb=db;}
function v6Mutate(change){if(v6Owner()==='locked')return false;const before=v6Copy(db);try{change();if(!save()){db=before;v6LastDb=db;toast('儲存失敗，原本紀錄已保留；請先下載備份');return false;}return true;}catch(error){db=before;v6LastDb=db;throw error;}}
function v6DateOK(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;const d=new Date(value+'T12:00:00');return Number.isFinite(d.getTime())&&localDate(d)===value;}
function v6Normalize(kind,f){const clean=v=>String(v??'').trim();const date=clean(f.date);if(kind!=='task'&&!v6DateOK(date))throw Error('請選擇有效日期');
 if(kind==='diary'){if(!clean(f.body))throw Error('請輸入日記內容');return {date,...v9NormalizeMood(f),body:String(f.body),tags:clean(f.tags)};}
 if(kind==='task'){if(!clean(f.title))throw Error('請輸入待辦名稱');if(f.due&&!v6DateOK(f.due))throw Error('請選擇有效期限');return {title:clean(f.title),due:f.due||'',category:clean(f.category)||'生活',quadrant:['q1','q2','q3','q4'].includes(f.quadrant)?f.quadrant:'q2'};}
 if(kind==='transaction'){const amount=Number(f.amount);if(!Number.isFinite(amount)||Math.round(amount*100)<1||amount>1e12)throw Error('請輸入大於 0 的有效金額');return {date,type:f.type==='income'?'income':'expense',amount:Math.round(amount*100)/100,...v11FinanceNormalize(f),note:clean(f.note)};}
 if(kind==='event'){if(!clean(f.title))throw Error('請輸入行程名稱');if(f.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(f.time))throw Error('請輸入有效時間');return {date,title:clean(f.title),time:f.time||'',...v121EventSettings(f)};}
 if(kind==='health'){const number=(v,max)=>{if(v==='')return '';const n=Number(v);if(!Number.isFinite(n)||n<0||n>max)throw Error('請檢查睡眠或飲水數值');return n;};return {date,mood:['平穩','開心','疲憊','低落','焦慮'].includes(f.mood)?f.mood:'平穩',sleep:number(f.sleep??'',24),water:number(f.water??'',50),note:clean(f.note)};}
 throw Error('找不到這個紀錄類別');
}
function v6Write(kind,values,editor){const spec=V6_KINDS[kind];if(!spec||editor.owner!==v6Owner()||v6Owner()==='locked')throw Error('帳號已切換，請重新開啟表單');const arr=db[spec.key],old=editor.id?arr.find(x=>x.id===editor.id):null;
 if(editor.id&&(!old||JSON.stringify(old)!==editor.before))throw Error('這筆紀錄已變更，請重新開啟再編輯');
 if(['diary','health'].includes(kind)&&arr.some(x=>x.date===values.date&&x.id!==editor.id))throw Error('這一天已有紀錄，請先從紀錄清單編輯，避免覆蓋');
 if(!old&&arr.length>=2000)throw Error('此類別已達 2000 筆，請先整理並保留備份');
 return v6Mutate(()=>{if(old)Object.assign(old,values);else arr.push({...values,id:id(),...(kind==='task'?{done:false}:{})});});
}
function v6Input(name,label,type,value,extra=''){return `<div class="field"><label for="v6-${name}">${label}</label><input id="v6-${name}" name="${name}" type="${type}" value="${esc(value??'')}" ${extra}/></div>`;}
function v6Select(name,label,options,value){return `<div class="field"><label for="v6-${name}">${label}</label><select id="v6-${name}" name="${name}">${options.map(([v,n])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(n)}</option>`).join('')}</select></div>`;}
function v6Area(name,label,value,placeholder=''){return `<div class="field"><label for="v6-${name}">${label}</label><textarea id="v6-${name}" name="${name}" rows="5" placeholder="${placeholder}" maxlength="${name==='body'?50000:5000}">${esc(value||'')}</textarea></div>`;}
function v6Fields(kind,r){const date=v6Input('date','日期','date',r.date||today(),'required');
 if(kind==='diary')return `${date}${v9MoodFields(r)}${v6Area('body','日記內容',r.body,'今天有什麼想留下來的？')}${v6Input('tags','標籤（以逗號分隔）','text',r.tags,'maxlength="200"')}`;
 if(kind==='task')return `${v6Input('title','待辦名稱','text',r.title,'required maxlength="100" placeholder="想完成的一件小事"')}${v6Input('due','期限（選填）','date',r.due)}${v6Input('category','分類','text',r.category||'生活','maxlength="50"')}${v11QuadrantFields(r.quadrant||'q2')}`;
 if(kind==='transaction')return `<div class="row">${v6Select('type','類型',[['expense','支出'],['income','收入']],r.type||'expense')}${date}</div>${v6Input('amount','金額（NT$）','number',r.amount,'required min="0.01" max="1000000000000" step="0.01" inputmode="decimal" placeholder="0"')}${v11FinanceFields(r)}${v6Input('note','備註（選填）','text',r.note,'maxlength="500"')}`;
 if(kind==='event')return `${v6Input('title','行程名稱','text',r.title,'required maxlength="100"')}<div class="row">${date}${v6Input('time','時間（選填）','time',r.time)}</div>${v121EventFields(r)}`;
 return `${date}${v6Select('mood','心情狀態',['平穩','開心','疲憊','低落','焦慮'].map(x=>[x,x]),r.mood||'平穩')}<div class="row">${v6Input('sleep','睡眠（小時）','number',r.sleep,'min="0" max="24" step="0.5"')}${v6Input('water','飲水（杯）','number',r.water,'min="0" max="50"')}</div>${v6Area('note','生活備註',r.note)}`;
}
function v6FormData(form){return Object.fromEntries(new FormData(form).entries());}
function v6Dirty(){const f=document.querySelector('#v6Composer form');return !!(f&&v6Editor&&JSON.stringify(v6FormData(f))!==v6Editor.initial);}
function v6RequestClose(){if(v6Dirty()&&!confirm('這裡有尚未儲存的內容，要放棄這次編輯嗎？'))return false;document.querySelector('#v6Composer')?.close();return true;}
function v6Dialog(){let d=document.querySelector('#v6Composer');if(!d){d=document.createElement('dialog');d.id='v6Composer';d.setAttribute('aria-labelledby','v6ComposerTitle');d.addEventListener('cancel',e=>{e.preventDefault();v6RequestClose();});d.addEventListener('close',()=>{if(!d.open){v6Editor=null;d.innerHTML='';}});document.body.append(d);}return d;}
function v6Compose(kind,recordId,prefill){if(v6Owner()==='locked')return;const spec=V6_KINDS[kind];if(!spec)return;if(v6Dirty()&&!confirm('切換類別會放棄尚未儲存的內容，確定切換嗎？'))return;
 let r=recordId?db[spec.key].find(x=>x.id===recordId):['diary','health'].includes(kind)?db[spec.key].find(x=>x.date===today()):null;if(recordId&&!r){toast('這筆紀錄已不存在');return;}r=r||prefill||{};
 const d=v6Dialog();v6Editor={kind,owner:v6Owner(),id:r.id||null,before:r.id?JSON.stringify(r):null,initial:null};d.innerHTML=`<div class="v6Sheet"><div class="sectionhead"><div><span class="overline">留住生活的小片刻</span><h2 id="v6ComposerTitle">${r.id?'編輯':'新增'}${spec.name}</h2></div><button type="button" class="btn subtle sm" data-v6-close>關閉</button></div><div class="v6ComposerTabs" aria-label="紀錄類別">${Object.entries(V6_KINDS).map(([k,v])=>`<button type="button" class="chip ${k===kind?'active':''}" data-v6-kind="${k}" aria-pressed="${k===kind}">${v.name}</button>`).join('')}</div><form data-form="v6-record" class="stack">${v6Fields(kind,r)}${!r.id&&V12_TEMPLATE_KINDS.includes(kind)?'<button type="button" class="btn line sm" data-v12-save-template>存為常用範本</button>':''}<p id="v6FormError" class="v6FormError" role="alert"></p><div class="v6FormActions"><button type="button" class="btn subtle" data-v6-close>取消</button><button type="submit" class="btn">${r.id?'儲存修改':'儲存'+spec.name}</button></div><p class="note">先儲存到此裝置；開啟自動同步後，連線時會自動上傳。</p></form></div>`;
 v6Editor.initial=JSON.stringify(v6FormData(d.querySelector('form')));if(!d.open)d.showModal();d.querySelector('input:not([type="date"]),textarea,select')?.focus();
}
function v6QuickPicker(){const kind=({diary:'diary',tasks:'task',finance:'transaction',calendar:'event',health:'health'})[view]||'task';v6Compose(kind);}
function v6HandleForm(e){if(v10Form(e))return true;if(v9Form(e))return true;if(v8PeriodForm(e))return true;const form=e.target.closest('form[data-form]');if(!form)return false;const modal=form.dataset.form==='v6-record',kind=modal?v6Editor?.kind:form.dataset.form;if(!V6_KINDS[kind]&&!modal)return false;e.preventDefault();
 try{if(!kind||v6Owner()==='locked')throw Error('請先完成登入');const f=v6FormData(form),values=v6Normalize(kind,f);const old=!modal&&['diary','health'].includes(kind)?db[V6_KINDS[kind].key].find(x=>x.date===values.date):null;const editor=modal?v6Editor:{owner:v6Owner(),id:old?.id||null,before:old?JSON.stringify(old):null};
  if(v6Write(kind,values,editor)){if(kind==='task'&&!editor.id&&taskFilter==='done')taskFilter='all';if(modal)document.querySelector('#v6Composer').close();render();toast('已儲存'+V6_KINDS[kind].name);}else if(modal)document.querySelector('#v6FormError').textContent='尚未儲存，請先下載備份並確認裝置空間。';
 }catch(error){if(modal&&document.querySelector('#v6FormError'))document.querySelector('#v6FormError').textContent=error.message;else toast(error.message);}return true;
}
function v6Key(key){return ({diary:'diaries',task:'tasks'})[key]||key;}
function v6Delete(key,recordId){key=v6Key(key);if(!['diaries','tasks','events','tx','recurring','goals','health','shopping','inventory','habits','periods','focusSessions'].includes(key))return;const arr=v9Collection(key),index=arr.findIndex(x=>x.id===recordId);if(index<0)return;const record=v6Copy(arr[index]);if(!v6Mutate(()=>arr.splice(index,1)))return;v6UndoQueue=v6UndoQueue.filter(x=>x.expires>Date.now()).slice(-9);v6UndoQueue.push({key,record,index,owner:v6Owner(),expires:Date.now()+30000});render();v6UndoRefresh();}
function v6Undo(){v6UndoQueue=v6UndoQueue.filter(x=>x.expires>Date.now()&&x.owner===v6Owner());const item=v6UndoQueue.at(-1);if(!item)return;const arr=v9Collection(item.key);if(item.key==='periods'&&v8PeriodOverlap(item.record,arr)){toast('日期已與另一筆生理期重疊，沒有復原');return;}if(arr.some(x=>x.id===item.record.id)||(['diaries','health'].includes(item.key)&&arr.some(x=>x.date===item.record.date))){toast('已有相同紀錄，為避免覆蓋，沒有復原');return;}if(arr.length>=2000){toast('此類別已達儲存上限，請先保留備份');return;}if(v6Mutate(()=>arr.splice(Math.min(item.index,arr.length),0,item.record))){v6UndoQueue.pop();render();toast('已復原紀錄');}}
function v6UndoRefresh(){v6UndoQueue=v6UndoQueue.filter(x=>x.expires>Date.now()&&x.owner===v6Owner());let el=document.querySelector('#v6Undo');if(el)el.remove();clearTimeout(v6UndoTimer);if(!v6UndoQueue.length)return;const seconds=Math.max(1,Math.ceil((v6UndoQueue.at(-1).expires-Date.now())/1000));document.querySelector('#content')?.insertAdjacentHTML('afterbegin',`<div id="v6Undo" class="v6Undo" role="status"><span>已刪除紀錄 · ${seconds} 秒內可復原${v6UndoQueue.length>1?'（還有 '+v6UndoQueue.length+' 筆）':''}</span><button class="btn subtle sm" data-v6-undo>復原上一筆</button></div>`);v6UndoTimer=setTimeout(v6UndoRefresh,1000);}
function v6HandleCheck(e){const t=e.target;if(!t.dataset.check)return false;const key=v6Key(t.dataset.check);if(!['tasks','shopping'].includes(key))return false;const record=db[key].find(x=>x.id===t.dataset.id);if(!record)return true;const before=record.done;if(v6Mutate(()=>{record.done=t.checked;}))render();else t.checked=!!before;return true;}
function v6EditButton(kind,recordId){return `<button type="button" class="btn subtle sm" data-v6-edit="${kind}" data-id="${esc(recordId)}" aria-label="編輯${V6_KINDS[kind].name}">編輯</button>`;}
function v6TodayPage(){const day=today(),diary=db.diaries.find(x=>x.date===day),health=db.health.find(x=>x.date===day),tasks=db.tasks.filter(t=>!t.done&&(!t.due||t.due<=day)).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')),events=v121EventsOn(day).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')),tx=db.tx.filter(x=>x.date===day),spent=tx.filter(x=>x.type==='expense').reduce((a,x)=>a+num(x.amount),0),msg=dailyHeroMessage();
 return `<section class="v6TodayHero"><div><div class="overline">慢慢來，把今天過好。</div><h2>${esc(db.settings.name||'你好')}，今天想從哪裡開始？</h2></div><img src="./icon-192-v5.png?v=5.0.1" alt="" width="96" height="96"/></section><section class="hero dailyHero" aria-label="每日心語"><div class="dailyTop"><div class="overline" style="color:#cce8c7">每日心語</div><span class="dailyDate">${esc(msg.date)}</span></div><h2>${esc(msg.quote)}</h2><p class="dailyDetail">${esc(msg.detail)}</p><div class="dailyFlower">❀ 今日花語｜<strong>${esc(msg.flower.name)}</strong> · ${esc(msg.flower.meaning)}</div></section><div class="v6QuickGrid" aria-label="快速記錄">${[['diary','寫日記','▤'],['task','加待辦','✓'],['transaction','記一筆','＄'],['event','排時間','▦']].map(([kind,n,symbol])=>`<button data-v6-kind="${kind}"><span aria-hidden="true">${symbol}</span>${n}</button>`).join('')}</div>${v12HomeTemplates()}<div class="v6TodayGrid"><section class="card v6Tasks"><div class="sectionhead"><h2>今天要做</h2><span class="tag">${tasks.length} 項</span></div><p class="note">今天、已到期與尚未設定期限的待辦。</p><div class="stack">${tasks.slice(0,5).map(t=>`<div class="item"><input type="checkbox" aria-label="完成${esc(t.title)}" data-check="tasks" data-id="${esc(t.id)}"/><div class="grow"><strong>${esc(t.title)}</strong><span class="desc">${t.due&&t.due<day?'已逾期 · '+fmtDate(t.due):t.due?'今天到期':'未設期限'}</span></div><details><summary>操作</summary><div class="row">${v6EditButton('task',t.id)}<button type="button" class="btn subtle sm" data-v10-link-focus="task" data-id="${esc(t.id)}">專注這項待辦</button></div></details></div>`).join('')||'<div class="v6Empty"><span aria-hidden="true">🌱</span><p>今天還沒有需要處理的待辦。<br/>可以留白，也可以安排一件小事。</p></div>'}</div><button class="btn line sm" data-page="tasks">查看全部待辦</button></section><section class="card"><div class="sectionhead"><h2>今天的行程</h2><button class="btn subtle sm" data-v6-kind="event">新增</button></div><div class="stack">${events.slice(0,5).map(x=>`<div class="v6Event"><time>${esc(x.time||'未定時')}</time><span class="grow">${esc(x.title)}</span>${v6EditButton('event',x.id)}</div>`).join('')||'<div class="v6Empty"><span aria-hidden="true">☀</span><p>今天的時間，還有自由安排的空間。</p></div>'}</div>${events.length>5?'<button class="btn line sm" data-page="calendar">查看全部行程</button>':''}</section><section class="card v6Mood"><div class="sectionhead"><h2>今天的心情</h2><span aria-hidden="true">♡</span></div><p class="v6MoodValue">${esc(diary?.mood||health?.mood||'還沒記下來')}</p><p class="note">${diary?'今天已留下日記。想補充一點什麼嗎？':'不用替今天打分數，留下此刻的感受就好。'}</p><button class="btn subtle" data-v6-kind="diary">${diary?'編輯今天日記':'記下今天'}</button></section><section class="card"><div class="sectionhead"><h2>今天的收支</h2><span class="tag">${tx.length} 筆</span></div><p class="note">今日支出</p><div class="metric">${money(spent)}</div><div class="row"><button class="btn subtle" data-v6-kind="transaction">記一筆收支</button><button class="btn line" data-page="finance">查看明細</button></div></section></div>${v10TodayHabits()}<div class="v6OverviewLink"><button class="btn line" data-page="overview">查看月度總覽與首頁小工具 →</button><p class="note">依目前帳號的實際紀錄整理。雲端狀態可在「帳號與備份」查看。</p></div>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||v6Owner()==='locked')return;if(b.dataset.v6Kind)v6Compose(b.dataset.v6Kind);if(b.dataset.v6Edit)v6Compose(b.dataset.v6Edit,b.dataset.id);if(b.hasAttribute('data-v6-close'))v6RequestClose();if(b.hasAttribute('data-v6-undo'))v6Undo();});

// V7: opt-in, per-UID foreground sync. A server transaction compares the exact
// revision read before writing. Conflicts never silently merge or overwrite.
let v7State={uid:null,epoch:0,busy:false,phase:'off',error:'',conflict:null,disk:null},v7Timer=null,v7Draft=null;
function v7Disk(uid){try{return localStorage.getItem(accountKey(uid));}catch{return null;}}
function v7Key(uid){return accountKey(uid)+'_sync_v7';}
function v7Meta(uid=v7State.uid){try{return JSON.parse(localStorage.getItem(v7Key(uid)))||{};}catch{return {};}}
function v7Enabled(){return !!(v7State.uid&&cloudUserId()===v7State.uid&&v7Meta().enabled);}
function v7Put(m,uid=v7State.uid){localStorage.setItem(v7Key(uid),JSON.stringify(m));}
function v7Text(data){return JSON.stringify(sanitize(data));}
function v7Valid(data){if(!data||typeof data!=='object'||data.version!==1)throw Error('bad-data');for(const k of ['diaries','tasks','events','tx','recurring','goals','health','shopping','inventory','habits'])if(!Array.isArray(data[k])||data[k].length>2000||data[k].some(r=>!r||typeof r!=='object'||Array.isArray(r)))throw Error('bad-data');v8ValidateTracker(data.settings?.periodTracker);v9ValidateFocus(data.settings?.focusTracker);return sanitize(data);}
function v7Context(){const uid=cloudUserId();if(uid===v7State.uid)return;clearTimeout(v7Timer);v7Draft=null;v7State={uid,epoch:v7State.epoch+1,busy:false,phase:'off',error:'',conflict:null,disk:uid?v7Disk(uid):null};if(uid&&v7Meta().enabled){v7State.phase='waiting';v7Schedule(0);}}
function v7Schedule(ms=2000){clearTimeout(v7Timer);if(v7Enabled())v7Timer=setTimeout(()=>v7Run(),ms);}
function v7BeforeSave(){const uid=cloudUserId();if(!uid||uid!==v7State.uid)return true;if(localStorage.getItem(accountKey(uid))!==v7State.disk){v7State.phase='tab';v7Paint();toast('另一個分頁已更新紀錄，請到帳號與備份重新載入。');return false;}return true;}
function v7Saved(){v7Draft=null;const uid=cloudUserId();if(uid&&uid===v7State.uid){v7State.disk=localStorage.getItem(accountKey(uid));if(v7Enabled()&&v7State.phase!=='conflict'){v7State.phase='waiting';v7Schedule();v7Paint();}}}
function v7Editing(){return !!(v6Dirty()||(v7Draft&&v7Draft.isConnected));}
function v7Current(uid,epoch){return cloudUserId()===uid&&v7State.uid===uid&&v7State.epoch===epoch;}
function v7Recovery(local,remote,uid=v7State.uid){localStorage.setItem(accountKey(uid)+'_recovery_v7',JSON.stringify({createdAt:new Date().toISOString(),local,cloud:remote}));}
function v7Ack(m,base,revision,uid){v7Put({...m,enabled:true,initialized:true,base,revision,lastAt:new Date().toISOString()},uid);}
function v7Conflict(remote){v7Recovery(JSON.parse(v7Text(db)),remote?.snapshot||null);v7State.conflict=remote;v7State.phase='conflict';}
function v7Error(e){return e.message==='too-large'?'紀錄超過目前單份 600 KB 限制，請先下載 JSON 備份。':e.message==='bad-data'?'雲端資料格式不相容，已停止套用。':e.code==='permission-denied'?'雲端權限不足，請確認 Firebase 規則。':e.message==='not-ready'?'登入與雲端元件尚未準備完成，稍後會再試。':'暫時無法連接雲端，紀錄仍保留在手機；可稍後重試。';}
async function v7Run(force=false){
 v7Context();if(!v7Enabled()||v7State.busy||cloudBusy||['conflict','tab'].includes(v7State.phase))return;
 if(document.hidden&&!force)return;
 if(!storageUsable){v7State.phase='error';v7State.error='本機儲存暫時失敗，請先下載 JSON 備份並確認裝置空間。';v7Paint();return;}
 if(!navigator.onLine){v7State.phase='offline';v7Paint();return;}
 const uid=v7State.uid,epoch=v7State.epoch,m=v7Meta();
 if(!v7BeforeSave())return;
 v7State.busy=true;v7State.phase='working';v7State.error='';v7Paint();
 try{
  const api=cloudBridge(uid),local=v7Text(db),remote=await api.read(uid);
  if(!v7Current(uid,epoch)||!v7Enabled())return;
  if(local!==v7Text(db)){v7State.phase='waiting';v7Schedule();return;}
  if(!v7BeforeSave())return;
  const cloud=remote?v7Text(v7Valid(remote.snapshot)):null,base=m.initialized?m.base:null;
  if(local===cloud){v7Ack(m,local,remote.revision,uid);v7State.phase='synced';return;}
  const pristine=local===v7Text(DEFAULT);
  if(remote&&((!m.initialized&&pristine)||(m.initialized&&local===base))){
   if(v7Editing()){v7State.phase='draft';return;}
   v7Recovery(JSON.parse(local),remote.snapshot,uid);
   // Persist the data before the sync base; a metadata failure cannot erase data.
   localStorage.setItem(accountKey(uid),cloud);v7State.disk=cloud;db=JSON.parse(cloud);
   v7Ack(m,cloud,remote.revision,uid);v7State.phase='synced';render();return;
  }
  if((!m.initialized&&!remote)||(m.initialized&&cloud===base)){
   const sent=JSON.parse(local),expected=remote?.revision??null;
   const result=await api.saveSafe(uid,sent,expected,()=>v7Current(uid,epoch)&&v7Enabled());
   if(!v7Current(uid,epoch)||!v7Enabled())return;
   if(!v7BeforeSave())return;
   if(!result||v7Text(v7Valid(result.snapshot))!==local){v7Conflict(result);return;}
   v7Ack(m,local,result.revision,uid);v3MarkBackup(sent);
   v7State.phase=v7Text(db)===local?'synced':'waiting';if(v7State.phase==='waiting')v7Schedule();return;
  }
  v7Conflict(remote);
 }catch(e){if(v7Current(uid,epoch)&&v7Enabled()){if(e.message==='sync-conflict'){v7State.phase='waiting';v7Schedule(0);}else{v7State.phase='error';v7State.error=v7Error(e);}}}
 finally{if(v7Current(uid,epoch)){v7State.busy=false;v7Paint();}}
}
function v7StatusHtml(){if(!cloudUserId())return '';const m=v7Meta();const states={off:'自動同步尚未開啟',waiting:'已存手機，等待同步',working:'正在核對雲端資料…',synced:'目前紀錄已與雲端一致',offline:'目前離線，紀錄先存手機',draft:'雲端有更新；完成或關閉編輯後再接續',conflict:'兩邊都有紀錄，請選擇接續方式',error:v7State.error||'同步暫停，紀錄保留在手機',tab:'另一個分頁已更新紀錄，請先重新載入'};return `<div class="notice v7Status ${['conflict','error','tab','offline'].includes(v7State.phase)?'warning':''}" data-v7-status role="status"><strong>${esc(m.enabled?states[v7State.phase]||states.waiting:states.off)}</strong><div class="note">${m.enabled?'儲存後自動上傳；開啟 APP 時約每 45 秒檢查其他裝置。':'可在「帳號與備份」開啟，或繼續手動上傳。'}${m.lastAt?'<br>上次核對：'+esc(new Date(m.lastAt).toLocaleString('zh-TW')):''}</div><button class="btn line sm" data-page="settings">查看雲端狀態</button></div>`;}
function v7Panel(){const enabled=v7Enabled(),c=v7State.conflict;return `<div data-v7-panel>${v7StatusHtml()}<div class="stack v7Controls"><button class="btn" data-v7-action="toggle">${enabled?'關閉自動同步':'開啟此帳號的自動同步'}</button>${enabled?'<button class="btn subtle" data-v7-action="retry">立即檢查同步</button>':''}<button class="btn line" data-v7-action="recovery">下載最近一次接續前的雙份備份</button>${v7State.phase==='tab'?'<button class="btn subtle" data-v7-action="reload">重新載入此裝置紀錄</button>':''}</div>${v7State.phase==='conflict'?`<section class="notice warning v7Conflict" role="alert"><h3>保留哪一邊作為接續版本？</h3><p>此手機 ${datasetCount(db)} 筆；雲端 ${c?datasetCount(c.snapshot):0} 筆${c?'（'+esc(c.savedAtText)+'）':''}。兩邊都已另存於此裝置的接續備份，請先下載檢查；選擇後不會自動合併。</p><div class="stack"><button class="btn subtle" data-v7-action="recovery">先下載雙份備份</button><button class="btn subtle" data-v7-action="remote">使用雲端版本接續</button><button class="btn subtle" data-v7-action="local">使用此手機版本接續</button></div></section>`:''}<p class="note">此設定只套用目前帳號與此瀏覽器。關閉 APP 時不會在背景上傳；離線變更會在下次開啟並連線時核對。遇到衝突會先暫停，已完成同步的刪除也會傳到其他裝置。歷史備份仍可手動還原。</p></div>`;}
function v7Paint(){if(typeof document==='undefined')return;const panel=document.querySelector('[data-v7-panel]');if(panel){panel.outerHTML=v7Panel();return;}document.querySelectorAll?.('[data-v7-status]').forEach(el=>el.outerHTML=v7StatusHtml());}
async function v7Toggle(){v7Context();if(!v7State.uid)return;if(v7Enabled()){if(v7State.busy){toast('請等目前雲端作業完成後再關閉');return;}v7Put({...v7Meta(),enabled:false});clearTimeout(v7Timer);v7State.phase='off';v7State.conflict=null;render();return;}if(!confirm('開啟後，此帳號儲存的日記、任務、收支、健康與設定會自動上傳雲端，並在其他已開啟同步的裝置接續。雲端不是端對端加密。確定開啟嗎？'))return;try{v7Put({...v7Meta(),enabled:true});v7State.phase='waiting';v7State.conflict=null;render();await v7Run(true);}catch(e){v7State.phase='error';v7State.error='無法儲存同步設定，請先下載 JSON 備份。';v7Paint();}}
async function v7Resolve(which){
 if(!v7Enabled()||v7State.busy||cloudBusy||v7State.phase!=='conflict')return;
 if(v7Editing()){toast('請先儲存或關閉正在編輯的內容');return;}
 const uid=v7State.uid,epoch=v7State.epoch,local=v7Text(db);
 if(!confirm(which==='remote'?'以雲端版本取代此手機目前帳號的紀錄？不會自動合併。請先下載雙份備份。':'以此手機版本更新雲端？其他裝置接續後也會看到此版本。請先下載雙份備份。'))return;
 v7State.busy=true;
 try{
  if(!v7BeforeSave())return;
  const api=cloudBridge(uid),r=await api.read(uid);if(!v7Current(uid,epoch)||!v7Enabled())return;
  if(!v7BeforeSave())return;
  if(local!==v7Text(db))throw Error('sync-conflict');
  if((r?.revision??null)!==(v7State.conflict?.revision??null)){v7Conflict(r);toast('雲端剛有更新，請重新查看再選擇');return;}
  v7Recovery(JSON.parse(local),r?.snapshot||null,uid);
  if(which==='remote'){
   if(!r)throw Error('bad-data');const text=v7Text(v7Valid(r.snapshot));
   localStorage.setItem(accountKey(uid),text);v7State.disk=text;db=JSON.parse(text);v7Ack(v7Meta(),text,r.revision,uid);
  }else{
   const result=await api.saveSafe(uid,JSON.parse(local),r?.revision??null,()=>v7Current(uid,epoch)&&v7Enabled());
   if(!v7Current(uid,epoch)||!v7Enabled())return;
   if(!v7BeforeSave())return;
   if(!result||v7Text(v7Valid(result.snapshot))!==local){v7Conflict(result);return;}
   v7Ack(v7Meta(),local,result.revision,uid);
  }
  v7State.conflict=null;v7State.phase='synced';if(which==='local'&&v7Text(db)!==local){v7State.phase='waiting';v7Schedule();}render();toast('已完成接續，兩邊的備份仍可下載');
 }catch(e){if(v7Current(uid,epoch)){if(e.message==='sync-conflict'){v7State.phase='waiting';v7State.conflict=null;v7Schedule(0);}else{v7State.phase='error';v7State.error=v7Error(e);}}}finally{if(v7Current(uid,epoch)){v7State.busy=false;v7Paint();}}
}
function v7DownloadRecovery(){const raw=localStorage.getItem(accountKey(v7State.uid)+'_recovery_v7');if(!raw){toast('目前沒有接續前備份；可先下載完整 JSON 備份。');return;}const r=JSON.parse(raw);for(const [name,data] of [['手機',r.local],['雲端',r.cloud]])if(data){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=url;a.download='森羅生活_接續前_'+name+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}toast('已產生手機與雲端兩份 JSON；若瀏覽器詢問，請允許多檔下載');}
function v7PauseForRestore(){if(v7State.busy){toast('請等待同步作業完成');return false;}if(!v7Enabled())return true;if(!confirm('還原前會先關閉此裝置的自動同步，避免舊版本立即覆蓋雲端。還原並核對後，可自行重新開啟。繼續嗎？'))return false;v7Put({...v7Meta(),enabled:false});clearTimeout(v7Timer);v7State.phase='off';v7Paint();return true;}
document.addEventListener('input',e=>{const f=e.target.closest?.('form');if(f)v7Draft=f;});
document.addEventListener('click',async e=>{const b=e.target.closest?.('[data-v7-action]');if(!b)return;try{switch(b.dataset.v7Action){case'toggle':await v7Toggle();break;case'retry':if(v7State.phase==='error')v7State.phase='waiting';await v7Run(true);break;case'local':case'remote':await v7Resolve(b.dataset.v7Action);break;case'recovery':v7DownloadRecovery();break;case'reload':if(v7State.busy)return;if(confirm('重新載入此瀏覽器已儲存的紀錄？尚未儲存的表單會關閉。')){v7Recovery(JSON.parse(v7Text(db)),null);db=sanitize(JSON.parse(localStorage.getItem(accountKey(v7State.uid))));v7State.disk=localStorage.getItem(accountKey(v7State.uid));v7State.phase='waiting';render();v7Schedule(0);}break;}}catch(e){toast('操作未完成，資料仍保留；請先下載 JSON 備份。');}});
window.addEventListener('online',()=>v7Schedule(0));
window.addEventListener('focus',()=>v7Schedule(0));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)v7Schedule(0);});
window.addEventListener('storage',e=>{if(v7State.uid&&e.key===accountKey(v7State.uid)&&e.newValue!==v7State.disk){v7State.phase='tab';v7Paint();}if(v7State.uid&&e.key===v7Key(v7State.uid)){let before=false,after=false;try{before=!!JSON.parse(e.oldValue||'{}').enabled;after=!!JSON.parse(e.newValue||'{}').enabled;}catch{}if(before!==after){v7State.phase=after?'waiting':'off';if(after)v7Schedule(0);else clearTimeout(v7Timer);v7Paint();}}});
if(typeof setInterval==='function')setInterval(()=>{if(!document.hidden)v7Run();},45000);
// Period data lives inside account settings so earlier snapshots retain it unchanged.
const V8_FLOW=['未記錄','少量','中等','多量'];
const V8_SYMPTOMS=['腹痛','腰痠','頭痛','疲倦','胸部脹痛','情緒變化'];
let v8PeriodId='',v8PeriodOwner='',v8PeriodMonth='',v8PeriodLimit=12,v9PeriodSelected='';
function v8PeriodRecords(data=db){const r=data.settings?.periodTracker?.records;return Array.isArray(r)?r:[];}
function v8Day(s){const a=s.split('-').map(Number);return Date.UTC(a[0],a[1]-1,a[2])/86400000;}
function v8AddDay(s,n){return new Date((v8Day(s)+n)*86400000).toISOString().slice(0,10);}
function v8PeriodOverlap(r,records){return records.some(x=>x.id!==r.id&&r.date<=(x.end||today())&&x.date<=(r.end||today()));}
function v8ValidateTracker(t){
 if(t===undefined)return;
 if(!t||typeof t!=='object'||Array.isArray(t)||!Array.isArray(t.records)||t.records.length>2000)throw Error('bad-data');
 const ids=new Set();
 for(const r of t.records){
  if(!r||typeof r!=='object'||Array.isArray(r)||typeof r.id!=='string'||!r.id||ids.has(r.id)||!v6DateOK(r.date)||r.date<'1900-01-01'||typeof r.end!=='string'||(r.end&&(!v6DateOK(r.end)||r.end<r.date))||!V8_FLOW.includes(r.flow)||!['未記錄','無','輕微','中等','明顯'].includes(r.pain)||!Array.isArray(r.symptoms)||r.symptoms.length>6||r.symptoms.some(x=>!V8_SYMPTOMS.includes(x))||new Set(r.symptoms).size!==r.symptoms.length||typeof r.note!=='string'||r.note.length>3000)throw Error('bad-data');
  ids.add(r.id);
 }
 const sorted=[...t.records].sort((a,b)=>a.date.localeCompare(b.date));
 for(let i=1;i<sorted.length;i++)if(!sorted[i-1].end||sorted[i-1].end>=sorted[i].date)throw Error('bad-data');
}
function v8NormalizePeriod(f){
 const date=String(f.date||''),end=String(f.end||'');
 if(!v6DateOK(date)||date<'1900-01-01'||date>today())throw Error('開始日期請填寫今天或過去的實際日期');
 if(end&&(!v6DateOK(end)||end<date||end>today()))throw Error('結束日期須介於開始日與今天之間；尚未結束可留空');
 const flow=String(f.flow||'未記錄'),pain=String(f.pain||'未記錄'),symptoms=V8_SYMPTOMS.filter((x,i)=>f['symptom'+i]==='on'),note=String(f.note||'').trim();
 if(!V8_FLOW.includes(flow)||!['未記錄','無','輕微','中等','明顯'].includes(pain)||note.length>3000)throw Error('請檢查經量、疼痛或備註內容');
 return {date,end,flow,pain,symptoms,note};
}
function v8WritePeriod(values,editor){
 if(editor.owner!==v6Owner()||v6Owner()==='locked')throw Error('帳號已切換，請重新開啟生理期表單');
 v8ValidateTracker(db.settings.periodTracker);
 const arr=v8PeriodRecords(),old=editor.id?arr.find(x=>x.id===editor.id):null;
 if(editor.id&&(!old||JSON.stringify(old)!==editor.before))throw Error('這筆紀錄已變更，請重新開啟再編輯');
 const record={...values,id:old?.id||id()};
 if(v8PeriodOverlap(record,arr))throw Error('這段日期與其他生理期重疊，請先確認日期或補上前次結束日');
 if(!old&&arr.length>=2000)throw Error('已達 2000 筆上限，請先保留備份');
 return v6Mutate(()=>{if(!db.settings.periodTracker)db.settings.periodTracker={records:[]};const records=v8PeriodRecords();if(old)Object.assign(old,values);else records.push(record);});
}
function v8PeriodSummary(records=v8PeriodRecords(),day=today()){
 const sorted=records.filter(x=>v6DateOK(x.date)&&x.date<=day).sort((a,b)=>a.date.localeCompare(b.date));
 const last=sorted.at(-1);if(!last)return {last:null,intervals:[],next:'',mean:null,ongoingDay:null};
 const starts=[...new Set(sorted.map(x=>x.date))].slice(-7),intervals=starts.slice(1).map((x,i)=>v8Day(x)-v8Day(starts[i]));
 const mean=intervals.length?Math.round(intervals.reduce((n,v)=>n+v,0)/intervals.length):null;
 return {last,intervals,mean,next:mean?v8AddDay(last.date,mean):'',ongoingDay:!last.end?v8Day(day)-v8Day(last.date)+1:null};
}
function v8PeriodCalendar(records,summary){
 const month=v8PeriodMonth||today().slice(0,7),[y,m]=month.split('-').map(Number),first=new Date(y,m-1,1),days=new Date(y,m,0).getDate(),offset=first.getDay();
 let cells=Array.from({length:offset},()=>'<span aria-hidden="true"></span>').join('');
 for(let n=1;n<=days;n++){
  const day=month+'-'+String(n).padStart(2,'0'),recorded=records.some(x=>x.date<=day&&day<=(x.end||today())),estimate=!recorded&&summary.next===day;
  cells+=`<button type="button" data-v9-period-day="${day}" aria-pressed="${v9PeriodSelected===day}" class="v8PeriodDay ${recorded?'recorded':''} ${estimate?'estimated':''} ${day===today()?'isToday':''} ${v9PeriodSelected===day?'selected':''}" aria-label="${day}${recorded?'，已記錄生理期':estimate?'，預估下次開始日':''}">${n}${estimate?'<small>預估</small>':''}</button>`;
 }
 return `<div class="v8PeriodCalendar"><div class="sectionhead"><button class="btn subtle sm" data-v8-month="-1" aria-label="生理期日曆上一月">‹</button><h3>${y} 年 ${m} 月</h3><button class="btn subtle sm" data-v8-month="1" aria-label="生理期日曆下一月">›</button></div><div class="v8PeriodDays">${['日','一','二','三','四','五','六'].map(n=>`<span class="note">${n}</span>`).join('')}${cells}</div><p class="tiny muted">點日期可查看、補登或編輯。<br>實色：實際紀錄　虛線：預估日期　外框：今天</p></div>`;
}
function v8PeriodPage(){
 if(v8PeriodOwner!==v6Owner()){v8PeriodOwner=v6Owner();v8PeriodId='';v8PeriodMonth='';v8PeriodLimit=12;v9PeriodSelected='';}
 const records=v8PeriodRecords(),s=v8PeriodSummary(records),r=records.find(x=>x.id===v8PeriodId)||{},sorted=[...records].sort((a,b)=>b.date.localeCompare(a.date));
 let status=!s.last?'從記下第一次開始，慢慢認識自己的節奏。':s.ongoingDay?'生理期進行中 · 第 '+s.ongoingDay+' 天':'最近一次：'+fmtDate(s.last.date)+' ～ '+fmtDate(s.last.end);
 let estimate=s.next?'預估下次開始：'+fmtDate(s.next):'至少記錄兩次生理期開始日後，才會計算預估日期。';
 if(s.next&&s.next<today())estimate='原預估日期：'+fmtDate(s.next)+'；尚未記錄新一次，請依實際情況補登。';
 return `<section class="card v8PeriodSection" aria-label="生理期追蹤"><div class="sectionhead"><div><span class="overline">照顧自己的節奏</span><h2>生理期追蹤</h2></div><span class="tag">${records.length} 次紀錄</span></div><p class="note">可補登過去紀錄；每筆代表一次生理期，尚未結束時可留空結束日。</p><div class="notice v8PeriodSummary"><strong>${esc(status)}</strong><p>${esc(estimate)}</p>${s.mean?`<p class="note">最近 ${s.intervals.length} 個間隔平均 ${s.mean} 天（${Math.min(...s.intervals)}～${Math.max(...s.intervals)} 天）。${new Set(s.intervals).size>1?'週期有變動，預估日期可能偏移。':''}</p>`:''}</div><div class="v8PeriodGrid"><div>${v8PeriodCalendar(records,s)}${v9PeriodDetail(records,s)}<p class="note">日期僅供生活安排參考，不作為避孕或診斷依據。</p></div><div><h3>${r.id?'編輯這次生理期':'新增生理期紀錄'}</h3><form data-form="period" data-period-id="${esc(r.id||'')}" data-period-owner="${esc(v6Owner())}" data-period-before="${esc(r.id?JSON.stringify(r):'')}" class="stack"><div class="row">${field('開始日期',`<input type="date" name="date" aria-label="生理期開始日期" required min="1900-01-01" max="${today()}" value="${esc(r.date||(v9PeriodSelected&&v9PeriodSelected<=today()?v9PeriodSelected:today()))}"/>`)}${field('結束日期（未結束可留空）',`<input type="date" name="end" aria-label="生理期結束日期" min="1900-01-01" max="${today()}" value="${esc(r.end||'')}"/>`)}</div><div class="row">${field('這次整體經量',`<select name="flow" aria-label="這次整體經量">${V8_FLOW.map(x=>`<option ${r.flow===x?'selected':''}>${x}</option>`).join('')}</select>`)}${field('這次整體疼痛程度',`<select name="pain" aria-label="這次整體疼痛程度">${['未記錄','無','輕微','中等','明顯'].map(x=>`<option ${r.pain===x?'selected':''}>${x}</option>`).join('')}</select>`)}</div><fieldset class="v8Symptoms"><legend>症狀（可複選，沒有可留空）</legend>${V8_SYMPTOMS.map((x,i)=>`<label><input type="checkbox" name="symptom${i}" ${(r.symptoms||[]).includes(x)?'checked':''}/> ${x}</label>`).join('')}</fieldset>${field('備註（選填）',`<textarea name="note" aria-label="生理期備註" maxlength="3000" rows="3" placeholder="記下這次想留意的身體感受">${esc(r.note||'')}</textarea>`)}<p data-period-error class="v6FormError" role="alert"></p><div class="row"><button class="btn" type="submit">${r.id?'儲存修改':'儲存生理期紀錄'}</button>${r.id?'<button class="btn subtle" type="button" data-v8-period-cancel>取消編輯</button>':''}</div></form></div></div><div class="sep"></div><h3>生理期歷史</h3><div class="stack">${sorted.slice(0,v8PeriodLimit).map(x=>`<div class="item v8PeriodLog"><div class="grow"><strong>${fmtDate(x.date)} ～ ${x.end?fmtDate(x.end):'尚未記錄結束'}</strong><div class="desc">${x.end?v8Day(x.end)-v8Day(x.date)+1+' 天 · ':''}經量 ${esc(x.flow)} · 疼痛 ${esc(x.pain)}</div><div class="desc">${esc((x.symptoms||[]).join('、'))}</div>${x.note?`<div class="desc">${esc(x.note)}</div>`:''}</div><button class="btn subtle sm" data-v8-period-edit="${esc(x.id)}">編輯</button><button class="iconbtn" data-v8-period-delete="${esc(x.id)}" aria-label="刪除 ${esc(x.date)} 生理期紀錄">×</button></div>`).join('')||'<div class="empty">還沒有紀錄；不會自動建立或猜測過去的生理期。</div>'}</div>${sorted.length>v8PeriodLimit?'<button class="btn line sm" data-v8-period-more>顯示更多紀錄</button>':''}<p class="note v8PeriodPrivacy">生理期紀錄會跟隨目前帳號的健康資料保存與 JSON 備份；若已開啟自動同步，也會上傳目前帳號的雲端。雲端並非端對端加密。</p></section>`;
}
function v8PeriodForm(e){
 const form=e.target.closest?.('form[data-form="period"]');if(!form||form.dataset.form!=='period')return false;e.preventDefault();
 try{
  const values=v8NormalizePeriod(v6FormData(form)),editor={owner:form.dataset.periodOwner,id:form.dataset.periodId||null,before:form.dataset.periodBefore||null};
  if(v8WritePeriod(values,editor)){v8PeriodId='';render();toast('已儲存生理期紀錄');}
  else form.querySelector('[data-period-error]').textContent='尚未儲存，原紀錄已保留；請先下載備份並確認儲存空間。';
 }catch(error){form.querySelector('[data-period-error]').textContent=error.message;}
 return true;
}
function v8PeriodClick(b){
 const has=k=>Object.prototype.hasOwnProperty.call(b.dataset,k);
 if(!['v8PeriodEdit','v8PeriodDelete','v8PeriodCancel','v8Month','v8PeriodMore'].some(has))return false;
 if(v7Editing()&&!confirm('有尚未儲存的內容，要放棄這次編輯嗎？'))return true;
 if(has('v8PeriodDelete')){v6Delete('periods',b.dataset.v8PeriodDelete);if(v8PeriodId===b.dataset.v8PeriodDelete)v8PeriodId='';}
 else {if(has('v8PeriodEdit'))v8PeriodId=b.dataset.v8PeriodEdit;if(has('v8PeriodCancel'))v8PeriodId='';if(has('v8Month'))v8PeriodMonth=monthNav(v8PeriodMonth||today().slice(0,7),Number(b.dataset.v8Month));if(has('v8PeriodMore'))v8PeriodLimit+=12;render();}
 if(has('v8PeriodEdit'))document.querySelector('form[data-form="period"]')?.scrollIntoView({behavior:'smooth',block:'center'});
 return true;
}
// Calendar interaction, richer diary emotions, and account-scoped focus sessions.
const V9_MOODS=[['好','😊 不錯'],['普通','🌿 普通'],['開心','☀️ 開心'],['平靜','平靜'],['感恩','感恩'],['期待','期待'],['滿足','滿足'],['被愛','被愛'],['有動力','有動力'],['放鬆','放鬆'],['低落','☁️ 低落'],['疲累','🌙 疲累'],['焦慮','焦慮'],['難過','難過'],['孤單','孤單'],['煩躁','煩躁'],['生氣','生氣'],['委屈','委屈'],['失落','失落'],['迷惘','迷惘'],['麻木','麻木'],['緊張','緊張'],['矛盾','矛盾'],['想哭','想哭']];
function v11OriginalMoodFields(r){const known=V9_MOODS.some(([v])=>v===r.mood),custom=r.mood&&!known?r.mood:((r.moods||[]).find(x=>!V9_MOODS.some(([v])=>v===x))||'');return `<div class="field"><label>主要心情</label><select name="mood" aria-label="主要心情">${V9_MOODS.map(([v,n])=>`<option value="${v}" ${(r.mood||'普通')===v?'selected':''}>${n}</option>`).join('')}<option value="custom" ${r.mood&&!known?'selected':''}>其他，自己填寫</option></select></div><details class="v9MoodExtras" ${(r.moods||[]).length>1?'open':''}><summary>今天有不只一種感受？加入其他情緒</summary><fieldset class="v8Symptoms"><legend>其他感受（可複選）</legend>${V9_MOODS.map(([v,n],i)=>`<label><input type="checkbox" name="v9mood${i}" ${(r.moods||[]).includes(v)&&r.mood!==v?'checked':''}/> ${n}</label>`).join('')}</fieldset></details><div class="field"><label>自己的心情描述（選填，最多 30 字）</label><input name="moodCustom" aria-label="自己的心情描述" maxlength="30" value="${esc(custom)}" placeholder="用自己的話形容此刻"/></div>`;}
function v9NormalizeMood(f){let custom=String(f.moodCustom||'').trim();if(custom.length>30)throw Error('自訂心情請控制在 30 字內');if(f.mood==='custom'&&!custom)throw Error('請填寫自己的心情描述');const primary=f.mood==='custom'?custom:V9_MOODS.some(([v])=>v===f.mood)?f.mood:'普通';return {mood:primary,moods:[...new Set([primary,...V9_MOODS.filter((_,i)=>f['v9mood'+i]==='on').map(([v])=>v),...(custom?[custom]:[])])]};}
function v9PeriodDetail(records,s){if(!v9PeriodSelected)return '<p class="note">點選日曆中的日期，查看當天紀錄或補登開始日。</p>';const date=v9PeriodSelected,r=records.find(x=>x.date<=date&&date<=(x.end||today()));return `<div class="notice v9DayDetail" role="status"><strong>${fmtDate(date)}</strong><p>${r?'已記錄生理期 · 第 '+(v8Day(date)-v8Day(r.date)+1)+' 天。下方已開啟這筆紀錄，可編輯日期與內容。':date>today()?(date===s.next?'這是預估下次開始日，僅供參考；實際開始後再記錄。':'這是未來日期，可查看日曆，尚不能登記實際生理期。'):'當天沒有生理期紀錄；下方開始日期已帶入所選日期，填妥後再儲存。'}</p></div>`;}
let v9FocusOwner=null,v9Active=null,v9ActiveDisk=null,v9ActiveError='',v9Mode='work',v9FocusLimit=12;
function v9FocusRecords(data=db){return Array.isArray(data.settings?.focusTracker?.records)?data.settings.focusTracker.records:[];}
function v9Collection(key){return key==='periods'?v8PeriodRecords():key==='focusSessions'?v9FocusRecords():db[key];}
function v9Minutes(v,max){const n=Number(v);if(!Number.isInteger(n)||n<1||n>max)throw Error('時間請填整數：專注 1～720 分鐘、休息 1～240 分鐘');return n;}
function v9FocusPrefs(){const p=db.settings.focusTracker?.prefs;return {workMinutes:Number.isInteger(p?.workMinutes)&&p.workMinutes>=1&&p.workMinutes<=720?p.workMinutes:25,breakMinutes:Number.isInteger(p?.breakMinutes)&&p.breakMinutes>=1&&p.breakMinutes<=240?p.breakMinutes:5};}
function v9ValidateFocus(t){if(t===undefined)return;if(!t||typeof t!=='object'||Array.isArray(t)||!Array.isArray(t.records)||t.records.length>2000)throw Error('bad-data');if(t.prefs){try{v9Minutes(t.prefs.workMinutes,720);v9Minutes(t.prefs.breakMinutes,240);}catch{throw Error('bad-data');}}const ids=new Set();for(const r of t.records){if(!r||typeof r!=='object'||typeof r.id!=='string'||!r.id||ids.has(r.id)||typeof r.topic!=='string'||!r.topic.trim()||r.topic.length>200||!Number.isFinite(r.startedAt)||!Number.isFinite(r.endedAt)||r.endedAt<r.startedAt||!Number.isInteger(r.plannedSeconds)||r.plannedSeconds<60||r.plannedSeconds>43200||!Number.isInteger(r.elapsedSeconds)||r.elapsedSeconds<0||r.elapsedSeconds>r.plannedSeconds||!['completed','stopped'].includes(r.outcome)||!Number.isInteger(r.score)||r.score<1||r.score>10||typeof r.reflection!=='string'||r.reflection.length>3000||typeof r.stopReason!=='string'||r.stopReason.length>500||(r.outcome==='stopped'&&!r.stopReason.trim())||(r.outcome==='completed'&&r.elapsedSeconds!==r.plannedSeconds))throw Error('bad-data');if(r.link&&!v10LinkOK(r.link))throw Error('bad-data');ids.add(r.id);}}
function v9ActiveKey(){return K+'_focus_v9_'+v6Owner();}
function v9ValidActive(a){return a&&a.owner===v6Owner()&&typeof a.id==='string'&&['work','break'].includes(a.mode)&&['active','review'].includes(a.status)&&typeof a.running==='boolean'&&Number.isInteger(a.plannedSeconds)&&a.plannedSeconds>=60&&a.plannedSeconds<=43200&&Number.isInteger(a.elapsedSeconds)&&a.elapsedSeconds>=0&&a.elapsedSeconds<=a.plannedSeconds&&Number.isFinite(a.segmentAt)&&Number.isFinite(a.startedAt)&&typeof a.topic==='string'&&a.topic.length<=200&&(!a.link||v10LinkOK(a.link))&&(!a.running||a.status==='active')&&(!a.breaking||(!a.running&&a.status==='active'&&Number.isFinite(a.breakUntil)))&&Number.isInteger(a.workMinutes)&&a.workMinutes>=1&&a.workMinutes<=720&&Number.isInteger(a.breakMinutes)&&a.breakMinutes>=1&&a.breakMinutes<=240&&typeof a.reflection==='string'&&typeof a.stopReason==='string'&&(a.status!=='review'||(['completed','stopped'].includes(a.outcome)&&Number.isFinite(a.endedAt)&&a.endedAt>=a.startedAt));}
function v9FocusContext(){const owner=v6Owner();if(owner==='locked'){v9FocusOwner=owner;v9Active=null;v9ActiveDisk=null;return;}let raw;try{raw=localStorage.getItem(v9ActiveKey());}catch{v9ActiveError='無法讀取本機計時，請先下載資料備份。';return;}if(owner===v9FocusOwner&&raw===v9ActiveDisk)return;v9FocusOwner=owner;v9ActiveDisk=raw;v9ActiveError='';try{const a=raw?JSON.parse(raw):null;if(a&&!v9ValidActive(a))throw Error('invalid');v9Active=a;}catch{v9Active=null;v9ActiveError='此裝置的未完成計時資料無法讀取，請保留本機資料並聯絡協助。';}v9Mode=v9Active?.mode||'work';}
function v9PutActive(next){if(v6Owner()==='locked'||v9FocusOwner!==v6Owner())throw Error('帳號已切換，請重新開啟專注計時');if(localStorage.getItem(v9ActiveKey())!==v9ActiveDisk)throw Error('另一個分頁已更新計時，請重新載入');const raw=next?JSON.stringify(next):null;if(raw===null)localStorage.removeItem(v9ActiveKey());else localStorage.setItem(v9ActiveKey(),raw);v9Active=next;v9ActiveDisk=raw;v9ActiveError='';}
function v9Elapsed(a=v9Active,now=Date.now()){return a?Math.min(a.plannedSeconds,a.elapsedSeconds+(a.running?Math.max(0,Math.floor((now-a.segmentAt)/1000)):0)):0;}
function v9Remaining(a=v9Active){return a?Math.max(0,a.plannedSeconds-v9Elapsed(a)):0;}
function v9FocusStart(f,owner){v9FocusContext();if(owner!==v6Owner()||v6Owner()==='locked')throw Error('帳號已切換，請重新開啟表單');if(v9Active||v9ActiveError)throw Error(v9ActiveError||'請先完成目前這段計時與回顧');const prefs={workMinutes:v9Minutes(f.workMinutes,720),breakMinutes:v9Minutes(f.breakMinutes,240)},mode=f.mode==='break'?'break':'work',topic=String(f.topic||'').trim();if(mode==='work'&&(!topic||topic.length>200))throw Error('請填寫這次要專注的內容（最多 200 字）');const link=mode==='work'?v10ResolveLink(f.link):null;if(!v6Mutate(()=>{db.settings.focusTracker={...db.settings.focusTracker,prefs,records:v9FocusRecords()};}))return false;const now=Date.now();v9PutActive({id:id(),owner:v6Owner(),mode,topic:mode==='work'?topic:'休息',...prefs,plannedSeconds:(mode==='work'?prefs.workMinutes:prefs.breakMinutes)*60,elapsedSeconds:0,running:true,segmentAt:now,startedAt:now,status:'active',reflection:'',stopReason:'',score:'',...(link?{link}:{})});v9Mode=mode;return true;}
function v9FocusFinish(outcome){if(!v9Active||v9Active.status!=='active')return;const a=v9Active,elapsed=v9Elapsed(a),complete=elapsed>=a.plannedSeconds;const next={...a,elapsedSeconds:elapsed,running:false,status:'review',outcome:complete?'completed':outcome,endedAt:complete&&a.running?a.segmentAt+(a.plannedSeconds-a.elapsedSeconds)*1000:Date.now()};delete next.breaking;delete next.breakUntil;v9PutActive(next);}
function v9FocusTick(){if(typeof db==='undefined')return;v9FocusContext();if(v10RestTick())return;if(!v9Active?.running)return;try{if(!v9Remaining()){v9FocusFinish('completed');view='focus';render();toast(v9Active.mode==='work'?'專注完成，記下這次回顧吧。':'休息結束了。');}else if(view==='focus')v9PaintTimer();}catch{v9ActiveError='計時暫時無法保存，請保持此頁開啟並下載備份。';if(view==='focus')v9PaintTimer();}}
function v9PaintTimer(){if(typeof document==='undefined')return;if(v10PaintImmersive())return;const a=v9Active,seconds=a?v9Remaining(a):v9SetupSeconds(),el=document.querySelector('#timerValue'),st=document.querySelector('#timerState');if(el)el.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');if(st)st.textContent=v9ActiveError||(!a?'設定時間與內容後開始':a.status==='review'?(a.outcome==='completed'?'已完成，等待回顧':'已中止，等待回顧'):a.running?'計時進行中':'已暫停，可繼續');}
function v9ReviewSave(f,owner,activeId){v9FocusContext();const a=v9Active;if(owner!==v6Owner()||!a||a.id!==activeId||a.status!=='review')throw Error('計時紀錄或帳號已變更，請重新開啟回顧');if(a.mode==='break'){v9PutActive(null);v9Mode='work';return true;}const score=Number(f.score),reflection=String(f.reflection||'').trim(),stopReason=String(f.stopReason||'').trim();if(!Number.isInteger(score)||score<1||score>10)throw Error('請選擇這次專注度：1～10 分');if(a.outcome==='stopped'&&!stopReason)throw Error('請記下中途停止的原因');if(reflection.length>3000||stopReason.length>500)throw Error('感想最多 3000 字，中止原因最多 500 字');const record={...(a.link?{link:a.link}:{}),id:a.id,topic:a.topic,startedAt:a.startedAt,endedAt:a.endedAt,plannedSeconds:a.plannedSeconds,elapsedSeconds:a.elapsedSeconds,outcome:a.outcome,score,reflection,stopReason};const arr=v9FocusRecords();if(!arr.some(x=>x.id===a.id)){if(arr.length>=2000)throw Error('專注紀錄已達 2000 筆，請先保留備份');if(!v6Mutate(()=>{db.settings.focusTracker={...db.settings.focusTracker,records:[...v9FocusRecords(),record]};v10CompleteLinked(a,f);}))return false;}v9PutActive(null);v9Mode='work';return true;}
function v9Time(seconds){return Math.floor(seconds/60)+' 分 '+seconds%60+' 秒';}
function v9FocusPage(){v9FocusContext();const a=v9Active,p=v9FocusPrefs(),records=[...v9FocusRecords()].sort((a,b)=>b.startedAt-a.startedAt);return `<div class="grid"><section class="card span7"><div class="sectionhead"><h2>專注與休息</h2><span class="tag">${(a?.mode||v9Mode)==='work'?'專注模式':'休息模式'}</span></div>${v9ActiveError?`<p class="notice warning" role="alert">${esc(v9ActiveError)}</p>`:''}<div class="focusring"><div><div class="bigtime" id="timerValue" aria-live="off" style="font-size:44px;padding:0"></div><p id="timerState" role="status"></p></div></div>${!a?`<form data-form="v9-focus-start" data-owner="${esc(v6Owner())}" class="stack"><div class="field"><label for="v9FocusMode">現在想做什麼？</label><select name="mode" id="v9FocusMode"><option value="work" ${v9Mode==='work'?'selected':''}>專注</option><option value="break" ${v9Mode==='break'?'selected':''}>休息</option></select></div><div class="row">${v6Input('workMinutes','專注時間（分鐘）','number',p.workMinutes,'required min="1" max="720" step="1"')}${v6Input('breakMinutes','休息時間（分鐘）','number',p.breakMinutes,'required min="1" max="240" step="1"')}</div>${v10LinkChoices()}${v6Input('topic','這次要專注的內容（休息可留空）','text',v10DraftTopic(),'maxlength="200" placeholder="想花一點時間完成什麼？"')}<p class="v6FormError" data-v9-error role="alert"></p><button class="btn" type="submit" ${v9ActiveError?'disabled':''}>開始計時</button></form>`:`<p class="v9FocusTopic">${esc(a.topic)}</p><p class="note">目標 ${Math.round(a.plannedSeconds/60)} 分鐘 · 本次設定：專注 ${a.workMinutes} 分鐘／休息 ${a.breakMinutes} 分鐘</p>${a.status==='active'?`<div class="row"><button class="btn" data-v9-focus="${a.running?'pause':'resume'}" data-id="${esc(a.id)}">${a.running?'暫停':'繼續'}</button><button class="btn line" data-v9-focus="stop" data-id="${esc(a.id)}">${a.mode==='work'?'中止並填寫原因':'結束這次休息'}</button></div>`:`<h3>${a.mode==='work'?(a.outcome==='completed'?'完成專注，留下回顧':'這次先停下來，留下原因'):'休息已結束'}</h3><p class="note">實際 ${v9Time(a.elapsedSeconds)}</p><form data-form="v9-focus-review" data-owner="${esc(v6Owner())}" data-session-id="${esc(a.id)}" class="stack">${a.mode==='work'?`${v6Area('reflection','專注完後的感想（選填）',a.reflection,'做了什麼？有什麼發現？')}${a.outcome==='stopped'?v6Area('stopReason','中途停止的原因（必填）',a.stopReason,'記錄原因，方便下次調整'):''}${v6Select('score','這次的專注度（1～10 分）',[['','請選擇'],...Array.from({length:10},(_,i)=>[String(i+1),String(i+1)+' 分'+(i===0?' · 很難集中':i===9?' · 非常專心':'')])],String(a.score||''))}${v10ReviewLink(a)}`:''}<p class="v6FormError" data-v9-error role="alert"></p><button class="btn" type="submit">${a.mode==='work'?'儲存這次回顧':'回到專注設定'}</button></form>`}` }<p class="note">未完成計時與回顧先保留在此瀏覽器、目前帳號；重新開啟時會核對時間。關閉 APP 不會發送背景通知。暫停時間不計入專注時間。</p></section><section class="card span5"><h2>專注紀錄</h2><p class="note">${records.length} 次已儲存的回顧。完成與中止分開標示。</p><div class="stack">${records.slice(0,v9FocusLimit).map(r=>`<article class="item v9FocusLog"><div class="grow"><strong>${esc(r.topic)}</strong><p class="desc">${esc(new Date(r.startedAt).toLocaleString('zh-TW'))}<br>${r.outcome==='completed'?'已完成':'中途停止'} · 實際 ${v9Time(r.elapsedSeconds)}／目標 ${Math.round(r.plannedSeconds/60)} 分鐘 · 專注度 ${r.score}/10</p>${r.stopReason?`<p class="desc">中止原因：${esc(r.stopReason)}</p>`:''}${r.reflection?`<p class="desc">感想：${esc(r.reflection)}</p>`:''}</div><button class="iconbtn" aria-label="刪除專注紀錄 ${esc(r.topic)}" data-delete="focusSessions" data-id="${esc(r.id)}">×</button></article>`).join('')||'<p class="empty">完成一次專注並儲存回顧後，紀錄會出現在這裡。</p>'}</div>${records.length>v9FocusLimit?'<button class="btn line sm" data-v9-focus-more>顯示更多紀錄</button>':''}<p class="note">已儲存的回顧會納入目前帳號的 JSON 備份；已開啟自動同步時也會上傳雲端。進行中的倒數不會在其他裝置同時啟動。</p></section></div>`;}
function v9Form(e){const form=e.target.closest?.('form[data-form]');if(!form||!['v9-focus-start','v9-focus-review'].includes(form.dataset.form))return false;e.preventDefault();try{const ok=form.dataset.form==='v9-focus-start'?v9FocusStart(v6FormData(form),form.dataset.owner):v9ReviewSave(v6FormData(form),form.dataset.owner,form.dataset.sessionId);if(ok){render();toast(form.dataset.form==='v9-focus-start'?'已開始計時':'已儲存這次回顧');}else form.querySelector('[data-v9-error]').textContent='尚未儲存，請確認裝置空間並下載備份。';}catch(err){form.querySelector('[data-v9-error]').textContent=err.message;}return true;}
function v9Click(b){
 if(b.dataset.v9PeriodDay){if(v7Editing()&&!confirm('要放棄尚未儲存的內容，改看這個日期嗎？'))return true;const day=b.dataset.v9PeriodDay;if(!v6DateOK(day))return true;v9PeriodSelected=day;const r=v8PeriodRecords().find(x=>x.date<=day&&day<=(x.end||today()));v8PeriodId=r?.id||'';render();return true;}
 if(b.hasAttribute('data-v9-focus-more')){v9FocusLimit+=12;render();return true;}
 if(!b.dataset.v9Focus)return false;try{v9FocusContext();const a=v9Active;if(!a||a.id!==b.dataset.id||a.status!=='active')throw Error('計時狀態已變更，請重新載入');const action=b.dataset.v9Focus;if(action==='pause'&&a.running){if(!v9Remaining())v9FocusFinish('completed');else v9PutActive({...a,elapsedSeconds:v9Elapsed(a),running:false});}if(action==='resume'&&!a.running)v9PutActive({...a,running:true,segmentAt:Date.now()});if(action==='stop')v9FocusFinish('stopped');render();}catch(err){toast(err.message);}return true;
}
document.addEventListener('input',e=>{const f=e.target.closest?.('form[data-form="v9-focus-review"]');if(!f||f.dataset.form!=='v9-focus-review'||f.dataset.owner!==v6Owner()||!v9Active||v9Active.id!==f.dataset.sessionId)return;try{const v=v6FormData(f);v9PutActive({...v9Active,reflection:String(v.reflection||'').slice(0,3000),stopReason:String(v.stopReason||'').slice(0,500),score:String(v.score||'')});}catch{v9ActiveError='回顧暫時無法暫存，請保持頁面開啟並嘗試儲存。';}});

function v9SetupSeconds(){const f=typeof document!=='undefined'?document.querySelector('form[data-form="v9-focus-start"]'):null,p=v9FocusPrefs();if(f){const mode=f.querySelector('[name="mode"]')?.value||v9Mode,n=Number(f.querySelector(mode==='work'?'[name="workMinutes"]':'[name="breakMinutes"]')?.value);if(Number.isInteger(n)&&n>=1&&n<=(mode==='work'?720:240))return n*60;}return (v9Mode==='work'?p.workMinutes:p.breakMinutes)*60;}
document.addEventListener('change',e=>{const f=e.target.closest?.('form[data-form="v9-focus-start"]');if(f&&f.dataset.form==='v9-focus-start'&&!v9Active){v9Mode=f.querySelector('[name="mode"]').value;v9PaintTimer();}});

function v9ClearAll(){v9FocusContext();if(!v6Mutate(()=>{db=sanitize(DEFAULT);}))return false;try{v9PutActive(null);v9Mode='work';render();toast('資料已清空');return true;}catch{render();toast('一般紀錄已清空，但未完成計時尚未清除；請重新載入後再清空。');return false;}}
// Immersive focus stays in the app viewport; no extra device permissions required.
let v10LinkDraft=null,v10HabitEditId='',v10HabitOwner=null;
function v10ShouldImmerse(){return !!(v9Active&&v9Active.owner===v6Owner()&&v6Owner()!=='locked'&&v9Active.status==='active');}
function v10SetImmersive(on){if(typeof document!=='undefined'&&document.documentElement)document.documentElement.dataset.focusImmersive=on?'on':'off';}
function v10ImmersivePage(){const a=v9Active,resting=a.breaking||!a.running;return `<section class="v10Immersive" aria-label="${a.breaking?'中途休息':a.mode==='break'?'休息倒數':'專注倒數'}"><div class="v10Timer" id="timerValue" role="timer" aria-live="off"></div><p id="timerState" class="v10SrOnly" role="status"></p><p id="v10FocusError" class="v10FocusError" role="alert" hidden></p><div class="v10FocusActions"><button class="btn line" data-v10-focus="end" data-id="${esc(a.id)}">結束</button><button class="btn" data-v10-focus="${resting?'resume':'rest'}" data-id="${esc(a.id)}">${resting?(a.mode==='break'?'繼續休息':'繼續專注'):a.mode==='break'?'暫停休息':'中途休息'}</button></div></section>`;}
function v10DisplaySeconds(a=v9Active,now=Date.now()){return !a?0:a.breaking?Math.max(0,Math.ceil((a.breakUntil-now)/1000)):v9Remaining(a);}
function v10PaintImmersive(){if(typeof document==='undefined'||!v10ShouldImmerse())return false;const el=document.querySelector('#timerValue');if(!el)return false;const n=v10DisplaySeconds(),a=v9Active;el.textContent=String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');el.setAttribute?.('aria-label',(a.breaking?'中途休息剩餘':a.mode==='break'?'休息剩餘':'專注剩餘')+Math.floor(n/60)+' 分 '+n%60+' 秒');const st=document.querySelector('#timerState');if(st)st.textContent=a.breaking?(n?'中途休息中':'休息已結束，按繼續專注回到倒數'):a.running?'倒數進行中':'已暫停';const err=document.querySelector('#v10FocusError');if(err){err.textContent=v9ActiveError;err.hidden=!v9ActiveError;}return true;}
function v10RestTick(){if(!v9Active?.breaking)return false;v10PaintImmersive();return true;}
function v10FocusAction(action,activeId){v9FocusContext();const a=v9Active;if(!a||a.owner!==v6Owner()||a.id!==activeId||a.status!=='active')throw Error('這段計時已變更，請重新載入');if(action==='end'){v9FocusFinish('stopped');view='focus';render();return;}
 if(action==='rest'&&a.running){const elapsed=v9Elapsed(a);if(elapsed>=a.plannedSeconds){v9FocusFinish('completed');view='focus';render();return;}if(a.mode==='work')v9PutActive({...a,elapsedSeconds:elapsed,running:false,breaking:true,breakUntil:Date.now()+a.breakMinutes*60000});else v9PutActive({...a,elapsedSeconds:elapsed,running:false});}
 if(action==='resume'&&!a.running){const next={...a,running:true,segmentAt:Date.now()};delete next.breaking;delete next.breakUntil;v9PutActive(next);}
 render();
}
function v10HabitName(h){return String(h.name||h.title||'未命名習慣');}
function v10HabitDates(h){return [...new Set((Array.isArray(h.dates)?h.dates:[]).filter(v=>typeof v==='string'&&v6DateOK(v)))].sort();}
function v10HabitDone(h,day=today()){return v10HabitDates(h).includes(day);}
function v10Streak(h,day=today()){const dates=new Set(v10HabitDates(h));let cursor=dates.has(day)?day:v8AddDay(day,-1),n=0;while(dates.has(cursor)){n++;cursor=v8AddDay(cursor,-1);}return n;}
function v10WriteHabit(name,editor){const clean=String(name||'').trim();if(editor.owner!==v6Owner()||v6Owner()==='locked')throw Error('帳號已切換，請重新開啟習慣表單');if(!clean||clean.length>60)throw Error('請填寫 1～60 字的習慣名稱');const old=editor.id?db.habits.find(x=>x.id===editor.id):null;if(editor.id&&(!old||JSON.stringify(old)!==editor.before))throw Error('這個習慣已變更，請重新開啟編輯');if(db.habits.some(x=>x.id!==editor.id&&v10HabitName(x).trim()===clean))throw Error('已有相同名稱的習慣');if(!old&&db.habits.length>=2000)throw Error('習慣已達 2000 筆，請先保留備份');return v6Mutate(()=>{if(old)old.name=clean;else db.habits.push({id:id(),name:clean,dates:[],createdDate:today()});});}
function v10SetHabitDay(h,day,done){if(!v6DateOK(day)||day>today())throw Error('只能登記今天或過去的實際打卡');const dates=v10HabitDates(h);if(done&&!dates.includes(day)){if(dates.length>=5000)throw Error('此習慣已達 5000 天紀錄，請先保留備份');dates.push(day);}h.dates=done?dates.sort():dates.filter(x=>x!==day);}
function v10ToggleHabit(habitId,owner,expected){if(owner!==v6Owner()||v6Owner()==='locked')throw Error('帳號已切換，請重新開啟習慣打卡');const h=db.habits.find(x=>x.id===habitId);if(!h)throw Error('這個習慣已不存在');if(v10HabitDone(h)!==expected)throw Error('打卡狀態已變更，請重新載入');return v6Mutate(()=>v10SetHabitDay(h,today(),!expected));}
function v10HabitButton(h){const done=v10HabitDone(h);return `<button class="btn ${done?'subtle':''}" data-v10-habit-toggle="${esc(h.id)}" data-owner="${esc(v6Owner())}" data-done="${done?'1':'0'}" aria-label="${done?'取消今天打卡':'今天打卡'}：${esc(v10HabitName(h))}">${done?'已打卡 · 取消':'今天打卡'}</button>`;}
function v10TaskTabs(){return `<div class="chiprow v10TaskTabs" aria-label="任務與習慣"><button class="chip ${view==='tasks'?'active':''}" data-page="tasks">任務清單</button><button class="chip ${view==='habits'?'active':''}" data-page="habits">習慣打卡</button></div>`;}
function v10HabitsPage(){if(v10HabitOwner!==v6Owner()){v10HabitOwner=v6Owner();v10HabitEditId='';}const record=db.habits.find(x=>x.id===v10HabitEditId),done=db.habits.filter(x=>v10HabitDone(x)).length;return `${v10TaskTabs()}<section class="card v10HabitsIntro"><div class="sectionhead"><h2>每天一點點，留下自己的節奏</h2><span class="tag">今天 ${done}／${db.habits.length} 項</span></div><p class="note">每個習慣每天打卡一次，重複點按可取消今天的打卡。</p><form data-form="v10-habit" data-owner="${esc(v6Owner())}" data-id="${esc(record?.id||'')}" data-before="${esc(record?JSON.stringify(record):'')}" class="stack">${v6Input('name',record?'修改習慣名稱':'新增一個每日習慣','text',record?v10HabitName(record):'','required maxlength="60" placeholder="想每天留一點時間做的事"')}<p class="v6FormError" data-v10-error role="alert"></p><div class="row"><button class="btn" type="submit">${record?'儲存修改':'加入習慣'}</button>${record?'<button class="btn subtle" type="button" data-v10-habit-cancel>取消編輯</button>':''}</div></form></section><div class="v10HabitGrid">${db.habits.map(h=>`<section class="card"><div class="sectionhead"><h3>${esc(v10HabitName(h))}</h3><span class="tag">${v10HabitDone(h)?'今天完成了':'今天未打卡'}</span></div><p class="note">連續 ${v10Streak(h)} 天${!v10HabitDone(h)?'（截至昨天）':''} · 累計 ${v10HabitDates(h).length} 天</p><div class="v10HabitWeek" aria-label="最近七天打卡">${Array.from({length:7},(_,i)=>v8AddDay(today(),i-6)).map(d=>`<span class="${v10HabitDone(h,d)?'done':''}" aria-label="${d} ${v10HabitDone(h,d)?'已打卡':'未打卡'}"><small>${['日','一','二','三','四','五','六'][new Date(d+'T12:00:00').getDay()]}</small><strong>${Number(d.slice(-2))}</strong></span>`).join('')}</div><div class="row">${v10HabitButton(h)}<button class="btn line" data-v10-link-focus="habit" data-id="${esc(h.id)}">專注這個習慣</button></div><div class="row"><button class="btn subtle sm" data-v10-habit-edit="${esc(h.id)}">編輯名稱</button><button class="iconbtn" aria-label="刪除習慣 ${esc(v10HabitName(h))}" data-delete="habits" data-id="${esc(h.id)}">×</button></div></section>`).join('')||'<section class="card empty">還沒有習慣。先新增一件每天想做的小事。</section>'}</div>`;}
function v10TodayHabits(){return `<section class="card v10TodayHabits"><div class="sectionhead"><h2>今天的習慣</h2><button class="btn subtle sm" data-page="habits">管理習慣</button></div><div class="stack">${db.habits.slice(0,3).map(h=>`<div class="item"><strong class="grow">${esc(v10HabitName(h))}</strong>${v10HabitButton(h)}</div>`).join('')||'<p class="note">新增一個每天想做的小習慣，慢慢累積。</p>'}</div></section>`;}
function v10ResolveLink(value){if(!value)return null;const split=value.indexOf(':'),kind=value.slice(0,split),recordId=value.slice(split+1);if(!['task','habit'].includes(kind)||!recordId)throw Error('請重新選擇關聯項目');const r=(kind==='task'?db.tasks:db.habits).find(x=>x.id===recordId);if(!r)throw Error('關聯的任務或習慣已不存在，請重新選擇');return {kind,id:r.id,title:kind==='task'?String(r.title):v10HabitName(r)};}
function v10DraftLink(){if(v10LinkDraft?.owner!==v6Owner())return null;try{return v10ResolveLink(v10LinkDraft.value);}catch{return null;}}
function v10DraftTopic(){return v10DraftLink()?.title||'';}
function v10LinkChoices(){const selected=v10DraftLink(),value=selected?selected.kind+':'+selected.id:'';const options=[...db.tasks.filter(t=>!t.done||value==='task:'+t.id).map(t=>['task:'+t.id,'任務：'+String(t.title)]),...db.habits.map(h=>['habit:'+h.id,'習慣：'+v10HabitName(h)])];return `${v6Select('link','關聯任務或習慣（選填）',[['','不關聯，直接專注'],...options],value)}<div class="chiprow"><button type="button" class="btn line sm" data-page="tasks">新增／管理任務</button><button type="button" class="btn line sm" data-page="habits">新增／管理習慣</button></div>`;}
function v10ReviewLink(a){if(a.outcome!=='completed'||!a.link)return '';const r=(a.link.kind==='task'?db.tasks:db.habits).find(x=>x.id===a.link.id);if(!r)return '<p class="note">原本關聯的項目已刪除，仍可儲存本次回顧。</p>';const day=localDate(new Date(a.endedAt));return `<label class="v10CompleteLinked"><input type="checkbox" name="completeLinked"/> ${a.link.kind==='task'?'同時將這項任務標記完成':'同時為這個習慣在 '+fmtDate(day)+' 打卡'}：${esc(a.link.title)}</label>`;}
function v10CompleteLinked(a,f){if(a.outcome!=='completed'||!a.link||f.completeLinked!=='on')return;const r=(a.link.kind==='task'?db.tasks:db.habits).find(x=>x.id===a.link.id);if(!r)throw Error('關聯項目已不存在，請取消勾選後再儲存回顧');if(a.link.kind==='task')r.done=true;else v10SetHabitDay(r,localDate(new Date(a.endedAt)),true);}
function v10Form(e){const form=e.target.closest?.('form[data-form]');if(!form||form.dataset.form!=='v10-habit')return false;e.preventDefault();try{const f=v6FormData(form);if(v10WriteHabit(f.name,{owner:form.dataset.owner,id:form.dataset.id||null,before:form.dataset.before||null})){v10HabitEditId='';render();toast('已儲存習慣');}else form.querySelector('[data-v10-error]').textContent='儲存失敗，原本資料已保留。';}catch(err){form.querySelector('[data-v10-error]').textContent=err.message;}return true;}
function v10Click(b){const has=k=>Object.prototype.hasOwnProperty.call(b.dataset,k);if(!['v10Focus','v10HabitToggle','v10HabitEdit','v10HabitCancel','v10LinkFocus'].some(has))return false;try{if(has('v10Focus')){v10FocusAction(b.dataset.v10Focus,b.dataset.id);return true;}if(v7Editing()&&!confirm('有尚未儲存的內容，要放棄這次編輯嗎？'))return true;if(has('v10HabitToggle')){if(v10ToggleHabit(b.dataset.v10HabitToggle,b.dataset.owner,b.dataset.done==='1')){render();toast(b.dataset.done==='1'?'已取消今天打卡':'今天的打卡已留下');}return true;}if(has('v10HabitEdit'))v10HabitEditId=b.dataset.v10HabitEdit;if(has('v10HabitCancel'))v10HabitEditId='';if(has('v10LinkFocus')){const value=b.dataset.v10LinkFocus+':'+b.dataset.id;v10ResolveLink(value);v10LinkDraft={owner:v6Owner(),value};go('focus');return true;}render();}catch(err){if(has('v10Focus')){v9ActiveError=err.message;v10PaintImmersive();}else toast(err.message);}return true;}
document.addEventListener('change',e=>{const f=e.target.closest?.('form[data-form="v9-focus-start"]');if(!f||f.dataset.form!=='v9-focus-start'||e.target.name!=='link')return;try{const link=v10ResolveLink(e.target.value);v10LinkDraft={owner:v6Owner(),value:e.target.value};const input=f.querySelector('[name="topic"]');if(link&&input)input.value=link.title;}catch(err){toast(err.message);}});

function v10LinkOK(link){return !!(link&&['task','habit'].includes(link.kind)&&typeof link.id==='string'&&link.id.length>0&&link.id.length<=256&&typeof link.title==='string'&&link.title.length<=200);}

// 四象限保留原有 q1～q4 資料值；選擇與顯示只更新當前表單。
const V11_QUADRANTS=[['q2','重要不緊急'],['q1','重要且緊急'],['q4','不重要不緊急'],['q3','不重要且緊急']];
function v11QuadrantFields(value='q2'){const selected=V11_QUADRANTS.some(([key])=>key===value)?value:'q2';return `<fieldset class="v11Quadrants"><legend>四象限（擇一）</legend><div class="v11QuadrantGrid">${V11_QUADRANTS.map(([key,label])=>`<label class="v11Quadrant v11${key}"><input type="radio" name="quadrant" value="${key}" ${key===selected?'checked':''} required/><span>${label}</span></label>`).join('')}</div></fieldset>`;}
function v11MoodTags(values){const unique=[...new Set(values.filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()))];return unique.length?unique.map(v=>`<span class="v11MoodTag">${esc(V9_MOODS.find(([key])=>key===v)?.[1]||v)}</span>`).join(''):'<span class="note">選取後會顯示在這裡</span>';}
function v9MoodFields(r){const primary=r.mood||'普通',values=[primary,...(r.moods||[])];const summary=`<div class="v11MoodSelection" aria-live="polite" aria-atomic="true"><span class="v11MoodCaption">目前選擇的感受</span><div class="v11MoodTags" data-v11-mood-tags>${v11MoodTags(values)}</div></div>`;return `<div class="v11MoodFields">${v11OriginalMoodFields(r).replace('</details>','</details>'+summary)}</div>`;}
function v11PaintMoodSummary(root){const primary=root.querySelector('[name="mood"]')?.value||'',custom=String(root.querySelector('[name="moodCustom"]')?.value||'').trim(),values=[primary==='custom'?custom:primary,...V9_MOODS.filter((_,i)=>root.querySelector('[name="v9mood'+i+'"]')?.checked).map(([v])=>v),custom];const target=root.querySelector('[data-v11-mood-tags]');if(target)target.innerHTML=v11MoodTags(values);}
function v11MoodChanged(e){const root=e.target.closest?.('.v11MoodFields');if(root)v11PaintMoodSummary(root);}
document.addEventListener('change',v11MoodChanged);
document.addEventListener('input',v11MoodChanged);

function v12ReminderValue(value) {
 const input = String(value || '');
 if (!input) return '';
 const [date, time] = input.split('T');
 const stamp = new Date(input);
 if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(input) ||
     !v6DateOK(date) || !Number.isFinite(+stamp) ||
     stamp.getHours() !== Number(time.slice(0, 2)) || stamp.getMinutes() !== Number(time.slice(3))) {
  throw Error('請輸入有效的提醒日期與時間');
 }
 return input;
}
function v12ReminderField(value) {
 return '<label>提醒時間（選填）<input type="datetime-local" name="remindAt" value="' +
  esc(value || '') + '"></label>';
}
function v12ReminderControls() {
 return '<p class="note">App 開著時會顯示提醒。需要在關閉 App 後收到通知，可將行程加入支援提醒的手機行事曆。</p>' +
  (typeof Notification !== 'undefined' && Notification.permission === 'default'
   ? '<button class="btn subtle sm" data-v12-permission>開啟系統通知</button>' : '');
}
function v12ReminderInfo(event) {
 let reminder;
 try { reminder = v12ReminderValue(event.remindAt); } catch { return ''; }
 const weekly = event.repeat === 'weekly' ? '<div class="tiny muted">每週重複 · 編輯或刪除會套用整組</div>' : '';
 if (!reminder) return weekly;
 return weekly + '<div class="tiny muted">提醒 ' + esc(reminder.replace('T',' ')) + '</div>' +
  '<button class="btn subtle sm" data-v12-calendar="' + esc(event.id) + '" data-v12-date="' + esc(event.date) + '">下載本次提醒</button>';
}
const v12Shown = new Map();
let v12Checking = false;
async function v12CheckReminders() {
 if (v12Checking || !window.sylvaAppBooted) return;
 const owner = v6Owner();
 if (owner === 'locked') return;
 const now = Date.now();
 const key = 'sylva_event_reminders_v1:' + owner;
 v12Checking = true;
 try {
  let sent = v12Shown.get(owner) || {};
  try { sent = {...sent, ...JSON.parse(localStorage.getItem(key) || '{}')}; } catch {}
  const cutoff = now - 86400000;
  for (const item of Object.keys(sent)) if (sent[item] < cutoff) delete sent[item];
  v12Shown.set(owner, sent);
  const due = [];
  for (const event of v121ReminderEvents(now)) {
   if (!event.remindAt) continue;
   let time;
   try { time = +new Date(v12ReminderValue(event.remindAt)); } catch { continue; }
   const tag = JSON.stringify([event.id, event.remindAt]);
   if (time > now || time < cutoff || Object.hasOwn(sent, tag)) continue;
   sent[tag] = now;
   due.push({title: String(event.title || '未命名行程'), tag});
  }
  if (!due.length) return;
  try { localStorage.setItem(key, JSON.stringify(sent)); } catch {}
  const message = due.map(item => item.title).join('、');
  toast('行程提醒：' + message);
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
   try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (v6Owner() !== owner) return;
    if (registration?.active) {
     await registration.showNotification('森羅生活 · 行程提醒', {body: message, tag: 'sylva-events-' + due[0].tag});
    } else {
     new Notification('森羅生活 · 行程提醒', {body: message});
    }
   } catch {}
  }
 } finally {
  v12Checking = false;
 }
}
function v12CalendarText(event) {
 const escapeText = value => String(value).replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/[,;]/g,'\\$&');
 const utc = value => new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const start = event.time
  ? 'DTSTART:' + utc(event.date + 'T' + event.time)
  : 'DTSTART;VALUE=DATE:' + event.date.replace(/-/g,'');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sylva Life//Event Reminder//ZH',
  'BEGIN:VEVENT','UID:' + encodeURIComponent(event.id) + (event.repeat === 'weekly' ? '-' + event.date : '') + '@sylva-life.local',
  'DTSTAMP:' + utc(Date.now()),start,'SUMMARY:' + escapeText(event.title),
  'BEGIN:VALARM','ACTION:DISPLAY','TRIGGER;VALUE=DATE-TIME:' + utc(v12ReminderValue(event.remindAt)),
  'DESCRIPTION:' + escapeText(event.title),'END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
document.addEventListener('click', async event => {
 const button = event.target.closest('[data-v12-permission],[data-v12-calendar]');
 if (!button || v6Owner() === 'locked') return;
 if (button.hasAttribute('data-v12-permission')) {
  try {
   const permission = await Notification.requestPermission();
   toast(permission === 'granted' ? '已開啟系統通知' : '將在 App 內顯示提醒');
   if (view === 'calendar') render();
  } catch { toast('將在 App 內顯示提醒'); }
  return;
 }
 const item = v121EventsOn(button.dataset.v12Date).find(record => record.id === button.dataset.v12Calendar);
 if (!item?.remindAt) return;
 try {
  const url = URL.createObjectURL(new Blob([v12CalendarText(item)], {type:'text/calendar;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = '森羅生活-行程提醒.ics';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
 } catch { toast('無法匯出此行程的提醒'); }
});
window.addEventListener('focus', v12CheckReminders);
document.addEventListener('visibilitychange', () => { if (!document.hidden) v12CheckReminders(); });
window.addEventListener('load', () => {
 v12CheckReminders();
 setInterval(v12CheckReminders, 1000);
});

const V12_TEMPLATE_KINDS = ['transaction', 'task', 'event'];

function v12Templates() {
 const saved = db.settings.quickTemplates;
 if (!Array.isArray(saved)) return [];
 return saved.filter(item => item && typeof item.id === 'string' &&
  typeof item.label === 'string' && V12_TEMPLATE_KINDS.includes(item.kind) &&
  item.fields && typeof item.fields === 'object').slice(0, 3);
}

function v12TemplateFields(kind, form) {
 if (!V12_TEMPLATE_KINDS.includes(kind)) throw Error('這類紀錄無法存為範本');
 const values = v6Normalize(kind, {
  ...form, date: today(), due: '', remindAt: '', amount: '1'
 });
 if (kind === 'transaction') {
  const {type, category, subcategory, note} = values;
  return {type, category, subcategory, note};
 }
 if (kind === 'task') {
  const {title, category, quadrant} = values;
  return {title, category, quadrant};
 }
 return {title: values.title, time: values.time, repeat: values.repeat, lead: values.lead};
}

function v12HomeTemplates() {
 const list = v12Templates();
 if (!list.length) return '';
 return `<section class="card" aria-label="常用範本">
  <div class="sectionhead"><h2>常用範本</h2></div>
  <div class="chiprow">${list.map(item =>
   `<button type="button" class="btn subtle sm" data-v12-use-template="${esc(item.id)}">${esc(item.label)}</button>`
  ).join('')}</div>
  <details><summary>管理範本</summary>
   <div class="stack">${list.map(item =>
    `<div class="item"><span class="grow">${esc(item.label)}</span><button type="button" class="btn line sm" data-v12-remove-template="${esc(item.id)}">移除</button></div>`
   ).join('')}</div>
  </details>
 </section>`;
}

document.addEventListener('click', event => {
 const button = event.target.closest('button[data-v12-save-template],button[data-v12-use-template],button[data-v12-remove-template]');
 if (!button || v6Owner() === 'locked') return;
 const owner = v6Owner();
 const list = v12Templates();
 try {
  if (button.hasAttribute('data-v12-save-template')) {
   const form = button.closest('form');
   const editor = v6Editor;
   if (!form || !editor || editor.id || editor.owner !== owner) return;
   if (list.length >= 3) throw Error('首頁可放 3 個範本，請先在首頁移除一個');
   const fields = v12TemplateFields(editor.kind, v6FormData(form));
   const suggested = fields.title || fields.subcategory || fields.category;
   const label = prompt('幫這個常用範本取個名字', suggested)?.trim();
   if (!label || owner !== v6Owner()) return;
   if (label.length > 24) throw Error('範本名稱最多 24 字');
   if (list.some(item => item.label === label)) throw Error('已有同名的範本');
   if (v6Mutate(() => {
    db.settings.quickTemplates = [...list, {id: id(), kind: editor.kind, label, fields}];
   })) {
    form.querySelector('#v6FormError').textContent = '已存到首頁的常用範本';
    if (view === 'home') render();
    toast('已儲存常用範本');
   }
   return;
  }
  const key = button.dataset.v12UseTemplate || button.dataset.v12RemoveTemplate;
  const template = list.find(item => item.id === key);
  if (!template) return;
  if (button.hasAttribute('data-v12-use-template')) {
   const fields = v12TemplateFields(template.kind, template.fields);
   v6Compose(template.kind, null, fields);
  } else if (confirm('移除「' + template.label + '」範本？') && owner === v6Owner()) {
   if (v6Mutate(() => {
    db.settings.quickTemplates = list.filter(item => item.id !== key);
   })) render();
  }
 } catch (error) {
  const feedback = button.closest('form')?.querySelector('#v6FormError');
  if (feedback) feedback.textContent = error.message;
  else toast(error.message);
 }
});

const V121_LEADS = [
 ['', '不使用提前提醒'], ['0', '準時'], ['10', '提前 10 分鐘'],
 ['60', '提前 1 小時'], ['1440', '提前 1 天']
];

function v121EventSettings(form) {
 const lead = String(form.lead ?? '');
 if (!V121_LEADS.some(([value]) => value === lead)) throw Error('請選擇有效的提醒選項');
 if (lead !== '' && !form.time) throw Error('使用提前或準時提醒時，請先填寫行程時間');
 return {
  repeat: form.repeat === 'weekly' ? 'weekly' : '',
  lead,
  remindAt: lead === '' ? v12ReminderValue(form.remindAt) : ''
 };
}

function v121EventFields(record = {}) {
 return `<details ${record.repeat || record.remindAt || record.lead ? 'open' : ''}>
  <summary>重複與提醒</summary>
  ${v6Select('repeat','重複',[['','只安排一次'],['weekly','每週同一天']],record.repeat || '')}
  ${v6Select('lead','提醒選項',V121_LEADS,record.lead ?? '')}
  ${v12ReminderField(record.remindAt)}
  <p class="note">選了準時或提前提醒，就以行程時間計算，每次重複都會提醒。自訂提醒日期與時間只提醒一次。編輯或刪除每週行程會套用整組。</p>
 </details>`;
}

function v121Occurrence(event, date) {
 if (date < event.date || !v6DateOK(event.date) || !v6DateOK(date)) return null;
 if (event.date !== date) {
  if (event.repeat !== 'weekly' || (Date.parse(date) - Date.parse(event.date)) % 604800000 !== 0) return null;
 }
 let remindAt = date === event.date ? event.remindAt : '';
 if (event.time && V121_LEADS.slice(1).some(([value]) => value === event.lead)) {
  const alarm = new Date(+new Date(date + 'T' + event.time) - Number(event.lead) * 60000);
  if (Number.isFinite(+alarm)) {
   const hours = String(alarm.getHours()).padStart(2,'0');
   const minutes = String(alarm.getMinutes()).padStart(2,'0');
   remindAt = localDate(alarm) + 'T' + hours + ':' + minutes;
  }
 }
 return {...event, date, remindAt};
}

function v121EventsOn(date) {
 return db.events.map(event => v121Occurrence(event,date)).filter(Boolean);
}

function v121ReminderEvents(now) {
 const nearby = [];
 for (let offset = -2; offset <= 2; offset++) {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  nearby.push(localDate(date));
 }
 const items = [];
 for (const event of db.events) {
  if (!event.remindAt && !event.lead) continue;
  const dates = event.repeat === 'weekly' && event.lead
   ? new Set([event.date, ...nearby]) : [event.date];
  for (const date of dates) {
   const occurrence = v121Occurrence(event,date);
   if (occurrence?.remindAt) items.push(occurrence);
  }
 }
 return items;
}
