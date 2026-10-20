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
  function number(i){return String(i+1).padStart(2,'0');}
  function media(w){
    var clip=P.clip(w), poster=clip?clip.poster:w.image;
    return '<span class="anime-row-media"><img src="'+P.esc(poster)+'" alt="" loading="lazy">'+
      (clip?'<video data-src="'+P.esc(clip.src)+'" poster="'+P.esc(poster)+'" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>':'')+'</span>';
  }
  function stop(root){root.querySelectorAll('video').forEach(function(v){v.pause();v.removeAttribute('src');v.load();});}
  function syncPlayback(){
    var allowed=autoplayEnabled&&!document.hidden&&!document.body.classList.contains('dream-preview-open');
    grid.querySelectorAll('.anime-row-media').forEach(function(root){
      var v=root.querySelector('video');if(!v)return;
      if(allowed&&visible.has(root)){
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
    filters.innerHTML=categories.map(function(c,i){return '<button type="button" class="pv-fbtn'+(cat===c?' is-on':'')+'" data-cat="'+c+'" aria-pressed="'+(cat===c)+'"><small>'+String(i+1)+'</small>'+labels[c][P.lang()==='zh'?0:1]+'</button>';}).join('');
    var pct=categories.length>1?categories.indexOf(cat)/(categories.length-1)*100:0;
    document.querySelector('.anime-slider i').style.width=pct+'%';document.querySelector('.anime-slider b').style.left=pct+'%';
    grid.innerHTML=shown.map(function(item){var w=item.w,i=item.id;return '<li><a class="anime-work-row" href="work.html?id='+i+'" data-work="'+i+'"><span class="anime-work-no">'+number(i)+'</span><span class="anime-work-title"><strong>'+P.esc(P.t(w.title))+'</strong><small>'+P.esc(w.title[P.lang()==='zh'?'en':'zh'])+'</small></span><span class="anime-work-group">'+P.esc(P.t(CONFIG.workGroupNames[w.group]))+'</span>'+media(w)+'</a></li>';}).join('');
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
  grid.addEventListener('focusin',function(e){var row=e.target.closest('[data-work]');if(row&&Number(row.dataset.work)!==selected)select(Number(row.dataset.work));});
  // All entries open the shared detail view on the first click or tap.
  document.addEventListener('click',function(e){var a=e.target.closest('[data-featured-work]');if(!a||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;var row=grid.querySelector('[data-work="'+Number(a.dataset.featuredWork)+'"]');if(row){e.preventDefault();row.click();}},true);
  addEventListener('keydown',function(e){if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT|VIDEO/.test(e.target.tagName)||e.target.isContentEditable)return;var n=Number(e.key);if(n>=1&&n<=categories.length){e.preventDefault();choose(categories[n-1],true);}else if(e.key.toLowerCase()==='q'||e.key.toLowerCase()==='e'){e.preventDefault();choose(categories[(categories.indexOf(cat)+(e.key.toLowerCase()==='q'?-1:1)+categories.length)%categories.length],true);}});
  addEventListener('popstate',function(){var c=new URLSearchParams(location.search).get('cat')||'all';if(c!==cat)choose(categories.indexOf(c)<0?'all':c,false);});
  document.addEventListener('visibilitychange',syncPlayback);
  new MutationObserver(syncPlayback).observe(document.body,{attributes:true,attributeFilter:['class']});
  reduce.addEventListener('change',function(){autoplayEnabled=!reduce.matches;updateToggle();syncPlayback();});
  P.onLang(render);render();
})();
