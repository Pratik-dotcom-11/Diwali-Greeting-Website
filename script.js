const $=id=>document.getElementById(id);
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
  function updateMessageCount(){const message=$('message');$('messageCount').textContent=message.value.length}function setWish(text){$('message').value=text;updateMessageCount();$('message').focus()}function getGreeting(){const sender=$('sender').value.trim(),receiver=$('receiver').value.trim(),msg=$('message').value.trim()||'May your home be filled with light, laughter and love this Diwali.';return {sender,receiver,msg}}
function generateGreeting(){const g=getGreeting();$('previewTo').textContent=(g.receiver?'Dear '+g.receiver+', ':'')+g.msg;$('previewFrom').textContent=g.sender?'With love, '+g.sender:'With warm wishes';$('greetingCard').animate([{transform:'scale(.98)',opacity:.7},{transform:'scale(1)',opacity:1}],{duration:350});toast('Your greeting is ready!')}
  function resetGreeting(){$('sender').value='';$('receiver').value='';$('message').value='';updateMessageCount();$('previewTo').textContent='May your life shine brighter with every diya.';$('previewFrom').textContent='With warm wishes'}
  $('message').addEventListener('input',updateMessageCount);document.querySelectorAll('.style-swatch').forEach(swatch=>swatch.addEventListener('click',()=>{document.querySelectorAll('.style-swatch').forEach(item=>item.classList.remove('active'));swatch.classList.add('active');const card=$('greetingCard');card.classList.remove('style-wine','style-rose','style-blue','style-amber');card.classList.add('style-'+([...swatch.classList].find(name=>['rose','blue','amber'].includes(name))||'wine'));}));updateMessageCount()
function getShareUrl(){const deployedUrl='https://diwali-greeting-website.vercel.app';return /^localhost|^127\\./.test(location.hostname)?deployedUrl:location.origin}
function openSharePopup(){const popup=$('sharePopup');popup.classList.add('open');popup.setAttribute('aria-hidden','false');document.body.classList.add('share-open');setTimeout(()=>popup.querySelector('.share-close').focus(),120)}
function closeSharePopup(){const popup=$('sharePopup');popup.classList.remove('open');popup.setAttribute('aria-hidden','true');document.body.classList.remove('share-open')}
function shareFromPopup(channel){shareGreeting(channel);if(channel!=='instagram'||navigator.clipboard)closeSharePopup()}
$('sharePopup').addEventListener('click',e=>{if(e.target.id==='sharePopup')closeSharePopup()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('sharePopup').classList.contains('open'))closeSharePopup()});
function shareText(){const g=getGreeting(),url=getShareUrl();return `🪔 Happy Diwali${g.receiver?', '+g.receiver:''}! ✨\n\n${g.msg}\n\n${g.sender?'With love, '+g.sender:'With warm wishes'}\n\nShare your greetings on - ${url}`}
async function shareGreeting(channel='whatsapp'){const url=getShareUrl(),text=shareText();if(channel==='native'&&navigator.share){try{await navigator.share({title:'Happy Diwali!',text,url});return}catch(e){if(e.name==='AbortError')return}}
 if(channel==='instagram'){try{await navigator.clipboard.writeText(text);toast('Greeting copied. Paste it in Instagram Direct!')}catch(e){toast('Copy the greeting, then share it on Instagram')}window.open('https://www.instagram.com/direct/new/','_blank','noopener');return}
 const targets={whatsapp:'https://wa.me/?text=',facebook:'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'&quote='+encodeURIComponent(text),telegram:'https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text)};const target=targets[channel]||targets.whatsapp;window.open(channel==='facebook'?target:target+encodeURIComponent(text),'_blank','noopener')}
