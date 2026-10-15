/* Scene composition and animation adapted directly from the supplied Dream Gallery. */
(function(){
'use strict';
var template="<div style=\"position:fixed;left:50%;top:50%;width:max(100vw,177.78vh);height:max(100vh,56.25vw);transform:translate(-50%,-50%);z-index:-3;pointer-events:none;overflow:hidden;background:#140a0c\">\n<div  data-k=\"L-bg\" style=\"position:absolute;inset:0\"><img src=\"assets/scene/00-clean-background.webp\" alt=\"\" style=\"position:absolute;inset:-2%;width:104%;height:104%;object-fit:cover\"></div>\n<div  data-k=\"L-mid\" style=\"position:absolute;inset:0\"><div style=\"position:absolute;left:43.5%;top:37.94%;height:20.7%;transform:translateX(-52%)\"><img  data-k=\"f07\" src=\"assets/scene/07-flower-mid-left-tall.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:52% 98.3%\"></div><div style=\"position:absolute;left:39%;top:43.04%;height:13%;transform:translateX(-47%)\"><img  data-k=\"f08\" src=\"assets/scene/08-flower-mid-left-short.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:49.4% 95.3%\"></div><div style=\"position:absolute;left:64%;top:39.17%;height:20.7%;transform:translateX(-55%)\"><img  data-k=\"f09\" src=\"assets/scene/09-flower-mid-right-tall.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:46.5% 98.2%\"></div><div style=\"position:absolute;left:59%;top:51.20%;height:7.5%;transform:translateX(-52%)\"><img  data-k=\"f10\" src=\"assets/scene/10-flower-mid-right-short.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:54.3% 97%\"></div></div>\n<div  data-k=\"L-shrub\" style=\"position:absolute;inset:0\"><img src=\"assets/scene/13-shrub-foreground-left.webp\" alt=\"\" style=\"position:absolute;left:-3%;bottom:-4%;width:36%;height:auto\"><img src=\"assets/scene/14-shrub-foreground-right.webp\" alt=\"\" style=\"position:absolute;right:-3%;bottom:-4%;width:36%;height:auto\"></div>\n<div  data-k=\"L-fg\" style=\"position:absolute;inset:0\"><div style=\"position:absolute;left:26%;top:58.38%;height:25%;transform:translateX(-53%)\"><img  data-k=\"f05\" src=\"assets/scene/05-flower-foreground-left.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:46.7% 96.3%\"></div><div style=\"position:absolute;left:78%;top:48.89%;height:26.4%;transform:translateX(-55%)\"><img  data-k=\"f06\" src=\"assets/scene/06-flower-foreground-right.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:41.5% 99.4%\"></div></div>\n<div  data-k=\"L-curtain\" style=\"position:absolute;inset:0\"><div style=\"position:absolute;left:-3%;top:-1%;height:102%\"><img  data-k=\"cL\" src=\"assets/scene/11-curtain-left.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:0 0\"></div><div style=\"position:absolute;right:-3%;top:-1%;height:102%\"><img  data-k=\"cR\" src=\"assets/scene/12-curtain-right.webp\" alt=\"\" style=\"display:block;height:100%;width:auto;transform-origin:100% 0\"></div></div>\n</div>\n<div style=\"position:fixed;inset:0;z-index:-2;pointer-events:none;background:radial-gradient(ellipse 75% 65% at 50% 45%,transparent 40%,rgba(20,10,12,.55) 100%);opacity:1\"></div>\n<div style=\"position:fixed;inset:0;z-index:-2;pointer-events:none;background:rgba(18,8,10,1);opacity:0;transition:opacity 300ms linear\"></div>\n<div style=\"position:fixed;left:50%;top:50%;width:max(100vw,177.78vh);height:max(100vh,56.25vw);transform:translate(-50%,-50%);z-index:40;pointer-events:none;overflow:hidden\">\n<div  data-k=\"L-pend\" style=\"position:absolute;inset:0\"><div  data-k=\"p02\" style=\"position:absolute;left:15.5%;top:-2%;height:46%;width:0;transform-origin:50% 0\"><div style=\"position:absolute;left:-1px;top:0;width:2px;height:57.82%;background:linear-gradient(90deg,#7a4a1c,#e9b866,#7a4a1c)\"></div><img src=\"assets/scene/02-pendant-left-star.webp\" alt=\"\" style=\"position:absolute;left:0;bottom:2.90%;height:41.30%;width:auto;transform:translateX(-50%)\"></div><div  data-k=\"p01\" style=\"position:absolute;left:19.7%;top:-2%;height:37.5%;width:0;transform-origin:50% 0\"><div style=\"position:absolute;left:-1px;top:0;width:2px;height:58.75%;background:linear-gradient(90deg,#7a4a1c,#e9b866,#7a4a1c)\"></div><img src=\"assets/scene/01-pendant-left-moon.webp\" alt=\"\" style=\"position:absolute;left:0;bottom:3.72%;height:40.00%;width:auto;transform:translateX(-50%)\"></div><div  data-k=\"p03\" style=\"position:absolute;left:81.4%;top:-2%;height:37.5%;width:0;transform-origin:50% 0\"><div style=\"position:absolute;left:-1px;top:0;width:2px;height:47.48%;background:linear-gradient(90deg,#7a4a1c,#e9b866,#7a4a1c)\"></div><img src=\"assets/scene/03-pendant-right-star-inner.webp\" alt=\"\" style=\"position:absolute;left:0;bottom:3.36%;height:50.67%;width:auto;transform:translateX(-50%)\"></div><div  data-k=\"p04\" style=\"position:absolute;left:85.6%;top:-2%;height:45%;width:0;transform-origin:50% 0\"><div style=\"position:absolute;left:-1px;top:0;width:2px;height:56.81%;background:linear-gradient(90deg,#7a4a1c,#e9b866,#7a4a1c)\"></div><img src=\"assets/scene/04-pendant-right-star-outer.webp\" alt=\"\" style=\"position:absolute;left:0;bottom:3.22%;height:42.22%;width:auto;transform:translateX(-50%)\"></div></div>\n</div>\n<canvas id=\"dreamPetals\" style=\"position:fixed;inset:0;z-index:41;width:100%;height:100%;display:block;pointer-events:none\"></canvas>\n\n";
var host=document.createElement('div');host.className='dream-scene-host';host.setAttribute('aria-hidden','true');host.innerHTML=template;document.body.prepend(host);
window.DreamSceneHost=host;
class GalleryScene {
  constructor(host){
    this.sc={};this.sim={};this.pm={x:0,y:0};this.m=null;this.lastT=0;this.acc=0;
    this.props={motion:'stop-motion'};host.querySelectorAll('[data-k]').forEach(el=>this.sc[el.dataset.k]=el);
    this.cv=host.querySelector('canvas');this.petals=Array.from({length:46},()=>this.newPetal(true));
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');
    this.tick=t=>{this.draw(t);this.raf=requestAnimationFrame(this.tick);};
    document.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')this.m={x:e.clientX,y:e.clientY};},{passive:true});
    document.documentElement.addEventListener('pointerleave',()=>{this.m=null;this.pm={x:0,y:0};});
    this.update=()=>{cancelAnimationFrame(this.raf);if(this.motion.matches){Object.values(this.sc).forEach(el=>el.style.transform='');this.cv.getContext('2d').clearRect(0,0,this.cv.width,this.cv.height);}else if(!document.hidden){this.lastT=0;this.raf=requestAnimationFrame(this.tick);}};
    this.motion.addEventListener('change',this.update);document.addEventListener('visibilitychange',this.update);this.update();
  }
  newPetal(any) { return { x: Math.random(), y: any ? Math.random() : -0.05, s: 4 + Math.random() * 7, vy: .0004 + Math.random() * .0008, vx: (Math.random() - .3) * .0006, r: Math.random() * 6.28, vr: (Math.random() - .5) * .04, ph: Math.random() * 6.28, hue: Math.random(), dx: 0, dy: 0 }; }
  burst(x, y, n) {
    const w = innerWidth, hh = innerHeight;
    for (let i = 0; i < n; i++) { const p = this.newPetal(false); p.x = x / w; p.y = y / hh; p.vx = (Math.random() - .5) * .004; p.vy = -.001 + Math.random() * .002; p.s = 4 + Math.random() * 5; this.petals.push(p); }
    if (this.petals.length > 90) this.petals.splice(0, this.petals.length - 90);
  }
  scene(t) {
    const dt = Math.min(.05, (t - (this.lastT || t)) / 1000); this.lastT = t;
    const m = this.m, sc = this.sc, sim = this.sim, stop = (this.props.motion ?? 'stop-motion') === 'stop-motion';
    const mv = m && this.pm.x ? { x: m.x - this.pm.x, y: m.y - this.pm.y } : { x: 0, y: 0 }; if (m) this.pm = { x: m.x, y: m.y };
    const tx = m ? m.x / innerWidth - .5 : 0, ty = m ? m.y / innerHeight - .5 : 0;
    this.pa = this.pa || { x: 0, y: 0 }; this.pa.x += (tx - this.pa.x) * .05; this.pa.y += (ty - this.pa.y) * .05;
    const hit = (el, pad, frac) => { if (!m || !el) return false; const r = el.getBoundingClientRect(); return m.x > r.left - pad && m.x < r.right + pad && m.y > r.top && m.y < r.top + r.height * (frac || 1); };
    ['p01', 'p02', 'p03', 'p04'].forEach((k, i) => {
      const s = sim[k] || (sim[k] = { a: 0, w: 0, ph: i * 1.7 });
      const breeze = Math.sin(t * .0007 + s.ph) * .012;
      if (hit(sc[k], 14) && Math.abs(mv.x) > .5) s.w += mv.x * .0035;
      s.w += (-14 * (s.a - breeze) - 1.1 * s.w) * dt; s.a += s.w * dt; s.a = Math.max(-.45, Math.min(.45, s.a));
    });
    ['f05', 'f06', 'f07', 'f08', 'f09', 'f10'].forEach((k, i) => {
      const s = sim[k] || (sim[k] = { a: 0, w: 0, sc: 1, on: false, ph: i * 2.3 });
      const el = sc[k], over = hit(el, 0, .42);
      if (over && !s.on && el) { const r = el.getBoundingClientRect(); this.burst(r.left + r.width / 2, r.top + r.height * .2, 7); s.w += (mv.x >= 0 ? 1 : -1) * 2.2; }
      s.on = over;
      const target = Math.sin(t * .0009 + s.ph) * .02 + (over ? (m && el && m.x < el.getBoundingClientRect().left + el.offsetWidth / 2 ? .09 : -.09) : 0);
      s.w += (-10 * (s.a - target) - 2.2 * s.w) * dt; s.a += s.w * dt;
      s.sc += ((over ? 1.07 : 1) - s.sc) * .12;
    });
    this.acc += dt; if (stop && this.acc < 1 / 12) return; this.acc = 0;
    const set = (k, v) => { if (sc[k]) sc[k].style.transform = v; };
    const px = this.pa.x, py = this.pa.y;
    [['L-bg', 8], ['L-mid', 14], ['L-shrub', 24], ['L-fg', 32], ['L-curtain', 40], ['L-pend', 34]].forEach(([k, d]) => set(k, `translate3d(${(-px * d).toFixed(1)}px,${(-py * d * .6).toFixed(1)}px,0)`));
    ['p01', 'p02', 'p03', 'p04'].forEach(k => set(k, `rotate(${sim[k].a.toFixed(4)}rad)`));
    ['f05', 'f06', 'f07', 'f08', 'f09', 'f10'].forEach(k => set(k, `rotate(${sim[k].a.toFixed(4)}rad) scale(${sim[k].sc.toFixed(3)})`));
    set('archFlower', `rotate(${(t * (stop ? .012 : .012)) % 360}deg)`); set('cL', `rotate(${(Math.sin(t * .0005) * .35).toFixed(3)}deg)`); set('cR', `rotate(${(Math.sin(t * .0005 + 1.3) * -.35).toFixed(3)}deg)`);
  }
  draw(t) {
    this.scene(t);
    const c = this.cv; if (!c) return;
    const dpr = Math.min(devicePixelRatio || 1, 2), w = c.offsetWidth, h = c.offsetHeight; if (!w) return;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    const m = this.m;
    this.petals.forEach((p, i) => {
      p.y += p.vy; p.x += p.vx + Math.sin(t * .0008 + p.ph) * .0004; p.r += p.vr;
      let x = p.x * w, y = p.y * h;
      if (m) { const dx = x - m.x, dy = y - m.y, d = Math.hypot(dx, dy); if (d < 140) { p.dx += dx / d * (140 - d) * .03; p.dy += dy / d * (140 - d) * .03; } }
      p.dx *= .94; p.dy *= .94; x += p.dx; y += p.dy;
      if (p.y > 1.05 || p.x < -.05 || p.x > 1.05) { if (this.petals.length > 46) { this.petals.splice(i, 1); return; } this.petals[i] = this.newPetal(false); }
      g.save(); g.translate(x, y); g.rotate(p.r); g.scale(1, .55 + .45 * Math.sin(t * .003 + p.ph));
      g.fillStyle = p.hue > .7 ? 'rgba(255,214,150,.75)' : p.hue > .35 ? 'rgba(255,170,150,.8)' : 'rgba(250,200,200,.7)';
      g.beginPath(); g.moveTo(0, -p.s); g.quadraticCurveTo(p.s * .9, 0, 0, p.s); g.quadraticCurveTo(-p.s * .9, 0, 0, -p.s); g.fill(); g.restore();
    });
  }

}
new GalleryScene(host);
})();
