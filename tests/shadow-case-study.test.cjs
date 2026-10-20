const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = {window:{}};
vm.createContext(context);
for (const file of ['config.js','js/case-study-media.js','js/shadow-case-study.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
}
const work = vm.runInContext('CONFIG.works[4]',context);
const render = lang => context.window.ShadowCaseStudy.render(work,lang);

test('detail entry loads the shadow timeline before rendering the work page', () => {
  const html = fs.readFileSync(path.join(root,'work.html'),'utf8');
  assert.match(html,/href="assets\/styles\/shadow-case-study\.css/);
  assert.ok(html.indexOf('js/shadow-case-study.js')>=0);
  assert.ok(html.indexOf('js/shadow-case-study.js')<html.indexOf('js/dream-work.js'));
  assert.doesNotMatch(work.detail.overview.zh,/手部稍虚/);
});

test('shadow timeline retains chronological original media and original iteration video', () => {
  for (const lang of ['zh','en']) {
    const html = render(lang);
    const ids = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map(m=>m[1]);
    assert.deepEqual(ids,['shadow-childhood','shadow-2021-first','shadow-2021-second','shadow-rethink','shadow-too-solid','shadow-latest']);
    for (const id of ['611:49','611:45','611:40','611:32']) {
      assert.ok(html.includes(context.window.CaseStudyMedia[id].src));
    }
    assert.match(html, /2025/);
    assert.match(html, /src="assets\/uploads\/ShadowMan_Remaster.mp4"/);
    assert.doesNotMatch(html,/clipboard|shadow-progress\/|underworld|亡妻|冥界/);
    for (const m of html.matchAll(/(?:src|poster|data-full-image)="(assets\/[^"]+)"/g)) {
      assert.ok(fs.statSync(path.join(root,m[1])).size>0,m[1]);
    }
  }
});

test('latest stage repeats the current final video and records the actual VR concept', () => {
  assert.match(render('zh'),/余光[\s\S]*正视[\s\S]*双摄像机/);
  assert.match(render('en'),/peripheral vision[\s\S]*two cameras/);
  const latest = render('zh').split('id="shadow-latest"')[1];
  assert.ok(latest.includes('src="'+work.links[0].href+'"'));
  assert.ok(latest.includes('poster="'+work.image+'"'));
  assert.equal(work.clip+'.mp4',work.links[0].href);
});
