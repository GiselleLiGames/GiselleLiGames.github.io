(function(){
  'use strict';
  var motion=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(pointer:fine)');
  function init(){
    var body=document.body,nav=body.querySelector(':scope > .top-nav');
    if(!nav){
      nav=document.createElement('nav');nav.className='top-nav';
      nav.innerHTML='<a class="nav-logo" href="index.html">GiselleLi</a><ul class="nav-links" id="navLinks"><li><a href="portfolio.html" data-i18n="nav.portfolio">作品集</a></li><li><a href="resume.html" data-i18n="nav.resume">简历</a></li><li><a href="contact.html" data-i18n="nav.contact">联系</a></li></ul>';
      body.prepend(nav);
    }
    var toggle=document.getElementById('langToggle');
    if(!toggle){toggle=document.createElement('button');toggle.id='langToggle';toggle.type='button';toggle.className='lang-toggle';toggle.addEventListener('click',function(){window.toggleLang();});}
    nav.appendChild(toggle);toggle.classList.add('lang-toggle');
    nav.setAttribute('aria-label','Main navigation');
    var current=location.pathname.split('/').pop();
    nav.querySelectorAll('.nav-links a').forEach(function(a){var active=a.getAttribute('href')===current||(current==='work.html'&&a.getAttribute('href')==='portfolio.html');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');});
    function label(){var zh=document.documentElement.lang!=='en';toggle.textContent=zh?'中 · EN':'ZH · EN';toggle.setAttribute('aria-label',zh?'切换到英文':'Switch to Chinese');if(current==='work.html')nav.querySelectorAll('[data-i18n]').forEach(function(a,i){a.textContent=(zh?['作品集','简历','联系']:['Portfolio','Resume','Contact'])[i];});}
    new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});label();
    nav.insertAdjacentHTML('beforeend','<div class="anime-progress" aria-hidden="true"><i></i></div>');
    var progress=nav.querySelector('.anime-progress i');
    function onScroll(){var max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';}
    addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
    var backdrop=document.createElement('div');backdrop.className='anime-backdrop';backdrop.setAttribute('aria-hidden','true');
    backdrop.innerHTML='<img class="anime-bg-cover" alt="" src="assets/uploads/previews/casino-central-orbit.webp"><canvas></canvas>';body.prepend(backdrop);
    var bgImage=backdrop.querySelector('img');document.addEventListener('anime:preview',function(e){bgImage.src=e.detail.image;});
    var canvas=backdrop.querySelector('canvas'),g=canvas.getContext('2d'),w=0,h=0,raf=0,lastFrame=0,levels=new Float32Array(64);
    var trail=[],mouse=null,triangles=Array.from({length:26},function(){return {x:Math.random(),y:Math.random(),s:40+Math.random()*140,v:.000015+Math.random()*.00002};});
    function resize(){var d=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*d;canvas.height=h*d;g.setTransform(d,0,0,d,0,0);if(motion.matches)draw(0);}
    function draw(now){
      var music=window.SiteAudio?SiteAudio.motion():{},active=!motion.matches&&music.playing&&music.energy>0;
      g.clearRect(0,0,w,h);var secs=now/1000,phase=active?music.phase:0,pulse=active?music.beat:0,hz=h*.62;
      canvas.dataset.musicPhase=String(phase||0);canvas.dataset.musicTime=String(music.time||0);
      for(var i=0;i<14;i++){var k=(i+(active?phase:0))/14,y=hz+(h-hz)*k*k;g.strokeStyle='rgba(255,140,200,'+(.05+k*.22)+')';g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
      for(var j=-12;j<=12;j++){g.strokeStyle='rgba(140,210,255,'+(.12-Math.abs(j)*.006)+')';g.beginPath();g.moveTo(w/2+j*14,hz);g.lineTo(w/2+j*w*.16,h);g.stroke();}
      var line=g.createLinearGradient(0,0,w,0);line.addColorStop(0,'#ff66aa00');line.addColorStop(.5,'rgba(255,220,240,'+(.55+pulse*.4)+')');line.addColorStop(1,'#66ccff00');g.fillStyle=line;g.fillRect(0,hz-1,w,2);
      triangles.forEach(function(t){var y=(t.y-(motion.matches?0:secs*t.v*1000)+100)%1;g.beginPath();g.moveTo(t.x*w,y*h-t.s*.58);g.lineTo(t.x*w+t.s/2,y*h+t.s*.29);g.lineTo(t.x*w-t.s/2,y*h+t.s*.29);g.closePath();g.strokeStyle='rgba(255,102,170,'+(.04+pulse*.04)+')';g.stroke();});
      var tallest=0;
      for(var b=0;b<64;b++){var target=active&&music.bands?music.bands[b]:0;levels[b]+=(target-levels[b])*(target>levels[b]?.65:.18);var bh=4+Math.pow(levels[b],.85)*Math.min(240,h*.23)*6*(1+pulse*.18);tallest=Math.max(tallest,bh);g.fillStyle='rgba('+Math.round(255-b/64*153)+','+Math.round(102+b/64*102)+','+Math.round(170+b/64*85)+',.25)';g.fillRect(b*w/64+1,h-bh,w/64-2,bh);}
      canvas.dataset.spectrumHeight=tallest.toFixed(1);
      if(!motion.matches && fine.matches){trail=trail.filter(function(p){return now-p.t<260;});trail.forEach(function(p){var k=1-(now-p.t)/260;g.beginPath();g.arc(p.x,p.y,2+6*k,0,Math.PI*2);g.fillStyle='rgba(255,102,170,'+(.45*k)+')';g.fill();});if(mouse){g.beginPath();g.arc(mouse.x,mouse.y,11,0,Math.PI*2);g.strokeStyle='#f2eef877';g.stroke();}}
    }
    function frame(now){if(now-lastFrame>30){draw(now);lastFrame=now;}raf=requestAnimationFrame(frame);}
    function update(){cancelAnimationFrame(raf);if(motion.matches){trail=[];draw(0);}else if(!document.hidden)raf=requestAnimationFrame(frame);}
    addEventListener('resize',resize);document.addEventListener('visibilitychange',update);motion.addEventListener('change',update);
    document.addEventListener('pointermove',function(e){if(e.pointerType==='touch'||motion.matches)return;mouse={x:e.clientX,y:e.clientY};trail.push({x:e.clientX,y:e.clientY,t:performance.now()});},{passive:true});
    document.documentElement.addEventListener('pointerleave',function(){mouse=null;});resize();update();
    document.addEventListener('click',function(e){
      var target=e.target.closest('a,button');if(!e.isTrusted || !target || target.closest('.anime-intro') || target.closest('.dream-zoom') || motion.matches)return;
      var r=target.getBoundingClientRect(),x=e.clientX||r.left+r.width/2,y=e.clientY||r.top+r.height/2;
      var ring=document.createElement('span');ring.className='anime-hit-ring';ring.style.left=x+'px';ring.style.top=y+'px';
      var judge=document.createElement('span');judge.className='anime-judgement';judge.style.left=x+'px';judge.style.top=(y-30)+'px';var judgement=['Great','Good','Perfect'][Math.floor(Math.random()*3)];judge.textContent=judgement;judge.style.setProperty('--judge-color',{Great:'#7be06b',Good:'#ffb347',Perfect:'#66ccff'}[judgement]);
      // Top-layer dialogs need their feedback in the same top layer.
      var host=target.closest('dialog[open]')||body;host.append(ring,judge);setTimeout(function(){ring.remove();judge.remove();},700);
    });
    // Local preview refreshes after a source change, keeping the user on this route.
    if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){
      var paths=[location.pathname,'/assets/entry/anime-theme.css','/js/anime-theme.js','/js/anime-gallery.js','/js/anime-motion.js','/js/dream-work.js','/assets/companion/oc-companion.css','/js/oc-companion.js','/js/oc-mesh.js','/js/site-audio.js','/assets/audio/audio-config.js','/assets/audio/site-audio.css','/config.js','/js/site-translations.js'],signature=null;
      setInterval(function(){if(document.hidden)return;Promise.all(paths.map(function(path){return fetch(path,{cache:'no-store'}).then(function(r){return r.text();}).then(function(text){var h=0;for(var i=0;i<text.length;i++)h=(Math.imul(h,31)+text.charCodeAt(i))|0;return h;});})).then(function(values){var next=values.join('|');if(signature!==null && next!==signature)location.reload();signature=next;}).catch(function(){});},2000);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
