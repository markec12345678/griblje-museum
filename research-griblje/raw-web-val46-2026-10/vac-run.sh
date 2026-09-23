#!/bin/bash
# usage: vac-run.sh <label> <fieldcode> <text>
LABEL="$1"; FIELD="$2"; TEXT="$3"
agent-browser open "https://vac.sjas.gov.si/vac/search/fieldSearch" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1
refs=$(agent-browser snapshot -i -c 2>/dev/null)
fref=$(echo "$refs" | grep 'combobox "Iskalno polje 1"' | grep -oE '@e[0-9]+' | head -1)
mref=$(echo "$refs" | grep 'combobox "Način iskanja 1"' | grep -oE '@e[0-9]+' | head -1)
tref=$(echo "$refs" | grep 'textbox' | grep -oE '@e[0-9]+' | head -1)
bref=$(echo "$refs" | grep 'button "Išči"' | grep -oE '@e[0-9]+' | head -1)
agent-browser select $fref "$FIELD" > /dev/null 2>&1
agent-browser select $mref 1 > /dev/null 2>&1
agent-browser fill $tref "$TEXT" > /dev/null 2>&1
VAL=$(agent-browser get value $tref 2>/dev/null)
if [ "$VAL" != "$TEXT" ]; then echo "=== $label ERROR: text not set ('$VAL')"; exit 1; fi
agent-browser click $bref > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1
agent-browser wait 2500 > /dev/null 2>&1
echo "=== $LABEL (field=$FIELD text=$TEXT)"
agent-browser eval "
(() => {
  const t = document.body.innerText.replace(/\s+/g,' ');
  const m = t.match(/Zadetkov:\s*(\d+)/);
  const rows = [...document.querySelectorAll('tr')].map(r => (r.innerText||'').replace(/\s+/g,' ').trim()).filter(x => x.includes('Signatura PE:'));
  return JSON.stringify({count: m ? m[1] : null, rows: rows.slice(0,15)});
})()"