async function copyGreeting(){try{await navigator.clipboard.writeText(shareText());toast('Greeting copied!')}catch(e){toast('Copy not available in this browser')}}
const grid=$('diyaGrid');for(let i=1;i<=10;i++){const d=document.createElement('button');d.className='diya-card';d.setAttribute('aria-label','Light diya '+i);d.innerHTML='<div class="tiny-diya"><div class="tiny-flame"></div><div class="tiny-bowl"></div></div><p>Diya '+i+'</p>';d.onclick=()=>{d.classList.toggle('lit');updateCount()};grid.appendChild(d)}
function updateCount(){const n=document.querySelectorAll('.diya-card.lit').length;$('diyaCount').textContent=`${n} of 10 diyas glowing`;if(n===10){toast('A beautiful circle of light!');window.fxShow&&fxShow(5)}}
function lightAll(){document.querySelectorAll('.diya-card').forEach((d,i)=>setTimeout(()=>{if(!d.classList.contains('lit')){d.classList.add('lit');diyaFx(d)}updateCount()},i*140))}
function resetDiyas(){document.querySelectorAll('.diya-card').forEach(d=>d.classList.remove('lit'));updateCount()}
const canvas=$('rangoliCanvas'),ctx=canvas.getContext('2d');let colour='#ffd34f',drawing=false,last=null,eraser=false,pattern='mandala';
  const colours=['#ffd34f','#ff6b6b','#ff8bc2','#b69cff','#69d8c5','#fff4d0','#f28b35','#ffffff','#7dd3fc','#a3e635'];
  const patterns=[['mandala','Mandala'],['lotus','Lotus'],['flower','Flower'],['diamond','Diamond']];
  const pal=$('palette');colours.forEach((c,i)=>{const b=document.createElement('button');b.className='swatch'+(i===0?' active':'');b.style.background=c;b.setAttribute('aria-label','Choose '+c);b.onclick=()=>{colour=c;eraser=false;updateEraser();document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('active'));b.classList.add('active')};pal.appendChild(b)});
  const picker=$('patternPicker');patterns.forEach(([id,label],i)=>{const b=document.createElement('button');b.className='pattern-btn'+(i===0?' active':'');b.textContent=label;b.setAttribute('aria-pressed',i===0);b.onclick=()=>{pattern=id;document.querySelectorAll('.pattern-btn').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});b.classList.add('active');b.setAttribute('aria-pressed','true');drawPattern()};picker.appendChild(b)});
  function drawPattern(){ctx.clearRect(0,0,500,500);ctx.save();ctx.translate(250,250);ctx.strokeStyle='rgba(255,216,120,.3)';ctx.lineWidth=2;
    if(pattern==='lotus'||pattern==='flower'){const petals=pattern==='lotus'?8:12;for(let i=0;i<petals;i++){ctx.rotate(Math.PI*2/petals);ctx.beginPath();ctx.ellipse(0,-110,pattern==='lotus'?28:17,75,0,0,Math.PI*2);ctx.stroke()}}
    if(pattern==='diamond'){for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(0,-145);ctx.lineTo(24,-105);ctx.lineTo(0,-65);ctx.lineTo(-24,-105);ctx.closePath();ctx.stroke()}}
    if(pattern==='mandala'||pattern==='flower'){for(let r=0;r<12;r++){ctx.rotate(Math.PI/6);for(let j=0;j<8;j++){ctx.beginPath();ctx.ellipse(0,-115,15,70,0,0,Math.PI*2);ctx.stroke()}}}
    ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.stroke();ctx.restore()}
  drawPattern();
  function pos(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}}
  function updateEraser(){const b=$('eraserBtn');b.classList.toggle('active',eraser);b.setAttribute('aria-pressed',eraser);b.textContent=eraser?'Eraser on':'Eraser'}
  function toggleEraser(){eraser=!eraser;updateEraser()}
  function startDraw(e){e.preventDefault();drawing=true;last=pos(e);canvas.setPointerCapture(e.pointerId);dot(last)}
  function dot(p){const size=+$('brush').value;ctx.save();ctx.globalCompositeOperation=eraser?'destination-out':'source-over';ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);ctx.fillStyle=eraser?'#000':colour;ctx.shadowColor=eraser?'transparent':colour;ctx.shadowBlur=eraser?0:12;ctx.fill();ctx.restore()}
  function moveDraw(e){if(!drawing)return;e.preventDefault();const p=pos(e);ctx.save();ctx.globalCompositeOperation=eraser?'destination-out':'source-over';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle=eraser?'#000':colour;ctx.lineWidth=+$('brush').value*1.6;ctx.lineCap='round';ctx.shadowColor=eraser?'transparent':colour;ctx.shadowBlur=eraser?0:10;ctx.stroke();ctx.restore();dot(p);last=p}
  canvas.addEventListener('pointerdown',startDraw);canvas.addEventListener('pointermove',moveDraw);canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);canvas.addEventListener('pointerleave',()=>drawing=false);
  function clearRangoli(){drawPattern();eraser=false;updateEraser()}
  function saveRangoli(){const a=document.createElement('a');a.download='my-digital-rangoli.png';a.href=canvas.toDataURL('image/png');a.click();toast('Your rangoli is downloaded!')}
