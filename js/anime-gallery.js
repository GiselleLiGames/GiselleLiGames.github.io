(function () {
  'use strict';
  /* Works on the portfolio page: one section per portfolio, stacked — Technical Art first
     (the main one), Level Design below it, both in the same form. Each section is a
     "song select": a stage previews the selected work, next to a wall of image tiles so
     every work is visible at a glance. No numbering anywhere. */
  var P = window.PV, works = P.works();
  var labels = {all:['全部','All'],shader:['Shader','Shaders'],pcg:['程序化生成','PCG'],render:['渲染','Rendering'],tool:['工具','Tools'],design:['关卡设计','Level Design'],code:['代码','Code']};
  // A work can set `track` in config.js; otherwise level-design works go to 'level', the rest to 'ta'.
  var trackNames = {ta:['技术美术','Technical Art'],level:['关卡设计','Level Design']};
  function trackOf(w){return trackNames[w.track]?w.track:(w.category==='design'?'level':'ta');}
  var tracks = Object.keys(trackNames).filter(function(t){return works.some(function(w){return trackOf(w)===t;});});
  var reduce = matchMedia('(prefers-reduced-motion: reduce)'), wide = matchMedia('(min-width: 761px)');
  var autoplayEnabled = !reduce.matches, pointerAt = 0, lastPointer = 'mouse', sections = [], current = null;
  function L(zh,en){return P.lang()==='zh'?zh:en;}

  var first = document.getElementById('works');
  function shell(track, index){
    if(index===0){first.dataset.track=track;return first;}
    var el=document.createElement('section');el.className='anime-collection anime-collection-next';el.id='works-'+track;el.dataset.track=track;
    el.innerHTML='<div class="anime-collection-bar"><div class="anime-filter-wrap"><div class="pv-filters" role="group"></div><div class="anime-slider" aria-hidden="true"><i></i><b></b></div></div></div>'+
      '<button type="button" class="anime-preview-toggle" aria-pressed="true"></button><div class="anime-works-layout"><ol class="anime-work-list"></ol></div>';
    sections[index-1].el.after(el);return el;
  }

  function Section(track, index){
    var S=this, el=shell(track,index);
    S.track=track;S.el=el;S.bar=el.querySelector('.anime-collection-bar');S.filters=el.querySelector('.pv-filters');S.slider=el.querySelector('.anime-slider');
    S.layout=el.querySelector('.anime-works-layout');S.grid=el.querySelector('.anime-work-list');S.toggle=el.querySelector('.anime-preview-toggle');
    S.categories=Object.keys(labels).filter(function(c){return c==='all'||works.some(function(w){return trackOf(w)===track&&w.category===c;});});
    S.cat='all';S.selected=-1;S.shown=[];S.armed=null;S.stageVisible=false;
    S.bar.classList.add('has-tracks');S.layout.classList.add('anime-stage-layout');
    S.title=document.createElement('h2');S.title.className='anime-track-title';S.bar.insertBefore(S.title,S.bar.querySelector('.anime-filter-wrap'));
    S.stage=document.createElement('aside');S.stage.className='anime-stage';
    S.stage.innerHTML='<div class="anime-stage-media"><img alt=""><video muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video></div><div class="anime-stage-copy"></div>';
    S.layout.insertBefore(S.stage,S.layout.firstChild);
    S.media=S.stage.querySelector('.anime-stage-media');S.img=S.media.querySelector('img');S.video=S.media.querySelector('video');S.copy=S.stage.querySelector('.anime-stage-copy');
    S.media.appendChild(S.toggle);
    S.video.addEventListener('playing',function(){S.media.classList.add('is-playing');});
    S.video.addEventListener('error',function(){S.media.classList.remove('is-playing');});
    new IntersectionObserver(function(es){S.stageVisible=es[0].isIntersecting;syncPlayback();},{threshold:.35}).observe(S.media);
    S.toggle.addEventListener('click',function(){autoplayEnabled=!autoplayEnabled;sections.forEach(updateToggle);syncPlayback();});
    S.filters.addEventListener('click',function(e){var b=e.target.closest('[data-cat]');if(b)choose(S,b.dataset.cat,true);});
    el.addEventListener('pointerenter',function(){current=S;});
    var grid=S.grid;
    grid.addEventListener('pointerover',function(e){if(e.pointerType==='touch')return;var row=e.target.closest('[data-work]');if(row&&Number(row.dataset.work)!==S.selected)select(S,Number(row.dataset.work));});
    grid.addEventListener('pointerdown',function(e){pointerAt=performance.now();lastPointer=e.pointerType||'mouse';current=S;},true);
    // Same rule everywhere, like picking a song. Touch (iPad / phone): the first tap on a work
    // always previews it, tapping it again opens it. Mouse: hover already previews, a click opens.
    grid.addEventListener('click',function(e){var row=e.target.closest('[data-work]');if(!row||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;var id=Number(row.dataset.work);
      if(lastPointer==='touch'||lastPointer==='pen'){if(S.armed===id)return;S.armed=id;}else if(id===S.selected)return;
      e.preventDefault();e.stopPropagation();select(S,id);if(!wide.matches)S.stage.scrollIntoView({block:'nearest',behavior:reduce.matches?'auto':'smooth'});},true);
    // Focus from a tap/click must not pre-select, or the first tap would open instead of preview.
    grid.addEventListener('focusin',function(e){if(performance.now()-pointerAt<800)return;current=S;var row=e.target.closest('[data-work]');if(row&&Number(row.dataset.work)!==S.selected)select(S,Number(row.dataset.work));});
  }

  function paintStage(S,id){
    var w=works[id],d=w.detail||{},clip=P.clip(w),zh=P.lang()==='zh';
    var category=labels[w.category]?labels[w.category][zh?0:1]:'';
    var meta=[d.year,d.tools,d.platform].filter(Boolean).map(function(v){return P.esc(P.t(v));}).join(' · ');
    S.media.classList.remove('is-playing');S.video.pause();S.video.removeAttribute('src');S.video.load();
    S.video.dataset.src=clip?clip.src:'';S.video.poster=clip?clip.poster:w.image;
    S.img.classList.remove('is-in');void S.img.offsetWidth;S.img.src=clip?clip.poster:w.image;S.img.classList.add('is-in');
    S.copy.innerHTML='<span class="anime-stage-tag">'+P.esc(category)+' · '+P.esc(P.t(CONFIG.workGroupNames[w.group]))+'</span>'+
      '<h3>'+P.esc(P.t(w.title))+'</h3>'+(zh?'<span class="anime-stage-secondary" lang="en">'+P.esc(w.title.en)+'</span>':'')+
      '<p>'+P.esc(P.t(d.overview)||P.t(w.desc))+'</p>'+
      (w.credits?'<span class="anime-stage-credit">'+(w.credits.mine?'<span><b>'+L('我负责','My work')+'</b>'+P.esc(P.t(w.credits.mine))+'</span>':'')+(w.credits.others?'<span><b class="is-other">'+L('他人','Others')+'</b>'+P.esc(P.t(w.credits.others))+'</span>':'')+'</span>':'')+(meta?'<small>'+meta+'</small>':'')+
      '<a class="anime-button anime-stage-open" href="work.html?id='+id+'" data-featured-work="'+id+'">'+L('查看作品 →','View project →')+'</a>';
    syncPlayback();
  }
  function media(w){var clip=P.clip(w), poster=clip?clip.poster:w.image;return '<span class="anime-row-media"><img src="'+P.esc(poster)+'" alt="" loading="lazy"></span>';}
  // Only the stage that is on screen plays; with two on screen, the one being browsed wins.
  function syncPlayback(){
    var allowed=autoplayEnabled&&!document.hidden&&!document.body.classList.contains('dream-preview-open');
    var onScreen=sections.filter(function(S){return S.stageVisible;}), playing=onScreen.indexOf(current)>=0?current:onScreen[0];
    sections.forEach(function(S){
      if(allowed&&S===playing&&S.video.dataset.src){if(S.video.getAttribute('src')!==S.video.dataset.src)S.video.src=S.video.dataset.src;S.video.play().catch(function(){S.media.classList.remove('is-playing');});}
      else S.video.pause();
    });
  }
  function updateToggle(S){S.toggle.textContent=autoplayEnabled?L('暂停预览','Pause previews'):L('播放预览','Play previews');S.toggle.setAttribute('aria-pressed',String(autoplayEnabled));}
  function select(S,id,quiet){
    if(!works[id])return;S.selected=id;
    S.grid.querySelectorAll('[data-work]').forEach(function(row){row.classList.toggle('is-selected',Number(row.dataset.work)===id);});
    paintStage(S,id);
    if(!quiet)document.dispatchEvent(new CustomEvent('anime:preview',{detail:{image:works[id].image}}));
  }
  // PC / iPad: size the tiles so every work shows without scrolling — two big columns when
  // they fit, more columns (smaller tiles) only when the list gets long.
  function fit(S){
    var g=S.grid.style;
    if(!wide.matches){g.removeProperty('--tile-cols');g.removeProperty('--tile-h');return;}
    var n=S.shown.length, width=S.grid.clientWidth, room=Math.max(240,innerHeight-196), gap=8, cols=2, h=0;
    for(;cols<=4;cols++){var rows=Math.ceil(n/cols), w=(width-gap*(cols-1))/cols;h=Math.min(w*9/16,(room-gap*(rows-1))/rows);if(h>=w*.4||cols===4)break;}
    g.setProperty('--tile-cols',cols);g.setProperty('--tile-h',Math.floor(h)+'px');
  }
  function render(S,quiet){
    var zh=P.lang()==='zh';
    S.shown=works.map(function(w,i){return {w:w,id:i};}).filter(function(item){return trackOf(item.w)===S.track&&(S.cat==='all'||item.w.category===S.cat);});
    S.title.innerHTML=P.esc(trackNames[S.track][zh?0:1])+(zh?' <small lang="en">'+P.esc(trackNames[S.track][1].toUpperCase())+'</small>':'');
    S.el.setAttribute('aria-label',trackNames[S.track][zh?0:1]);
    // A portfolio with a single category needs no filter row.
    S.bar.querySelector('.anime-filter-wrap').hidden=S.categories.length<3;
    S.filters.setAttribute('aria-label',L('作品分类','Portfolio categories'));
    S.filters.innerHTML=S.categories.map(function(c){return '<button type="button" class="pv-fbtn'+(S.cat===c?' is-on':'')+'" data-cat="'+c+'" aria-pressed="'+(S.cat===c)+'">'+labels[c][zh?0:1]+'</button>';}).join('');
    var pct=S.categories.length>1?S.categories.indexOf(S.cat)/(S.categories.length-1)*100:0;
    S.slider.querySelector('i').style.width=pct+'%';S.slider.querySelector('b').style.left=pct+'%';
    S.grid.innerHTML=S.shown.map(function(item){var w=item.w,i=item.id;return '<li><a class="anime-work-row" href="work.html?id='+i+'" data-work="'+i+'"><span class="anime-work-title"><strong>'+P.esc(P.t(w.title))+'</strong>'+(zh?'<small lang="en">'+P.esc(w.title.en)+'</small>':'')+'</span><span class="anime-work-group">'+P.esc(P.t(CONFIG.workGroupNames[w.group]))+'</span>'+media(w)+'</a></li>';}).join('');
    updateToggle(S);fit(S);
    if(S.shown.length)select(S,S.shown.some(function(item){return item.id===S.selected;})?S.selected:S.shown[0].id,quiet);
  }
  function renderAll(){
    document.getElementById('animeSecondary').textContent=P.t(CONFIG.name.subtitle);
    document.getElementById('animeUniversity').textContent=L('犹他大学','UNIVERSITY OF UTAH');
    document.getElementById('animeBrowse').textContent=L('浏览作品 ↓','Browse works ↓');
    // Only the first portfolio announces its preview, so the page backdrop follows the main one.
    sections.forEach(function(S,i){render(S,i>0);});
  }
  var filterTimer;
  function choose(S,c,focus){
    if(S.categories.indexOf(c)<0)return;if(c!==S.cat)document.dispatchEvent(new CustomEvent('anime:category',{detail:{category:c}}));S.cat=c;S.armed=null;
    if(S===sections[0]){var url=new URL(location.href);if(c==='all')url.searchParams.delete('cat');else url.searchParams.set('cat',c);url.searchParams.delete('track');history.replaceState(history.state,'',url.pathname+url.search+url.hash);}
    clearTimeout(filterTimer);S.layout.classList.add('is-switching');
    filterTimer=setTimeout(function(){render(S);S.layout.classList.remove('is-switching');if(focus){var b=S.filters.querySelector('[data-cat="'+c+'"]');if(b)b.focus({preventScroll:true});}},reduce.matches?0:160);
  }

  tracks.forEach(function(t,i){sections.push(new Section(t,i));});
  current=sections[0];
  var initial=new URLSearchParams(location.search).get('cat');
  if(initial&&sections[0].categories.indexOf(initial)>=0)sections[0].cat=initial;

  // The stage button opens the shared detail view through its tile.
  document.addEventListener('click',function(e){var a=e.target.closest('[data-featured-work]');if(!a||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;var S=sections.filter(function(x){return x.el.contains(a);})[0];if(!S)return;var row=S.grid.querySelector('[data-work="'+Number(a.dataset.featuredWork)+'"]');if(row){e.preventDefault();lastPointer='mouse';S.selected=Number(a.dataset.featuredWork);row.click();}},true);
  // Arrow keys move through the portfolio being browsed, Enter opens; number keys switch its category.
  addEventListener('keydown',function(e){
    if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||/INPUT|TEXTAREA|SELECT|VIDEO/.test(e.target.tagName)||e.target.isContentEditable)return;
    var onScreen=sections.filter(function(S){return S.stageVisible;}), S=onScreen.indexOf(current)>=0?current:onScreen[0];if(!S)return;
    var step={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key];
    if(wide.matches&&(step||(e.key==='Enter'&&e.target===document.body))){
      var at=S.shown.map(function(x){return x.id;}).indexOf(S.selected);if(at<0)return;e.preventDefault();
      if(e.key==='Enter'){var open=S.grid.querySelector('[data-work="'+S.selected+'"]');if(open){lastPointer='mouse';open.click();}return;}
      var nx=S.shown[Math.max(0,Math.min(S.shown.length-1,at+step))];
      if(nx&&nx.id!==S.selected){select(S,nx.id);var r=S.grid.querySelector('[data-work="'+nx.id+'"]');if(r)r.scrollIntoView({block:'nearest',behavior:reduce.matches?'auto':'smooth'});}
      return;
    }
    var n=Number(e.key);
    if(n>=1&&n<=S.categories.length&&S.categories.length>2){e.preventDefault();choose(S,S.categories[n-1],false);var b=S.filters.querySelector('[data-cat="'+S.categories[n-1]+'"]');if(b){b.classList.add('is-key-active');setTimeout(function(){b.classList.remove('is-key-active');},320);}}
  });
  addEventListener('popstate',function(){var S=sections[0],c=new URLSearchParams(location.search).get('cat')||'all';if(c!==S.cat)choose(S,S.categories.indexOf(c)<0?'all':c,false);});
  document.addEventListener('visibilitychange',syncPlayback);
  new MutationObserver(syncPlayback).observe(document.body,{attributes:true,attributeFilter:['class']});
  var resizeTimer;addEventListener('resize',function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(function(){sections.forEach(fit);},120);});
  wide.addEventListener('change',function(){sections.forEach(fit);syncPlayback();});
  reduce.addEventListener('change',function(){autoplayEnabled=!reduce.matches;sections.forEach(updateToggle);syncPlayback();});
  // Scroll cue (no text): a pulsing chevron at the bottom of the screen while there is more
  // page below. Clicking it moves to the next section; it disappears at the very bottom.
  var cue=document.createElement('button');cue.type='button';cue.className='anime-scroll-cue';
  cue.innerHTML='<svg viewBox="0 0 28 30" width="28" height="30" aria-hidden="true"><path d="M4 5l10 9 10-9"/><path d="M4 16l10 9 10-9"/></svg>';
  document.body.appendChild(cue);
  function stops(){return [document.querySelector('.anime-hero')].concat(sections.map(function(S){return S.el;}),[document.querySelector('footer')]).filter(Boolean);}
  function updateCue(){
    var end=document.documentElement.scrollHeight-innerHeight;
    cue.classList.toggle('is-hidden',scrollY>=end-12||end<40);
    cue.setAttribute('aria-label',L('向下滚动到下一部分','Scroll to the next section'));
  }
  cue.addEventListener('click',function(){
    var next=stops().filter(function(el){return el.getBoundingClientRect().top>170;})[0];
    if(next&&next.tagName!=='FOOTER')next.scrollIntoView({behavior:reduce.matches?'auto':'smooth'});
    else scrollTo({top:document.documentElement.scrollHeight,behavior:reduce.matches?'auto':'smooth'});
  });
  addEventListener('scroll',updateCue,{passive:true});addEventListener('resize',updateCue);
  new ResizeObserver(updateCue).observe(document.body);
  P.onLang(function(){renderAll();updateCue();});renderAll();updateCue();
})();
