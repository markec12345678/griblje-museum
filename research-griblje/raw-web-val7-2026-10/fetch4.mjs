import ZAI from 'z-ai-web-dev-sdk';
const zai = await ZAI.create();
// 1) polno besedilo NP 2017
try {
  const r = await zai.functions.invoke('page_reader', { url: 'https://www.naravniparkislovenije.si/slo/prireditve/krajinski-park-kolpa/pastirski-praznik-v-gribljah-2017/68' });
  const dd = r.data || r;
  const text = String(dd.html||'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const i = text.indexOf('Letos bomo');
  console.log('NP-NADALJEVANJE:', text.slice(i, i+1500));
} catch (e) { console.log('NP FAIL', String(e.message).slice(0,60)); }
// 2) vigred homepage raw html → linki
try {
  const r2 = await zai.functions.invoke('page_reader', { url: 'https://www.vinska-vigred.si/' });
  const dd2 = r2.data || r2;
  const links = [...String(dd2.html||'').matchAll(/href="([^"]+)"/g)].map(m=>m[1]).filter(u=>/pogaca/i.test(u));
  console.log('VIGRED-LINKI:', [...new Set(links)].join('\n'));
} catch (e) { console.log('VIGRED FAIL', String(e.message).slice(0,60)); }
