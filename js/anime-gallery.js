(function () {
  'use strict';
  var P = window.PV, works = P.works(), grid = document.getElementById('pvGrid');
  var filters = document.getElementById('pvFilters'), toggle = document.getElementById('animePreviewToggle');
  var labels = {all:['全部','All'],shader:['Shader','Shaders'],pcg:['程序化生成','PCG'],render:['渲染','Rendering'],tool:['工具','Tools'],code:['代码','Code']};
  var categories = Object.keys(labels).filter(function(c){return c==='all'||works.some(function(w){return w.category===c;});});
  var cat = new URLSearchParams(location.search).get('cat') || 'all', selected = 0, shown = [];
  if(categories.indexOf(cat)<0)cat='all';
  var filterTimer, reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var autoplayEnabled = !reduce.matches, visible = new Set();
  function L(zh,en){return P.lang()==='zh'?zh:en;}
  // Song-select layout on every screen: a stage previews the selected work, the list stays
  // compact. PC / iPad: stage left, list right. Phone: stage pinned on top, list below.
  var wide = matchMedia('(min-width: 761px)'), layoutEl = document.querySelector('.anime-works-layout');
  layoutEl.classList.add('anime-stage-layout');
  var stage = document.createElement('aside');stage.className='anime-stage';
  stage.innerHTML='<div class="anime-stage-media"><img alt=""><video muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video></div><div class="anime-stage-copy"></div>';
  layoutEl.insertBefore(stage, layoutEl.firstChild);
  var stageMedia=stage.querySelector('.anime-stage-media'), stageImg=stageMedia.querySelector('img'), stageVideo=stageMedia.querySelector('video'), stageCopy=stage.querySelector('.anime-stage-copy'), stageVisible=false;
  stageMedia.appendChild(toggle);
  stageVideo.addEventListener('playing',function(){stageMedia.classList.add('is-playing');});
  stageVideo.addEventListener('error',function(){stageMedia.classList.remove('is-playing');});
  function paintStage(id){
    var w=works[id],d=w.detail||{},clip=P.clip(w),zh=P.lang()==='zh';
    var category=labels[w.category]?labels[w.category][zh?0:1]:'';
    var meta=[d.year,d.tools,d.platform].filter(Boolean).map(function(v){return P.esc(P.t(v));}).join(' · ');
    stageMedia.classList.remove('is-playing');stageVideo.pause();stageVideo.removeAttribute('src');stageVideo.load();
    stageVideo.dataset.src=clip?clip.src:'';stageVideo.poster=clip?clip.poster:w.image;
    stageImg.classList.remove('is-in');void stageImg.offsetWidth;stageImg.src=clip?clip.poster:w.image;stageImg.classList.add('is-in');
    stageCopy.innerHTML='<span class="anime-stage-tag">'+P.esc(category)+' · '+P.esc(P.t(CONFIG.workGroupNames[w.group]))+'</span>'+
      '<h3>'+P.esc(P.t(w.title))+'</h3><span class="anime-stage-secondary">'+P.esc(w.title[zh?'en':'zh'])+'</span>'+
      '<p>'+P.esc(P.t(d.overview)||P.t(w.desc))+'</p>'+(meta?'<small>'+meta+'</small>':'')+
      '<a class="anime-button anime-stage-open" href="work.html?id='+id+'" data-featured-work="'+id+'">'+L('查看作品 →','View project →')+'</a>';
    syncPlayback();
  }
  new IntersectionObserver(function(es){stageVisible=es[0].isIntersecting;syncPlayback();},{threshold:.2}).observe(stageMedia);
  function media(w){
    var clip=P.clip(w), poster=clip?clip.poster:w.image;
    return '<span class="anime-row-media"><img src="'+P.esc(poster)+'" alt="" loading="lazy">'+
      (clip?'<video data-src="'+P.esc(clip.src)+'" poster="'+P.esc(poster)+'" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>':'')+'</span>';
  }
  function stop(root){root.querySelectorAll('video').forEach(function(v){v.pause();v.removeAttribute('src');v.load();});}
  function syncPlayback(){
    var allowed=autoplayEnabled&&!document.hidden&&!document.body.classList.contains('dream-preview-open');
    if(allowed&&stageVisible&&stageVideo.dataset.src){if(stageVideo.getAttribute('src')!==stageVideo.dataset.src)stageVideo.src=stageVideo.dataset.src;stageVideo.play().catch(function(){stageMedia.classList.remove('is-playing');});}
    else stageVideo.pause();
    grid.querySelectorAll('.anime-row-media').forEach(function(root){
      var v=root.querySelector('video');if(!v)return;
      if(false){
        if(!v.getAttribute('src'))v.src=v.dataset.src;
        v.muted=true;v.play().catch(function(){root.classList.remove('is-playing');});
      }else v.pause();
    });
  }
  function updateToggle(){
    toggle.textContent=autoplayEnabled?L('暂停预览','Pause previews'):L('播放预览','Play previews');
    toggle.setAttribute('aria-pressed',String(autoplayEnabled));
  }
  function select(id){
    if(!works[id])return;selected=id;
    grid.querySelectorAll('[data-work]').forEach(function(row){row.classList.toggle('is-selected',Number(row.dataset.work)===id);});
    paintStage(id);
    document.dispatchEvent(new CustomEvent('anime:preview',{detail:{image:works[id].image}}));
  }
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){if(entry.isIntersecting&&entry.intersectionRatio>=.15)visible.add(entry.target);else visible.delete(entry.target);});
    syncPlayback();
  },{threshold:[0,.15]});
  function render(){
    observer.disconnect();visible.clear();stop(grid);
    shown=works.map(function(w,i){return {w:w,id:i};}).filter(function(item){return cat==='all'||item.w.category===cat;});
    document.getElementById('animeSecondary').textContent=P.t(CONFIG.name.subtitle);
    document.getElementById('animeUniversity').textContent=L('犹他大学','UNIVERSITY OF UTAH');
    document.getElementById('animeBrowse').textContent=L('浏览作品 ↓','Browse works ↓');
    filters.setAttribute('aria-label',L('作品分类','Portfolio categories'));
    filters.innerHTML=categories.map(function(c,i){return '<button type="button" class="pv-fbtn'+(cat===c?' is-on':'')+'" data-cat="'+c+'" aria-pressed="'+(cat===c)+'">'+labels[c][P.lang()==='zh'?0:1]+'</button>';}).join('');
    var pct=categories.length>1?categories.indexOf(cat)/(categories.length-1)*100:0;
    document.querySelector('.anime-slider i').style.width=pct+'%';document.querySelector('.anime-slider b').style.left=pct+'%';
    grid.innerHTML=shown.map(function(item){var w=item.w,i=item.id;return '<li><a class="anime-work-row" href="work.html?id='+i+'" data-work="'+i+'"><span class="anime-work-title"><strong>'+P.esc(P.t(w.title))+'</strong><small>'+P.esc(w.title[P.lang()==='zh'?'en':'zh'])+'</small></span><span class="anime-work-group">'+P.esc(P.t(CONFIG.workGroupNames[w.group]))+'</span>'+media(w)+'</a></li>';}).join('');
    grid.querySelectorAll('.anime-row-media').forEach(function(root){
      var v=root.querySelector('video');if(v){v.addEventListener('playing',function(){root.classList.add('is-playing');});v.addEventListener('error',function(){root.classList.remove('is-playing');});}
      observer.observe(root);
    });
    updateToggle();
    if(shown.length)select(shown.some(function(item){return item.id===selected;})?selected:shown[0].id);
  }
  function choose(c,focus){
    if(categories.indexOf(c)<0)return;if(c!==cat)document.dispatchEvent(new CustomEvent('anime:category',{detail:{category:c}}));cat=c;
    var url=new URL(location.href);if(c==='all')url.searchParams.delete('cat');else url.searchParams.set('cat',c);
    history.replaceState(history.state,'',url.pathname+url.search+url.hash);var layout=document.querySelector('.anime-works-layout');clearTimeout(filterTimer);layout.classList.add('is-switching');filterTimer=setTimeout(function(){render();layout.classList.remove('is-switching');if(focus){var b=filters.querySelector('[data-cat="'+c+'"]');if(b)b.focus({preventScroll:true});}},reduce.matches?0:160);
  }
  toggle.addEventListener('click',function(){autoplayEnabled=!autoplayEnabled;updateToggle();syncPlayback();});
  filters.addEventListener('click',function(e){var b=e.target.closest('[data-cat]');if(b)choose(b.dataset.cat,true);});
  grid.addEventListener('pointerover',function(e){if(e.pointerType==='touch')return;var row=e.target.closest('[data-work]');if(row&&Number(row.dataset.work)!==selected)select(Number(row.dataset.work));});
  // Same rule everywhere, like picking a song: the first tap on a work selects and previews it,
  // tapping the selected work (or the stage button) opens it. A mouse hover already selects.
  grid.addEventListener('click',function(e){var row=e.target.closest('[data-work]');if(!row||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;var id=Number(row.dataset.work);
    // Touch (iPad / phone): only a work already previewed by an earlier tap opens; the first tap
    // always previews, even for the work that is selected by default. Mouse: hover already previews.
    if(lastPointer==='touch'||lastPointer==='pen'){if(armed===id)return;armed=id;}else if(id===selected)return;
    e.preventDefault();e.stopPropagation();select(id);if(!wide.matches)stage.scrollIntoView({block:'nearest',behavior:reduce.matches?'auto':'smooth'});},true);
  // Focus from a tap/click must not pre-select, or the first tap would open instead of preview.
  var pointerAt=0,lastPointer='mouse',armed=null;grid.addEventListener('pointerdown',function(e){pointerAt=performance.now();lastPointer=e.pointerType||'mouse';},true);
  grid.addEventListener('focusin',function(e){if(performance.now()-pointerAt<800)return;var row=e.target.closest('[data-work]');if(row&&Number(row.dataset.work)!==selected)select(Number(row.dataset.work));});
  // All entries open the shared detail view on the first click or tap.
  document.addEventListener('click',function(e){var a=e.target.closest('[data-featured-work]');if(!a||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;var row=grid.querySelector('[data-work="'+Number(a.dataset.featuredWork)+'"]');if(row){e.preventDefault();row.click();}},true);
  addEventListener('keydown',function(e){if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT|VIDEO/.test(e.target.tagName)||e.target.isContentEditable)return;if(wide.matches&&stageVisible&&(e.key==='ArrowDown'||e.key==='ArrowUp'||(e.key==='Enter'&&e.target===document.body))){var at=shown.map(function(x){return x.id;}).indexOf(selected);if(at<0)return;e.preventDefault();if(e.key==='Enter'){var open=grid.querySelector('[data-work="'+selected+'"]');if(open)open.click();return;}var nx=shown[Math.max(0,Math.min(shown.length-1,at+(e.key==='ArrowDown'?1:-1)))];if(nx&&nx.id!==selected){select(nx.id);var r=grid.querySelector('[data-work="'+nx.id+'"]');if(r)r.scrollIntoView({block:'nearest',behavior:reduce.matches?'auto':'smooth'});}return;}var n=Number(e.key);if(n>=1&&n<=categories.length){e.preventDefault();choose(categories[n-1],true);}else if(e.key.toLowerCase()==='q'||e.key.toLowerCase()==='e'){e.preventDefault();choose(categories[(categories.indexOf(cat)+(e.key.toLowerCase()==='q'?-1:1)+categories.length)%categories.length],true);}});
  addEventListener('popstate',function(){var c=new URLSearchParams(location.search).get('cat')||'all';if(c!==cat)choose(categories.indexOf(c)<0?'all':c,false);});
  document.addEventListener('visibilitychange',syncPlayback);
  new MutationObserver(syncPlayback).observe(document.body,{attributes:true,attributeFilter:['class']});
  wide.addEventListener('change',syncPlayback);
  reduce.addEventListener('change',function(){autoplayEnabled=!reduce.matches;updateToggle();syncPlayback();});
  P.onLang(render);render();
})();
