#!/usr/bin/env python3
"""DDG HTML search — usage: ddg.py "query" [count]"""
import sys, re, html, urllib.parse, urllib.request

q = urllib.parse.quote(sys.argv[1]) if len(sys.argv) > 1 else ""
n = int(sys.argv[2]) if len(sys.argv) > 2 else 8
req = urllib.request.Request(
    f"https://html.duckduckgo.com/html/?q={q}",
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
)
h = urllib.request.urlopen(req, timeout=25).read().decode("utf-8", errors="ignore")
rows = re.findall(
    r'<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', h, re.S
)[:n]
for url, title in rows:
    if "uddg=" in url:
        m = re.search(r"uddg=([^&]+)", url)
        if m:
            url = urllib.parse.unquote(m.group(1))
    title = html.unescape(re.sub(r"<[^>]+>", "", title)).strip()
    print("URL:", html.unescape(url))
    print("T:", title[:150])
    print("---")
