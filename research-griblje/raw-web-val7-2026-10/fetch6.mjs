import ZAI from 'z-ai-web-dev-sdk';
const zai = await ZAI.create();
const jobs = [
  ['https://www.vinska-vigred.si/sl/novice/najboljsa-belokranjska-pogaca-44-vinske-vigredi-v-beli-krajini-prihaja-iz-gribelj/', 'f-vigred-44.json'],
  ['https://www.vinska-vigred.si/sl/novice/najboljsa-belokranjska-pogaca-prihaja-iz-gribelj/', 'f-vigred-druga.json'],
  ['https://www.naravniparkislovenije.si/slo/prireditve/krajinski-park-kolpa/pastirski-praznik-v-gribljah-2017/68', 'f-np-pastirski2017-full.json'],
  ['https://arhiv.vaskanal.com/obudili-pastirski-praznik/', 'f-vaskanal-obudili.json'],
  ['https://www.radio-odeon.com/novice/pastirski-praznik-v-gribljah/', 'f-odeon-pastirski2.json'],
];
const clean = h => String(h||'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
for (const [url, out] of jobs) {
  try {
    const r = await zai.functions.invoke('page_reader', { url });
    const dd = r.data || r;
    await Bun.write(out, JSON.stringify({url, title: dd.title, published: dd.publishedTime, text: clean(dd.html).slice(0,9000)}, null, 2));
    console.log(`OK ${out} — "${(dd.title||'').slice(0,60)}" pub=${dd.publishedTime||'?'}`);
  } catch (e) { console.log(`FAIL ${out}: ${String(e.message).slice(0,60)}`); }
  await new Promise(r=>setTimeout(r,8000));
}
