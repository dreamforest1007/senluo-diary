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
const V3_VERSION='5.0.1';
const V3_WIDGETS=['本月日記','待辦事項','本月支出','本月結餘','智慧提醒','快捷入口','近期待辦','目標進度'];
const V3_THEMES={forest:'陽光森林',tea:'暖茶書房',sea:'聽瀾海岸',lavender:'暮色花園',spring:'春節團圓',lantern:'元宵燈火',dragon:'端午青粽',moon:'中秋月桂',pumpkin:'萬聖南瓜',christmas:'聖誕松林',sunny:'晴空漫遊',rainy:'雨聲書窗',snow:'初雪小屋',cat:'黑貓茶館',rabbit:'白兔草原',deer:'小鹿林徑',fern:'蕨葉秘境',lotus:'荷風小築',camellia:'山茶花信'};
function v3Order(){const a=db.settings.widgetOrder;return [...new Set([...(Array.isArray(a)?a:[]),...V3_WIDGETS.map((_,i)=>i)])].filter(i=>Number.isInteger(i)&&i>=0&&i<V3_WIDGETS.length);}
function v3MetaKey(){return (authMode==='account'&&accountUser?accountKey(accountUser.uid):K)+'_backup_status_v3';}
function v3Meta(){try{return JSON.parse(localStorage.getItem(v3MetaKey()))||{};}catch{return {};}}
function v3MarkBackup(snapshot){try{localStorage.setItem(v3MetaKey(),JSON.stringify({at:new Date().toISOString(),snapshot:JSON.stringify(snapshot)}));return true;}catch{return false;}}
function v3BackupStatus(){const m=v3Meta();return `<div class="notice v3BackupStatus ${m.snapshot!==JSON.stringify(db)?'warning':''}" role="status"><strong>${!m.at?'此裝置尚無新版上傳紀錄':m.snapshot===JSON.stringify(db)?'目前資料與此裝置上次上傳一致':'有尚未備份到雲端的變更'}</strong><div class="note">${m.at?'此裝置上次完成上傳：'+esc(new Date(m.at).toLocaleString('zh-TW')):'舊版與其他裝置的備份，請從歷史清單查閱。'}<br>雲端備份需手動上傳；此提示只比較本裝置。</div></div>`;}
function v3Settings(){return v5LayoutSettings();}
function v3Apply(){if(authMode==='account'&&!accountUser)return;const theme=v4EffectiveTheme();document.documentElement.dataset.theme=theme;v5ApplyPalette(theme);document.querySelector('#content > .festivalBanner')?.remove();document.querySelector('#content > .v3BackupStatus')?.remove();const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=getComputedStyle(document.documentElement).getPropertyValue('--dark').trim();document.querySelector('#content > .v5FirstSteps')?.remove();if(view==='home'){const welcome=v5WelcomeHome();if(welcome)document.querySelector('#content').insertAdjacentHTML('afterbegin',welcome);const banner=v4FestivalBanner(theme);if(banner)document.querySelector('#content').insertAdjacentHTML('afterbegin',banner);const grid=document.querySelector('#content > .grid');if(grid){if(!grid.dataset.widgetIds){[...grid.children].forEach((card,i)=>card.dataset.widgetId=String(i));grid.dataset.widgetIds='1';}const cards=[...grid.children];v3Order().forEach(i=>{const card=cards.find(card=>card.dataset.widgetId===String(i));if(card)grid.append(card);});}if(authMode==='account'&&accountUser)document.querySelector('#content').insertAdjacentHTML('afterbegin',v3BackupStatus());}}
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
function v5LayoutSettings(){const order=v3Order();return `<div class="card span12"><div class="sectionhead"><h2>首頁與外觀</h2><button class="btn subtle" data-page="themes">前往主題館</button></div><details class="v5Details"><summary>調整首頁卡片順序</summary><div class="stack">${order.map((id,i)=>`<div class="item"><span class="grow">${V3_WIDGETS[id]}</span><button class="btn subtle sm" data-v3-move="${id}" data-direction="-1" aria-label="將${V3_WIDGETS[id]}上移" ${i===0?'disabled':''}>↑</button><button class="btn subtle sm" data-v3-move="${id}" data-direction="1" aria-label="將${V3_WIDGETS[id]}下移" ${i===order.length-1?'disabled':''}>↓</button></div>`).join('')}</div></details><div class="sep"></div><h3>關於森羅生活</h3><p class="note">森羅之心 × 森日記 · V5 · 你的生活空間 · 不會自動同步</p><p class="note">程式版本：${V3_VERSION}</p><button class="btn subtle" data-v3-update>檢查程式更新</button><p id="v3UpdateStatus" class="note" role="status"></p></div>`;}
function morePage(){const links=[['themes','主題館','星座、節日與自然色調','✦'],['settings','帳號與備份','登入、資料匯出與歷史備份','☁'],['calendar','行事曆','安排接下來的日子','▦'],['goals','目標管理','把長期心願拆成小步','◎'],['health','健康紀錄','記錄心情、睡眠與飲水','♡'],['lists','購物與收納','採買清單與物品位置','▤'],['focus','專注計時','留一段專心的時間','◷'],['hub','生活提醒','查看依紀錄產生的提示','◌']];return `<div class="v5MoreGrid">${links.map(([page,title,note,symbol])=>`<button class="v5MoreCard" data-page="${page}"><span class="v5MoreSymbol" aria-hidden="true">${symbol}</span><span><strong>${title}</strong><small>${note}</small></span><span aria-hidden="true">›</span></button>`).join('')}</div><details class="v5Details"><summary>第一次使用？從這裡開始</summary><ol class="note"><li>選擇本機使用，或以 Google 登入建立自己的空間。</li><li>用「新增」記一筆日記、任務、收支或行程。</li><li>到主題館選喜歡的風格，再到帳號與備份保留 JSON。</li></ol><p class="note">資料先儲存在目前裝置。登入 Google 並不等於已備份；雲端備份需要手動上傳。切換帳號會使用各自獨立的本機資料區。</p></details>`;}
let v5AuthSlow=false,v5AuthFailure=false;
function v5CoverHtml(){return `<section class="v5Cover" role="status" aria-live="polite"><div class="v5CoverMark" aria-hidden="true" style="background:transparent;box-shadow:none"><img src="./icon-192-v5.png?v=5.0.1" alt="" width="82" height="82" style="display:block;border-radius:25px"/></div><span class="v5CoverEyebrow">把日子，過成喜歡的樣子。</span><h1>森羅生活</h1><p>${v5AuthFailure?'目前無法連接登入服務':v5AuthSlow?'登入確認比平常久一點':'正在開啟你的生活空間'}</p><div class="v5CoverLine" aria-hidden="true"></div>${v5AuthSlow||v5AuthFailure?'<p class="note">本機紀錄仍會保留。請確認網路後重試。</p><button class="btn" data-v5-retry>重新連線</button>':''}</section>`;}
function v5LoginHtml(){return `<section class="v5Welcome card"><div class="v5CoverMark" aria-hidden="true" style="background:transparent;box-shadow:none"><img src="./icon-192-v5.png?v=5.0.1" alt="" width="82" height="82" style="display:block;border-radius:25px"/></div><h2>歡迎來到森羅生活</h2><p>記下心情，安排生活，留一點時間給自己。</p><button class="btn" data-action="googleLogin">以 Google 登入</button><button class="btn subtle" data-action="guestMode">先在此裝置使用</button><p class="note">Google 帳號有各自的資料空間，雲端備份由你手動操作。</p></section>`;}
function v5SessionStyle(state){document.documentElement.dataset.session=state;}
function v5WelcomeHome(){if(datasetCount(db)>0)return '';return `<div class="v5FirstSteps"><strong>從一件小事，開始你的生活紀錄。</strong><p class="note">先記一筆，再慢慢找到自己的節奏。</p><div class="chiprow"><button class="btn" data-page="diary">寫第一篇日記</button><button class="btn subtle" data-page="tasks">建立待辦</button><button class="btn subtle" data-page="themes">選個主題</button></div></div>`;}
function v5QuickAdd(){let d=document.querySelector('#v5QuickAdd');if(!d){d=document.createElement('dialog');d.id='v5QuickAdd';d.setAttribute('aria-label','新增生活紀錄');d.innerHTML='<div class="installSheet"><div class="sectionhead"><h2>今天想記下什麼？</h2><button class="btn subtle" data-v5-close-quick>關閉</button></div><div class="stack"><button class="btn" data-page="diary">寫日記</button><button class="btn subtle" data-page="tasks">新增待辦</button><button class="btn subtle" data-page="finance">記一筆收支</button><button class="btn subtle" data-page="calendar">新增行程</button><button class="btn subtle" data-page="health">記錄健康</button></div></div>';document.body.append(d);}d.showModal();}
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
