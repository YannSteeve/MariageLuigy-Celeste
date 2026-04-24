const isMobile = window.matchMedia("(max-width: 520px), (pointer: coarse)").matches;

const palette = ['#a94c61','#d8aa47','#211005','#8f3446','#f1d58b','#6f2435','#d8aa47','#2f0710'];

function fillSegments(id, count = isMobile ? 12 : 24) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "kente-seg";
    s.style.background = palette[i % palette.length];
    el.appendChild(s);
  }
}

fillSegments("kenteTop");
fillSegments("kenteBottom");

const strip = document.getElementById("accentStrip");
if (strip) {
  strip.innerHTML = "";
  palette.concat(palette.slice(0, 2)).forEach(c => {
    const b = document.createElement("div");
    b.className = "accent-block";
    b.style.background = c;
    strip.appendChild(b);
  });
}

const syms = ["✦","◈","⬡","✣","◆","✧","⬢","✥"];
const bg = document.getElementById("adinkra-bg");
if (bg) {
  bg.innerHTML = "";
  const total = isMobile ? 24 : 48;
  for (let i = 0; i < total; i++) {
    const c = document.createElement("div");
    c.className = "adinkra-cell";
    c.style.setProperty("--i", i);
    c.textContent = syms[i % syms.length];
    bg.appendChild(c);
  }
}

const rG = document.getElementById("rideau-gauche");
const rD = document.getElementById("rideau-droite");
const flash = document.getElementById("flash-dore");

setTimeout(() => {
  if (flash) {
    flash.classList.add("actif");
    setTimeout(() => flash.classList.add("efface"), 80);
    setTimeout(() => flash.remove(), 450);
  }

  if (rG) rG.classList.add("ouvert");
  if (rD) rD.classList.add("ouvert");

  setTimeout(() => {
    if (rG) rG.remove();
    if (rD) rD.remove();
  }, 1300);
}, 400);

const canvas = document.getElementById("sparkle-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];
let animationRunning = false;

const COLORS = ["#d8aa47","#f1d58b","#ffffff","#fff7ec"];
const SHAPES = isMobile ? ["diamond","circle"] : ["diamond","cross","star","circle"];

function resize() {
  if (!canvas) return;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

if (canvas && ctx) {
  resize();
  addEventListener("resize", resize);
}

class Particle {
  constructor(x, y, burst = false) {
    const mobileFactor = isMobile ? 0.45 : 1;

    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * (burst ? 8 : 2) * mobileFactor;
    this.vy = ((Math.random() - 0.5) * (burst ? 7 : 2) - Math.random() * (burst ? 4 : 1)) * mobileFactor;
    this.size = burst ? Math.random() * 3 + 1.2 : Math.random() * 1.8 + 0.8;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.life = 1;
    this.decay = burst ? 0.025 : 0.014;
    this.rot = Math.random() * Math.PI * 2;
    this.rotV = (Math.random() - 0.5) * 0.12;
    this.gravity = burst ? 0.08 : 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.rot += this.rotV;
    this.life -= this.decay;
  }

  draw(c) {
    c.save();
    c.globalAlpha = Math.max(0, this.life);
    c.translate(this.x, this.y);
    c.rotate(this.rot);
    c.fillStyle = this.color;
    c.strokeStyle = this.color;

    const s = this.size;

    if (this.shape === "diamond") {
      c.beginPath();
      c.moveTo(0, -s);
      c.lineTo(s, 0);
      c.lineTo(0, s);
      c.lineTo(-s, 0);
      c.closePath();
      c.fill();
    } else if (this.shape === "cross") {
      c.lineWidth = s * 0.45;
      c.beginPath();
      c.moveTo(-s, 0);
      c.lineTo(s, 0);
      c.moveTo(0, -s);
      c.lineTo(0, s);
      c.stroke();
    } else if (this.shape === "star") {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5 - Math.PI / 2;
        const a2 = a + Math.PI / 5;
        c.lineTo(Math.cos(a) * s, Math.sin(a) * s);
        c.lineTo(Math.cos(a2) * s * 0.4, Math.sin(a2) * s * 0.4);
      }
      c.closePath();
      c.fill();
    } else {
      c.beginPath();
      c.arc(0, 0, s * 0.55, 0, Math.PI * 2);
      c.fill();
    }

    c.restore();
  }
}

function startAnimation() {
  if (animationRunning || !ctx || !canvas) return;
  animationRunning = true;
  requestAnimationFrame(tick);
}

function tick() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });

  if (particles.length > 0) {
    requestAnimationFrame(tick);
  } else {
    animationRunning = false;
  }
}

