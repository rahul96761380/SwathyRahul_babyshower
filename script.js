const slides = [
  {file:'01_krishna_blessings.jpg',kicker:'A BEAUTIFUL NEW CHAPTER',title:'A little\nmiracle',accent:'is on its way…',body:'A tiny new heartbeat,\na lifetime of love.',kind:'opening',src:'assets/slides/01_krishna_blessings.jpg'},
  {file:'02_krishna_radha.jpg',kicker:'LOVE, LAUGHTER & LITTLE MOMENTS',title:'A little mischief,',accent:'endless love…',body:'May our little one be surrounded\nby joy, wonder and love.',kind:'krishna',src:'assets/slides/02_krishna_radha.jpg'},
  {file:'03_swathy_rahul.jpg',kicker:'OUR GREATEST ADVENTURE BEGINS',title:'Swathy &\nRahul',accent:'Our hearts are\ngrowing…',body:'Soon to be\nAmma & Appa',kind:'names',src:'assets/slides/03_swathy_rahul.jpg'},
  {file:'04_baby_shower.jpg',kicker:'A DAY FILLED WITH LOVE',title:'Join us for our',accent:'Baby Shower',body:'As we celebrate\nour little one on the way,\nwe would be delighted\nto have you with us.',kind:'invite',src:'assets/slides/04_baby_shower.jpg'},
  {file:'05_event_details.jpg',kicker:'SAVE THE DATE',title:'Friday, 12 February\n2027',accent:'8:00 AM',body:'Raghu Saran Mini Hall\nNo. 1, 1st Cross Street,\nLIC Colony, Pammal, Chennai\nTamil Nadu – 600075\n(Approx. 2 km from Pallavaram\nRailway Station)',kind:'details',src:'assets/slides/05_event_details.jpg'},
  {file:'06_closing_blessings.jpg',kicker:'A LITTLE LOVE MAKES A BIG BLESSING',title:'Your presence\nwill make our day',accent:'complete.',body:'With love and warm wishes,\nSwathy & Rahul',kind:'closing',src:'assets/slides/06_closing_blessings.jpg'}
];

const DURATION=8000, SCENE_FADE_MS=480;
const $=id=>document.getElementById(id);
const art=$('art'),scene=$('scene'),content=$('content'),fill=$('fill'),dots=$('dots'),play=$('play');
const bgMusic=$('bgMusic'),musicBtn=$('musicBtn');
let idx=0,playing=true,elapsed=0,last=performance.now(),transitioning=false,queuedIndex=null;
let firstNavigationMusicAttempted=false;

function setMusicButton(state){const labels={on:'♫ Music on',off:'♫ Music off',tap:'♫ Tap for music',error:'♫ Music unavailable'};musicBtn.textContent=labels[state];musicBtn.classList.toggle('on',state==='on');musicBtn.setAttribute('aria-label',state==='on'?'Turn background music off':'Turn background music on');}
async function startMusic(){try{await bgMusic.play();setMusicButton('on');}catch(e){setMusicButton('tap');}}
async function toggleMusic(){if(bgMusic.paused)await startMusic();else{bgMusic.pause();setMusicButton('off');}}
bgMusic.volume=.34;musicBtn.addEventListener('click',toggleMusic);bgMusic.addEventListener('play',()=>setMusicButton('on'));bgMusic.addEventListener('pause',()=>{if(bgMusic.currentSrc)setMusicButton('off')});bgMusic.addEventListener('error',()=>setMusicButton('error'));
function enableMusicOnFirstNavigation(){if(firstNavigationMusicAttempted)return;firstNavigationMusicAttempted=true;if(bgMusic.paused)startMusic();}

