(function () {
  'use strict';
  var P = window.PV, W = P.works(), grid = document.getElementById('pvGrid');
  var filters = document.getElementById('pvFilters'), result = document.getElementById('dreamResult');
  var categories = {all:['全部','All'],shader:['Shader','Shaders'],pcg:['程序化生成','PCG'],render:['渲染','Rendering'],tool:['工具','Tools'],code:['代码','Code']};
  var cat = new URLSearchParams(location.search).get('cat') || 'all';
  if (!categories[cat] || (cat !== 'all' && !W.some(function(w){return w.category === cat;}))) cat = 'all';
  function render(){
    var zh = P.lang() === 'zh', count = 0;
    document.getElementById('dreamNameSecondary').textContent = P.t(CONFIG.name.subtitle);
    document.getElementById('dreamRole').textContent = zh ? 'technical artist · 技术美术师' : 'technical artist';
    var toggle = document.getElementById('langToggle'); if(toggle)toggle.textContent = zh ? '中 · EN' : 'ZH · EN';
    document.getElementById('dreamCollectionLabel').textContent = 'the collection';
    filters.innerHTML = Object.keys(categories).filter(function(c){return c === 'all' || W.some(function(w){return w.category === c;});}).map(function(c){
      var n = c === 'all' ? W.length : W.filter(function(w){return w.category === c;}).length;
      return '<button type="button" class="pv-fbtn'+(cat === c?' is-on':'')+'" data-cat="'+c+'" aria-pressed="'+(cat === c)+'">'+categories[c][zh?0:1]+'<span class="dream-filter-count">'+n+'</span></button>';
    }).join('');
    grid.querySelectorAll('video').forEach(function(v){v.pause();v.removeAttribute('src');v.load();});
    grid.innerHTML = W.map(function(w,i){
      if(cat !== 'all' && w.category !== cat) return '';
      count++;
      var group = CONFIG.workGroupNames[w.group];
      var clip = P.clip(w), sigil={shader:'✦',pcg:'❋',render:'☾',tool:'⚜',code:'✧'}[w.category] || '✦';
      var media = '<div class="dream-cover"><div class="pv-media"><img src="'+P.esc(w.image)+'" alt="" loading="lazy" decoding="async">'+(clip?'<video src="'+P.esc(clip.src)+'" muted loop playsinline preload="none" poster="'+P.esc(w.image)+'"></video>':'')+'</div>'+Array(4).fill('<i class="dream-cover-corner"></i>').join('')+'</div>';
      return '<a class="pv-card pv-rise" href="work.html?id='+i+'" data-work="'+i+'" data-cat="'+P.esc(w.category)+'" style="--d:'+((count-1)%3)*70+'ms">'+media+'<div class="pv-card__body"><div><h3 class="pv-card__title">'+P.esc(P.t(w.title))+'</h3><span class="dream-card-secondary" lang="'+(zh?'en':'zh-CN')+'">'+P.esc(w.title[zh?'en':'zh'])+'</span></div><span class="dream-card-type">'+sigil+' '+P.esc(P.t(group))+'</span></div></a>';
    }).join('');
    grid.dataset.count = cat === 'all' ? '' : count;
    result.innerHTML = '<strong>'+(cat === 'all' ? (zh ? '全部作品' : 'All works') : categories[cat][zh?0:1])+'</strong><span>'+count+' '+(count===1?'work':'works')+'</span>'+(cat !== 'all'?'<button type="button">'+(zh?'显示全部 ✕':'Show all ✕')+'</button>':'');
    grid.querySelectorAll('.pv-card').forEach(function(card){
      var video=card.querySelector('video');if(!video)return;
      var play=function(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;video.muted=true;video.preload='auto';var playing=video.play();if(playing && playing.then)playing.then(function(){if(card.matches(':hover,:focus-within'))card.classList.add('is-previewing');else video.pause();}).catch(function(){});};
      var stop=function(){video.pause();try{video.currentTime=0;}catch(e){}card.classList.remove('is-previewing');};
      card.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')play();});card.addEventListener('pointerleave',stop);card.addEventListener('focusin',play);card.addEventListener('focusout',stop);
    });
    P.reveal(document);
  }
  function choose(c){ cat = c; var url = new URL(location.href); if(c === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat',c); history.replaceState(null,'',url.pathname+url.search); render(); var button=filters.querySelector('[data-cat="'+cat+'"]');if(button)button.focus({preventScroll:true}); }
  filters.addEventListener('click',function(e){var b = e.target.closest('[data-cat]'); if(b && b.dataset.cat !== cat) choose(b.dataset.cat);});
  result.addEventListener('click',function(e){if(e.target.closest('button')) choose('all');});
  addEventListener('popstate',function(){var c = new URLSearchParams(location.search).get('cat') || 'all';cat = categories[c]?c:'all';render();});
  addEventListener('pagehide',function(){try{sessionStorage.setItem('dream-scroll',String(scrollY));}catch(e){}});
  P.onLang(render); render();
  try{var y = +sessionStorage.getItem('dream-scroll'); if(y && document.referrer.includes('work.html')){grid.querySelectorAll('.pv-rise').forEach(function(el){el.classList.add('is-in');});requestAnimationFrame(function(){scrollTo(0,y);});}}catch(e){}
})();
