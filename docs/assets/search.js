
(function(){
  var box=document.getElementById('q'), res=document.getElementById('results'), idx=null, sel=-1;
  var base=document.body.getAttribute('data-base')||'';
  function load(cb){ if(idx) return cb(); fetch(base+'search-index.json').then(function(r){return r.json()}).then(function(j){idx=j;cb()}).catch(function(){idx=[];cb()}); }
  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function run(){
    var q=box.value.trim().toLowerCase(); sel=-1;
    if(!q){res.style.display='none';return}
    var toks=q.split(/\s+/).filter(Boolean);
    var out=[];
    idx.forEach(function(e){
      var t=e.t.toLowerCase(), b=e.b.toLowerCase(), sc=0, ok=true;
      toks.forEach(function(k){
        var inT=t.indexOf(k)>=0, p=b.indexOf(k);
        if(!inT && p<0) ok=false;
        if(inT) sc+=10; if(p>=0) sc+=1+Math.min(5,b.split(k).length-1)*0.2;
      });
      if(ok) out.push([sc,e]);
    });
    out.sort(function(a,b){return b[0]-a[0]});
    out=out.slice(0,25);
    if(!out.length){res.innerHTML='<div class="none">'+res.getAttribute('data-none')+'</div>';res.style.display='block';return}
    res.innerHTML=out.map(function(o){
      var e=o[1], b=e.b, k=toks[0], p=b.toLowerCase().indexOf(k), sn='';
      if(p>=0){var s=Math.max(0,p-40); sn=(s>0?'… ':'')+b.substr(s,150)+' …';} else sn=b.substr(0,130)+' …';
      sn=esc(sn).replace(new RegExp('('+esc(k).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>');
      return '<a href="'+base+e.u+'"><div class="rc">'+esc(e.c)+'</div><div class="rt">'+esc(e.t)+'</div><div class="rs">'+sn+'</div></a>';
    }).join('');
    res.style.display='block';
  }
  box.addEventListener('input',function(){load(run)});
  box.addEventListener('focus',function(){load(run)});
  box.addEventListener('keydown',function(e){
    var items=res.querySelectorAll('a'); if(!items.length) return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault(); sel=(sel+(e.key==='ArrowDown'?1:-1)+items.length)%items.length; items.forEach(function(a,i){a.classList.toggle('sel',i===sel)}); items[sel].scrollIntoView({block:'nearest'});}
    else if(e.key==='Enter'){ var a=items[sel>=0?sel:0]; if(a) location.href=a.href; }
    else if(e.key==='Escape'){res.style.display='none';box.blur()}
  });
  document.addEventListener('click',function(e){ if(!e.target.closest('.searchbox')) res.style.display='none'; });
  document.addEventListener('keydown',function(e){ if(e.key==='/' && document.activeElement.tagName!=='INPUT'){e.preventDefault();box.focus()} });
  document.addEventListener('click',function(e){ var lm=document.querySelector('.langmenu[open]'); if(lm && !e.target.closest('.langmenu')) lm.removeAttribute('open'); });
  var mb=document.getElementById('menubtn'); if(mb) mb.addEventListener('click',function(){document.body.classList.toggle('open')});
  var side=document.querySelector('.side a.cur'); if(side&&side.scrollIntoView) side.scrollIntoView({block:'center'});
})();