function launchFireworks(){const N=window.__lite?12:28;const area=$('fireworkArea');const rect=area.getBoundingClientRect();for(let k=0;k<5;k++){const x=30+Math.random()*(rect.width-60),y=25+Math.random()*100;const rocket=document.createElement('i');rocket.className='rocket';rocket.style.left=x+'px';area.appendChild(rocket);setTimeout(()=>{rocket.remove();for(let i=0;i<N;i++){const b=document.createElement('i');b.className='burst';b.style.left=x+'px';b.style.top=y+'px';const a=Math.PI*2*i/N,dist=35+Math.random()*65;b.style.setProperty('--x',Math.cos(a)*dist+'px');b.style.setProperty('--y',Math.sin(a)*dist+'px');b.style.background=['#ffe28b','#ff75a8','#ff9b42','#b6a0ff','#fff'][Math.floor(Math.random()*5)];area.appendChild(b);setTimeout(()=>b.remove(),1300)}},1200+k*520)}toast('Happy Diwali! 🎆');window.fxShow&&fxShow(6)}
let audioCtx=null,oscillators=[],musicOn=false,loopTimer=null;
function toggleMusic(){if(musicOn){stopMusic();return}try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();musicOn=true;$('musicBtn').textContent='♫ Music: On';playTune()}catch(e){toast('Audio is not supported in this browser')}}
function playTune(){if(!musicOn)return;const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46];let i=0;function note(){if(!musicOn)return;const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=notes[i%notes.length];gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.045,audioCtx.currentTime+.04);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.32);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.34);i++;loopTimer=setTimeout(note,390)}note()}
function stopMusic(){musicOn=false;clearTimeout(loopTimer);$('musicBtn').textContent='♫ Music: Off'}


/* ===== Diwali animation layer (added) ===== */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd=(a,b)=>a+Math.random()*(b-a);const L=()=>!!window.__lite;
/* Firecrackers (canvas) */
const cv=$('fxCanvas'),c=cv.getContext('2d');let W,H,dpr,parts=[],rockets=[],running=false;
let lw=0;function size(force){if(!force&&lw&&Math.abs(innerWidth-lw)<2&&Math.abs(innerHeight-H)<140)return;lw=innerWidth;dpr=L()?1:Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0)}
size(true);cv.style.display='none';window.__fxResize=()=>size(true);let rsz;addEventListener('resize',()=>{clearTimeout(rsz);rsz=setTimeout(size,200)});
const pal=[['#fff2bd','#ffb52e'],['#ff9ec4','#e42c76'],['#ffb36b','#ff5a1f'],['#cbbcff','#7a5cff'],['#ffffff','#ffe99a'],['#a5e8ff','#38bdf8']];
function launch(x,ty){rockets.push({x,y:H+10,vy:-(H*.012+rnd(0,2.5)),ty,p:pal[Math.floor(rnd(0,pal.length))]});go()}
function burst(x,y,p){if(parts.length>(L()?200:520))return;p=p||pal[Math.floor(rnd(0,pal.length))];const t=Math.floor(rnd(0,3)),n=((t===2?70:100)*(L()?.45:1))|0;
 for(let i=0;i<n;i++){const a=Math.PI*2*i/n+rnd(-.05,.05),v=t===1?5:rnd(1.2,6.2);
  parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:0,max:t===2?rnd(80,115):rnd(45,75),g:t===2?.045:.03,col:Math.random()<.35?p[0]:p[1],s:rnd(1.4,2.8)})}
 for(let i=0;i<(L()?4:14);i++)parts.push({x,y,vx:rnd(-1,1),vy:rnd(-1,1),life:0,max:14,g:0,col:'#fff',s:3.5});go()}
