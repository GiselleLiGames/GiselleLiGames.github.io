(function () {
  'use strict';
  var P = window.PV, works = P.works(), grid = document.getElementById('pvGrid');
  var filters = document.getElementById('pvFilters'), preview = document.getElementById('animePreview');
  var labels = {all:['全部','All'],shader:['着色器','Shaders'],pcg:['程序化生成','PCG'],render:['渲染','Rendering'],tool:['工具','Tools'],code:['代码','Code']};
  var categories = Object.keys(labels).filter(function(c){return c==='all'||works.some(function(w){return w.category===c;});});
  var cat = new URLSearchParams(location.search).get('cat') || 'all', selected = 0, shown = [];
  if(categories.indexOf(cat)<0)cat='all';
  var filterTimer;var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  function L(zh,en){return P.lang()==='zh'?zh:en;}
  function number(i){return String(i+1).padStart(2,'0');}
  function media(w,autoplay){var clip=P.clip(w);return '<img class="is-visible" src="'+P.esc(w.image)+'" alt="">'+(clip && !reduce.matches?'<video src="'+P.esc(clip.src)+'" poster="'+P.esc(w.image)+'" muted loop playsinline preload="none"'+(autoplay?' autoplay':'')+'></video>':'');}
  function stop(root){root.querySelectorAll('video').forEach(function(v){v.pause();v.removeAttribute('src');v.load();});}
  function play(root){root.querySelectorAll('video').forEach(function(v){v.muted=true;if(!reduce.matches && !document.hidden && !document.body.classList.contains('dream-preview-open'))v.play().catch(function(){});});}
  function select(id){
    if(!works[id])return; var previous=preview.querySelector('.anime-preview-media img');previous=previous?previous.cloneNode(true):null;selected=id; var w=works[id];stop(preview);
    grid.querySelectorAll('[data-work]').forEach(function(row){row.classList.toggle('is-selected',Number(row.dataset.work)===id);});
    preview.innerHTML='<a class="anime-preview-media" href="work.html?id='+id+'" data-preview-work="'+id+'" aria-label="'+P.esc(P.t(w.title))+'">'+media(w,false)+'<span class="anime-preview-no">'+number(id)+'</span></a><div class="anime-preview-copy"><div><small>'+P.esc(labels[w.category]?labels[w.category][P.lang()==='zh'?0:1]:w.category)+' · '+P.esc(P.t(CONFIG.workGroupNames[w.group]))+'</small><p>'+P.esc(P.t(w.desc))+'</p></div><a class="anime-button" data-preview-work="'+id+'" href="work.html?id='+id+'">'+L('打开','Open')+' →</a></div>';
    if(previous && !reduce.matches){var next=preview.querySelector('.anime-preview-media img');next.classList.remove('is-visible');preview.querySelector('.anime-preview-media').appendChild(previous);requestAnimationFrame(function(){next.classList.add('is-visible');previous.classList.add('is-outgoing');setTimeout(function(){previous.remove();},340);});}if(innerWidth>=1000)play(preview);
    document.dispatchEvent(new CustomEvent('anime:preview',{detail:{image:w.image}}));
  }
  function render(){
    stop(grid);shown=works.map(function(w,i){return {w:w,id:i};}).filter(function(item){return cat==='all'||item.w.category===cat;});
    document.getElementById('animeSecondary').textContent=P.t(CONFIG.name.subtitle);
    document.getElementById('animeUniversity').textContent=L('犹他大学','UNIVERSITY OF UTAH');
    document.getElementById('animeBrowse').textContent=L('浏览作品 ↓','Browse works ↓');
    filters.setAttribute('aria-label',L('作品分类','Portfolio categories'));
    filters.innerHTML=categories.map(function(c,i){return '<button type="button" class="pv-fbtn'+(cat===c?' is-on':'')+'" data-cat="'+c+'" aria-pressed="'+(cat===c)+'"><small>'+String(i+1)+'</small>'+labels[c][P.lang()==='zh'?0:1]+'</button>';}).join('');
    var pct=categories.length>1?categories.indexOf(cat)/(categories.length-1)*100:0;
    document.querySelector('.anime-slider i').style.width=pct+'%';document.querySelector('.anime-slider b').style.left=pct+'%';
    grid.innerHTML=shown.map(function(item){var w=item.w,i=item.id;return '<li><a class="anime-work-row" href="work.html?id='+i+'" data-work="'+i+'"><span class="anime-work-no">'+number(i)+'</span><span class="anime-work-title"><strong>'+P.esc(P.t(w.title))+'</strong><small>'+P.esc(w.title[P.lang()==='zh'?'en':'zh'])+'</small></span><span class="anime-work-group">'+P.esc(P.t(CONFIG.workGroupNames[w.group]))+'</span><img class="anime-row-image" src="'+P.esc(w.image)+'" alt="" loading="lazy"></a></li>';}).join('');
    var featured=document.getElementById('animeFeatured');stop(featured);featured.setAttribute('aria-label',L('打开精选作品：','Open featured work: ')+P.t(works[0].title));
    featured.innerHTML='<span class="anime-featured-inner">'+media(works[0],false)+'<span class="anime-featured-label"><small>FEATURED</small>'+P.esc(P.t(works[0].title))+'</span></span>';
    if(shown.length)select(shown.some(function(item){return item.id===selected;})?selected:shown[0].id);
    observeVisibility();
  }
  function choose(c,focus){
    if(categories.indexOf(c)<0)return;cat=c;
    var url=new URL(location.href);if(c==='all')url.searchParams.delete('cat');else url.searchParams.set('cat',c);
    history.replaceState(history.state,'',url.pathname+url.search+url.hash);var layout=document.querySelector('.anime-works-layout');clearTimeout(filterTimer);layout.classList.add('is-switching');filterTimer=setTimeout(function(){render();layout.classList.remove('is-switching');if(focus){var b=filters.querySelector('[data-cat="'+c+'"]');if(b){b.focus({preventScroll:true});b.classList.add('is-key-active');setTimeout(function(){b.classList.remove('is-key-active');},350);}}},reduce.matches?0:160);
  }
  filters.addEventListener('click',function(e){var b=e.target.closest('[data-cat]');if(b)choose(b.dataset.cat,true);});
  grid.addEventListener('pointerover',function(e){if(e.pointerType==='touch')return;var row=e.target.closest('[data-work]');if(row && Number(row.dataset.work)!==selected)select(Number(row.dataset.work));});
  grid.addEventListener('focusin',function(e){var row=e.target.closest('[data-work]');if(row && Number(row.dataset.work)!==selected)select(Number(row.dataset.work));});
  // Send every project entry through the existing shared detail view.
  document.addEventListener('click',function(e){var a=e.target.closest('[data-featured-work],[data-preview-work]');if(!a||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;var id=Number(a.dataset.featuredWork || a.dataset.previewWork),row=grid.querySelector('[data-work="'+id+'"]');if(row){e.preventDefault();row.click();}},true);
  addEventListener('keydown',function(e){if(e.defaultPrevented || e.ctrlKey||e.metaKey||e.altKey || document.querySelector('dialog[open]') || /INPUT|TEXTAREA|SELECT|VIDEO/.test(e.target.tagName)||e.target.isContentEditable)return;var n=Number(e.key);if(n>=1&&n<=categories.length){e.preventDefault();choose(categories[n-1],true);}else if(e.key.toLowerCase()==='q'||e.key.toLowerCase()==='e'){e.preventDefault();choose(categories[(categories.indexOf(cat)+(e.key.toLowerCase()==='q'?-1:1)+categories.length)%categories.length],true);}});
  addEventListener('popstate',function(){var c=new URLSearchParams(location.search).get('cat')||'all';if(c!==cat)choose(categories.indexOf(c)<0?'all':c,false);});
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){var v=entry.target.querySelector('video');if(!v)return;if(entry.isIntersecting)play(entry.target);else v.pause();});},{threshold:.05});
  function observeVisibility(){observer.disconnect();observer.observe(document.getElementById('animeFeatured'));observer.observe(preview);}
  document.addEventListener('visibilitychange',function(){if(document.hidden){document.querySelectorAll('.anime-featured video,.anime-preview video').forEach(function(v){v.pause();});}else observeVisibility();});
  reduce.addEventListener('change',render);
  P.onLang(render);render();
})();
