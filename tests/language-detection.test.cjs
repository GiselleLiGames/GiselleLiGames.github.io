const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function storage(values = {}) {
  const data = new Map(Object.entries(values));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
const scope = {
  window: { location: { search: '' }, fetch: async () => { throw Error('offline'); } },
  navigator: { languages: ['en-US'] }, URLSearchParams, AbortController, setTimeout, clearTimeout
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/language-detection.js'), 'utf8'), scope);
const create = scope.window.SiteLanguage.create;
const response = country => Promise.resolve({ ok: true, json: async () => ({ country, ip: 'not-stored' }) });

test('explicit links and saved choices skip IP lookup', async () => {
  const fetch = () => { throw Error('must not fetch'); };
  assert.equal((await create({ search: '?lang=en', storage: storage({ lang: 'zh' }), fetch }).detect()).lang, 'en');
  assert.equal((await create({ storage: storage({ lang: 'zh' }), fetch }).detect()).lang, 'zh');
});

test('Chinese regions use Chinese; other regions use English', async () => {
  for (const country of ['CN', 'HK', 'MO', 'TW', 'US', 'GB', 'JP', 'SG']) {
    const result = await create({ storage: storage(), languages: ['en'], fetch: () => response(country) }).detect();
    assert.equal(result.lang, ['CN', 'HK', 'MO', 'TW'].includes(country) ? 'zh' : 'en');
    assert.equal(result.source, 'ip');
  }
});

test('country cache expires after 24 hours and contains no IP', async () => {
  const store = storage();
  const detector = create({ storage: store, now: () => 1000, fetch: () => response('CN') });
  await detector.detect();
  const cache = JSON.parse(store.getItem('site-language-country'));
  assert.deepEqual(Object.keys(cache).sort(), ['country', 'expires']);
  assert.equal(cache.expires, 1000 + 86400000);
  assert.equal(detector.initial().source, 'ip-cache');
  assert.equal(create({ storage: store, now: () => cache.expires, languages: ['en'] }).initial().source, 'browser');
  assert.equal(store.getItem('lang'), null, 'auto detection must not become a manual choice');
});

test('timeouts, HTTP errors, invalid responses and blocked storage fall back safely', async () => {
  for (const fetch of [() => new Promise(() => {}), async () => ({ ok: false }), () => response('INVALID')]) {
    const result = await create({ storage: storage(), languages: ['zh-CN'], fetch, timeout: 10 }).detect();
    assert.equal(result.lang, 'zh');
    assert.equal(result.source, 'browser');
  }
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  const result = await create({ storage: blocked, languages: ['en'], fetch: () => response('CN') }).detect();
  assert.equal(result.lang, 'zh');
});

test('a manual change during the IP request wins', async () => {
  const store = storage();
  let resolve;
  const pending = create({ storage: store, languages: ['en'], fetch: () => new Promise(r => { resolve = r; }) }).detect();
  store.setItem('lang', 'en');
  resolve(await response('CN'));
  const result = await pending;
  assert.equal(result.lang, 'en');
  assert.equal(result.source, 'manual');
});