function go(){if(running)return;running=true;cv.style.display='block';requestAnimationFrame(loop)}
function loop(){c.globalCompositeOperation='destination-out';c.fillStyle='rgba(0,0,0,.2)';c.fillRect(0,0,W,H);c.globalCompositeOperation='lighter';
 rockets=rockets.filter(r=>{r.y+=r.vy;if(!L()||r.y%2<1)parts.push({x:r.x+rnd(-1,1),y:r.y,vx:rnd(-.3,.3),vy:rnd(.3,1.2),life:0,max:22,g:0,col:'#ffd66b',s:2});
  c.globalAlpha=1;c.fillStyle='#fff7cc';c.beginPath();c.arc(r.x,r.y,2.4,0,7);c.fill();
  if(r.y<=r.ty){burst(r.x,r.y,r.p);return false}return true});
 parts=parts.filter(q=>{q.life++;q.vx*=.985;q.vy=q.vy*.985+q.g;q.x+=q.vx;q.y+=q.vy;const k=1-q.life/q.max;if(k<=0)return false;
  c.globalAlpha=Math.min(1,k*1.4);c.fillStyle=q.col;const rr=q.s*(.4+k*.6);if(L()){c.fillRect(q.x-rr,q.y-rr,rr*2,rr*2)}else{c.beginPath();c.arc(q.x,q.y,rr,0,7);c.fill()}return true});
 c.globalAlpha=1;
 if(parts.length||rockets.length)requestAnimationFrame(loop);else{running=false;c.clearRect(0,0,W,H);cv.style.display='none'}}
window.fxShow=function(n){if(reduce)return;if(L())n=Math.ceil(n/2);if(rockets.length>10)return;for(let i=0;i<n;i++)setTimeout(()=>launch(rnd(W*.12,W*.88),rnd(H*.12,H*.46)),i*320)};
window.fxBurst=function(x,y){if(!reduce)burst(x,y)};
/* Opening show */
if(!reduce){
 addEventListener('load',()=>{setTimeout(()=>{fxShow(9);setTimeout(()=>fxShow(6),5200)},350)});
 const tap=e=>{if(rockets.length<6)launch(e.clientX,Math.max(60,e.clientY*.7))};
 document.addEventListener('pointerdown',tap);setTimeout(()=>document.removeEventListener('pointerdown',tap),6500);
}
/* Diya animations */
let emb=0;function ember(parent,left,top,dx){if(L()||emb>24)return;emb++;const e=document.createElement('i');e.className='ember';e.style.cssText=`left:${left};top:${top};--dx:${dx}px;--d:${rnd(1.5,3)}s`;parent.appendChild(e);setTimeout(()=>{e.remove();emb--},3200)}
window.diyaFx=function(d){if(reduce)return;d.classList.remove('pop');void d.offsetWidth;d.classList.add('pop');setTimeout(()=>d.classList.remove('pop'),600);
 const t=d.querySelector('.tiny-diya');for(let i=0;i<(L()?0:9);i++)setTimeout(()=>ember(t,'50%','22px',rnd(-34,34)),i*45);
 const r=d.getBoundingClientRect();if(!c)return;for(let i=0;i<(L()?6:16);i++){const a=rnd(0,7);parts.push({x:r.left+r.width/2,y:r.top+24,vx:Math.cos(a)*rnd(.5,3),vy:Math.sin(a)*rnd(.5,3)-1,life:0,max:rnd(25,45),g:.04,col:'#ffd66b',s:rnd(1.2,2.2)})}go()};
