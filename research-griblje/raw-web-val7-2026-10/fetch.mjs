import ZAI from 'z-ai-web-dev-sdk';
const jobs = [
  ['https://www.radio-odeon.com/novice/pastirski-praznik/', 'f-odeon-pastirski.json'],
  ['https://www.radio-odeon.com/novice/krizevo-star-pastirski-praznik/', 'f-odeon-krizevo.json'],
  ['https://www.radio-odeon.com/novice/del-gribelj-bo-brez-elektrike/', 'f-odeon-elektrika.json'],
  ['https://www.vinska-vigred.si/?s=griblje', 'f-vigred-search.json'],
  ['https://www.naravniparkislovenije.si/?s=pastirski+praznik', 'f-np-search.json'],
];
const zai = await ZAI.create();
for (const [url, out] of jobs) {
  try {
    const r = await zai.functions.invoke('page_reader', { url });
    const dd = r.data || r;
    const text = String(dd.html||'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    await Bun.write(out, JSON.stringify({url, title: dd.title, text: text.slice(0,6000)}, null, 2));
    console.log(`OK ${out} — "${(dd.title||'').slice(0,60)}" len=${text.length}`);
  } catch (e) { console.log(`FAIL ${out}: ${String(e.message).slice(0,80)}`); }
}
