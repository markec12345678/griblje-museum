#!/bin/bash
# Bing search via curl (z-ai quota alternative) — usage: bing-search.sh "query" [count]
Q=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$1")
N=${2:-8}
curl -s -m 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" \
  -H "Accept-Language: sl,en;q=0.9" \
  "https://www.bing.com/search?q=${Q}&count=${N}" | python3 -c "
import sys, re, html
h = sys.stdin.read()
items = re.findall(r'<li class=\"b_algo\".*?</li>', h, re.S)
for it in items[:${N}]:
    m = re.search(r'<h2><a href=\"([^\"]+)\"[^>]*>(.*?)</a></h2>', it, re.S)
    if not m: continue
    url, title = m.group(1), re.sub(r'<[^>]+>', '', m.group(2))
    sn = re.search(r'<p[^>]*>(.*?)</p>', it, re.S)
    snip = re.sub(r'<[^>]+>', '', sn.group(1)) if sn else ''
    print('URL:', html.unescape(url))
    print('TITLE:', html.unescape(title))
    print('SNIP:', html.unescape(snip)[:300])
    print('---')
"
