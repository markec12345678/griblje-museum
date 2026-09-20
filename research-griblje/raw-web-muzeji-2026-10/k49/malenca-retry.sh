#!/bin/bash
# Ozadnja zanka: poskusi prenesti sliko malence vsake 3 min (do 20 poskusov)
# uspeh -> zapise v public/images/authentic/malenca-kolpa-griblje.jpg
DEST=/home/z/griblje-museum/public/images/authentic/malenca-kolpa-griblje.jpg
LOG=/home/z/griblje-museum/research-griblje/raw-web-muzeji-2026-10/k49/malenca-retry.log
for i in $(seq 1 20); do
  curl -s -m 60 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Slap_in_malenca_na_Kolpi_pri_Gribljah.jpg/1280px-Slap_in_malenca_na_Kolpi_pri_Gribljah.jpg" \
    -o /tmp/malenca-try.jpg
  T=$(file -b /tmp/malenca-try.jpg | head -c 4)
  echo "$(date +%H:%M:%S) try $i: $T $(wc -c < /tmp/malenca-try.jpg)" >> "$LOG"
  if [ "$T" = "JPEG" ]; then
    python3 -c "
from PIL import Image
im = Image.open('/tmp/malenca-try.jpg').convert('RGB')
im.save('$DEST', quality=85, optimize=True)
print('saved', im.size)
" >> "$LOG" 2>&1
    echo "$(date +%H:%M:%S) SUCCESS" >> "$LOG"
    exit 0
  fi
  sleep 180
done
echo "$(date +%H:%M:%S) GAVE UP" >> "$LOG"
