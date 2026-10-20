(function(){
  'use strict';
  // One detail view shared by the gallery dialog and direct project URLs.
  var shell="  <nav class=\"pv-subbar\" id=\"dreamSubbar\" aria-label=\"Project navigation\"></nav>\n  <main class=\"pv-shell\" id=\"pvMain\"></main>\n  <footer><button type=\"button\" class=\"lang-toggle\" data-detail-lang aria-label=\"切换语言\">中 · EN</button><span data-i18n=\"footer.copy\">© 2026 Hanqing Li · All rights reserved</span><a href=\"mailto:kyuandart@gmail.com\">kyuandart@gmail.com</a></footer>\n  <div class=\"dream-zoom\" id=\"dreamZoom\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"dreamZoomTitle\" hidden>\n    <div class=\"dream-zoom-toolbar\"><span id=\"dreamZoomTitle\"></span><div><button data-zoom=\"out\" aria-label=\"Zoom out\">−</button><button data-zoom=\"reset\" aria-label=\"Reset zoom\">100%</button><button data-zoom=\"in\" aria-label=\"Zoom in\">+</button><button data-zoom=\"close\">关闭 · Esc</button></div></div>\n    <div class=\"dream-zoom-stage\"><img alt=\"\" draggable=\"false\"><span class=\"dream-zoom-hint\"></span></div>\n  </div>\n";
  function mount(root, initialId, options){
  options=options || {};
  root.insertAdjacentHTML('beforeend', shell);
  if(root===document.body)root.querySelector('[data-detail-lang]').id='langToggle';
  var P = window.PV, W = P.works(), main = root.querySelector('#pvMain'), id=initialId;
  function stop(){main.querySelectorAll('video').forEach(function(v){v.pause();v.removeAttribute('src');v.load();});}
  function navigate(next){if(options.navigate)options.navigate(next);else location.href='work.html?id='+next+'&lang='+P.lang();}
  var zoom = root.querySelector('#dreamZoom'), stage = zoom.querySelector('.dream-zoom-stage'), image = stage.querySelector('img');
  var scale = 1, tx = 0, ty = 0, drag = null, returnFocus = null, previousOverflow = '';
  function L(zh,en){return P.lang()==='zh'?zh:en;}
  function caption(v){return P.esc(P.t(v.title || v.label).replace(/[→↗]/g,'').trim());}
  function poster(w,v){return v.poster || w.image || (P.clip(w)||{}).poster || '';}
  function player(w,v){return '<div class="pv-player"><video controls playsinline preload="'+(w.pdf==='assets/uploads/Project1_Compressed.pdf'?'metadata':'none')+'" poster="'+P.esc(poster(w,v))+'" src="'+P.esc(v.href)+'"></video></div>';}
  function section(num,title,body,id){return '<section class="dream-section" id="'+id+'"><div class="dream-section-heading"><i>'+num+'</i><h2>'+title+'</h2>'+(id==='gallery'?'<small>'+L('点击放大','Click to enlarge')+'</small>':'')+'</div><div class="dream-prose">'+body+'</div></section>';}
  var outlineObserver=null;
  function outlineOpen(aside,open){
    if(!aside)return;
    aside.classList.toggle('is-open',open);
    aside.querySelector('button').setAttribute('aria-expanded',String(open));
    aside.querySelector('nav').hidden=!open;
  }
  function readingLayout(){
    if(outlineObserver){outlineObserver.disconnect();outlineObserver=null;}
    var sections=Array.from(main.querySelectorAll('.dream-section[id],.fc-chapter[id],.pbr-section[id]')).filter(function(s){return s.querySelector('h2');});
    main.classList.toggle('has-outline',sections.length>0);
    if(!sections.length)return;
    main.querySelectorAll('.fc-index,.pbr-index').forEach(function(nav){nav.remove();});
    var layout=document.createElement('div'), aside=document.createElement('aside'), content=document.createElement('div');
    layout.className='dream-reading-layout';aside.className='dream-outline';content.className='dream-reading-content';
    var outlineId=root===document.body?'workOutline':'previewOutline';
    aside.innerHTML='<button class="dream-outline-toggle" type="button" aria-expanded="false" aria-controls="'+outlineId+'"><span aria-hidden="true">☰</span><span class="dream-outline-label">'+L('目录','Contents')+'</span></button><nav id="'+outlineId+'" aria-label="'+L('作品目录','Contents')+'" hidden>'+sections.map(function(s){return '<a href="#'+P.esc(s.id)+'">'+P.esc(s.querySelector('h2').textContent)+'</a>';}).join('')+'</nav>';
    aside.querySelector('button').addEventListener('click',function(){outlineOpen(aside,!aside.classList.contains('is-open'));});
    aside.querySelector('nav').addEventListener('click',function(e){if(e.target.closest('a'))outlineOpen(aside,false);});
    while(main.firstChild)content.appendChild(main.firstChild);
    layout.appendChild(aside);layout.appendChild(content);main.appendChild(layout);
    var links=Array.from(aside.querySelectorAll('a'));
    function current(id){links.forEach(function(a){if(a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
    current(sections[0].id);
    outlineObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting)current(entry.target.id);});},{root:root===document.body?null:root,rootMargin:'-80px 0px -55% 0px',threshold:0});
    sections.forEach(function(s){outlineObserver.observe(s);});
  }
  function nodeAtlas(atlas){
    if(!atlas)return '';
    var count=atlas.groups.reduce(function(total,group){return total+group.nodes.length;},0);
    return '<div class="dream-atlas-intro"><span>M_Floor</span><p>'+L('材质分为支持金属反射的 M_Floor 和去除金属反射的 M_Toon，按需使用以降低渲染开销。点击分区可放大查看。','Two material variants reduce rendering cost: M_Floor supports metallic reflections, while M_Toon omits them. Select a region to inspect the graph.')+'</p><small>'+count+' '+L('分区 · 点击放大','regions · Click to enlarge')+'</small></div><div class="dream-atlas">'+atlas.groups.map(function(group,i){
      return '<section class="dream-atlas-group"><header><span>0'+(i+1)+'</span><h3>'+P.esc(P.t(group.title))+'</h3><small>'+group.nodes.length+' '+L('图','views')+'</small></header><div class="dream-atlas-tiles">'+group.nodes.map(function(node){
        var label=P.esc(P.t(node.label)), revision=node.revision?'?v='+encodeURIComponent(node.revision):'', full=P.esc(atlas.base+node.file+revision), thumb=P.esc(atlas.base+node.file.replace(/\.png$/,'.webp')+revision);
        return '<button class="dream-atlas-tile pv-page-img" type="button" data-full-image="'+full+'" data-title="M_Floor · '+label+'" aria-label="'+L('放大：','Enlarge: ')+label+'"><img src="'+thumb+'" alt="'+label+'" loading="lazy" decoding="async" width="560" height="400"><span>'+label+'</span></button>';
      }).join('')+'</div></section>';
    }).join('')+'</div>';
  }
  function back(){try{var ref = new URL(document.referrer);if(ref.origin===location.origin && ref.pathname.endsWith('/portfolio.html'))return ref.pathname+ref.search;}catch(e){}return 'portfolio.html';}
  function render(){
    stop();
    var w = W[id];
    if(!w){main.innerHTML='<section class="pv-hero"><h1 class="pv-htitle" id="dreamDetailTitle" tabindex="-1">'+L('没有找到这个作品','Work not found')+'</h1><a class="dream-doc-link" href="portfolio.html">← '+L('返回作品集','Back to portfolio')+'</a></section>';return;}
    var d = w.detail || {}, isPBR=w.pdf==='assets/uploads/Project1_Compressed.pdf', videos = (w.links||[]).filter(function(v){return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(v.href||'');});
    if(isPBR) videos=[{href:'assets/clips/pbr-sections/final-scene.mp4',poster:'assets/clips/pbr-sections/final-scene.webp'}];
    var images = (w.links||[]).filter(function(v){return v.type==='image';}), docs = (w.links||[]).filter(function(v){return v.type==='docs' || v.type==='github' || v.type==='external';});
    var prev=(id-1+W.length)%W.length,next=(id+1)%W.length, zh=P.lang()==='zh', group=P.t(CONFIG.workGroupNames[w.group]);
    var facts = []; if(d.year)facts.push(['year',P.t(d.year)]);if(d.tools)facts.push(['tools',P.t(d.tools)]);if(d.platform)facts.push(['platform',P.t(d.platform)]);if(id!==0){facts.push(['type',group]);if(d.role)facts.push(['role',P.t(d.role)]);}
    document.title=P.t(w.title)+' | Hanqing Li · GiselleLi';
    root.querySelector('[data-i18n="footer.copy"]').textContent=L('© 2026 李涵清 · 保留所有权利',CONFIG.copyright);
    root.querySelector('[data-detail-lang]').textContent=P.lang()==='zh'?'中 · EN':'ZH · EN';
    var overview='<p>'+P.esc(P.t(d.overview)||P.t(w.desc))+'</p>'+(d.overview&&!isPBR?'<p>'+P.esc(P.t(w.desc))+'</p>':'')+'<div class="pv-tags">'+(w.tags||[]).map(function(t){return '<span class="pv-tag">'+P.esc(P.t(t))+'</span>';}).join('')+'</div>';
    ['goals','process'].forEach(function(key){if(d[key])overview+='<h3>'+ (key==='goals'?L('目标与挑战','Goals & challenges'):L('制作过程','Process'))+'</h3><ul>'+d[key].map(function(s){return '<li>'+P.esc(P.t(s))+'</li>';}).join('')+'</ul>';});
    if(d.results)overview+='<div class="pv-metrics">'+d.results.map(function(r){return '<p><strong>'+P.esc(r.value)+'</strong> '+P.esc(P.t(r.label))+'</p>';}).join('')+'</div>';
    var category={shader:['Shader','Shader'],pcg:['程序化生成','PCG'],render:['渲染','Rendering'],tool:['工具','Tools'],code:['代码','Code']}[w.category] || ['', ''];
    var documentLinks=docs.map(function(v){return '<a class="dream-doc-link" href="'+P.esc(v.href)+'" target="_blank" rel="noopener">'+caption(v)+' →</a>';}).join(' · ');
    var n=0, romans=['01','02','03','04','05'];
    root.querySelector('#dreamSubbar').innerHTML='<span class="anime-work-count">'+String(id+1).padStart(2,'0')+'<span> / '+String(W.length).padStart(2,'0')+'</span></span>';
    main.innerHTML=
      '<section class="pv-hero"><div><div class="pv-kicker">'+P.esc(category[zh?0:1])+' · '+P.esc(group)+'</div><h1 class="pv-htitle" id="dreamDetailTitle" tabindex="-1">'+P.esc(P.t(w.title))+'</h1><span class="dream-name-secondary" lang="'+(zh?'en':'zh-CN')+'">'+P.esc(w.title[zh?'en':'zh'])+'</span></div>'+(videos.length?player(w,videos[0]):'<div class="pv-player"><img src="'+P.esc(w.image)+'" alt="'+P.esc(P.t(w.title))+'" style="display:block;width:100%"></div>')+
      '<div class="pv-facts">'+facts.map(function(f){return '<div class="pv-fact"><small>'+f[0]+'</small><span>'+P.esc(f[1])+'</span></div>';}).join('')+'</div></section>'+
      section(romans[n++],L('概述','Overview'),overview,'overview')+
      (videos.length>1?section(romans[n++],L('视频','Videos'),'<div class="dream-media-grid">'+videos.slice(1).map(function(v,k){return '<figure>'+player(w,v)+'<figcaption><b>'+String(k+1).padStart(2,'0')+'</b>'+caption(v)+'</figcaption>'+(v.description?'<p>'+P.esc(P.t(v.description))+'</p>':'')+'</figure>';}).join('')+'</div>','video'):'')+
      (images.length?section(romans[n++],images.some(function(v){return /shader-graphs/.test(v.href);})?L('节点图','Node graphs'):L('图片','Images'),'<div class="dream-media-grid">'+images.map(function(v,k){return '<figure><button class="dream-graph pv-page-img" type="button" data-full-image="'+P.esc(v.href)+'" data-title="'+caption(v)+'" aria-label="'+L('放大：','Enlarge: ')+caption(v)+'"><img src="'+P.esc(v.href)+'" alt="'+caption(v)+'" loading="lazy"><span>⤢ '+L('放大','Enlarge')+'</span></button><figcaption><b>'+String(k+1).padStart(2,'0')+'</b>'+caption(v)+'</figcaption>'+(v.description?'<p>'+P.esc(P.t(v.description))+'</p>':'')+'</figure>';}).join('')+(documentLinks?'<div style="grid-column:1/-1;justify-self:start">'+documentLinks+'</div>':'')+'</div>','gallery'):'')+
      (d.nodeAtlas?section(romans[n++],L('材质拆解','Material breakdown'),nodeAtlas(d.nodeAtlas),'material-atlas'):'')+
      (docs.length && !images.length?'<p>'+documentLinks+'</p>':'')+
      (window.FigmaCaseStudy && FigmaCaseStudy.has(w)?FigmaCaseStudy.render(w,zh?'zh':'en'):'')+
      (w.pdf?'<p style="margin-block:40px"><a class="dream-doc-link" href="'+P.esc(w.pdf)+'" target="_blank" rel="noopener">'+L('打开原始 PDF','Open original PDF')+' ↗</a></p>':'')+
      '<nav class="dream-more" aria-label="'+L('更多作品','More works')+'">'+[prev,next].map(function(j,k){var v=W[j];return '<a href="work.html?id='+j+'"><img src="'+P.esc(v.image)+'" alt="" loading="lazy"><div><i>'+ (k?'next ›':'‹ previous')+'</i><strong>'+P.esc(P.t(v.title))+'</strong></div></a>';}).join('')+'</nav><a class="anime-detail-back" href="'+P.esc(back())+'">« '+L('返回','Back')+'</a>';
    readingLayout();
    P.reveal(main);
    zoom.querySelector('[data-zoom="close"]').textContent=L('关闭 · Esc','Close · Esc');
    zoom.querySelector('.dream-zoom-hint').textContent=L('滚轮缩放 · 拖动平移 · 双击放大 / 还原','Scroll to zoom · Drag to pan · Double-click to reset / enlarge');
  }
  function transform(){image.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')';stage.style.cursor=drag?'grabbing':scale>1?'grab':'zoom-in';zoom.querySelector('[data-zoom="reset"]').textContent=Math.round(scale*100)+'%';}
  function reset(){scale=1;tx=ty=0;transform();}
  function zoomBy(f,x,y){var s=Math.max(1,Math.min(10,scale*f)),k=s/scale;tx=(x||0)-((x||0)-tx)*k;ty=(y||0)-((y||0)-ty)*k;scale=s;if(scale===1){tx=ty=0;}transform();}
  function close(){zoom.hidden=true;document.documentElement.style.overflow=previousOverflow;image.removeAttribute('src');main.inert=false;root.querySelector('#dreamSubbar').inert=false;if(returnFocus && returnFocus.isConnected)returnFocus.focus({preventScroll:true});}
  root.addEventListener('click',function(e){var b=e.target.closest('.pv-page-img');if(!b)return;returnFocus=b;image.src=b.dataset.fullImage || b.querySelector('img').src;image.alt=b.dataset.title || b.querySelector('img').alt;root.querySelector('#dreamZoomTitle').textContent=image.alt;previousOverflow=document.documentElement.style.overflow;zoom.hidden=false;main.inert=true;root.querySelector('#dreamSubbar').inert=true;document.documentElement.style.overflow='hidden';reset();zoom.querySelector('[data-zoom="close"]').focus();});
  zoom.addEventListener('click',function(e){var b=e.target.closest('[data-zoom]');if(!b)return;var action=b.dataset.zoom;if(action==='close')close();else if(action==='reset')reset();else zoomBy(action==='in'?1.5:1/1.5);});
  stage.addEventListener('wheel',function(e){e.preventDefault();var r=stage.getBoundingClientRect();zoomBy(Math.exp(-e.deltaY*.0018),e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2);},{passive:false});
  stage.addEventListener('pointerdown',function(e){if(scale<=1)return;stage.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY};stage.style.cursor='grabbing';});
  stage.addEventListener('pointermove',function(e){if(!drag)return;tx+=e.clientX-drag.x;ty+=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY};transform();});
  ['pointerup','pointercancel','lostpointercapture'].forEach(function(type){stage.addEventListener(type,function(){drag=null;transform();});});
  stage.addEventListener('dblclick',function(e){if(scale>1)reset();else{var r=stage.getBoundingClientRect();zoomBy(3,e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2);}});
  root.addEventListener('keydown',function(e){
    if(e.key==='Escape' && root.querySelector('.dream-outline.is-open')){e.preventDefault();e.stopPropagation();var aside=root.querySelector('.dream-outline');outlineOpen(aside,false);aside.querySelector('button').focus();return;}
    if(!zoom.hidden){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}if(e.key==='+' || e.key==='=')zoomBy(1.4);if(e.key==='-')zoomBy(1/1.4);if(e.key==='Tab'){var bs=Array.from(zoom.querySelectorAll('button'));if(e.shiftKey && document.activeElement===bs[0]){e.preventDefault();bs[bs.length-1].focus();}else if(!e.shiftKey && document.activeElement===bs[bs.length-1]){e.preventDefault();bs[0].focus();}}return;}
    if(/INPUT|TEXTAREA|VIDEO|BUTTON/.test(document.activeElement.tagName) || document.activeElement.isContentEditable)return;
    if(id>=0 && id<W.length && (e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();navigate((id+(e.key==='ArrowRight'?1:-1)+W.length)%W.length);}
  });
  root.addEventListener('click',function(e){
    var openOutline=root.querySelector('.dream-outline.is-open');if(openOutline && !e.target.closest('.dream-outline'))outlineOpen(openOutline,false);
    if(e.target.closest('[data-detail-lang]')){window.toggleLang();return;}
    var a=e.target.closest('a[href]');if(!a || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button!==0)return;
    if(options.navigate && a.getAttribute('href').charAt(0)==='#'){
      var target=root.querySelector(a.getAttribute('href'));
      if(target){e.preventDefault();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
      return;
    }
    if(options.close && (a.classList.contains('anime-detail-back') || (a.closest('#dreamSubbar') && a===root.querySelector('#dreamSubbar a')))){e.preventDefault();options.close();return;}
    if(options.navigate && /work\.html\?id=/.test(a.getAttribute('href'))){e.preventDefault();navigate(Number(new URL(a.href).searchParams.get('id')));}
  });
  P.onLang(function(){if(!options.isActive || options.isActive())render();});
  render();
  return {show:function(next){if(!zoom.hidden)close();id=next;render();},stop:stop,closeZoom:function(){if(!zoom.hidden)close();}};
  }
  window.DreamWork={mount:mount};
  if(document.body.classList.contains('dream-work')){
    var raw=new URLSearchParams(location.search).get('id');
    mount(document.body,/^\d+$/.test(raw || '')?Number(raw):-1);
  }
})();
