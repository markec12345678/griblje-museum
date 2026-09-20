import ZAI from 'z-ai-web-dev-sdk';
const queries = [
  ['site:radio-odeon.com griblje', 'ss1-odeon.json'],
  ['site:arhiv.vaskanal.com griblje', 'ss2-vaskanal.json'],
  ['site:radio-odeon.com križevo pastirski', 'ss3-odeon-krizevo.json'],
  ['reka-kolpa.si Griblje kopališče', 'ss4-kolpa.json'],
  ['etno-muzej.si Griblje Županič hiša', 'ss5-sem.json'],
  ['moja-dolenjska.si Griblje 500 letnica cerkev', 'ss6-mojadol.json'],
  ['druzina.si Bela krajina 1943 Gribelj partizani', 'ss7-druzina.json'],
  ['vinska-vigred.si pogača Griblje Jerčinovič', 'ss8-pogaca.json'],
];
const zai = await ZAI.create();
for (const [query, out] of queries) {
  try {
    const r = await zai.functions.invoke('web_search', { query, num: 10 });
    await Bun.write(out, JSON.stringify(r, null, 2));
    const urls = (Array.isArray(r)?r:[]).map(x=>x.url).filter(u=>!u.endsWith(u.split('/')[2]));
    console.log(`OK ${out} — ${(Array.isArray(r)?r:[]).length} zadetkov, ${urls.length} s polnim URL`);
  } catch (e) { console.log(`FAIL ${out}: ${e.message}`); }
}
