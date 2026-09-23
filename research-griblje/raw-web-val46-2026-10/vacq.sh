#!/bin/bash
LABEL="$1"; FIELD="$2"; TEXT="$3"
agent-browser open "https://vac.sjas.gov.si/vac/search/fieldSearch" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1
snap=$(agent-browser snapshot -i -c 2>/dev/null)
fref=$(echo "$snap" | grep 'combobox "Iskalno polje 1"' | grep -oE 'e[0-9]+' | tail -1)
mref=$(echo "$snap" | grep 'combobox "Način iskanja 1"' | grep -oE 'e[0-9]+' | tail -1)
tref=$(echo "$snap" | grep 'textbox' | grep -oE 'e[0-9]+' | tail -1)
bref=$(echo "$snap" | grep 'button "Išči"' | grep -oE 'e[0-9]+' | tail -1)
agent-browser select "@$fref" "$FIELD" > /dev/null 2>&1
agent-browser select "@$mref" 1 > /dev/null 2>&1
agent-browser fill "@$tref" "$TEXT" > /dev/null 2>&1
VAL=$(agent-browser get value "@$tref" 2>/dev/null | tr -d '"')
if [ "$VAL" != "$TEXT" ]; then echo "=== $LABEL FILL-FAIL ($VAL)"; exit 0; fi
agent-browser click "@$bref" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1
agent-browser wait 5000 > /dev/null 2>&1; sleep 3
echo "=== $LABEL (field=$FIELD: $TEXT)"
agent-browser eval "document.body.innerText.replace(/\s+/g,' ').match(/Zadetkov:\s*\d+/)" 2>/dev/null
agent-browser eval "document.body.innerText.replace(/\s+/g,' ').slice(0, 3500)" 2>/dev/null
