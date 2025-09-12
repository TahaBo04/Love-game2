/* ===== Personalization ===== */
const HER_NAME = "Soumaya";
const YOUR_NAME = "Taha";
/* Optional: set initials for the car plate (2–3 letters each) */
const INITIALS = { you: "T", her: "S" };
/* Optional music file in same folder (leave empty for no music) */
const MUSIC_SRC = "assets/apocalypse.mp3";

/* ===== DOM ===== */
const herNameEl = document.getElementById("herName");
const myNameEl  = document.getElementById("myName");
const frameNamesEl = document.getElementById("frameNames");
const plateTextEl  = document.getElementById("plateText");
const loveNoteEl   = document.getElementById("loveNote");
const stage        = document.getElementById("stage");
const musicBtn     = document.getElementById("musicBtn");
const surpriseBtn  = document.getElementById("surpriseBtn");
const themeBtn     = document.getElementById("themeBtn");
const bgm          = document.getElementById("bgm");

/* ===== Init names ===== */
herNameEl.textContent = HER_NAME;
myNameEl.textContent  = YOUR_NAME;
frameNamesEl.textContent = `${YOUR_NAME} & ${HER_NAME}`;
plateTextEl.textContent  = `${INITIALS.you}${INITIALS.her}-❤️`;

/* ===== Music ===== */
if (MUSIC_SRC) {
  bgm.querySelector("source").src = MUSIC_SRC;
  bgm.load();
}
let musicOn = false;
musicBtn.addEventListener("click", () => {
  if (!MUSIC_SRC) {
    alert("No track set yet. Add an MP3 file and set MUSIC_SRC in script.js.");
    return;
  }
  musicOn = !musicOn;
  musicBtn.textContent = musicOn ? "Music: On ♪" : "Music: Off ♪";
  musicBtn.setAttribute("aria-pressed", String(musicOn));
  if (musicOn) bgm.play().catch(()=>{});
  else bgm.pause();
});

/* ===== Theme toggle ===== */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.setAttribute("aria-pressed", document.body.classList.contains("light"));
  localStorage.setItem("fts_theme", document.body.classList.contains("light") ? "light" : "dark");
});
(() => {
  const saved = localStorage.getItem("fts_theme");
  if (saved === "light") document.body.classList.add("light");
  themeBtn.setAttribute("aria-pressed", document.body.classList.contains("light"));
})();

/* ===== Scene switching ===== */
const SCENES = ["home","car","plane","picnic"];
const cards = document.querySelectorAll(".card");
cards.forEach(card=>{
  card.addEventListener("click", ()=>{
    const scene = card.dataset.scene;
    showScene(scene);
  });
});

function showScene(key){
  // hide all
  document.querySelectorAll(".scene").forEach(s=>{
    s.setAttribute("aria-hidden","true");
  });
  // show selected
  const el = document.getElementById(`scene-${key}`);
  if (el){ el.setAttribute("aria-hidden","false"); }
  // save
  localStorage.setItem("fts_last_scene", key);
  // small flourish if available
  flourish(key);
}

function flourish(key){
  if (key === "home"){
    burst(elCenter(document.querySelector("#scene-home .frame")));
  } else if (key === "car"){
    burst(elCenter(document.querySelector("#scene-car .car")));
  } else if (key === "plane"){
    burst({x: window.innerWidth*0.7, y: stage.getBoundingClientRect().top + 120});
  } else if (key === "picnic"){
    burst(elCenter(document.querySelector("#scene-picnic .note")));
  }
}

/* Surprise me */
surpriseBtn.addEventListener("click", ()=>{
  const random = SCENES[Math.floor(Math.random()*SCENES.length)];
  showScene(random);
});

/* Persist last scene */
(() => {
  const last = localStorage.getItem("fts_last_scene");
  showScene(last && SCENES.includes(last) ? last : "home");
})();

/* ===== Love note click ===== */
loveNoteEl.addEventListener("click", ()=>{
  const msg = `To ${HER_NAME},\n\nI love how you turn ordinary moments into forever memories. — ${YOUR_NAME}`;
  alert(msg);
});

/* ===== Tiny confetti (vanilla) ===== */
function burst(point){
  if (!point) return;
  const N = 24;
  for (let i=0;i<N;i++){
    const s = document.createElement("span");
    s.className = "confetti";
    s.style.left = (point.x - 4) + "px";
    s.style.top  = (point.y - 4) + "px";
    s.style.setProperty("--dx", (Math.random()*2-1)*180 + "px");
    s.style.setProperty("--dy", (Math.random()*-1)*220 + "px");
    s.style.setProperty("--rot", (Math.random()*360) + "deg");
    document.body.appendChild(s);
    setTimeout(()=> s.remove(), 900);
  }
}
function elCenter(el){
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width/2, y: r.top + r.height/2 };
}

/* ===== Stars background (canvas) ===== */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({length: Math.min(220, Math.floor((canvas.width*canvas.height)/18000))}).map(()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.2 + 0.2,
    s: Math.random()*0.5 + 0.2,
    a: Math.random()*Math.PI*2
  }));
}
window.addEventListener("resize", resize);
resize();
(function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (const st of stars){
    st.a += 0.02;
    const twinkle = (Math.sin(st.a)+1)/2; // 0..1
    ctx.globalAlpha = 0.4 + twinkle*0.6;
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r*(0.7 + twinkle*0.6), 0, Math.PI*2);
    ctx.fillStyle = "#dff";
    ctx.fill();
  }
  ctx.globalAlpha = 1;
})();

/* ===== Confetti styles (injected for brevity) ===== */
const style = document.createElement("style");
style.textContent = `
.confetti{
  position: fixed;
  width: 6px; height: 6px; background: hsl(${Math.floor(Math.random()*360)} 90% 60%);
  border-radius: 2px;
  animation: conf 0.9s ease-out forwards;
  pointer-events:none;
}
@keyframes conf{
  to{ transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0 }
}`;
document.head.appendChild(style);
