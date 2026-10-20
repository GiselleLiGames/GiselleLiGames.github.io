const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = {window:{}};
vm.createContext(context);
for (const file of ['figma-case-studies', 'case-study-curated', 'case-study-media', 'pbr-case-study', 'figma-case-study-renderer']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', file + '.js'), 'utf8'), context);
}
const render = lang => context.window.FigmaCaseStudy.render({pdf:'assets/uploads/Project1_Compressed.pdf'}, lang);

test('one PBR chapter contains both metallic and non-metallic demonstrations', () => {
  const html = render('en');
  const pbr = html.match(/<article[^>]+id="pbr-opaque"[\s\S]*?<\/article>/)[0];
  assert.match(pbr, /pbr-nonmetal\.mp4/);
  assert.match(pbr, /pbr-metal\.mp4/);
  assert.equal((html.match(/<h2>PBR Shader<\/h2>/g) || []).length, 1);
  assert.doesNotMatch(html, /id="pbr-metal"/);
});

test('each material has its own short clip and technical evidence', () => {
  const html = render('en');
  for (const id of ['opaque','ice','foliage','wind','water']) {
    const chapter = html.match(new RegExp('<article[^>]+id="pbr-' + id + '"[\\s\\S]*?<\\/article>'))[0];
    assert.match(chapter, /<video /);
    assert.match(chapter, /<p class="pbr-summary">/);
    assert.match(chapter, /data-source-node=/);
  }
  const foliage = html.match(/<article[^>]+id="pbr-foliage"[\s\S]*?<\/article>/)[0];
  assert.match(foliage, /class="pbr-technical"/);
  assert.match(foliage, /Reverse spherical harmonics/);
  assert.match(foliage, /Foliage material parameters/);
});

test('removed authorship claims stay out while wind references remain', () => {
  for (const lang of ['en','zh']) {
    const html = render(lang);
    assert.doesNotMatch(html, /Volumetric|Raymarch|体积雾|体积光|Scene conception|Sculpture \/ White/);
    for (const node of [173,231,235,234,236,230,229,232]) assert.doesNotMatch(html, new RegExp('data-source-node="920:' + node + '"'));
    for (const node of [316,328]) assert.match(html, new RegExp('data-source-node="920:' + node + '"'));
  }
});

test('all preview, zoom, poster and video paths actually exist', () => {
  for (const lang of ['en','zh']) {
    const html = render(lang);
    const paths = [...html.matchAll(/(?:src|poster|data-full-image)="(assets\/[^\"]+)"/g)].map(m => m[1]);
    assert.ok(paths.length > 80);
    for (const file of paths) assert.ok(fs.statSync(path.join(root, file)).size > 0, file);
  }
});

test('workflow is expanded by default and the long showreel is not embedded', () => {
  for (const lang of ['en','zh']) {
    const html = render(lang);
    assert.match(html, /<details class="pbr-context" open>/);
    assert.doesNotMatch(html, /ShadingShowreel\.mp4|Full showreel|完整演示/);
  }
});
