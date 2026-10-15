/* Motion timings and gestures from the supplied Anime Game v4 reference. */
(function(){
  'use strict';
  var reduced=matchMedia('(prefers-reduced-motion: reduce)'), origin=null, busy=false;
  document.addEventListener('pointerdown',function(e){var target=e.target.closest('a,button');if(target)origin=target.getBoundingClientRect();},{capture:true,passive:true});
  function expand(el,done){
    if(reduced.matches){done();return;}if(busy)return;busy=true;
    var rect=el.getBoundingClientRect();if(rect.top>=innerHeight || rect.bottom<=0)rect=origin||rect;
    var wipe=document.createElement('div');wipe.className='anime-expand';
    Object.assign(wipe.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
    document.body.appendChild(wipe);
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      wipe.classList.add('is-expanding');Object.assign(wipe.style,{left:'0px',top:'0px',width:'100vw',height:'100vh'});
      setTimeout(function(){done();var dialog=document.querySelector('dialog[open]');if(dialog)dialog.appendChild(wipe);wipe.classList.add('is-fading');setTimeout(function(){wipe.remove();busy=false;},200);},240);
    });});
  }
  window.AnimeMotion={expand:expand};
  function decode(el,target,duration){
    if(!el || reduced.matches){if(el)el.textContent=target;return;}
    var glyphs='ｱｶｻﾀﾅﾊﾏﾔﾗ涵清李#%&',start=performance.now();
    el.setAttribute('aria-label',target);
    function step(now){var k=(now-start)/duration,n=Math.floor(k*target.length);el.textContent=Array.from(target).map(function(c,i){return i<n?c:glyphs[Math.floor(Math.random()*glyphs.length)];}).join('');if(k<1)requestAnimationFrame(step);else{el.textContent=target;el.removeAttribute('aria-label');}}
    requestAnimationFrame(step);
  }
  function init(){
    var body=document.body,hero=document.querySelector('.anime-hero');
    // Cursor trails are in the foreground, like the reference's z-index 60 canvas.
    var cursor=document.createElement('canvas');cursor.className='anime-cursor';cursor.setAttribute('aria-hidden','true');body.appendChild(cursor);
    var g=cursor.getContext('2d'),points=[],mouse=null,raf=0;
    function resize(){var d=Math.min(devicePixelRatio||1,2);cursor.width=innerWidth*d;cursor.height=innerHeight*d;g.setTransform(d,0,0,d,0,0);}
    function draw(now){g.clearRect(0,0,innerWidth,innerHeight);points=points.filter(function(p){return now-p.t<260;});points.forEach(function(p){var k=1-(now-p.t)/260;g.beginPath();g.arc(p.x,p.y,2+6*k,0,Math.PI*2);g.fillStyle='rgba(255,102,170,'+(.45*k)+')';g.fill();});if(mouse){g.beginPath();g.arc(mouse.x,mouse.y,11,0,Math.PI*2);g.lineWidth=2;g.strokeStyle='rgba(242,238,248,.55)';g.stroke();}if(points.length || mouse)raf=requestAnimationFrame(draw);else raf=0;}
    function clear(){cancelAnimationFrame(raf);raf=0;points=[];mouse=null;g.clearRect(0,0,innerWidth,innerHeight);}
    document.addEventListener('pointermove',function(e){if(e.pointerType==='touch'||reduced.matches)return;mouse={x:e.clientX,y:e.clientY};points.push({x:e.clientX,y:e.clientY,t:performance.now()});if(!raf)raf=requestAnimationFrame(draw);},{passive:true});
    document.documentElement.addEventListener('pointerleave',function(){mouse=null;});document.addEventListener('visibilitychange',function(){if(document.hidden)clear();});reduced.addEventListener('change',clear);addEventListener('resize',resize);resize();
    // Layer the cursor over a modal too, without intercepting its controls.
    var dialog=document.getElementById('dreamDetail');if(dialog)new MutationObserver(function(){if(dialog.open)dialog.appendChild(cursor);else body.appendChild(cursor);}).observe(dialog,{attributes:true,attributeFilter:['open']});
    if(!hero)return;
    var title=document.getElementById('introTitle'),frame=document.createElement('div');frame.className='anime-heading-frame';title.before(frame);frame.appendChild(title);
    function name(){return document.documentElement.lang==='en'?CONFIG.name.en:CONFIG.name.zh;}
    // Reveal the works title one character at a time on entering the viewport.
    var collection=document.querySelector('.anime-collection'),worksTitle=document.querySelector('#animeWorksTitle > span');
    function letters(){if(!worksTitle)return;var text=worksTitle.textContent;worksTitle.innerHTML=Array.from(text).map(function(c,i){return '<span style="--letter-delay:'+i*60+'ms">'+(c===' '?'&nbsp;':c)+'</span>';}).join('');}
    letters();var visible=false;
    var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){visible=true;collection.classList.add('anime-works-in');io.disconnect();}},{threshold:.15});io.observe(collection);
    new MutationObserver(function(){setTimeout(function(){decode(title,name(),480);letters();if(visible)collection.classList.add('anime-works-in');},0);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    var seen=false;try{seen=sessionStorage.getItem('anime-intro')==='1';}catch(e){}
    if(reduced.matches){body.classList.add('anime-entered');return;}
    body.classList.add('anime-entering');
    function reveal(){requestAnimationFrame(function(){body.classList.add('anime-entered');});setTimeout(function(){decode(title,name(),480);},260);setTimeout(function(){body.classList.remove('anime-entering');},1300);}
    if(seen){reveal();return;}
    var intro=document.createElement('button');intro.type='button';intro.className='anime-intro anime-intro-v4';intro.setAttribute('aria-label',document.documentElement.lang==='en'?'Skip intro':'跳过开场');
    intro.innerHTML='<span class="anime-intro-left"></span><span class="anime-intro-right"></span><span class="anime-intro-content"><span class="anime-intro-emblem"><i class="anime-intro-line"></i><i class="anime-intro-approach"></i><i class="anime-intro-disc"></i><i class="anime-intro-flash"></i></span><span class="anime-intro-text"><strong></strong><small>LOADING 000</small></span></span><span class="anime-intro-skip">'+(document.documentElement.lang==='en'?'Click or press any key to skip':'点击或按任意键跳过')+'</span>';
    body.appendChild(intro);var label=intro.querySelector('.anime-intro-text small'),word=intro.querySelector('strong'),start=performance.now(),finished=false,timers=[];
    function loading(now){if(finished)return;var pct=Math.min(100,Math.round((now-start)/7));label.textContent='LOADING '+String(pct).padStart(3,'0');if(pct<100)requestAnimationFrame(loading);}
    requestAnimationFrame(loading);
    timers.push(setTimeout(function(){intro.classList.add('is-ready');label.textContent='READY';},760));
    timers.push(setTimeout(function(){intro.classList.add('is-hit');label.textContent='TECHNICAL ARTIST · PORTFOLIO';decode(word,'GiselleLi',520);},1400));
    function finish(){if(finished)return;finished=true;timers.forEach(clearTimeout);intro.classList.add('is-opening');removeEventListener('keydown',skip,true);try{sessionStorage.setItem('anime-intro','1');}catch(e){}reveal();setTimeout(function(){intro.remove();},900);}
    function skip(e){e.preventDefault();e.stopImmediatePropagation();finish();}intro.addEventListener('click',finish);addEventListener('keydown',skip,true);timers.push(setTimeout(finish,2150));
    reduced.addEventListener('change',function(){if(reduced.matches)finish();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
