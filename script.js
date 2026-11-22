const slides = [{"file": "01_krishna_blessings.jpg", "kicker": "A BEAUTIFUL NEW CHAPTER", "title": "A little\nmiracle", "accent": "is on its way…", "body": "A tiny new heartbeat,\na lifetime of love.", "kind": "opening", "src": "assets/slides/01_krishna_blessings.jpg"}, {"file": "02_krishna_radha.jpg", "kicker": "LOVE, LAUGHTER & LITTLE MOMENTS", "title": "A little mischief,", "accent": "endless love…", "body": "May our little one be surrounded\nby joy, wonder and love.", "kind": "krishna", "src": "assets/slides/02_krishna_radha.jpg"}, {"file": "03_swathy_rahul.jpg", "kicker": "OUR GREATEST ADVENTURE BEGINS", "title": "Swathy &\nRahul", "accent": "Our hearts are\ngrowing…", "body": "Soon to be\nAmma & Appa", "kind": "names", "src": "assets/slides/03_swathy_rahul.jpg"}, {"file": "04_baby_shower.jpg", "kicker": "A DAY FILLED WITH LOVE", "title": "Join us for our", "accent": "Baby Shower", "body": "As we celebrate\nour little one on the way,\nwe would be delighted\nto have you with us.", "kind": "invite", "src": "assets/slides/04_baby_shower.jpg"}, {"file": "05_event_details.jpg", "kicker": "SAVE THE DATE", "title": "Friday, 12 February\n2027", "accent": "8:00 AM", "body": "Raghu Saran Mini Hall\nNo. 1, 1st Cross Street,\nLIC Colony, Pammal, Chennai\nTamil Nadu – 600075\n(Approx. 2 km from Pallavaram\nRailway Station)", "kind": "details", "src": "assets/slides/05_event_details.jpg"}, {"file": "06_closing_blessings.jpg", "kicker": "A LITTLE LOVE MAKES A BIG BLESSING", "title": "Your presence\nwill make our day", "accent": "complete.", "body": "With love and warm wishes,\nSwathy & Rahul", "kind": "closing", "src": "assets/slides/06_closing_blessings.jpg"}];
const duration=8000;let idx=0,playing=true,elapsed=0,last=performance.now();
const art=document.getElementById('art'),artNext=document.getElementById('artNext'),content=document.getElementById('content'),fill=document.getElementById('fill'),dots=document.getElementById('dots'),play=document.getElementById('play');
const bgMusic=document.getElementById('bgMusic'),musicBtn=document.getElementById('musicBtn');bgMusic.volume=0.34;
function setMusicButton(state){
  const labels={on:'♫ Music on',off:'♫ Music off',tap:'♫ Tap for music',error:'♫ Music unavailable'};
  musicBtn.textContent=labels[state];
  musicBtn.classList.toggle('on',state==='on');
  musicBtn.setAttribute('aria-label',state==='on'?'Turn background music off':'Turn background music on');
}
async function startMusic(){
  try{await bgMusic.play();setMusicButton('on');}
  catch(e){setMusicButton('tap');}
}
async function toggleMusic(){
  if(bgMusic.paused){await startMusic();}
  else{bgMusic.pause();setMusicButton('off');}
}
bgMusic.addEventListener('error',()=>setMusicButton('error'));
bgMusic.addEventListener('play',()=>setMusicButton('on'));
bgMusic.addEventListener('pause',()=>{if(bgMusic.currentSrc)setMusicButton('off');});
musicBtn.addEventListener('click',toggleMusic);
// Browsers often block audible autoplay. If that happens, start music on the
// visitor's first slide-navigation gesture (swipe, Next button, or arrow key).
let firstNavigationMusicAttempted=false;
function enableMusicOnFirstNavigation(){
  if(firstNavigationMusicAttempted)return;
  firstNavigationMusicAttempted=true;
  if(bgMusic.paused)startMusic();
}
const fields=['kicker','title','accent','body'];
slides.forEach(s=>{const img=new Image();img.src=s.src});
let visibleArt=art,hiddenArt=artNext,changeToken=0;
function show(n){
  const nextIndex=(n+slides.length)%slides.length;
  if(nextIndex===idx && visibleArt.src) return;
  idx=nextIndex;
  const s=slides[idx],token=++changeToken;
  content.classList.add('is-changing');
  const preload=new Image();
  preload.onload=()=>{
    if(token!==changeToken)return;
    hiddenArt.src=s.src;
    hiddenArt.classList.add('active');
    visibleArt.classList.remove('active');
    const oldVisible=visibleArt;visibleArt=hiddenArt;hiddenArt=oldVisible;
    content.className=s.kind+' is-changing';
    fields.forEach(k=>document.getElementById(k).textContent=String(s[k]||'').replace(/\\n/g,'\n'));
    document.getElementById('counter').textContent=String(idx+1).padStart(2,'0')+' / 06';
    [...dots.children].forEach((d,i)=>d.classList.toggle('active',i===idx));
    requestAnimationFrame(()=>requestAnimationFrame(()=>{if(token===changeToken)content.classList.remove('is-changing')}));
    elapsed=0;last=performance.now();fill.style.width='0%';
  };
  preload.onerror=()=>{if(token===changeToken)content.classList.remove('is-changing')};
  preload.src=s.src;
  if(preload.complete && preload.naturalWidth)preload.onload();
}
slides.forEach((s,i)=>{let d=document.createElement('button');d.className='dot';d.setAttribute('aria-label','Slide '+(i+1));d.onclick=()=>{enableMusicOnFirstNavigation();show(i)};dots.appendChild(d)});
document.getElementById('prev').onclick=()=>{enableMusicOnFirstNavigation();show(idx-1)};document.getElementById('next').onclick=()=>{enableMusicOnFirstNavigation();show(idx+1)};
function toggle(){playing=!playing;play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',playing?'Pause':'Play');last=performance.now()}
play.onclick=toggle;
function loop(now){if(playing){elapsed+=now-last;fill.style.width=Math.min(100,elapsed/duration*100)+'%';if(elapsed>=duration)show(idx+1)}last=now;requestAnimationFrame(loop)}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){enableMusicOnFirstNavigation();show(idx+1)}if(e.key==='ArrowLeft'){enableMusicOnFirstNavigation();show(idx-1)}if(e.key===' '){e.preventDefault();toggle()}});
let sx=0,sy=0;document.getElementById('stage').addEventListener('touchstart',e=>{sx=e.changedTouches[0].screenX;sy=e.changedTouches[0].screenY},{passive:true});
document.getElementById('stage').addEventListener('touchend',e=>{let dx=e.changedTouches[0].screenX-sx,dy=e.changedTouches[0].screenY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){enableMusicOnFirstNavigation();show(idx+(dx<0?1:-1))}},{passive:true});
let resumeMusicAfterHide=false;document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;play.textContent='▶';resumeMusicAfterHide=!bgMusic.paused;if(resumeMusicAfterHide)bgMusic.pause()}else{playing=true;play.textContent='Ⅱ';last=performance.now();if(resumeMusicAfterHide){bgMusic.play().catch(()=>{});resumeMusicAfterHide=false}}});
show(0);startMusic();requestAnimationFrame(loop);