$('diyaGrid').addEventListener('click',e=>{const d=e.target.closest('.diya-card');if(d&&d.classList.contains('lit'))diyaFx(d)});
if(!reduce){
 setInterval(()=>{if(document.hidden||L()||(window.__off&&__off.diya))return;document.querySelectorAll('.diya-card.lit .tiny-diya').forEach(t=>{if(Math.random()<.6)ember(t,(46+rnd(0,8))+'%','22px',rnd(-14,14))})},650);
 const hd=document.querySelector('.main-diya');setInterval(()=>{if(!document.hidden&&hd&&!(window.__off&&__off.hero))ember(hd,(48+rnd(0,4))+'%','30%',rnd(-26,26))},420);
 for(let i=0;i<(L()?0:10);i++){const f=document.createElement('i');f.className='floater';f.style.cssText=`left:${rnd(2,98)}%;--sway:${rnd(-60,60)}px;animation-duration:${rnd(9,18)}s;animation-delay:${rnd(0,12)}s;width:${rnd(3,6)}px;height:${rnd(3,6)}px`;document.body.appendChild(f)}
 const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(!e.isIntersecting&&e.boundingClientRect.bottom<0){io.unobserve(e.target);clean(e.target)}});
  es.filter(e=>e.isIntersecting).map(e=>e.target).sort((x,y)=>x.compareDocumentPosition(y)&2?1:-1).forEach((el,i)=>{
   io.unobserve(el);const d=+el.dataset.b+Math.min(i*+el.dataset.st,.9);el.style.setProperty('--d',d+'s');el.classList.add('in',el.dataset.a);
   setTimeout(()=>clean(el),(d+2.2)*1000);
   if(el.classList.contains('celebrate')||el.classList.contains('nexora'))setTimeout(()=>fxShow(4),500)})
 },{threshold:.15,rootMargin:'0px 0px -6% 0px'});
 /* section entrance animations: each section has its own style */
 const cfg=[
  ['.hero>div:first-child>*','a-slide',0.2,.06],['.hero-art','a-zspin',0.25,0],
  ['#experience .section-head','a-drop',0,0],['#experience .feature','a-pop',0,.11],
  ['#greeting .section-head','a-zoom',0,0],['#greeting .two-col>.panel:not(.preview)','a-left',.1,0],['#greeting .preview','a-flip',.25,0],
  ['#photo-card .section-head','a-blurup',0,0],['#photo-card .photo-upload>.panel','a-clip',.1,0],['#photo-card .photo-preview','a-swing',.3,0],
  ['#diya .section-head','a-glow',0,0],['#diya .panel','a-unroll',.1,0],['#diya .diya-card','a-rise',.45,.1],
  ['#rangoli .section-head','a-tilt',0,0],['#rangoli .rangoli-layout','a-unroll',.1,0],['#rangoli .rangoli-wrap','a-spin',.55,0],['#rangoli .rangoli-layout>div:last-child','a-right',.75,0],['#rangoli .swatch','a-pop',1,.06],
  ['.panel.celebrate','a-bounce',0,0],['.marquee','a-slide',0.4,0],['.ribbons','a-slide',0,0],['.team .section-head','a-glow',0,0],['.nexora','a-zoom',.15,0],['.team-card','a-flip',.35,.22],['footer','a-slide',0,0]];
 const clean=el=>{el.classList.remove('rv','in',el.dataset.a);el.style.removeProperty('--d')};
 cfg.forEach(([sel,a,base,st])=>document.querySelectorAll(sel).forEach(el=>{if(el.classList.contains('rv'))return;el.classList.add('rv');el.dataset.a=a;el.dataset.b=base;el.dataset.st=st;
  el.addEventListener('animationend',e=>{if(e.target===el&&el.classList.contains('in'))clean(el)});io.observe(el)}));
}
})();

