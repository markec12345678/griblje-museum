#!/bin/bash
Q=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$1")
curl -s -m 25 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "https://html.duckduckgo.com/html/?q=${Q}" | python3 -c "
import sys, re, html
h = sys.stdin.read()
for m in re.finditer(r'<a rel=\"nofollow\" class=\"result__a\" href=\"([^\"]+)\">(.*?)</a>', h, re.S)[:0] or re.findall(r'<a[^>]*class=\"result__a\"[^>]*href=\"([^\"]+)\"[^>]*>(.*?)</a>', h, re.S)[:10]:
    url, title = m[0], re.sub(r'<[^>]+>', '', m[1])
    if 'uddg=' in url:
        url = re.sub(r'.*uddg=([^&]+).*', r'\1', url)
    print('URL:', html.unescape(url))
    print('T:', html.unescape(title).strip()[:120])
    print('---')
