#!/usr/bin/env python3
"""Drive agent-browser through VAC field search; one query per invocation."""
import subprocess, json, re, sys

def ab(*args, timeout=120):
    r = subprocess.run(['agent-browser', *args], capture_output=True, text=True, timeout=timeout)
    return r.stdout + r.stderr

def query(label, field, text):
    ab('open', 'https://vac.sjas.gov.si/vac/search/fieldSearch')
    ab('wait', '--load', 'networkidle')
    snap = ab('snapshot', '-i', '-c')
    def ref(pat):
        m = re.search(r'combobox "%s"\[?[^\]]*ref=@?e(\d+)' % pat, snap) or re.search(r'%s[^\]]*ref=@?e(\d+)' % pat, snap)
        return '@e' + m.group(1) if m else None
    fref = re.search(r'combobox "Iskalno polje 1".*?ref=@?e(\d+)', snap, re.S)
    mref = re.search(r'combobox "Način iskanja 1".*?ref=@?e(\d+)', snap, re.S)
    tref = re.search(r'textbox.*?ref=@?e(\d+)', snap, re.S)
    bref = re.search(r'button "Išči".*?ref=@?e(\d+)', snap, re.S)
    if not all([fref, mref, tref, bref]):
        print(label, '| REFS MISSING'); return
    ab('select', '@e'+fref.group(1), field)
    ab('select', '@e'+mref.group(1), '1')
    ab('fill', '@e'+tref.group(1), text)
    val = ab('get', 'value', '@e'+tref.group(1)).strip()
    if text not in val:
        print(label, '| FILL FAILED:', repr(val)); return
    ab('click', '@e'+bref.group(1))
    ab('wait', '--load', 'networkidle')
    ab('wait', '2500')
    js = """(() => {
  const t = document.body.innerText.replace(/\\s+/g,' ');
  const m = t.match(/Zadetkov:\\s*(\\d+)/);
  const rows = [...document.querySelectorAll('tr')].map(r => (r.innerText||'').replace(/\\s+/g,' ').trim()).filter(x => x.includes('Signatura PE:'));
  return JSON.stringify({count: m ? m[1] : null, rows: rows.slice(0,15)});
})()"""
    out = ab('eval', js, timeout=60)
    print('===', label, f'(field={field}, text={text})')
    try:
        s = out[out.index('"'):]
        d = json.loads(json.loads(s) if s.startswith('"') else s)
        print('COUNT:', d.get('count'))
        for r in d.get('rows', [])[:15]:
            print('  -', r[:230])
    except Exception:
        print(out[:800])

if __name__ == '__main__':
    query(sys.argv[1], sys.argv[2], sys.argv[3])
