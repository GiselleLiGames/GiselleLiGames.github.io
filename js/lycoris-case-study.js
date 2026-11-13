(function () {
  'use strict';
  function render(work, lang) {
    function L(zh, en) { return lang === 'zh' ? zh : en; }
    function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
    var blocks = {};
    ((window.FIGMA_CASE_STUDIES || {})[2] || []).forEach(function (chapter) {
      chapter.columns.forEach(function (column) { column.forEach(function (b) { blocks[b.node || b.sourceNode] = b; }); });
    });
    function shot(id, label) {
      var b = blocks[id], m = (window.CaseStudyMedia || {})[id];
      if (!b || !b.src) return '';
      var src = m ? m.src : b.src.replace(/\.(png|jpg)$/, '.webp');
      var full = m ? m.full : b.src.replace(/\.(png|jpg)$/, '.full.webp');
      var size = m ? [m.width,m.height] : (window.FIGMA_IMAGE_SIZES || {})[src] || [1600,900];
      return '<figure class="pbr-shot" data-source-node="' + id + '"><button class="pv-page-img" type="button" data-full-image="' + esc(full) + '" data-title="' + esc(label) + '" aria-label="' + esc(L('放大：','Enlarge: ') + label) + '"><img src="' + esc(src) + '" alt="' + esc(label) + '" width="' + size[0] + '" height="' + size[1] + '" loading="lazy" decoding="async"></button><figcaption>' + esc(label) + '</figcaption></figure>';
    }
    function shots(items, extra) { return '<div class="lycoris-process ' + (extra || '') + '">' + items.map(function (s) { return shot(s[0],s[1]); }).join('') + '</div>'; }
    function chapter(id, title, tools, body) {
      return '<article class="pbr-section" id="lycoris-' + id + '"><header class="pbr-section-head"><div><h2>' + esc(title) + '</h2><p>' + esc(tools) + '</p></div></header>' + body + '</article>';
    }
    function summary(text) { return '<p class="pbr-summary">' + esc(text) + '</p>'; }
    var html = '<section class="fc-studies pbr-study lycoris-study" id="case-study" aria-label="' + L('Lycoris 制作过程','Lycoris workflow') + '">';
    html += chapter('character',L('角色风格化 Shader','Stylized Character Shader'),'Unity URP · Ramp · Blinn–Phong',
      '<div class="lycoris-demo-row"><figure class="pbr-demo"><video controls playsinline loop preload="none" poster="assets/clips/lycoris-sections/character-comparison.webp" aria-label="' + L('角色渲染迭代对比','Character shading iteration comparison') + '"><source src="assets/clips/lycoris-sections/character-comparison.mp4" type="video/mp4"></video><figcaption>' + L('角色渲染迭代对比 · 原始演示','Character shading iteration · original demonstration') + '</figcaption></figure>' + summary(L('以 Ramp 控制角色明暗过渡，使用 C# 工具实时生成并预览渐变。Blinn–Phong 高光通过 Threshold、Softness 与 SmoothStep 控制形状，配合黑白遮罩调整阴影边界，减少写实细节。','A ramp controls the character’s light-to-shadow transition, with a C# tool for generating and previewing gradients. Threshold, Softness and SmoothStep shape the Blinn–Phong highlights; a black-and-white mask adjusts shadow edges for a cleaner stylized result.')) + '</div>' +
      shots([['729:130',L('C# Ramp 生成与预览工具','C# ramp generation and preview')],['660:246',L('角色材质参数','Character material controls')]]));
    html += chapter('scene',L('场景渲染与迭代','Scene Rendering & Iteration'),'FOV 10 · Lighting · Fog · Post-processing',
      summary(L('以 FOV 10 建立横版视角，利用空间分层、雾、分区灯光和后期处理区分关卡氛围。后续迭代减少写实纹理，强化明暗对比，并用 HeroLight 和危险区域的对应灯光保持角色可读性。','An FOV of 10 supports the side-scrolling view. Spatial layers, fog, lighting zones and post-processing distinguish level atmospheres. Later iteration reduces realistic textures and strengthens light–shadow contrast, with HeroLight and lights at hazardous emissive areas keeping the character readable.')) +
      shots([['356:77',L('岩石与熔岩场景','Rock and lava environment')],['660:172',L('关卡中的光照与氛围','Level lighting and atmosphere')],['660:194',L('场景材质测试','Scene material study')],['660:195',L('简化后的风格化表面','Simplified stylized surfaces')]]));
    html += chapter('vfx',L('玩法特效与 Shader','Gameplay VFX & Shaders'),'Particle System · Shader Graph · ASE',
      '<section class="lycoris-effect"><h3>' + L('可交互鬼火','Interactable Ghost Fire') + '</h3>' + summary(L('使用粒子系统与 Shader Graph 制作火焰，以 Trail、Force Over Lifetime 和三角函数控制尾部拉伸与变化，服务于燃烧符咒、拉动笼子和牵引角色三种交互。','Particle System and Shader Graph create the flame. Trails, Force Over Lifetime and trigonometric functions control its stretched tail for three interactions: burning talismans, pulling a cage and pulling the character.')) + shots([['717:748',L('鬼火与笼子的交互','Ghost fire interacting with a cage')],['717:745',L('火焰 Shader Graph','Flame Shader Graph')]]) + '</section>' +
      '<section class="lycoris-effect"><h3>' + L('符咒燃烧与溶解','Talisman Burning & Dissolve') + '</h3>' + summary(L('通过溶解 Shader 与 Burn Ramp 表现符咒被烧毁的过程。','A dissolve shader and burn ramp visualize the talisman burning away.')) + shots([['729:133',L('符咒燃烧效果','Talisman burning effect')],['729:149',L('燃烧与溶解材质参数','Burn and dissolve controls')]]) + '</section>' +
      '<section class="lycoris-effect"><h3>' + L('血液管线','Blood Pipeline') + '</h3>' + summary(L('将直管与弯头组合成管线，以 ASE 制作流动效果，并暴露 Direction 参数，由管线组脚本控制流向。','Straight pipes and elbows form the pipeline. An ASE material creates the flow, with a Direction parameter controlled by the pipe-group script.')) + shots([['717:741',L('管线流动效果','Pipeline flow effect')],['729:159',L('管线方向与脚本控制','Pipeline direction and script controls')]]) + '</section>');
    html += chapter('animation',L('角色动画与灵魂切换','Character Animation & Soul Transition'),'Mixamo · Animator · Dissolve',
      summary(L('使用 Mixamo 绑定角色并调整动画，编写衔接代码，与主程序实现的角色机制整合。角色变化需要两套模型与四个动画控制器，肉身与灵魂的过渡通过溶解 Shader 表现。','I rigged the character with Mixamo, adjusted the animations and wrote integration code for the lead programmer’s character mechanics. Two models and four animation controllers support character changes, while a dissolve shader visualizes body-to-soul transitions.')) +
      shots([['660:231',L('角色绑定与动画调整','Character rigging and animation adjustments')],['660:232',L('角色溶解与切换实现','Character dissolve and transition implementation')]]));
    html += chapter('production',L('白盒到场景的制作流程','From Whitebox to Environment'),'Unity · Branch Workflow · Team of 7',
      summary(L('玩法程序与主策划在 Design 分支验证原型，我独立搭建带光照的美术场景，再将资产与定稿后的关卡白盒整合。作为项目经理，我同时负责周会、反馈整理与进度调整。','The gameplay programmer and lead designer validated the prototype in the Design branch. I independently built and lit the art environment, then integrated the assets with the finalized level whitebox. As project manager, I also handled weekly meetings, feedback and schedule adjustments.')) +
      shots([['660:123',L('关卡白盒','Level whitebox')],['716:614',L('美术场景与关卡整合','Art environment and level integration')]]) +
      '<p class="lycoris-trailer"><a class="dream-doc-link" href="https://www.youtube.com/watch?v=Gen78RAZ3zE" target="_blank" rel="noopener">' + L('观看团队项目预告片','Watch the team project trailer') + ' ↗</a></p>');
    return html + '</section>';
  }
  window.LycorisCaseStudy = {render:render};
})();