const imagePromises=slides.map(s=>new Promise(resolve=>{const im=new Image();im.src=s.src;if(im.decode)im.decode().then(()=>resolve(im)).catch(()=>{if(im.complete&&im.naturalWidth)resolve(im);else{im.onload=()=>resolve(im);im.onerror=()=>resolve(null)}});else{im.onload=()=>resolve(im);im.onerror=()=>resolve(null)}}));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function resetProgress(){elapsed=0;last=performance.now();fill.style.width='0%';}
function updateText(s){content.className=s.kind;$('kicker').textContent=s.kicker;$('title').textContent=s.title;$('accent').textContent=s.accent;$('body').textContent=s.body;$('counter').textContent=String(idx+1).padStart(2,'0')+' / 06';[...dots.children].forEach((d,i)=>d.classList.toggle('active',i===idx));}

async function show(requested){
  const target=(requested+slides.length)%slides.length;
  if(transitioning){queuedIndex=target;return;}
  if(target===idx)return;
  transitioning=true;resetProgress();
  try{
    // Wait until the target artwork is fully decoded before changing the visible scene.
    const prepared=await imagePromises[target];
    if(!prepared)throw new Error('Slide artwork could not be loaded: '+slides[target].src);
    scene.classList.add('is-fading');
    await wait(SCENE_FADE_MS);

    // Change image and copy only while the complete scene is invisible.
    art.src=slides[target].src;
    if(art.decode){try{await art.decode();}catch(e){}}
    idx=target;updateText(slides[target]);
    void scene.offsetWidth;
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    scene.classList.remove('is-fading');
    await wait(SCENE_FADE_MS);
    transitioning=false;
    if(queuedIndex!==null){const next=queuedIndex;queuedIndex=null;if(next!==idx)show(next);}
  }catch(err){console.error(err);scene.classList.remove('is-fading');transitioning=false;}
}

slides.forEach((s,i)=>{const d=document.createElement('button');d.className='dot';d.type='button';d.setAttribute('aria-label','Slide '+(i+1));d.addEventListener('click',()=>{enableMusicOnFirstNavigation();show(i)});dots.appendChild(d)});
$('prev').addEventListener('click',()=>{enableMusicOnFirstNavigation();show(idx-1)});
$('next').addEventListener('click',()=>{enableMusicOnFirstNavigation();show(idx+1)});
function toggle(){playing=!playing;play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',playing?'Pause':'Play');last=performance.now();}
play.addEventListener('click',toggle);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){enableMusicOnFirstNavigation();show(idx+1)}else if(e.key==='ArrowLeft'){enableMusicOnFirstNavigation();show(idx-1)}else if(e.key===' '){e.preventDefault();toggle()}});
let sx=0,sy=0;const stage=$('stage');stage.addEventListener('touchstart',e=>{sx=e.changedTouches[0].screenX;sy=e.changedTouches[0].screenY},{passive:true});stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-sx,dy=e.changedTouches[0].screenY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){enableMusicOnFirstNavigation();show(idx+(dx<0?1:-1))}},{passive:true});
let resumeMusicAfterHide=false;document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;play.textContent='▶';resumeMusicAfterHide=!bgMusic.paused;if(resumeMusicAfterHide)bgMusic.pause()}else{playing=true;play.textContent='Ⅱ';last=performance.now();if(resumeMusicAfterHide){bgMusic.play().catch(()=>{});resumeMusicAfterHide=false}}});

async function init(){
  stage.classList.add('loading');
  // Explicitly load every typeface used by the slide copy before revealing anything.
  const fontReady=document.fonts?Promise.all([
    document.fonts.load('600 16px "Playfair Display"'),
    document.fonts.load('500 48px "Great Vibes"'),
    document.fonts.load('500 24px "Cormorant Garamond"'),
    document.fonts.ready
  ]):Promise.resolve();
  await Promise.all([...imagePromises,fontReady]);
  art.src=slides[0].src;
  if(art.decode){try{await art.decode()}catch(e){}}
  idx=0;updateText(slides[0]);
  void scene.offsetWidth;
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  scene.classList.remove('is-fading');
  stage.classList.remove('loading');
  resetProgress();startMusic();
}
function loop(now){if(playing&&!transitioning){elapsed+=now-last;fill.style.width=Math.min(100,elapsed/DURATION*100)+'%';if(elapsed>=DURATION)show(idx+1)}last=now;requestAnimationFrame(loop)}
init();requestAnimationFrame(loop);
