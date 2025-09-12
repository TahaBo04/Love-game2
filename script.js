/*********** Personal defaults ***********/
let YOU = "Taha";
let HER  = "Soumaya";
const INITIALS = { you: "T", her: "S" }; // for car plate

/*********** DOM ***********/
const listEl = document.getElementById("sceneList");
const stage  = document.getElementById("stage");
const titleEl= document.getElementById("sceneTitle");
const emojiEl= document.getElementById("sceneEmoji");
const captionEl = document.getElementById("sceneCaption");
const pairNamesEl = document.getElementById("pairNames");
const plateEl = document.getElementById("plate");
const loveNoteBtn = document.getElementById("loveNote");

const inpEmoji = document.getElementById("inpEmoji");
const inpTitle = document.getElementById("inpTitle");
const inpCaption = document.getElementById("inpCaption");
const inpBg = document.getElementById("inpBg");
const inpYou = document.getElementById("inpYou");
const inpHer = document.getElementById("inpHer");

const btnSave = document.getElementById("btnSave");
const btnReset= document.getElementById("btnReset");
const btnRandom = document.getElementById("btnRandom");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnTheme= document.getElementById("btnTheme");
const btnMusic= document.getElementById("btnMusic");
const bgm = document.getElementById("bgm");

/*********** Scenes state ***********/
const DEFAULT_SCENES = [
  { id:"home",  emoji:"🏠", title:"Our Cozy Home", caption:"This is our living room… someday it will be our everyday.", bg:"", anim:"home" },
  { id:"car",   emoji:"🚗", title:"Road Trip",      caption:"Windows down, music up, your hand in mine.", bg:"", anim:"car" },
  { id:"plane", emoji:"✈️", title:"Fly Away",       caption:"We’ll chase sunsets and return with stories only we understand.", bg:"", anim:"plane" },
  { id:"picnic",emoji:"🧺", title:"Picnic Date",    caption:"Fresh air, soft grass, your laugh—it’s perfect with you.", bg:"", anim:"picnic" },
];

let scenes = load("fts_scenes") || DEFAULT_SCENES.slice();
let index = clampIndex( load("fts_index") ?? 0 );
applyTheme(load("fts_theme") || "dark");

/*********** Build sidebar list ***********/
function renderList(){
  listEl.innerHTML = "";
  scenes.forEach((sc, i)=>{
    const item = document.createElement("button");
    item.className = "scene-item" + (i===index ? " active":"");
    item.innerHTML = `
      <span class="emoji">${sc.emoji}</span>
      <div class="scene-meta">
        <span class="scene-title">${sc.title}</span>
        <span class="scene-small">${sc.id}</span>
      </div>`;
    item.addEventListener("click", ()=> { index=i; save("fts_index", index); show(i); });
    listEl.appendChild(item);
  });
}

/*********** Show scene ***********/
function show(i){
  index = clampIndex(i);
  const sc = scenes[index];

  // stage text
  emojiEl.textContent = sc.emoji || "✨";
  titleEl.textContent = sc.title || "Untitled";
  captionEl.textContent = sc.caption || "";

  // background
  if (sc.bg && sc.bg.trim().length){
    stage.style.setProperty("--bgimg", `url("${sc.bg}")`);
  } else {
    stage.style.setProperty("--bgimg", `linear-gradient(180deg,#0e1730,#0a1224)`);
  }

  // names + plate
  pairNamesEl.textContent = `${YOU} & ${HER}`;
  plateEl.textContent = `${INITIALS.you}${INITIALS.her}-❤️`;

  // toggle demo anim blocks
  document.querySelectorAll(".anim").forEach(el=> el.hidden = true);
  const map = {home:"animHome", car:"animCar", plane:"animPlane", picnic:"animPicnic"};
  const animId = map[sc.id] || map[sc.anim] || "animHome";
  const animEl = document.getElementById(animId);
  if (animEl) animEl.hidden = false;

  // fill panel inputs
  inpEmoji.value = sc.emoji;
  inpTitle.value = sc.title;
  inpCaption.value = sc.caption;
  inpBg.value = sc.bg || "";
  inpYou.value = YOU;
  inpHer.value = HER;

  // active state in list
  document.querySelectorAll(".scene-item").forEach((it, k)=>{
    it.classList.toggle("active", k===index);
  });

  save("fts_index", index);
}
function clampIndex(i){ return Math.max(0, Math.min(i, (scenes.length-1))); }

