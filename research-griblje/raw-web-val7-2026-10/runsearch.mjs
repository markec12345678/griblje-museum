import ZAI from 'z-ai-web-dev-sdk';
const queries = [
  ['s02', '"Griblje" sistory zgodovina', 's02-sistory.json'],
  ['s06', 'Griblje facebook društvo kmečkih žena slike', 's06-facebook.json'],
  ['s07', 'križevo pastirski praznik Griblje Barle', 's07-krizevo.json'],
  ['s08', 'Griblje COBISS knjiga monografija', 's08-cobiss.json'],
  ['s09', 'Griblje dLib.si digitalna knjižnica časopisje', 's09-dlib.json'],
  ['s10', 'Griblje Geopedia Zemljevid kataster', 's10-geopedia.json'],
  ['s11', 'Griblje šola kronika učiteljica zgodovina', 's11-sola.json'],
  ['s12', 'Griblje cerkev sveti Vid podružnica Podzemelj župnija', 's12-cerkev.json'],
];
const zai = await ZAI.create();
for (const [tag, query, out] of queries) {
  try {
    const r = await zai.functions.invoke('web_search', { query, num: 8 });
    const fs = await import('fs');
    fs.writeFileSync(out, JSON.stringify(r, null, 2));
    console.log(`OK ${tag} (${Array.isArray(r) ? r.length : 0})`);
  } catch (e) { console.log(`FAIL ${tag}: ${e.message}`); }
}
