const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('every homepage work has its own existing video and poster', () => {
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'config.js'), 'utf8') + '\nthis.works = CONFIG.works;', context);
  assert.equal(context.works.length, 7);
  for (const work of context.works) {
    assert.ok(work.clip, work.title.en + ' needs a preview');
    for (const extension of ['.mp4', '.webp']) {
      const file = path.join(root, work.clip + extension);
      assert.ok(fs.existsSync(file), file);
      assert.ok(fs.statSync(file).size > 0, file);
    }
  }
});
