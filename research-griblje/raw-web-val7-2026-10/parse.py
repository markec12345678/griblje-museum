import re,html,sys
raw=open(sys.argv[1],encoding='utf-8',errors='ignore').read()
raw=re.sub(r'<(style|script)[\s\S]*?</\1>','',raw)
m=re.search(r'property="article:published_time"\s+content="([^"]+)"',raw) or re.search(r'"datePublished":\s*"([^"]+)"',raw)
print('DATUM:',m.group(1) if m else '?')
a=re.search(r'property="og:description"\s+content="([^"]+)"',raw)
print('OG-DESC:',html.unescape(a.group(1))[:300] if a else '?')
ps=re.findall(r'<p[^>]*>([\s\S]*?)</p>',raw)
out=[]
for p in ps:
    t=html.unescape(re.sub(r'<[^>]+>','',p)).strip()
    if len(t)>80: out.append(t)
print('\n\n'.join(out[:14]))
