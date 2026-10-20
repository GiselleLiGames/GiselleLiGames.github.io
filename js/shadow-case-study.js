(function () {
  'use strict';
  var stages = [
    {id:'childhood', title:{zh:'最初的概念设计',en:'The original childhood concept'}, node:'611:49', text:{zh:'小时候，我常常觉得余光里似乎有人出现，而它仿佛就长成这个样子。于是，我把这种感觉设计成一个 VR 怪物机制：它只在玩家的余光里出现，正视时就会消失。我用双摄像机检测它是否处在玩家 VR 头显的视觉边缘。',en:'As a child, I often thought I saw someone in the corner of my eye. This is what I imagined it looked like. I turned that feeling into a VR monster mechanic: it only appears in peripheral vision and disappears when looked at directly. I used two cameras to detect whether it was at the edge of the player’s view in the VR headset.'}},
    {id:'2021-first', title:{zh:'2021 · 第一次尝试',en:'2021 · First attempt'}, node:'611:45', text:{zh:'2021 年，我先用简化的方块人形尝试实现这个想法，探索黑色轮廓、噪点与身体消散的表现。',en:'In 2021, I first tried the idea on a simple block figure, exploring a black silhouette, noise and a dissolving body.'}},
    {id:'2021-second', title:{zh:'2021 · 第二次尝试',en:'2021 · Second attempt'}, node:'611:40', text:{zh:'随后，我换成更接近人体的人形继续尝试。轮廓和噪点有所变化，但整体仍偏向一个有实体的模型，离想象中的鬼影还有距离。',en:'I then tried a more human figure. The silhouette and noise changed, but it still felt like a solid model rather than the shadow I imagined.'}},
    {id:'rethink', title:{zh:'2025 · 重新思考概念',en:'2025 · Rethinking the concept'}, node:'611:32', text:{zh:'2025 年重新迭代时，我把重点放在“像隔着玻璃看见一个人”的感觉上：身体轮廓柔软、虚实不均，伸向镜头的手比身体更容易辨认。',en:'In the 2025 iteration, I returned to the feeling of seeing a person through glass: a soft silhouette, uneven solidity, and a reaching hand that is easier to read than the body.'}},
    {id:'too-solid', title:{zh:'再次迭代 · 仍然太实',en:'Another iteration · Still too solid'}, video:'assets/uploads/ShadowMan_Remaster.mp4', poster:'assets/clips/shadow-man.webp', text:{zh:'这一版尝试用细颗粒和虚实变化表现身体，但结果仍然太实。它让我意识到，除了本体材质，还需要处理轮廓与画面中的模糊关系。',en:'This version explored fine grain and changes in solidity, but the result still felt too solid. I needed to work on the silhouette and its blur in the image, as well as the mesh material.'}},
    {id:'latest', title:{zh:'最新进展 · 后处理模糊与 AI 辅助',en:'Latest progress · Post-process blur and AI assistance'}, text:{zh:'最后，我尝试用后处理高斯模糊表现鬼影，并用 AI 辅助概念图与模型生成，再修整手部和绑定。身体保持黑灰色，以 Dither 控制虚实；身体与前伸的手使用不同的模糊强度，让按住玻璃的姿态更清楚。',en:'Finally, I tried post-process Gaussian blur and AI-assisted concept and model generation, then repaired the hand and rig. The figure stays black and gray, with dither controlling its solidity. Different blur strengths on the body and reaching hand make the glass-pressing pose clearer.'}}
  ];
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function text(s,lang){return s[lang]||s.en;}
  function render(work,lang){
    return stages.map(function(s,i){
      var latest=i===stages.length-1, m=s.node && (window.CaseStudyMedia||{})[s.node];
      var current=latest && (work.links||[]).filter(function(l){return l.type==='video';})[0];
      var video=current?current.href:s.video, poster=current?(current.poster||work.image):s.poster;
      var media=m?'<figure class="shadow-progress-media"><button class="pv-page-img" type="button" data-full-image="'+esc(m.full)+'" aria-label="'+esc(text(s.title,lang))+'"><img src="'+esc(m.src)+'" alt="'+esc(text(s.title,lang))+'" width="'+m.width+'" height="'+m.height+'" loading="lazy"></button></figure>':video?'<figure class="pbr-demo"><video controls playsinline loop preload="none" poster="'+esc(poster)+'" src="'+esc(video)+'"></video></figure>':'';
      var extra=latest?'<h3>'+(lang==='zh'?'本次制作流程':'Current workflow')+'</h3><p>'+(lang==='zh'?'AI 概念图 → 本地混元重建 → 自动拓扑重建 → 基础骨骼绑定 → 手部修整 → Shader 与特效整合。':'AI concept → local Hunyuan3D reconstruction → automatic topology rebuilding → basic rigging → hand repair → shader and VFX integration.')+'</p><p>'+(lang==='zh'?'角色共 4,998 三角面、20 根骨骼，使用 UE5.6 Forward Shading。':'4,998 character triangles and 20 bones, rendered with UE5.6 Forward Shading.')+'</p>':'';
      var labels=lang==='zh'?['最初概念','第一次','第二次','第三次','第四次','最新进展']:['Original concept','First','Second','Third','Fourth','Latest progress'];
      return '<section class="pbr-section shadow-progress" id="shadow-'+s.id+'" data-outline-label="'+esc(labels[i])+'"><header class="pbr-section-head"><div><h2>'+esc(text(s.title,lang))+'</h2></div></header><div class="dream-prose"><p>'+esc(text(s.text,lang))+'</p>'+media+extra+'</div></section>';
    }).join('');
  }
  window.ShadowCaseStudy={has:function(w){return (w.links||[]).some(function(l){return l.href==='assets/uploads/ShadowMan_Remaster.mp4';});},render:render};
})();
