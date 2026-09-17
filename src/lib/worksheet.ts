"use client";

import type { UiDict } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

/**
 * Tiskanje delovnega lista — po vzoru šolskih storitev (skoletjeneste)
 * norveških muzejev. Delovni list se zgredi v skritem iframe-u in
 * natisne, ne da bi se dotaknil CSS-ja same aplikacije.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildWorksheetHtml(school: UiDict["school"], lang: Lang, kicker: string): string {
  const ws = school.worksheet;
  const taskItems = ws.tasks
    .map(
      (task, index) => `
        <li class="task">
          <p class="q"><span class="num">${index + 1}.</span> ${escapeHtml(task)}</p>
          <div class="lines" aria-hidden="true"></div>
        </li>`
    )
    .join("");

  const fields = `
    <div class="fields">
      <span class="field"><span class="label">${escapeHtml(ws.nameField)}:</span></span>
      <span class="field"><span class="label">${escapeHtml(ws.classField)}:</span></span>
      <span class="field"><span class="label">${escapeHtml(ws.dateField)}:</span></span>
    </div>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(ws.docTitle)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, "Times New Roman", serif;
    color: #1d2a1f;
    margin: 0;
    font-size: 11.5pt;
    line-height: 1.55;
  }
  header { border-bottom: 2.5pt solid #2f5233; padding-bottom: 8pt; margin-bottom: 14pt; }
  h1 { font-size: 16pt; margin: 0; color: #2f5233; }
  header p { margin: 3pt 0 0; font-size: 10pt; color: #54604f; font-style: italic; }
  .fields { display: flex; gap: 18pt; margin: 14pt 0 6pt; }
  .field { flex: 1; border-bottom: 0.75pt solid #8a948a; padding-bottom: 3pt; font-size: 10.5pt; }
  .field .label { color: #54604f; }
  .intro {
    background: #f2f4ee;
    border-left: 3pt solid #9a5b3c;
    padding: 8pt 10pt;
    font-size: 10.5pt;
    margin: 10pt 0 16pt;
  }
  h2 { font-size: 13pt; margin: 14pt 0 6pt; color: #2f5233; }
  ol { list-style: none; margin: 0; padding: 0; }
  .task { margin-bottom: 14pt; }
  .q { margin: 0 0 6pt; }
  .num { font-weight: bold; color: #9a5b3c; }
  .lines {
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 21pt,
      #b9c1b6 21pt,
      #b9c1b6 22pt
    );
    min-height: 66pt;
    border: none;
  }
  .open { border: 1pt dashed #8a948a; padding: 8pt 10pt; }
  .open p { margin: 0 0 6pt; }
  .open .lines { min-height: 88pt; }
  .thanks { margin-top: 14pt; font-style: italic; }
  footer {
    margin-top: 18pt;
    border-top: 0.75pt solid #b9c1b6;
    padding-top: 6pt;
    font-size: 9pt;
    color: #54604f;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>
<header>
  <h1>${escapeHtml(ws.docTitle)}</h1>
  <p>${escapeHtml(kicker)}</p>
</header>
${fields}
<p class="intro">${escapeHtml(ws.intro)}</p>
<h2>${escapeHtml(ws.tasksTitle)}</h2>
<ol>${taskItems}</ol>
<div class="open">
  <p><strong>${escapeHtml(ws.openTitle)}.</strong> ${escapeHtml(ws.openQuestion)}</p>
  <div class="lines"></div>
</div>
<p class="thanks">${escapeHtml(ws.thanks)}</p>
<footer>
  <span>${escapeHtml(ws.footer)}</span>
  <span>muzej-griblje · 2026</span>
</footer>
</body>
</html>`;
}

/** Natisne delovni list v trenutnem jeziku. */
export function printWorksheet(t: UiDict, lang: Lang): void {
  const html = buildWorksheetHtml(t.school, lang, t.hero.kicker);

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.setAttribute("title", t.school.worksheet.docTitle);
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  // Kratka zakasnitev, da brskalnik naloži vsebino pred tiskanjem.
  window.setTimeout(() => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } catch {
      // tiskanje ni uspelo — iframe vseeno počistimo
    }
    window.setTimeout(() => frame.remove(), 60_000);
  }, 150);
}
