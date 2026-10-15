/* Open the complete project in place; direct URLs use the same view. */
(function(){
  'use strict';
  var grid=document.getElementById('pvGrid'), dialog=document.createElement('dialog');
  dialog.className='dream-detail dream-work';dialog.id='dreamDetail';
  dialog.setAttribute('aria-labelledby','dreamDetailTitle');document.body.appendChild(dialog);
  var view=null, opener=null, overflow='', title='', pushed=false, active=-1;
  function route(id,replace){
    var url=new URL(location.href);url.searchParams.set('work',id);
    history[replace?'replaceState':'pushState']({dreamDetail:id},'',url);
  }
  function show(id,from){
    if(!PV.works()[id])return;
    active=id;
    if(!dialog.open){
      opener=from || grid.querySelector('[data-work="'+id+'"]');title=document.title;
      overflow=document.documentElement.style.overflow;
      grid.querySelectorAll('video').forEach(function(v){v.pause();});
      document.documentElement.style.overflow='hidden';document.body.classList.add('dream-preview-open');
      dialog.showModal();
    }
    if(!view)view=DreamWork.mount(dialog,id,{close:requestClose,navigate:move,isActive:function(){return dialog.open;}});
    else view.show(id);
    dialog.scrollTop=0;
    dialog.querySelector('#dreamDetailTitle').focus({preventScroll:true});
  }
  function move(id){route(id,true);show(id);}
  function hide(){
    if(!dialog.open)return;
    view.closeZoom();view.stop();dialog.close();
    document.body.classList.remove('dream-preview-open');document.documentElement.style.overflow=overflow;document.title=title;
    var target=opener && opener.isConnected?opener:grid.querySelector('[data-work="'+active+'"]');
    if(target)target.focus({preventScroll:true});
  }
  function requestClose(){
    if(pushed){history.back();}
    else {var url=new URL(location.href);url.searchParams.delete('work');history.replaceState(null,'',url);hide();}
  }
  grid.addEventListener('click',function(e){
    var card=e.target.closest('[data-work]');
    if(!card || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button!==0)return;
    e.preventDefault();var id=Number(card.dataset.work);route(id,false);pushed=true;show(id,card);
  });
  dialog.addEventListener('cancel',function(e){e.preventDefault();requestClose();});
  addEventListener('popstate',function(){
    var value=new URLSearchParams(location.search).get('work');
    if(value!==null && /^\d+$/.test(value))show(Number(value));else hide();
  });
  var initial=new URLSearchParams(location.search).get('work');
  if(initial!==null && /^\d+$/.test(initial))show(Number(initial));
})();
