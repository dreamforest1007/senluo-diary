#!/usr/bin/env python3
"""Apply the 2026-11-07 finance category update to an existing senluo-diary checkout.
No personal records are read, deleted, or migrated by this script.
Run: python apply_update.py /path/to/senluo-diary
"""
from pathlib import Path
import sys

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
PACK = Path(__file__).resolve().parent

def replace_once(src, old, new, label):
    count = src.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly one match, found {count}. Project version may have changed. No files were written.')
    return src.replace(old,new,1)

index_path=ROOT/'index.html'
v3_path=ROOT/'v3.js'
sw_path=ROOT/'sw.js'
for path in (index_path, v3_path, sw_path):
    if not path.is_file():
        raise RuntimeError(f'Missing required project file: {path}')

index=index_path.read_text(encoding='utf-8')
v3=v3_path.read_text(encoding='utf-8')
sw=sw_path.read_text(encoding='utf-8')
if 'finance-categories.js?v=1.0.0' in index:
    raise SystemExit('This update appears to have been applied already. No files changed.')

v3=replace_once(v3,"const V3_VERSION='10.3.0';","const V3_VERSION='10.4.0';",'runtime version')
v3=replace_once(v3, "category:clean(f.category)||'其他',note:clean(f.note)", "...v11FinanceNormalize(f),note:clean(f.note)", 'transaction normalization')
v3=replace_once(v3,
    "${v6Input('category','分類','text',r.category||'飲食','required maxlength=\"50\" list=\"v6Categories\"')}<datalist id=\"v6Categories\">${['飲食','交通','購物','住宿','醫療','娛樂','薪資','其他'].map(x=>`<option value=\"${x}\"></option>`).join('')}</datalist>",
    '${v11FinanceFields(r)}',
    'quick-add categories')

index=replace_once(index, "V3_VERSION!=='10.3.0'", "V3_VERSION!=='10.4.0'",'runtime compatibility')
index=replace_once(index,
    '<script src="./v3.js?v=10.3.0"></script>',
    '<script src="./v3.js?v=10.4.0"></script>\n<script src="./finance-categories.js?v=1.0.0"></script>',
    'asset loading')
index=replace_once(index,
    '${field(\'分類\',`<select name="category"><option>飲食</option><option>交通</option><option>購物</option><option>住宿</option><option>醫療</option><option>娛樂</option><option>薪資</option><option>其他</option></select>`)}',
    "${v11FinanceFields({type:'expense',category:'飲食',subcategory:''})}",
    'finance page category picker')
index=replace_once(index,
    '<td>${esc(t.category)}<div class="tiny muted">${esc(t.note||\'\')}</div></td>',
    '<td>${esc(t.category)}${t.subcategory?\' → \'+esc(t.subcategory):\'\'}<div class="tiny muted">${esc(t.note||\'\')}</div></td>',
    'record list subcategory')
index=replace_once(index,
    "||'<div class=\"empty\">這個月還沒有支出紀錄。</div>'}</div><div class=\"sep\"></div>${heading('本月明細')}",
    "||'<div class=\"empty\">這個月還沒有支出紀錄。</div>'}${v11FinanceSubSummary(tx)}</div><div class=\"sep\"></div>${heading('本月明細')}",
    'subcategory analytics')

sw=replace_once(sw,
    "const CACHE_NAME = 'sylva-life-static-v20-v1030-task-details-20261105';",
    "const CACHE_NAME = 'sylva-life-static-v21-finance-categories-20261107';",
    'offline cache key')
sw=replace_once(sw,
    "'./v3.js?v=10.3.0', './v3.css?v=10.3.0',",
    "'./v3.js?v=10.4.0', './v3.css?v=10.3.0', './finance-categories.js?v=1.0.0',",
    'offline static assets')

# All checks above complete before any file is modified.
from shutil import copyfile
import subprocess
js_file=PACK/'finance-categories.js'
subprocess.run(['node','--check',str(js_file)],check=True)
for path,content in ((v3_path,v3),(index_path,index),(sw_path,sw)):
    path.write_text(content,encoding='utf-8')
copyfile(js_file,ROOT/'finance-categories.js')
subprocess.run(['node','--check',str(v3_path)],check=True)
subprocess.run(['node','--check',str(sw_path)],check=True)
print('SUCCESS: Finance main/subcategories added to both transaction editors; old data remains compatible.')
print('Changed: index.html, v3.js, sw.js; added: finance-categories.js')
print('Changes are local only. Review and deploy through your GitHub repository.')
