import ZAI from 'z-ai-web-dev-sdk';
const jobs = [
  ['https://www.naravniparkislovenije.si/slo/prireditve/krajinski-park-kolpa/pastirski-praznik-v-gribljah-2017/68', 'f-np-pastirski2017.json'],
  ['https://www.vinska-vigred.si/?s=gribelj', 'f-vigred-search2.json'],
];
const zai = await ZAI.create();
for (const [url, out] of jobs) {
  try {
    const r = await zai.functions.invoke('page_reader', { url });
    const dd = r.data || r;
    const text = String(dd.html||'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    await Bun.write(out, JSON.stringify({url, title: dd.title, text: text.slice(0,8000)}, null, 2));
    console.log(`OK ${out} — "${(dd.title||'').slice(0,60)}" len=${text.length}`);
  } catch (e) { console.log(`FAIL ${out}: ${String(e.message).slice(0,70)}`); }
}
