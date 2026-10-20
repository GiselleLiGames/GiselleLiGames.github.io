(function () {
  'use strict';
  function render(work, lang) {
    var L = function (zh, en) { return lang === 'zh' ? zh : en; };
    function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
    var blocks = {};
    ((window.FIGMA_CASE_STUDIES || {})[5] || []).forEach(function (chapter) {
      chapter.columns.forEach(function (column) { column.forEach(function (b) { blocks[b.node || b.sourceNode] = b; }); });
    });
    function shot(id, label) {
      var key = '744:' + id, b = blocks[key], m = (window.CaseStudyMedia || {})[key];
      if (!b || !b.src) return '';
      var src = m ? m.src : b.src.replace(/\.(png|jpg)$/, '.webp');
      var full = m ? m.full : b.src.replace(/\.(png|jpg)$/, '.full.webp');
      var size = m ? [m.width, m.height] : (window.FIGMA_IMAGE_SIZES || {})[src] || [1600, 900];
      return '<figure class="pbr-shot" data-source-node="' + key + '"><button class="pv-page-img" type="button" data-full-image="' + esc(full) + '" data-title="' + esc(label) + '" aria-label="' + esc(L('放大：', 'Enlarge: ') + label) + '"><img src="' + esc(src) + '" alt="' + esc(label) + '" width="' + size[0] + '" height="' + size[1] + '" loading="lazy" decoding="async"></button><figcaption>' + esc(label) + '</figcaption></figure>';
    }
    function shots(items) { return '<div class="pcg-process">' + items.map(function (s) { return shot(s[0], s[1]); }).join('') + '</div>'; }
    function clip(id, caption) {
      var base = 'assets/clips/pcg-sections/' + id;
      return '<figure class="pbr-demo"><video controls playsinline loop preload="none" poster="' + base + '.webp" aria-label="' + esc(caption) + '"><source src="' + base + '.mp4" type="video/mp4"></video><figcaption>' + esc(caption) + '</figcaption></figure>';
    }
    var sections = [
      {id:'materials', title:L('房屋建模与程序化材质','House Modeling & Procedural Materials'), tools:'Maya · Substance Designer', clip:'materials', caption:L('房屋白模、屋顶与木板材质制作','House blockout, roof and wood material workflow'),
        text:L('在 Maya 中完成房屋基础建模与 UV，在 Substance Designer 中制作砖墙、木板和屋檐材质。通过边缘高光、木纹与苔藓遮罩控制表面细节，再调整为更简洁的风格化表现。','I modeled and unwrapped the house in Maya, then built brick, wood and roof materials in Substance Designer. Edge highlights, wood grain and moss masks control the surface detail, with further adjustments toward a simpler stylized finish.'),
        images:[[25,L('砖墙：边缘磨损与高光','Brick · edge wear and highlights')],[33,L('木板：木纹与苔藓遮罩','Wood · grain and moss mask')],[37,L('屋檐：平铺与随机变化','Roof · tiling and variation')]]},
      {id:'brick',title:L('程序化砖墙','Procedural Brick Walls'),tools:'Houdini · Height Map → Mesh · Unreal Engine',clip:'brick-wall',caption:L('高度图生成砖墙，并在 UE 中调整门洞与墙体','Height-map brick walls and doorway controls in UE'),
        text:L('用 Substance Designer 的高度图驱动 Attribute from Map 与 Poly Reduce，将材质转换为砖墙网格。两个立方体分别控制墙体与门洞；预览模式用于调形，再切换最终结果生成细节。','A Substance Designer height map drives Attribute from Map and Poly Reduce to turn the material into a brick-wall mesh. Two cubes control the wall and doorway. Preview mode supports shape adjustments before generating the detailed result.'),
        images:[[71,L('高度图转网格后的墙体','Wall mesh generated from the height map')],[81,L('墙体、门洞与顶部收边参数','Wall, doorway and top-trim controls')],[87,L('高度图采样与网格简化节点','Height-map sampling and mesh reduction nodes')]]},
      {id:'stone',title:L('样条石墙','Spline-based Stone Walls'),tools:'Houdini · Point Wrangle · Unreal Engine',clip:'stone-wall',caption:L('石块参数变化、样条调形与 UE 场景应用','Stone variation, spline editing and use in UE'),
        text:L('用样条控制石墙路径，通过 Point Wrangle 让石块交错排列，并在 For Loop 中调整单块尺寸与破损程度。在 UE 中拖动样条，即可快速改变墙体走向。','A spline defines the wall path. Point Wrangle staggers the stones, while a For Loop varies their dimensions and weathering. Editing the spline in UE quickly changes the wall layout.'),
        images:[[120,L('石块尺寸与破损控制','Stone dimensions and weathering controls')],[121,L('交错排列的点与路径','Points and paths for staggered placement')],[122,L('Point Wrangle 排列逻辑','Point Wrangle placement logic')]]},
      {id:'mountain',title:L('程序化山体','Procedural Mountains'),tools:'Houdini · HeightField · Erode',clip:'mountains',caption:L('HeightField 塑形、侵蚀与山体上色','HeightField shaping, erosion and terrain color'),
        text:L('通过 HeightField 节点塑造山脉轮廓，加入 Erode 侵蚀与自动上色，再导出高度图用于 UE 地形。结合 Sweep 与属性混合，探索更有层次的山体形态。','HeightField nodes shape the mountain silhouette, followed by erosion and automatic coloring. The height map is exported for UE terrain. Sweep and attribute blending explore layered mountain forms.'),
        images:[[140,L('建立山体大形','Establish the mountain form')],[144,L('加入侵蚀细节','Add erosion detail')],[137,L('山体上色结果','Colored terrain result')]]},
      {id:'scene',title:L('UE 场景整合与迭代','UE Scene Integration & Iteration'),tools:'Unreal Engine · Vertex Color · RVT',
        text:L('将房屋、程序化墙体和山体组合成场景。顶点色材质用于石墙，RVT 让草地与地形衔接。早期材质偏写实，迭代中减少表面噪声，保留轮廓、浮雕与高光。','The house, procedural walls and mountains come together in UE. Vertex-color materials shade the stone walls, and RVT blends grass into the landscape. Iteration reduces the realistic surface noise in favor of clearer silhouettes, relief and highlights.'),
        images:[[179,L('石墙顶点色材质','Stone-wall vertex-color material')],[183,L('草地与地形的 RVT 混合','RVT blending for grass and terrain')],[184,L('UE 材质节点','UE material nodes')]]}
    ];
    var html = '<section class="fc-studies pbr-study pcg-study" id="case-study" aria-label="' + L('PCG 制作过程','PCG workflow') + '">';
    html += sections.map(function (s) {
      return '<article class="pbr-section" id="pcg-' + s.id + '"><header class="pbr-section-head"><div><h2>' + esc(s.title) + '</h2><p>' + esc(s.tools) + '</p></div></header>' +
        (s.clip ? '<div class="pcg-demo-row">' + clip(s.clip, s.caption) + '<p class="pbr-summary">' + esc(s.text) + '</p></div>' : '<p class="pbr-summary">' + esc(s.text) + '</p>') + shots(s.images) +
        (s.id === 'scene' ? '<div class="pcg-comparison">' + shot(185,L('早期版本','Earlier version')) + shot(190,L('迭代后场景','Revised scene')) + '</div><details class="pbr-evidence pcg-reference"><summary>' + L('查看一张场景参考','View scene reference') + '</summary><figure class="pbr-shot"><button class="pv-page-img" type="button" data-full-image="assets/uploads/pcg-reference/laputa-landscape.jpg" aria-label="' + L('放大场景参考','Enlarge scene reference') + '"><img src="assets/uploads/pcg-reference/laputa-landscape.webp" alt="' + L('《天空之城》山谷房屋画面参考','Castle in the Sky · hillside house reference') + '" width="1920" height="1080" loading="lazy"></button><figcaption>' + L('画面参考：《天空之城》© 1986 Hayao Miyazaki / Studio Ghibli。','Visual reference: Castle in the Sky © 1986 Hayao Miyazaki / Studio Ghibli. ') + ' <a href="https://wallpapers.com/laputa-castle-in-the-sky" target="_blank" rel="noopener">' + L('图片来源','Image source') + ' ↗</a></figcaption></figure></details>' : '') + '</article>';
    }).join('');
    return html + '</section>';
  }
  window.PCGCaseStudy = {render:render};
})();
