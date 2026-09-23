#!/bin/bash
LABEL="$1"; FIELD="$2"; TEXT="$3"
agent-browser open "https://vac.sjas.gov.si/vac/search/fieldSearch" > /dev/null 2>&1
agent-browser wait --load networkidle > /dev/null 2>&1
agent-browser eval "
  const f = document.querySelector('select[name=\"field1\"]');
  const m = document.querySelector('select[name=\"mode1\"]');
  const t = document.querySelector('input[type=\"text\"]');
  f.value = '$FIELD';
  m.value = '1';
  t.value = '$TEXT';
  [f, m, t].forEach(el => {
    el.dispatchEvent(new Event('input', {bubbles: true}));
    el.dispatchEvent(new Event('change', {bubbles: true}));
  });
  'filled: ' + t.value
"
agent-browser find role button click --name "Išči" > /dev/null 2>&1
sleep 6
agent-browser wait --load networkidle > /dev/null 2>&1
echo "=== $LABEL (field=$FIELD: $TEXT)"
agent-browser eval "
(() => {
  const t = document.body.innerText.replace(/\s+/g,' ');
  const m = t.match(/Zadetkov:\s*(\d+)/);
  return 'COUNT: ' + (m ? m[1] : '?');
})()" 2>/dev/null
