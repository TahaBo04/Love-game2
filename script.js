/******** Personalization ********/
const YOU = "Taha";
const HER  = "Soumaya";
const INITIALS = { you: "T", her: "S" }; // for plate

/******** DOM ********/
const stage = document.getElementById("stage");
const titleEl = document.getElementById("sceneTitle");
const emojiEl = document.getElementById("sceneEmoji");
const captionEl = document.getElementById("sceneCaption");
const pairNamesEl = document.getElementById("pairNames");
const plateEl = document.getElementById("plate");
const loveNoteBtn = document.getElementById("loveNote");

const btnRandom = document.getElementById("btnRandom");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnTheme = document.getElementById("btnTheme");
const btnMusic = document.getElementById("btnMusic");
const bgm = document.getElementById("bgm");

/******** Scenes ********/
const SCENES = [
  {
    id:"home",
    emoji:"🏠",
    title:"Our Little Nest",
    caption:"The glow of our names on the wall, your laughter in the room — this is where love feels endless and home becomes us.",
    bg:"assets/IMG_5297.jpeg",
    anim:"home"
  },
  {
    id:"car",
    emoji:"🚗",
    title:"Endless Roads Together",
    caption:"Windows down, music up, your hand resting in mine. Every road feels like a story when I’m driving through it with you.",
    bg:"assets/IMG_5298.jpeg",
    anim:"car"
  },
  {
    id:"plane",
    emoji:"✈️",
    title:"Wings of Our Love",
    caption:"Someday we’ll board planes not just for trips, but for dreams. Every takeoff will carry us to sunsets painted just for us.",
    bg:"assets/IMG_5299.jpeg",
    anim:"plane"
  },
  {
    id:"picnic",
    emoji:"🧺",
    title:"Picnic of Forever",
    caption:"Fresh grass under us, soft skies above us, your smile beside me. Even the simplest picnic becomes magic when it’s with you.",
    bg:"assets/IMG_5296.jpeg",
    anim:"picnic"
  }
];

let index = 0;

/******** Build card clicks ********/
document.querySelectorAll(".card").forEach(btn=>{
  btn.addEventListener("click", ()=> {
    const key = btn.dataset.scene;
    const i = SCENES.findIndex(s => s.id === key);
    if (i >= 0) show(i);
  });
});

/******** Show a scene ********/
function show(i){
  index = (i + SCENES.length) % SCENES.length;
  const sc = SCENES[index];

  // header text
  titleEl.textContent = sc.title;
  emojiEl.textContent = sc.emoji;
  captionEl.textContent = sc.caption;

  // background
  stage.style.setProperty("--bgimg", `url("${sc.bg}")`);

  // names & plate
  pairNamesEl.textContent = `${YOU} & ${HER}`;
  plateEl.textContent = `${INITIALS.you}${INITIALS.her}-❤️`;

  // toggle anim blocks
  document.querySelectorAll(".anim").forEach(a => a.hidden = true);
  document.getElementById(`anim${capitalize(sc.anim)}`).hidden = false;

  // flourish
  confettiCenter();
}
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

/******** Buttons ********/
btnRandom.addEventListener("click", ()=>{
  show(Math.floor(Math.random()*SCENES.length));
});
btnNext.addEventListener("click", ()=> show(index+1));
btnPrev.addEventListener("click", ()=> show(index-1));

/******** Theme ********/
btnTheme.addEventListener("click", ()=>{
  const light = !document.body.classList.contains("light");
  document.body.classList.toggle("light", light);
  btnTheme.setAttribute("aria-pressed", String(light));
});

/******** Music (with iOS unlock) ********/
let musicOn = false;
btnMusic.addEventListener("click", ()=>{
  musicOn = !musicOn;
  btnMusic.textContent = musicOn ? "Music: On ♪" : "Music: Off ♪";
  btnMusic.setAttribute("aria-pressed", String(musicOn));
  if (musicOn) bgm.play().catch(()=>{}); else bgm.pause();
});
window.addEventListener("touchend", unlockOnce, {once:true});
window.addEventListener("click", unlockOnce, {once:true});
function unlockOnce(){ bgm.play().then(()=>bgm.pause()).catch(()=>{}); }

/******** Cute note ********/
if (loveNoteBtn){
  loveNoteBtn.addEventListener("click", ()=>{
    alert(`To ${HER},\n\nThank you for turning ordinary moments into forever memories.\n— ${YOU}`);
  });
}

/******** Stars background ********/
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
function resize(){
  canvas.width = innerWidth; canvas.height = innerHeight;
  stars = Array.from({length: Math.min(220, Math.floor((canvas.width*canvas.height)/18000))}).map(()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.2 + 0.2,
    a: Math.random()*Math.PI*2
  }));
}
addEventListener("resize", resize); resize();
(function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (const s of stars){
    s.a += 0.02;
    const tw = (Math.sin(s.a)+1)/2;
    ctx.globalAlpha = 0.4 + tw*0.6;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r*(0.7 + tw*0.6), 0, Math.PI*2); ctx.fillStyle = "#dff"; ctx.fill();
  }
  ctx.globalAlpha = 1;
})();

/******** Confetti ********/
function confettiCenter(){
  const r = stage.getBoundingClientRect();
  const pt = { x: r.left + r.width/2, y: r.top + 100 };
  burst(pt);
}
function burst(pt){
  const N = 28;
  for (let i=0;i<N;i++){
    const s = document.createElement("span");
    s.className = "confetti";
    s.style.left = (pt.x - 4) + "px";
    s.style.top  = (pt.y - 4) + "px";
    s.style.setProperty("--dx", (Math.random()*2-1)*180 + "px");
    s.style.setProperty("--dy", (Math.random()*-1)*220 + "px");
    s.style.setProperty("--rot", (Math.random()*360) + "deg");
    document.body.appendChild(s);
    setTimeout(()=> s.remove(), 900);
  }
}
// confetti styles
const style = document.createElement("style");
style.textContent = `
.confetti{ position:fixed; width:6px; height:6px; background:hsl(${Math.floor(Math.random()*360)} 90% 60%);
  border-radius:2px; animation:conf .9s ease-out forwards; pointer-events:none; z-index:9999 }
@keyframes conf{ to{ transform: translate(var(--dx),var(--dy)) rotate(var(--rot)); opacity:0 } }`;
document.head.appendChild(style);

/******** Boot ********/
show(0);
