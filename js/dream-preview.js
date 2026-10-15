/* The reference's collection preview, with real links to the full case studies. */
(function(){
  'use strict';
  var P=window.PV, works=P.works(), grid=document.getElementById('pvGrid');
  var dialog=document.createElement('dialog');dialog.className='dream-preview';dialog.id='dreamPreview';dialog.setAttribute('aria-labelledby','dreamPreviewTitle');document.body.appendChild(dialog);
  var active=0, opener=null, previousOverflow='';
  var categories={shader:['着色器','Shader'],pcg:['程序化生成','PCG'],render:['渲染','Rendering'],tool:['工具','Tools'],code:['代码','Code']};
  var sigils={shader:'✦',pcg:'❋',render:'☾',tool:'⚜',code:'✧'};
  function L(zh,en){return P.lang()==='zh'?zh:en;}
  function stop(){dialog.querySelectorAll('video').forEach(function(v){v.pause();v.removeAttribute('src');v.load();});}
  function button(action,label,cls){return '<button type="button" data-preview="'+action+'"'+(cls?' class="'+cls+'"':'')+'>'+label+'</button>';}
  function render(){
    stop();var w=works[active],zh=P.lang()==='zh',clip=P.clip(w),group=P.t(CONFIG.workGroupNames[w.group]),category=(categories[w.category]||['',''])[zh?0:1],url='work.html?id='+active;
    var previous=(active-1+works.length)%works.length,next=(active+1)%works.length;
    dialog.innerHTML='<div class="dream-preview-shell"><div class="dream-preview-nav">'+button('close','← '+L('返回作品集','Back to portfolio'))+'<span>'+String(active+1).padStart(2,'0')+' / '+String(works.length).padStart(2,'0')+'</span><div>'+button('previous','‹ '+L('上一个','Previous'))+button('next',L('下一个','Next')+' ›')+'</div></div>'+
      '<div class="dream-preview-heading"><span>'+sigils[w.category]+' '+P.esc(category)+' · '+P.esc(group)+'</span><h2 id="dreamPreviewTitle">'+P.esc(P.t(w.title))+'</h2><em>'+P.esc(w.title[zh?'en':'zh'])+'</em></div>'+
      '<a class="dream-preview-media" href="'+url+'" aria-label="'+L('打开完整作品','Open full project')+'"><img src="'+P.esc(w.image)+'" alt="">'+(clip?'<video src="'+P.esc(clip.src)+'" poster="'+P.esc(w.image)+'" muted loop playsinline preload="none"></video>':'')+'<span>'+(P.fullVideo(w)?'▶ '+L('观看完整视频','Watch full video'):L('查看项目','View project'))+'</span></a>'+
      '<div class="dream-preview-info"><p>'+P.esc(P.t(w.desc))+'</p><div class="dream-preview-facts"><div><span>'+L('分类','Category')+'</span><strong>'+P.esc(category)+'</strong></div><div><span>'+L('类型','Type')+'</span><strong>'+P.esc(group)+'</strong></div><div><span>'+L('标签','Tags')+'</span><div>'+(w.tags||[]).map(function(t){return '<i>'+P.esc(typeof t==='string'?t:P.t(t))+'</i>';}).join('')+'</div></div><a class="dream-doc-link" href="'+url+'">'+L('项目详解','Project details')+' →</a></div></div>'+
      '<div class="dream-preview-more">'+[previous,next].map(function(i,k){return button(k?'next':'previous','<img src="'+P.esc(works[i].image)+'" alt=""><span><i>'+(k?'next ›':'‹ previous')+'</i><strong>'+P.esc(P.t(works[i].title))+'</strong></span>');}).join('')+'</div></div>';
    var video=dialog.querySelector('video');if(video && !matchMedia('(prefers-reduced-motion: reduce)').matches){video.muted=true;var p=video.play();if(p && p.catch)p.catch(function(){});}
  }
  function close(){if(dialog.open)dialog.close();}
  function open(id,from){active=id;opener=from;grid.querySelectorAll('video').forEach(function(v){v.pause();});render();previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';document.body.classList.add('dream-preview-open');dialog.showModal();dialog.scrollTop=0;dialog.querySelector('[data-preview="close"]').focus({preventScroll:true});}
  function move(dir){active=(active+dir+works.length)%works.length;render();dialog.querySelector('[data-preview="'+(dir<0?'previous':'next')+'"]').focus({preventScroll:true});}
  grid.addEventListener('click',function(e){var card=e.target.closest('[data-work]');if(!card || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button!==0)return;e.preventDefault();open(Number(card.dataset.work),card);});
  dialog.addEventListener('click',function(e){var b=e.target.closest('[data-preview]');if(b){if(b.dataset.preview==='close')close();else move(b.dataset.preview==='next'?1:-1);}else if(e.target===dialog)close();else if(e.target.closest('a[href]'))close();});
  dialog.addEventListener('close',function(){stop();document.body.classList.remove('dream-preview-open');document.documentElement.style.overflow=previousOverflow;if(opener && opener.isConnected)opener.focus({preventScroll:true});});
  dialog.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
})();
