(function(){
  function arrange(){
    var nav=document.querySelector('body > .top-nav'), links=document.getElementById('navLinks'), toggle=document.getElementById('langToggle');
    if(!nav || !links || !toggle || nav.querySelector('.dream-nav-group'))return;
    var group=document.createElement('div');group.className='dream-nav-group';
    nav.appendChild(group);group.appendChild(links);group.appendChild(toggle);
    function label(){toggle.textContent=document.documentElement.lang==='en'?'ZH · EN':'中 · EN';}
    new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});label();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrange);else arrange();
})();