/*********** Save edited scene ***********/
btnSave.addEventListener("click", ()=>{
  const sc = scenes[index];
  sc.emoji = inpEmoji.value || sc.emoji;
  sc.title = inpTitle.value || sc.title;
  sc.caption = inpCaption.value || "";
  sc.bg = inpBg.value || "";
  YOU = inpYou.value || YOU;
  HER = inpHer.value || HER;

  save("fts_scenes", scenes);
  save("fts_names", {YOU, HER});
  renderList(); show(index);
  flash(btnSave);
});

/*********** Reset defaults ***********/
btnReset.addEventListener("click", ()=>{
  if (!confirm("Reset all scenes to defaults?")) return;
  scenes = DEFAULT_SCENES.slice();
  save("fts_scenes", scenes);
  const storedNames = load("fts_names");
  if (storedNames){ YOU = storedNames.YOU; HER = storedNames.HER; }
  renderList(); show(0);
});

/*********** Random / Next / Prev ***********/
btnRandom.addEventListener("click", ()=>{
  const i = Math.floor(Math.random()*scenes.length);
  show(i);
  confettiCenter();
});
btnNext.addEventListener("click", ()=> show(index+1));
btnPrev.addEventListener("click", ()=> show(index-1));

/*********** Theme ***********/
btnTheme.addEventListener("click", ()=>{
  const t = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(t);
});
function applyTheme(t){
  document.body.classList.toggle("light", t==="light");
  btnTheme.setAttribute("aria-pressed", t==="light");
  save("fts_theme", t);
}

/*********** Music ***********/
let musicOn = false;
btnMusic.addEventListener("click", ()=>{
  musicOn = !musicOn;
  btnMusic.textContent = musicOn ? "Music: On ♪" : "Music: Off ♪";
  btnMusic.setAttribute("aria-pressed", String(musicOn));
  if (musicOn) bgm.play().catch(()=>{}); else bgm.pause();
});
// iOS unlock once
window.addEventListener("touchend", unlockOnce, {once:true});
window.addEventListener("click", unlockOnce, {once:true});
function unlockOnce(){ bgm.play().then(()=>bgm.pause()).catch(()=>{}); }

/*********** Cute interactions ***********/
if (loveNoteBtn){
  loveNoteBtn.addEventListener("click", ()=>{
    alert(`To ${HER},\n\nI love how you turn ordinary moments into forever memories.\n— ${YOU}`);
  });
}

/*********** Export / Import ***********/
document.getElementById("btnExport").addEventListener("click", ()=>{
  const data = JSON.stringify({ scenes, names:{YOU, HER} }, null, 2);
  const blob = new Blob([data], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "future-together-scenes.json";
  a.click();
});
document.getElementById("fileImport").addEventListener("change", (e)=>{
  const file = e.target.files?.[0]; if(!file) return;
  file.text().then(txt=>{
    try{
      const obj = JSON.parse(txt);
      if (obj.names){ YOU = obj.names.YOU || YOU; HER = obj.names.HER || HER; save("fts_names", {YOU, HER}); }
      if (Array.isArray(obj.scenes)){ scenes = obj.scenes; save("fts_scenes", scenes); }
      renderList(); show(0);
    }catch(err){ alert("Invalid JSON"); }
  });
});

/*********** Utilities ***********/
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key){ const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
function flash(btn){ btn.classList.add("primary"); setTimeout(()=>btn.classList.remove("primary"), 500); }
function confettiCenter(){
  const r = stage.getBoundingClientRect();
  const point = {x: r.left + r.width/2, y: r.top + 100};
  burst(point);
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
// confetti style injection
const style = document.createElement("style");
style.textContent = `
.confetti{ position:fixed; width:6px; height:6px; background:hsl(${Math.floor(Math.random()*360)} 90% 60%);
  border-radius:2px; animation:conf .9s ease-out forwards; pointer-events:none }
@keyframes conf{ to{ transform: translate(var(--dx),var(--dy)) rotate(var(--rot)); opacity:0 } }`;
document.head.appendChild(style);

/*********** Boot ***********/
const storedNames = load("fts_names");
if (storedNames){ YOU = storedNames.YOU || YOU; HER = storedNames.HER || HER; }
renderList();
show(index);
