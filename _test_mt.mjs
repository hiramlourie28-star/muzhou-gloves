import { readFileSync } from 'fs';
const env = Object.fromEntries(readFileSync('.env.local','utf8').split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return [l.slice(0,i), l.slice(i+1)]}));
process.env.ALIYUN_ACCESS_KEY_ID = env.ALIYUN_ACCESS_KEY_ID;
process.env.ALIYUN_ACCESS_KEY_SECRET = env.ALIYUN_ACCESS_KEY_SECRET;

const Alimt = (await import('@alicloud/alimt20181012')).default;
const $Alimt = await import('@alicloud/alimt20181012');
const $OpenApi = await import('@alicloud/openapi-client');

const client = new Alimt.default(new $OpenApi.Config({
  accessKeyId: env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: env.ALIYUN_ACCESS_KEY_SECRET,
  endpoint: 'mt.aliyuncs.com',
}));

const text = '防水防风触屏滑雪手套，可订制男、女、儿童类五指及手闷款。';
for (const target of ['en','es','pt','ru','ja','ko']) {
  const req = new $Alimt.TranslateGeneralRequest({
    formatType:'text', sourceLanguage:'zh', targetLanguage:target, sourceText:text, scene:'general'
  });
  const res = await client.translateGeneral(req);
  console.log(`${target}:`, res.body?.data?.translated || `❌ ${res.body?.message}`);
}
