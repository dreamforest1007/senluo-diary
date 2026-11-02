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
const V3_VERSION='7.0.2';
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
function v5LayoutSettings(){const order=v3Order();return `<div class="card span12"><div class="sectionhead"><h2>首頁與外觀</h2><button class="btn subtle" data-page="themes">前往主題館</button></div><details class="v5Details"><summary>調整首頁卡片順序</summary><div class="stack">${order.map((id,i)=>`<div class="item"><span class="grow">${V3_WIDGETS[id]}</span><button class="btn subtle sm" data-v3-move="${id}" data-direction="-1" aria-label="將${V3_WIDGETS[id]}上移" ${i===0?'disabled':''}>↑</button><button class="btn subtle sm" data-v3-move="${id}" data-direction="1" aria-label="將${V3_WIDGETS[id]}下移" ${i===order.length-1?'disabled':''}>↓</button></div>`).join('')}</div></details><div class="sep"></div><h3>關於森羅生活</h3><p class="note">森羅之心 × 森日記 · V7 · 你的生活空間 · 可選擇自動雲端同步</p><p class="note">程式版本：${V3_VERSION}</p><button class="btn subtle" data-v3-update>檢查程式更新</button><p id="v3UpdateStatus" class="note" role="status"></p></div>`;}
function morePage(){const links=[['themes','主題館','星座、節日與自然色調','✦'],['settings','帳號與備份','登入、資料匯出與歷史備份','☁'],['overview','月度總覽','統計與自訂首頁小工具','▥'],['calendar','行事曆','安排接下來的日子','▦'],['goals','目標管理','把長期心願拆成小步','◎'],['health','健康紀錄','記錄心情、睡眠與飲水','♡'],['lists','購物與收納','採買清單與物品位置','▤'],['focus','專注計時','留一段專心的時間','◷'],['hub','生活提醒','查看依紀錄產生的提示','◌']];return `<div class="v5MoreGrid">${links.map(([page,title,note,symbol])=>`<button class="v5MoreCard" data-page="${page}"><span class="v5MoreSymbol" aria-hidden="true">${symbol}</span><span><strong>${title}</strong><small>${note}</small></span><span aria-hidden="true">›</span></button>`).join('')}</div><details class="v5Details"><summary>第一次使用？從這裡開始</summary><ol class="note"><li>選擇本機使用，或以 Google 登入建立自己的空間。</li><li>用「新增」記一筆日記、任務、收支或行程。</li><li>到主題館選喜歡的風格，再到帳號與備份保留 JSON。</li></ol><p class="note">資料先儲存在目前裝置。登入 Google 並不等於已備份；可在帳號與備份開啟自動同步。切換帳號會使用各自獨立的本機資料區。</p></details>`;}
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
 if(kind==='diary'){if(!clean(f.body))throw Error('請輸入日記內容');return {date,mood:['好','普通','低落','疲累','開心'].includes(f.mood)?f.mood:'普通',body:String(f.body),tags:clean(f.tags)};}
 if(kind==='task'){if(!clean(f.title))throw Error('請輸入待辦名稱');if(f.due&&!v6DateOK(f.due))throw Error('請選擇有效期限');return {title:clean(f.title),due:f.due||'',category:clean(f.category)||'生活',quadrant:['q1','q2','q3','q4'].includes(f.quadrant)?f.quadrant:'q2'};}
 if(kind==='transaction'){const amount=Number(f.amount);if(!Number.isFinite(amount)||Math.round(amount*100)<1||amount>1e12)throw Error('請輸入大於 0 的有效金額');return {date,type:f.type==='income'?'income':'expense',amount:Math.round(amount*100)/100,category:clean(f.category)||'其他',note:clean(f.note)};}
 if(kind==='event'){if(!clean(f.title))throw Error('請輸入行程名稱');if(f.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(f.time))throw Error('請輸入有效時間');return {date,title:clean(f.title),time:f.time||''};}
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
 if(kind==='diary')return `<div class="row">${date}${v6Select('mood','心情',[['好','😊 不錯'],['普通','🌿 普通'],['開心','☀️ 開心'],['疲累','🌙 疲累'],['低落','☁️ 低落']],r.mood||'普通')}</div>${v6Area('body','日記內容',r.body,'今天有什麼想留下來的？')}${v6Input('tags','標籤（以逗號分隔）','text',r.tags,'maxlength="200"')}`;
 if(kind==='task')return `${v6Input('title','待辦名稱','text',r.title,'required maxlength="100" placeholder="想完成的一件小事"')}${v6Input('due','期限（選填）','date',r.due)}${v6Input('category','分類','text',r.category||'生活','maxlength="50"')}${v6Select('quadrant','優先順序',[['q1','重要且緊急'],['q2','重要不緊急'],['q3','緊急不重要'],['q4','不緊急不重要']],r.quadrant||'q2')}`;
 if(kind==='transaction')return `<div class="row">${v6Select('type','類型',[['expense','支出'],['income','收入']],r.type||'expense')}${date}</div>${v6Input('amount','金額（NT$）','number',r.amount,'required min="0.01" max="1000000000000" step="0.01" inputmode="decimal" placeholder="0"')}${v6Input('category','分類','text',r.category||'飲食','required maxlength="50" list="v6Categories"')}<datalist id="v6Categories">${['飲食','交通','購物','住宿','醫療','娛樂','薪資','其他'].map(x=>`<option value="${x}"></option>`).join('')}</datalist>${v6Input('note','備註（選填）','text',r.note,'maxlength="500"')}`;
 if(kind==='event')return `${v6Input('title','行程名稱','text',r.title,'required maxlength="100"')}<div class="row">${date}${v6Input('time','時間（選填）','time',r.time)}</div>`;
 return `${date}${v6Select('mood','心情狀態',['平穩','開心','疲憊','低落','焦慮'].map(x=>[x,x]),r.mood||'平穩')}<div class="row">${v6Input('sleep','睡眠（小時）','number',r.sleep,'min="0" max="24" step="0.5"')}${v6Input('water','飲水（杯）','number',r.water,'min="0" max="50"')}</div>${v6Area('note','生活備註',r.note)}`;
}
function v6FormData(form){return Object.fromEntries(new FormData(form).entries());}
function v6Dirty(){const f=document.querySelector('#v6Composer form');return !!(f&&v6Editor&&JSON.stringify(v6FormData(f))!==v6Editor.initial);}
function v6RequestClose(){if(v6Dirty()&&!confirm('這裡有尚未儲存的內容，要放棄這次編輯嗎？'))return false;document.querySelector('#v6Composer')?.close();return true;}
function v6Dialog(){let d=document.querySelector('#v6Composer');if(!d){d=document.createElement('dialog');d.id='v6Composer';d.setAttribute('aria-labelledby','v6ComposerTitle');d.addEventListener('cancel',e=>{e.preventDefault();v6RequestClose();});d.addEventListener('close',()=>{if(!d.open){v6Editor=null;d.innerHTML='';}});document.body.append(d);}return d;}
function v6Compose(kind,recordId){if(v6Owner()==='locked')return;const spec=V6_KINDS[kind];if(!spec)return;if(v6Dirty()&&!confirm('切換類別會放棄尚未儲存的內容，確定切換嗎？'))return;
 let r=recordId?db[spec.key].find(x=>x.id===recordId):['diary','health'].includes(kind)?db[spec.key].find(x=>x.date===today()):null;if(recordId&&!r){toast('這筆紀錄已不存在');return;}r=r||{};
 const d=v6Dialog();v6Editor={kind,owner:v6Owner(),id:r.id||null,before:r.id?JSON.stringify(r):null,initial:null};d.innerHTML=`<div class="v6Sheet"><div class="sectionhead"><div><span class="overline">留住生活的小片刻</span><h2 id="v6ComposerTitle">${r.id?'編輯':'新增'}${spec.name}</h2></div><button type="button" class="btn subtle sm" data-v6-close>關閉</button></div><div class="v6ComposerTabs" aria-label="紀錄類別">${Object.entries(V6_KINDS).map(([k,v])=>`<button type="button" class="chip ${k===kind?'active':''}" data-v6-kind="${k}" aria-pressed="${k===kind}">${v.name}</button>`).join('')}</div><form data-form="v6-record" class="stack">${v6Fields(kind,r)}<p id="v6FormError" class="v6FormError" role="alert"></p><div class="v6FormActions"><button type="button" class="btn subtle" data-v6-close>取消</button><button type="submit" class="btn">${r.id?'儲存修改':'儲存'+spec.name}</button></div><p class="note">先儲存到此裝置；開啟自動同步後，連線時會自動上傳。</p></form></div>`;
 v6Editor.initial=JSON.stringify(v6FormData(d.querySelector('form')));if(!d.open)d.showModal();d.querySelector('input:not([type="date"]),textarea,select')?.focus();
}
function v6QuickPicker(){const kind=({diary:'diary',tasks:'task',finance:'transaction',calendar:'event',health:'health'})[view]||'task';v6Compose(kind);}
function v6HandleForm(e){const form=e.target.closest('form[data-form]');if(!form)return false;const modal=form.dataset.form==='v6-record',kind=modal?v6Editor?.kind:form.dataset.form;if(!V6_KINDS[kind]&&!modal)return false;e.preventDefault();
 try{if(!kind||v6Owner()==='locked')throw Error('請先完成登入');const f=v6FormData(form),values=v6Normalize(kind,f);const old=!modal&&['diary','health'].includes(kind)?db[V6_KINDS[kind].key].find(x=>x.date===values.date):null;const editor=modal?v6Editor:{owner:v6Owner(),id:old?.id||null,before:old?JSON.stringify(old):null};
  if(v6Write(kind,values,editor)){if(modal)document.querySelector('#v6Composer').close();render();toast('已儲存'+V6_KINDS[kind].name);}else if(modal)document.querySelector('#v6FormError').textContent='尚未儲存，請先下載備份並確認裝置空間。';
 }catch(error){if(modal&&document.querySelector('#v6FormError'))document.querySelector('#v6FormError').textContent=error.message;else toast(error.message);}return true;
}
function v6Key(key){return ({diary:'diaries',task:'tasks'})[key]||key;}
function v6Delete(key,recordId){key=v6Key(key);if(!['diaries','tasks','events','tx','recurring','goals','health','shopping','inventory','habits'].includes(key))return;const arr=db[key],index=arr.findIndex(x=>x.id===recordId);if(index<0)return;const record=v6Copy(arr[index]);if(!v6Mutate(()=>arr.splice(index,1)))return;v6UndoQueue=v6UndoQueue.filter(x=>x.expires>Date.now()).slice(-9);v6UndoQueue.push({key,record,index,owner:v6Owner(),expires:Date.now()+30000});render();v6UndoRefresh();}
function v6Undo(){v6UndoQueue=v6UndoQueue.filter(x=>x.expires>Date.now()&&x.owner===v6Owner());const item=v6UndoQueue.at(-1);if(!item)return;const arr=db[item.key];if(arr.some(x=>x.id===item.record.id)||(['diaries','health'].includes(item.key)&&arr.some(x=>x.date===item.record.date))){toast('已有相同紀錄，為避免覆蓋，沒有復原');return;}if(arr.length>=2000){toast('此類別已達儲存上限，請先保留備份');return;}if(v6Mutate(()=>arr.splice(Math.min(item.index,arr.length),0,item.record))){v6UndoQueue.pop();render();toast('已復原紀錄');}}
function v6UndoRefresh(){v6UndoQueue=v6UndoQueue.filter(x=>x.expires>Date.now()&&x.owner===v6Owner());let el=document.querySelector('#v6Undo');if(el)el.remove();clearTimeout(v6UndoTimer);if(!v6UndoQueue.length)return;const seconds=Math.max(1,Math.ceil((v6UndoQueue.at(-1).expires-Date.now())/1000));document.querySelector('#content')?.insertAdjacentHTML('afterbegin',`<div id="v6Undo" class="v6Undo" role="status"><span>已刪除紀錄 · ${seconds} 秒內可復原${v6UndoQueue.length>1?'（還有 '+v6UndoQueue.length+' 筆）':''}</span><button class="btn subtle sm" data-v6-undo>復原上一筆</button></div>`);v6UndoTimer=setTimeout(v6UndoRefresh,1000);}
function v6HandleCheck(e){const t=e.target;if(!t.dataset.check)return false;const key=v6Key(t.dataset.check);if(!['tasks','shopping'].includes(key))return false;const record=db[key].find(x=>x.id===t.dataset.id);if(!record)return true;const before=record.done;if(v6Mutate(()=>{record.done=t.checked;}))render();else t.checked=!!before;return true;}
function v6EditButton(kind,recordId){return `<button type="button" class="btn subtle sm" data-v6-edit="${kind}" data-id="${esc(recordId)}" aria-label="編輯${V6_KINDS[kind].name}">編輯</button>`;}
function v6TodayPage(){const day=today(),diary=db.diaries.find(x=>x.date===day),health=db.health.find(x=>x.date===day),tasks=db.tasks.filter(t=>!t.done&&(!t.due||t.due<=day)).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')),events=db.events.filter(x=>x.date===day).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')),tx=db.tx.filter(x=>x.date===day),spent=tx.filter(x=>x.type==='expense').reduce((a,x)=>a+num(x.amount),0),msg=dailyHeroMessage();
 return `<section class="v6TodayHero"><div><div class="overline">慢慢來，把今天過好。</div><h2>${esc(db.settings.name||'你好')}，今天想從哪裡開始？</h2></div><img src="./icon-192-v5.png?v=5.0.1" alt="" width="96" height="96"/></section><section class="hero dailyHero" aria-label="每日心語"><div class="dailyTop"><div class="overline" style="color:#cce8c7">每日心語</div><span class="dailyDate">${esc(msg.date)}</span></div><h2>${esc(msg.quote)}</h2><p class="dailyDetail">${esc(msg.detail)}</p><div class="dailyFlower">❀ 今日花語｜<strong>${esc(msg.flower.name)}</strong> · ${esc(msg.flower.meaning)}</div></section><div class="v6QuickGrid" aria-label="快速記錄">${[['diary','寫日記','▤'],['task','加待辦','✓'],['transaction','記一筆','＄'],['event','排時間','▦']].map(([kind,n,symbol])=>`<button data-v6-kind="${kind}"><span aria-hidden="true">${symbol}</span>${n}</button>`).join('')}</div><div class="v6TodayGrid"><section class="card v6Tasks"><div class="sectionhead"><h2>今天要做</h2><span class="tag">${tasks.length} 項</span></div><p class="note">今天、已到期與尚未設定期限的待辦。</p><div class="stack">${tasks.slice(0,5).map(t=>`<div class="item"><input type="checkbox" aria-label="完成${esc(t.title)}" data-check="tasks" data-id="${esc(t.id)}"/><div class="grow"><strong>${esc(t.title)}</strong><span class="desc">${t.due&&t.due<day?'已逾期 · '+fmtDate(t.due):t.due?'今天到期':'未設期限'}</span></div>${v6EditButton('task',t.id)}</div>`).join('')||'<div class="v6Empty"><span aria-hidden="true">🌱</span><p>今天還沒有需要處理的待辦。<br/>可以留白，也可以安排一件小事。</p></div>'}</div><button class="btn line sm" data-page="tasks">查看全部待辦</button></section><section class="card"><div class="sectionhead"><h2>今天的行程</h2><button class="btn subtle sm" data-v6-kind="event">新增</button></div><div class="stack">${events.slice(0,5).map(x=>`<div class="v6Event"><time>${esc(x.time||'未定時')}</time><span class="grow">${esc(x.title)}</span>${v6EditButton('event',x.id)}</div>`).join('')||'<div class="v6Empty"><span aria-hidden="true">☀</span><p>今天的時間，還有自由安排的空間。</p></div>'}</div>${events.length>5?'<button class="btn line sm" data-page="calendar">查看全部行程</button>':''}</section><section class="card v6Mood"><div class="sectionhead"><h2>今天的心情</h2><span aria-hidden="true">♡</span></div><p class="v6MoodValue">${esc(diary?.mood||health?.mood||'還沒記下來')}</p><p class="note">${diary?'今天已留下日記。想補充一點什麼嗎？':'不用替今天打分數，留下此刻的感受就好。'}</p><button class="btn subtle" data-v6-kind="diary">${diary?'編輯今天日記':'記下今天'}</button></section><section class="card"><div class="sectionhead"><h2>今天的收支</h2><span class="tag">${tx.length} 筆</span></div><p class="note">今日支出</p><div class="metric">${money(spent)}</div><div class="row"><button class="btn subtle" data-v6-kind="transaction">記一筆收支</button><button class="btn line" data-page="finance">查看明細</button></div></section></div><div class="v6OverviewLink"><button class="btn line" data-page="overview">查看月度總覽與首頁小工具 →</button><p class="note">依目前帳號的實際紀錄整理。雲端狀態可在「帳號與備份」查看。</p></div>`;
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
function v7Valid(data){if(!data||typeof data!=='object'||data.version!==1)throw Error('bad-data');for(const k of ['diaries','tasks','events','tx','recurring','goals','health','shopping','inventory','habits'])if(!Array.isArray(data[k])||data[k].length>2000||data[k].some(r=>!r||typeof r!=='object'||Array.isArray(r)))throw Error('bad-data');return sanitize(data);}
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
