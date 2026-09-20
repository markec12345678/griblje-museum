import ZAI from 'z-ai-web-dev-sdk';
const jobs = [
  ['https://www.vinska-vigred.si/najboljsa-belokranjska-pogaca-44-vinske-vigredi-v-beli-krajini-prihaja-iz-gribelj/', 'f-vigred-pogaca.json'],
  ['https://www.radio-odeon.com/novice/pastirski-praznik/', 'f-odeon-pastirski.json'],
  ['https://www.radio-odeon.com/novice/krizevo-star-pastirski-praznik/', 'f-odeon-krizevo.json'],
];
const zai = await ZAI.create();
for (const [url, out] of jobs) {
  try {
    const r = await zai.functions.invoke('page_reader', { url });
    const dd = r.data || r;
    await Bun.write(out, JSON.stringify({url, title: dd.title, html: String(dd.html||'').slice(0,12000)}, null, 2));
    console.log(`OK ${out} — "${(dd.title||'').slice(0,70)}"`);
  } catch (e) { console.log(`FAIL ${out}: ${String(e.message).slice(0,70)}`); }
}