function burst(x, y, count) {
  if (!ctx || !canvas) return;

  const maxParticles = isMobile ? 35 : 130;
  const realCount = Math.min(count, isMobile ? 12 : count);

  for (let i = 0; i < realCount; i++) {
    if (particles.length >= maxParticles) break;
    particles.push(new Particle(x, y, true));
  }

  startAnimation();
}

setTimeout(() => {
  const cx = innerWidth / 2;
  const cy = innerHeight / 2;

  burst(cx, cy, isMobile ? 14 : 55);

  if (!isMobile) {
    setTimeout(() => burst(cx - 110, cy - 70, 35), 240);
    setTimeout(() => burst(cx + 110, cy - 70, 35), 420);
    setTimeout(() => burst(cx, cy - 135, 45), 620);
  }
}, 1600);

if (!isMobile) {
  setInterval(() => {
    const x = Math.random() * innerWidth;
    const y = Math.random() * innerHeight * 0.82;
    particles.push(new Particle(x, y, false));
    startAnimation();
  }, 1800);

  setInterval(() => {
    const pos = [[.14,.26],[.86,.26],[.5,.12],[.12,.78],[.88,.78]];
    const [px, py] = pos[Math.floor(Math.random() * pos.length)];
    burst(innerWidth * px, innerHeight * py, 18);
  }, 6500);
}

function spawnSymbol() {
  if (isMobile) return;

  const el = document.createElement("div");
  el.className = "float-symbol";

  const symbols = ["✦","✝","◆","✧","◈","🕊"];
  el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  const dur = Math.random() * 2 + 3;
  el.style.setProperty("--dur", dur + "s");
  el.style.setProperty("--x", (Math.random() * 90 + 5) + "vw");
  el.style.setProperty("--y", (Math.random() * 62 + 18) + "vh");
  el.style.setProperty("--rot", (Math.random() * 70 - 35) + "deg");

  document.body.appendChild(el);
  setTimeout(() => el.remove(), (dur + 0.4) * 1000);
}

if (!isMobile) {
  setInterval(spawnSymbol, 3500);
  for (let i = 0; i < 3; i++) setTimeout(spawnSymbol, i * 600);
}

function scriptureGlow() {
  if (isMobile) return;

  const lines = ["Dieu est amour", "Alliance bénie", "Unis par la grâce", "Soli Deo Gloria"];
  const el = document.createElement("div");

  el.className = "scripture-glow";
  el.textContent = lines[Math.floor(Math.random() * lines.length)];
  el.style.setProperty("--x", (Math.random() * 55 + 22) + "vw");
  el.style.setProperty("--y", (Math.random() * 45 + 18) + "vh");

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

if (!isMobile) {
  setInterval(scriptureGlow, 7000);
  setTimeout(scriptureGlow, 3000);
}

document.addEventListener("click", e => {
  burst(e.clientX, e.clientY, isMobile ? 6 : 18);

  if (isMobile) return;

  const halo = document.createElement("div");
  halo.className = "click-blessing";
  halo.style.left = e.clientX + "px";
  halo.style.top = e.clientY + "px";

  document.body.appendChild(halo);
  setTimeout(() => halo.remove(), 1200);
});