#!/bin/bash
# Val 109 — zanka koščkov do 45/45 izrezkov (max 14 kosov ~ 2.3 h)
cd /home/z/griblje-museum/research-griblje/raw-web-val109-2026-09
for i in $(seq 1 14); do
  n=$(ls vlm-v109/*.json 2>/dev/null | wc -l)
  echo "=== chunk $i start ($n/45) ===" >> loop-v109.log
  if [ "$n" -ge 45 ]; then echo "COMPLETE" >> loop-v109.log; break; fi
  timeout 580 bun read-v109.mts 540 >> loop-v109.log 2>&1
  n=$(ls vlm-v109/*.json 2>/dev/null | wc -l)
  echo "=== chunk $i end ($n/45) ===" >> loop-v109.log
done
echo "LOOP END $(ls vlm-v109/*.json 2>/dev/null | wc -l)/45" >> loop-v109.log
