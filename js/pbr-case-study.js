(function () {
  'use strict';
  // The original Figma images remain the evidence; group them by shader, not PDF reading order.
  function render(work, lang) {
    var zh = lang === 'zh', L = function (a, b) { return zh ? a : b; };
    var esc = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
    var blocks = {};
    ((window.FIGMA_CASE_STUDIES || {})[1] || []).forEach(function (chapter) {
      chapter.columns.forEach(function (column) { column.forEach(function (block) { blocks[block.node || block.sourceNode] = block; }); });
    });
    function media(id) {
      var b = blocks['920:' + id];
      if (!b || !b.src) return null;
      var cropped = (window.CaseStudyMedia || {})['920:' + id];
      var src = b.src.replace(/\.(png|jpg)$/, '.webp');
      var size = (window.FIGMA_IMAGE_SIZES || {})[src] || [1600, 900];
      return cropped || {src:src, full:src.replace(/\.webp$/, '.full.webp'), width:size[0], height:size[1]};
    }
    function shot(id, label) {
      var m = media(id); if (!m) return '';
      return '<figure class="pbr-shot" data-source-node="920:' + id + '"><button class="pv-page-img" type="button" data-full-image="' + esc(m.full) + '" data-title="' + esc(label) + '" aria-label="' + esc(L('放大：', 'Enlarge: ') + label) + '"><img src="' + esc(m.src) + '" alt="' + esc(label) + '" width="' + m.width + '" height="' + m.height + '" loading="lazy" decoding="async"></button><figcaption>' + esc(label) + '</figcaption></figure>';
    }
    function shots(items, extra) { return '<div class="pbr-shots ' + (extra || '') + '">' + items.map(function (x) { return shot(x[0], x[1]); }).join('') + '</div>'; }
    function clip(id, label) {
      var src = 'assets/clips/pbr-sections/' + id;
      return '<figure class="pbr-demo"><video controls playsinline loop preload="none" poster="' + src + '.webp" aria-label="' + esc(label) + '"><source src="' + src + '.mp4" type="video/mp4"></video><figcaption>' + esc(label) + '</figcaption></figure>';
    }
    function note(title, text) { return '<div class="pbr-note"><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p></div>'; }
    function more(label, content) { return '<details class="pbr-evidence"><summary>' + esc(label) + '</summary>' + content + '</details>'; }
    function technical(parameters, codes) { return '<div class="pbr-technical"><div class="pbr-parameters"><h3>' + L('材质与参数','Material & parameters') + '</h3>' + parameters + '</div><div class="pbr-code"><h3>' + L('实现代码','Implementation') + '</h3>' + codes + '</div></div>'; }
    var sections = [
      {id:'opaque', title:L('PBR Shader', 'PBR Shader'), type:'Cook–Torrance · Metallic / Non-metallic · IBL', demos:[['pbr-nonmetal',L('非金属：内置与自研 Shader 对比','Non-metallic · built-in vs. custom shader')],['pbr-metal',L('金属：光照与粗糙度响应','Metallic · lighting and roughness response')]],
        text:L('以 Cook–Torrance BRDF 和 IBL 构建同一套金属／非金属 PBR。漫反射除以 π，保持能量守恒；粗糙度与材质通道控制表面反射。', 'One Cook–Torrance and IBL framework handles both metallic and non-metallic surfaces. The diffuse term is divided by π for energy conservation; roughness and material channels control reflections.'),
        evidence:technical(shots([[301,L('材质参数','Material parameters')]]),shots([[292,L('基础 PBR 着色代码','PBR shading code')]])) + more(L('查看材质纹理','Material textures'),shots([[296,L('基础色','Base color')],[295,L('法线','Normal')],[304,L('材质通道','Material channels')]],'pbr-shots--maps'))},
      {id:'ice', title:L('半透明冰 Shader','Translucent Ice Shader'), type:'3S Sampling · MatCap · Screen Color', clip:'ice', demo:L('冰材质：半透明、反射与表面细节','Ice material · translucency, reflection and surface detail'),
        text:L('不透明冰在场景中的效果不理想，因此改用半透明方案：3S 采样、MatCap 反射与屏幕颜色模糊。', 'Opaque ice did not work well in this scene, so I switched to translucent ice using 3S sampling, MatCap reflections and blurred screen color.'),
        evidence:note(L('法线与透明排序','Normals and transparency'),L('混合法线保留表面细节，并处理透明材质的渲染顺序。','Blended normals retain surface detail; render ordering handles the transparent material.')) + shots([[244,L('冰材质参数','Ice material parameters')],[246,L('雕像法线贴图','Surface normal map')],[245,L('冰裂纹法线','Cracked-ice normal map')]],'pbr-shots--maps') + more(L('查看材质迭代对比','Material iteration'),shots([[238,L('早期不透明方案','Earlier opaque material')],[237,L('半透明方案','Translucent material')],[243,L('场景中的材质测试','Material test in scene')]]))},
      {id:'foliage', title:L('植物透光与散射','Foliage Transmission & Scattering'), type:'Reverse SH · Scattering', clip:'foliage-scattering', demo:L('逆光下的叶片透光效果','Leaf transmission under backlighting'),
        text:L('在植物 PBR 上加入反向球谐光照与散射，让叶片在逆光时透光。使用同一模型对比 Unity SpeedTree 与自研 Shader。', 'Reverse spherical harmonics and scattering add leaf transmission to the foliage PBR shader. The comparison uses the same model with Unity SpeedTree and my shader.'),
        evidence:technical(shots([[305,L('植物材质参数','Foliage material parameters')]]),shots([[306,L('反向球谐光照','Reverse spherical harmonics')],[307,L('散射实现','Scattering implementation')]]))},
      {id:'wind', title:L('植物风动 Shader','Foliage Wind Shader'), type:'Main Bending · Detail Bending', clip:'foliage-wind', demo:L('主弯曲与叶片细节弯曲','Main bending and leaf detail bending'),
        text:L('从简单的正弦、余弦叠加改为参考《孤岛危机》的双层弯曲：主弯曲控制整株运动，细节弯曲控制叶片。', 'I replaced simple sine and cosine motion with the two-part bending approach used in Crysis: main bending moves the plant, while detail bending moves the leaves.'),
        evidence:shots([[321,L('风动参数','Wind parameters')],[318,L('主弯曲','Main bending')],[319,L('细节弯曲','Detail bending')]]) + '<h3 class="pbr-reference-title">' + L('算法参考','Algorithm references') + '</h3>' + shots([[316,L('程序化植被动画：主弯曲与细节弯曲','Procedural vegetation animation · main and detail bending')],[328,L('叶片与边缘的波形','Leaf and edge waveforms')]],'pbr-shots--references') + more(L('查看风动代码','Wind implementation'),shots([[315,L('初始风动算法','Initial wind algorithm')],[322,L('改进后的弯曲实现','Revised bending implementation')],[323,L('细节运动实现','Detail motion implementation')]]))},
      {id:'water', title:L('水面 Shader','Water Shader'), type:'Flipbook Waves · Refraction · Reflection', clip:'water', demo:L('水面：透明度、折射、反射与波纹','Water · transparency, refraction, reflection and waves'),
        text:L('使用 Blender Ocean 烘焙波浪序列，驱动水面法线与高度。采样屏幕颜色实现水下物体折射，并加入扭曲反射。', 'A wave flipbook baked from Blender Ocean drives the surface normals and height. Screen-color sampling refracts submerged objects, with distorted reflections added to the surface.'),
        evidence:shots([[356,L('波浪序列：法线与高度','Wave flipbook · normals and height')],[357,L('波浪贴图设置','Wave texture setup')]]) + more(L('查看实现与前后对比','Implementation and comparisons'),shots([[371,L('无折射','Without refraction')],[372,L('添加折射','With refraction')],[376,L('水面折射代码','Water refraction code')],[379,L('无反射','Without reflection')],[380,L('添加反射','With reflection')],[382,L('捕获场景颜色','Scene color capture')]]))},
      {id:'tools', title:L('Shader 参数界面','ShaderGUI & Material Controls'), type:'C# · Feature Toggles',
        text:L('为自研 Shader 编写 ShaderGUI：按功能分组参数，关闭功能时隐藏对应设置。场景工具用于按类型重命名、整理灯光。', 'A custom ShaderGUI groups material parameters by feature and hides settings for disabled features. A scene tool renames and groups lights by type.'),
        evidence:shots([[391,L('功能关闭','Feature disabled')],[390,L('功能启用','Feature enabled')]]) + more(L('查看编辑器代码与工具','Editor implementation and tools'),shots([[393,L('ShaderGUI 条件显示','Conditional ShaderGUI controls')],[394,L('功能切换代码','Feature toggle code')],[395,L('灯光分组工具','Light grouping tool')],[396,L('编辑器窗口实现','Editor window implementation')]]))}
    ];
    var html = '<section class="fc-studies pbr-study" id="case-study" aria-label="' + L('Shader 技术拆解','Shader breakdown') + '"><nav class="pbr-index" aria-label="' + L('Shader 目录','Shader chapters') + '">' + sections.map(function(s,i){return '<a href="#pbr-' + s.id + '"><span>' + String(i+1).padStart(2,'0') + '</span>' + esc(s.title) + '</a>';}).join('') + '</nav>';
    html += sections.map(function(s,i){var demos=s.demos?'<div class="pbr-demos">'+s.demos.map(function(d){return clip(d[0],d[1]);}).join('')+'</div>':(s.clip?clip(s.clip,s.demo):'');return '<article class="pbr-section" id="pbr-' + s.id + '"><header class="pbr-section-head"><span>' + String(i+1).padStart(2,'0') + '</span><div><h2>' + esc(s.title) + '</h2><p>' + esc(s.type) + '</p></div></header><div class="pbr-section-body' + (!demos?' pbr-section-body--tools':'') + '">' + demos + '<div class="pbr-implementation"><p class="pbr-summary">' + esc(s.text) + '</p>' + s.evidence + '</div></div></article>';}).join('');
    var stages = [[440,447,L('直接镜面反射','Direct specular')],[441,448,L('间接镜面反射','Indirect specular')],[442,443,L('直接漫反射','Direct diffuse')],[445,446,L('间接漫反射','Indirect diffuse')],[444,459,L('烘焙全局光照','Baked GI')]];
    html += '<section class="pbr-section" id="pbr-composition"><header class="pbr-section-head"><span>07</span><div><h2>' + L('合成与后期','Composition & Post-processing') + '</h2><p>PBR · ACES · Bloom · SSAO</p></div></header><p class="pbr-summary">' + L('合成直接与间接的漫反射、镜面反射，再通过 ACES 色调映射、Bloom 和 SSAO 调整最终画面。','Direct and indirect diffuse and specular terms form the base render. ACES tone mapping, bloom and SSAO shape the final image.') + '</p><div class="pbr-breakdown">' + stages.map(function(s){return '<div>' + shot(s[0],s[2]) + more(L('查看对应代码','View code'),shot(s[1],s[2]+' · HLSL')) + '</div>';}).join('') + '</div>' + shots([[453,L('基础合成','Base composition')],[452,L('后期处理','Post-processing')],[455,L('加入 SSAO','With SSAO')]]) + '</section>';
    var steps = [[174,L('导入场景资产','Import scene assets'),L('将 Fab 资产从 UE 转入 Unity。','Transfer Fab assets from UE into Unity.')],[175,L('检查初始渲染','Inspect the imported render'),L('定位材质不兼容、过亮灯光和场景层次问题。','Identify incompatible materials, excessive lighting and lost scene definition.')],[176,L('替换材质与重建光照','Replace materials and rebuild lighting'),L('应用自研 Shader，关闭原有点光源，重新布光。','Apply the custom shaders, disable the imported point lights and rebuild the lighting.')],[195,L('统一材质响应','Unify material response'),L('调整材质参数，让石材、植物与水面在同一光照中工作。','Tune the materials so stone, foliage and water respond consistently to the lighting.')],[196,L('接入 GI 与阴影','Integrate GI and shadows'),L('让 PBR Shader 支持烘焙 GI 与 ShadowMap。','Add baked-GI and shadow-map support to the PBR shaders.')],[197,L('完成场景调校','Finish scene tuning'),L('统一 Shader、光照与后期处理的最终表现。','Balance the final shaders, lighting and post-processing.')]];
    html += '<details class="pbr-context" open><summary>' + L('场景搭建与渲染流程','Scene setup & rendering workflow') + '</summary><ol class="pbr-workflow">' + steps.map(function(s,i){return '<li><span>' + String(i+1).padStart(2,'0') + '</span><h3>' + esc(s[1]) + '</h3>' + shot(s[0],s[1]) + '<p>' + esc(s[2]) + '</p></li>';}).join('') + '</ol></details></section>';
    return html;
  }
  window.PBRCaseStudy = {render:render};
})();
