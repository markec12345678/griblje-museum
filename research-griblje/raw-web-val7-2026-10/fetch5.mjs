import ZAI from 'z-ai-web-dev-sdk';
const zai = await ZAI.create();
const jobs = [
  ['https://www.vinska-vigred.si/sl/novice/najboljsa-belokranjska-pogaca-44-vinske-vigredi-v-beli-krajini-prihaja-iz-gribelj/', 'f-vigred-44.json'],
  ['https://www.vinska-vigred.si/sl/novice/najboljsa-belokranjska-pogaca-prihaja-iz-gribelj/', 'f-vigred-druga.json'],
];
for (const [url, out] of jobs) {
  try {
    const r = await zai.functions.invoke('page_reader', { url });
    const dd = r.data || r;
    const text = String(dd.html||'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    await Bun.write(out, JSON.stringify({url, title: dd.title, text: text.slice(0,7000)}, null, 2));
    console.log(`OK ${out} len=${text.length}`);
  } catch (e) { console.log(`FAIL ${out}: ${String(e.message).slice(0,60)}`); }
}
