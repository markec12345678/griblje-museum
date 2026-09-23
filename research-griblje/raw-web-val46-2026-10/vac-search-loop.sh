#!/bin/bash
# VAC field search loop: $1=label $2=field $3=mode $4=text $5=range
LABEL="$1"; FIELD="$2"; MODE="$3"; TEXT="$4"; RANGE="$5"
OUT="vac-aj-${LABEL}.json"
curl -k -s -A "Mozilla/5.0" -H "X-Requested-With: XMLHttpRequest" -X POST "https://vac.sjas.gov.si/vac/search/fieldSearchFindAjax" \
  --data-urlencode "field1=$FIELD" --data-urlencode "mode1=$MODE" --data-urlencode "text1=$TEXT" \
  --data-urlencode "link1=" --data-urlencode "searchRange=$RANGE" --data-urlencode "searchRangeArchive=" \
  --max-time 40 -o "$OUT"
python3 -c "
import json
d = json.load(open('$OUT'))
p = d.get('pager', {})
print('$LABEL'.ljust(38), 'items:', p.get('totalItems'), 'searchId:', d.get('searchId'))
"
