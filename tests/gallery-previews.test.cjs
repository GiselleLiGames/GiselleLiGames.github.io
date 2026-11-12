const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('every homepage work has a cover and video projects have an existing clip and poster', () => {
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'config.js'), 'utf8') + '\nthis.works = CONFIG.works;', context);
  for (const work of context.works) {
    const cover = path.join(root, work.image);
    assert.ok(fs.statSync(cover).size > 0, cover);
    if (!work.hasVideo && !work.clip) continue;
    assert.ok(work.clip, work.title.en + ' needs a preview');
    for (const extension of ['.mp4', '.webp']) {
      const file = path.join(root, work.clip + extension);
      assert.ok(fs.existsSync(file), file);
      assert.ok(fs.statSync(file).size > 0, file);
    }
  }
});