/* Happy Diwali ribbons: scroll-reactive speed + skew (added) */
(function(){
const box=document.querySelector('.ribbons');if(!box)return;
box.addEventListener('click',e=>{if(window.fxBurst)fxBurst(e.clientX,e.clientY)});
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const tr=[...box.querySelectorAll('.rb-track')].map(el=>({el,dir:+el.dataset.dir,sp:+el.dataset.speed,x:0,hover:1}));
tr.forEach(t=>{const b=t.el.parentNode;b.addEventListener('mouseenter',()=>t.hover=.2);b.addEventListener('mouseleave',()=>t.hover=1)});
const meas=()=>tr.forEach(t=>t.half=t.el.scrollWidth/2);meas();addEventListener('resize',meas);addEventListener('load',meas);document.fonts&&document.fonts.ready.then(meas);
let last=scrollY,vel=0,on=false;
new IntersectionObserver(e=>{on=e[0].isIntersecting;if(on)requestAnimationFrame(tick)}).observe(box);
function tick(){
 if(!on)return;
 vel=vel*.9+(scrollY-last)*.1;last=scrollY;
 const boost=Math.min(Math.abs(vel),45),sk=window.__lite?0:Math.max(-14,Math.min(14,-vel*.35));
 tr.forEach(t=>{const half=t.half;if(!half)return;
  t.x+=t.dir*(t.sp+boost*.55)*t.hover;
  if(t.x<=-half)t.x+=half;if(t.x>0)t.x-=half;
  t.el.style.transform=`translate3d(${t.x}px,0,0) skewX(${sk}deg)`});
 requestAnimationFrame(tick)}
})();

/* Performance controller: lite mode, FPS watchdog, off-screen pausing (added) */
(function(){
const root=document.documentElement;
window.__off={};
window.setLite=function(save){if(window.__lite&&root.classList.contains('lite'))return;window.__lite=true;root.classList.add('lite');
 document.querySelectorAll('.floater,.ember').forEach(e=>e.remove());window.__fxResize&&__fxResize();
 if(save){try{localStorage.setItem('dd-lite','1')}catch(e){}}};
/* pause animations of sections that are not on screen */
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{e.target.classList.toggle('off',!e.isIntersecting);const k=e.target.dataset.pk;if(k)__off[k]=!e.isIntersecting}),{rootMargin:'120px 0px'});
 [['.hero','hero'],['#diya','diya'],['.marquee',''],['.ribbons',''],['.team','']].forEach(([q,k])=>{const el=document.querySelector(q);if(el){if(k)el.dataset.pk=k;io.observe(el)}});
}
/* FPS watchdog: if the device struggles, switch to lite mode automatically */
let fr=0,t0=0,bad=0,n=0;
function frame(t){if(!t0)t0=t;fr++;
 if(t-t0>=2000){const fps=fr*1000/(t-t0);fr=0;t0=t;n++;
  if(!document.hidden){bad=fps<38?bad+1:0;if(bad>=2&&!window.__lite){setLite(true);return}}
  if(n>=8||window.__lite)return}
 requestAnimationFrame(frame)}
addEventListener('load',()=>setTimeout(()=>requestAnimationFrame(frame),800));
document.addEventListener('visibilitychange',()=>{fr=0;t0=0;bad=0});
/* free the opening-show layers once it is over */
setTimeout(()=>document.querySelectorAll('.intro-veil,.intro-greet').forEach(e=>e.remove()),6800);
})();
