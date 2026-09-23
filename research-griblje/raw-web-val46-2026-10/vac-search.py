#!/usr/bin/env python3
import subprocess, json, re, sys, time

def run(label, text, field='1', mode='1'):
    ck = f"ck-{label}.txt"
    out = f"vac-fsfind-{label}.html"
    subprocess.run(['curl','-k','-s','-c',ck,'-A','Mozilla/5.0','-X','POST',
        'https://vac.sjas.gov.si/vac/search/fieldSearchFind',
        '--data-urlencode',f'field1={field}','--data-urlencode',f'mode1={mode}',
        '--data-urlencode',f'text1={text}','--data-urlencode','link1=',
        '--data-urlencode','searchRange=','--data-urlencode','searchRangeArchive=',
        '--max-time','40','-o',out], check=True)
    html = open(out, encoding='utf-8', errors='ignore').read()
    m = re.search(r'data-searchId="(\d+)"', html)
    if not m:
        print(label, '| NO searchId'); return
    sid = m.group(1)
    time.sleep(1.5)
    r = subprocess.run(['curl','-k','-s','-b',ck,'-A','Mozilla/5.0','-H','X-Requested-With: XMLHttpRequest',
      f'https://vac.sjas.gov.si/vac/search/searchResultsAjax?pageSize=100&sort=score&prevDir=ASC&dir=ASC&searchId={sid}&page=1',
      '--max-time','40'], capture_output=True, text=True)
    fn = f"vac-rows-{label}.json"
    open(fn,'w').write(r.stdout)
    try:
        d = json.loads(r.stdout)
        items = d.get('pageData') or []
        print(label.ljust(34), '| items:', d.get('totalItems'), '| fetched:', len(items))
        for it in items[:25]:
            print('   ', json.dumps(it, ensure_ascii=False)[:220])
    except Exception as e:
        print(label, '| parse error:', r.stdout[:150])

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv)>3 else '1', sys.argv[4] if len(sys.argv)>4 else '1')
