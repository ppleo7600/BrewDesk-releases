(function(){
  var now=Date.now();
  document.querySelectorAll('.vcard[data-at]').forEach(function(c){ if(now<Date.parse(c.getAttribute('data-at'))) c.hidden=true; });
  document.querySelectorAll('.vbox .vgrid').forEach(function(g){
    var any=g.querySelector('.vcard:not([hidden])'); g.hidden=!any;
    var l=g.previousElementSibling; if(l&&l.classList.contains('vlabel')&&l.dataset.for==='shorts') l.hidden=!any;
  });
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a.vthumb'); if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.button) return;
    e.preventDefault();
    var c=a.closest('.vcard'), f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+c.getAttribute('data-vid')+'?autoplay=1&rel=0&playsinline=1';
    f.title=a.getAttribute('aria-label')||''; f.allow='accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen=true; f.referrerPolicy='strict-origin-when-cross-origin';
    var d=document.createElement('div'); d.className='vthumb'; d.appendChild(f); a.replaceWith(d);
  });
})();
