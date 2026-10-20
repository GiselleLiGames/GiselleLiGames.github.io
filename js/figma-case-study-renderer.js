(function () {
  'use strict';
  /*
   * Case-study renderer (PBR / Lycoris / Laputa-PCG / Tower of Fantasy).
   * Complete local-copy content lives in js/figma-local-copy-content.js.
   *
   * Layout rules (2026-10-13 re-layout):
   *  - Each chapter is read top-to-bottom as one flow (left column, then right column).
   *  - Consecutive images become one compact "justified" gallery row instead of
   *    full-width stacked pictures. Click any picture to see it full size.
   *  - Several headings in a row become a small row of topic chips.
   *  - Images repeated across chapters of the same work are shown only once.
   */
  var keys = {'assets/uploads/Project1_Compressed.pdf':1,'assets/uploads/Project2_Compressed.pdf':2,'assets/uploads/Project3_Compressed.pdf':5,'assets/uploads/Project4_Compressed.pdf':6};
  function chapters(work) {
    var key=keys[work.pdf], mediaKeys=window.FIGMA_MEDIA_KEYS || {};
    if(key == null) (work.links || []).some(function(link){if(mediaKeys[link.href] != null){key=mediaKeys[link.href];return true;}return false;});
    return (window.FIGMA_CASE_STUDIES || {})[key] || [];
  }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function t(v,lang) { return window.SiteCopy ? SiteCopy.text(v,lang) : (typeof v === 'string' ? v : v[lang] || v.en); }
  function media(item) { var map=window.CaseStudyMedia || {}; return map[item.node || item.sourceNode] || map[item.src] || null; }
  function preview(src) { var m=media({src:src}); return m ? m.src : src.replace(/\.(png|jpg)$/,'.webp'); }
  function full(src) { var m=media({src:src}); return m ? m.full : /^assets\/uploads\/figma\/source\//.test(src) ? src.replace(/\.(png|jpg|webp)$/,'.full.webp') : src; }
  function size(item) {
    var m=media(item); if(m) return [m.width,m.height];
    var s=(window.FIGMA_IMAGE_SIZES || {})[preview(item.src)];
    if (s) return s;
    if (item.width > 0 && item.height > 0) return [Math.round(item.width), Math.round(item.height)];
    return [16, 9];
  }
  /* same file name + same pixel size = the same picture re-exported into another chapter */
  function sig(item) { var s=size(item); return item.src.split('/').pop()+'@'+s[0]+'x'+s[1]; }

  function figure(item) {
    var s=size(item), m=media(item), r=Math.max(.3, Math.min(s[0]/s[1], 8));
    return '<figure class="fc-shot'+(r>=3?' fc-shot--strip':'')+'" style="--r:'+r.toFixed(3)+'"><button class="pv-page-img" type="button" data-full-image="'+esc(m?m.full:full(item.src))+'" aria-label="'+esc(item.alt)+'" title="'+esc(item.alt)+'">'+
      '<img src="'+esc(m?m.src:preview(item.src))+'" alt="'+esc(item.alt)+'" width="'+s[0]+'" height="'+s[1]+'" loading="lazy" decoding="async"></button></figure>';
  }
  function gallery(items) {
    var n=items.length;
    return '<div class="fc-gallery fc-gallery--'+(n===1?'one':n===2?'two':'many')+'">'+items.map(figure).join('')+'</div>';
  }
  function banner(src, alt) {
    return '<figure class="fc-banner"><button class="pv-page-img" type="button" data-full-image="'+esc(full(src))+'" aria-label="'+esc(alt)+'"><img src="'+esc(preview(src))+'" alt="'+esc(alt)+'" loading="lazy" decoding="async"></button></figure>';
  }

  /* turn a flat list of blocks into text runs, heading-chip runs and image galleries */
  function flow(blocks,lang) {
    blocks=blocks.filter(function(b){return !(b.kind==='heading' && /^inspiration$/i.test(b.text.trim()));});
    blocks=blocks.map(function(b){return Object.assign({},b,{text:t(b.text||'',lang),alt:t(b.alt||'',lang)});});
    var tokens=[], i=0;
    while (i < blocks.length) {
      var b=blocks[i], j=i;
      if (b.kind==='image') {
        while (j < blocks.length && blocks[j].kind==='image') j++;
        tokens.push({type:'gallery', n:j-i, html:gallery(blocks.slice(i,j))});
      } else if (b.kind==='heading') {
        while (j < blocks.length && blocks[j].kind==='heading') j++;
        var hs=blocks.slice(i,j);
        tokens.push({type:'heading', html: hs.length===1 ? '<h3 class="fc-h">'+esc(b.text)+'</h3>'
          : '<ul class="fc-chips">'+hs.map(function(h){return '<li>'+esc(h.text)+'</li>';}).join('')+'</ul>'});
      } else {
        while (j < blocks.length && blocks[j].kind==='text') j++;
        tokens.push({type:'text', len:blocks.slice(i,j).reduce(function(n,p){return n+p.text.length;},0), html:'<div class="fc-text">'+blocks.slice(i,j).map(function(p){return '<p>'+esc(p.text)+'</p>';}).join('')+'</div>'});
      }
      i=j;
    }
    /* text followed by one or two pictures → side by side on wide screens */
    var out='', flip=false;
    for (var k=0; k<tokens.length; k++) {
      var a=tokens[k], next=tokens[k+1];
      if (a.type==='text' && a.len>=260 && next && next.type==='gallery' && next.n<=2) {
        out+='<div class="fc-pair'+(flip?' fc-pair--flip':'')+'">'+a.html+next.html+'</div>';
        flip=!flip; k++;
      } else out+=a.html;
    }
    return out;
  }

  /* ---------- hand-arranged case studies (js/case-study-curated.js) ---------- */
  function curated(work) {
    var key=keys[work.pdf], mediaKeys=window.FIGMA_MEDIA_KEYS || {};
    if(key == null) (work.links || []).some(function(link){if(mediaKeys[link.href] != null){key=mediaKeys[link.href];return true;}return false;});
    return (window.CURATED_CASE_STUDIES || {})[key] || null;
  }
  function shot(img,lang) {
    img=Object.assign({},img,{cap:t(img.cap||'',lang)});
    var m=media(img), w=m?m.width:img.w, h=m?m.height:img.h, r=Math.max(.3, Math.min(w/h, 6));
    return '<figure class="cs-shot" style="--r:'+r.toFixed(3)+'"><button class="pv-page-img" type="button" data-full-image="'+esc(m?m.full:full(img.src))+'" aria-label="'+esc(img.cap||'')+'">'+
      '<img src="'+esc(m?m.src:img.src)+'" alt="'+esc(img.cap||'')+'" width="'+w+'" height="'+h+'" loading="lazy" decoding="async"></button>'+
      (img.cap?'<figcaption>'+esc(img.cap)+'</figcaption>':'')+'</figure>';
  }
  function renderCurated(list, work, lang) {
    var theme=keys[work.pdf]===2?'lycoris':keys[work.pdf]===6?'work':'pbr';
    return '<section class="fc-studies cs" id="case-study" data-theme="'+theme+'" aria-label="'+(lang==='zh'?'项目详解':'Case study')+'">'+
      '<div class="fc-index" role="navigation" aria-label="'+(lang==='zh'?'项目章节':'Chapters')+'">'+list.map(function(c,i){return '<a href="#cs-'+c.id+'"><b>'+String(i+1).padStart(2,'0')+'</b>'+esc(t(c.title,lang))+'</a>';}).join('')+'</div>'+
      list.map(function(c,i){
        return '<article class="fc-chapter cs-chapter" id="cs-'+c.id+'">'+
          '<header class="fc-head"><span>'+String(i+1).padStart(2,'0')+'</span><h2>'+esc(t(c.title,lang))+'</h2></header>'+
          (c.kicker?'<p class="cs-kicker">'+esc(t(c.kicker,lang))+'</p>':'')+
          ((c.links||[]).length?'<div class="fc-links">'+c.links.map(function(l){return '<a href="'+esc(l.href)+'" target="_blank" rel="noopener">'+esc(t(l.title,lang))+' ↗</a>';}).join('')+'</div>':'')+
          (c.cover?'<figure class="fc-banner"><button class="pv-page-img" type="button" data-full-image="'+esc(full(c.cover))+'"><img src="'+esc(c.cover)+'" alt="'+esc(t(c.title,lang))+'" loading="lazy" decoding="async"></button></figure>':'')+
          c.sections.map(function(s){
            var copy=(s.h && !/^inspiration(?:\s*[—–-]\s*why\??)?$/i.test(s.h.trim())?'<h3 class="cs-h">'+esc(t(s.h,lang))+'</h3>':'')+(s.sub?'<p class="cs-sub">'+esc(t(s.sub,lang))+'</p>':'')+
              (s.text?t(s.text,lang).split('\n').map(function(p){return '<p>'+esc(p)+'</p>';}).join(''):'');
            var main=(s.images||[]).filter(function(m){return !m.detail;}), det=(s.images||[]).filter(function(m){return m.detail;});
            /* main pictures in one big row; parameter panels / node graphs in a smaller second row */
            var pics=(main.length||det.length)?'<div class="cs-media">'+(main.length?'<div class="cs-shots">'+main.map(function(img){return shot(img,lang);}).join('')+'</div>':'')+(det.length?'<div class="cs-shots cs-shots--detail">'+det.map(function(img){return shot(img,lang);}).join('')+'</div>':'')+'</div>':'';
            var wide=!s.text || !pics;
            return '<section class="cs-sec'+(wide?' cs-sec--stack':'')+'"><div class="cs-copy">'+copy+'</div>'+pics+'</section>';
          }).join('')+
        '</article>';
      }).join('')+'</section>';
  }

  function render(work,lang) {
    if (work.pdf === 'assets/uploads/Project1_Compressed.pdf' && window.PBRCaseStudy) return window.PBRCaseStudy.render(work,lang);
    var cu=curated(work); if(cu) return renderCurated(cu, work, lang);
    var list=chapters(work); if(!list.length)return '';
    var theme=keys[work.pdf]===2?'lycoris':keys[work.pdf]===6?'work':'pbr';
    var seen={};
    /* decorative corner ornaments sometimes also come through as content images — skip them */
    list.forEach(function(c){ (c.ornaments||[]).forEach(function(src){ seen['orn:'+src.split('/').pop().replace(/\.\w+$/,'')]=1; }); });
    /* images the Figma import marked as decoration (corner flourishes, frames) */
    ((window.FIGMA_LOCAL_COPY_IMPORT||{}).coverage||[]).forEach(function(x){ if(x.classification==='decoration' && x.path) seen['orn:'+x.path.split('/').pop().replace(/\.\w+$/,'')]=1; });
    function fresh(item){ if(/Fw48\d*\.\w+$/.test(item.src)) return false; /* downloaded frame ornaments */ if(seen['orn:'+item.src.split('/').pop().replace(/\.\w+$/,'')]) return false; var k=sig(item); if(seen[k]) return false; seen[k]=1; return true; }

    return '<section class="fc-studies" id="case-study" data-theme="'+theme+'" aria-label="'+(lang==='zh'?'项目详解':'Case study')+'">'+
      '<div class="fc-index" role="navigation" aria-label="'+(lang==='zh'?'项目章节':'Chapters')+'">'+list.map(function(c,i){return '<a href="#fc-'+c.id.replace(':','-')+'"><b>'+String(i+1).padStart(2,'0')+'</b>'+esc(t(c.title,lang))+'</a>';}).join('')+'</div>'+
      list.map(function(c,i){
        var title=t(c.title,lang);
        var bg=c.background && fresh({src:c.background}) ? banner(c.background,title) : '';
        var parts=c.columns.map(function(col){
          return col.filter(function(b){ return b.kind!=='image' || fresh(b); });
        }).filter(function(col){ return col.length; });
        var supp=(c.supplementary||[]).filter(fresh);
        var links=(c.links||[]).filter(function(link){return /^https:\/\//.test(link.href);});
        return '<article class="fc-chapter" id="fc-'+c.id.replace(':','-')+'">'+
          (c.ornaments||[]).map(function(src,k){return '<img class="fc-ornament fc-ornament--'+k+'" src="'+esc(preview(src))+'" alt="" aria-hidden="true" loading="lazy">';}).join('')+
          '<header class="fc-head"><span>'+String(i+1).padStart(2,'0')+'</span><h2>'+esc(title)+'</h2></header>'+
          (links.length?'<div class="fc-links">'+links.map(function(link){return '<a href="'+esc(link.href)+'" target="_blank" rel="noopener">'+esc(t(link.title,lang))+' ↗</a>';}).join('')+'</div>':'')+
          bg+
          parts.map(function(col){ return '<div class="fc-part">'+flow(col,lang)+'</div>'; }).join('')+
          (supp.length?'<details class="fc-reference"><summary>'+(lang==='zh'?'更多场景视图':'Additional scene views')+'</summary>'+gallery(supp.map(function(img){return Object.assign({},img,{alt:t(img.alt,lang)});}))+'</details>':'')+
        '</article>';
      }).join('')+'</section>';
  }
  window.FigmaCaseStudy={has:function(w){return !!curated(w) || chapters(w).length>0;},render:render};
})();
