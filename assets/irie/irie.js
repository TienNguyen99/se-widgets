// ═══════════════════════════════════════
//  GLOBAL STATE
// ═══════════════════════════════════════
let goal_total  = 0;
let goal_amount = 0;
let fieldData, data, recents;
let textOrder = "", animationSpeed = "", textLabel = "";

// ── Sprite ──
let canvas = document.getElementById("canvasSrc");
let ctx    = canvas.getContext("2d");
canvas.width  = 256;
canvas.height = 256;
let spriteWidth  = 256;
let spriteHeight = 256;
const image = new Image();
image.src = "{{image}}";
let totalFrame = 9, currentFrame = 0;
let frameX = 0, frameY = 0;
let minFrame = 0, maxFrame = 8;
let frameDown = 0, speed = 0, animationId;

// ── 5 Wave Stars ──
const N = 5;
const STAR_SIZE   = 90;
const PINK        = '#f472b6';
const PINK2       = '#ec4899';
const EMPTY_COLOR = '#1e1535';
const BORDER_FULL = '#f9a8d4';
const BORDER_EMPTY= '#3d2f5a';
const starPhases  = [0, 0.5, 1.0, 1.5, 2.0];

const starCanvases = [];
const starCtxs     = [];
let   starRafId;
let   wasComplete  = false;

// ═══════════════════════════════════════
//  HELPERS — STAR DRAWING (WAVE IMPROVED)
// ═══════════════════════════════════════
function starPoints(cx, cy, outerR, innerR, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r     = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / n - Math.PI / 2;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return pts;
}

function drawStarCanvas(sCtx, pct, phase, t) {
  const S = STAR_SIZE;
  const cx = S / 2, cy = S / 2;
  const OR = S * 0.44, IR = S * 0.19;
  const pts = starPoints(cx, cy, OR, IR, 5);

  sCtx.clearRect(0, 0, S, S);

  // --- Nền ---
  sCtx.save();
  sCtx.beginPath();
  pts.forEach((p, i) => i ? sCtx.lineTo(p[0], p[1]) : sCtx.moveTo(p[0], p[1]));
  sCtx.closePath();
  sCtx.fillStyle = EMPTY_COLOR;
  sCtx.fill();
  sCtx.restore();

  // --- Sóng fill ---
  if (pct > 0) {
    const minY = cy - OR;
    const maxY = cy + OR;
    const fillH = maxY - minY;
    const fillTop = maxY - fillH * (pct / 100);
    const AMP = 5.0; // Tăng biên độ
    const WL = S * 0.5;

    sCtx.save();
    sCtx.beginPath();
    pts.forEach((p, i) => i ? sCtx.lineTo(p[0], p[1]) : sCtx.moveTo(p[0], p[1]));
    sCtx.closePath();
    sCtx.clip();

    // Layer 1
    sCtx.beginPath();
    sCtx.moveTo(0, S);
    for (let x = 0; x <= S; x++) {
      const y = fillTop 
        + Math.sin((x / WL) * Math.PI * 2 + phase + t * 2) * AMP
        + Math.cos((x / WL) * Math.PI + t) * (AMP * 0.5);
      sCtx.lineTo(x, y);
    }
    sCtx.lineTo(S, S);
    sCtx.closePath();
    sCtx.fillStyle = PINK2;
    sCtx.fill();

    // Layer 2
    sCtx.beginPath();
    sCtx.moveTo(0, S);
    for (let x = 0; x <= S; x++) {
      const y = fillTop + 4
        + Math.sin((x / WL) * Math.PI * 2 + phase + t * 2 + 1.5) * AMP;
      sCtx.lineTo(x, y);
    }
    sCtx.lineTo(S, S);
    sCtx.closePath();
    sCtx.fillStyle = PINK;
    sCtx.globalAlpha = 0.5;
    sCtx.fill();
    sCtx.globalAlpha = 1;
    sCtx.restore();
  }

  // --- Outline ---
  sCtx.save();
  sCtx.beginPath();
  pts.forEach((p, i) => i ? sCtx.lineTo(p[0], p[1]) : sCtx.moveTo(p[0], p[1]));
  sCtx.closePath();
  sCtx.strokeStyle = pct > 0 ? BORDER_FULL : BORDER_EMPTY;
  sCtx.lineWidth = 3;
  sCtx.stroke();
  sCtx.restore();
}

function getStarFill(idx, totalPct) {
  const per = 100 / N;
  const filled = totalPct / per;
  if (idx < Math.floor(filled)) return 100;
  if (idx > Math.floor(filled)) return 0;
  return Math.round((filled - Math.floor(filled)) * 100);
}

function animateStars(ts) {
  const t = ts / 500; // Tốc độ sóng
  const pct = Math.min(100, Math.max(0, (goal_amount / goal_total) * 100)) || 0;
  for (let i = 0; i < N; i++) {
    drawStarCanvas(starCtxs[i], getStarFill(i, pct), starPhases[i], t);
  }
  starRafId = requestAnimationFrame(animateStars);
}

function initStars() {
  for (let i = 0; i < N; i++) {
    const c = document.getElementById('star' + i);
    starCanvases.push(c);
    starCtxs.push(c.getContext('2d'));
  }
  requestAnimationFrame(animateStars);
}

// ═══════════════════════════════════════
//  INIT — StreamElements
// ═══════════════════════════════════════
window.addEventListener("onWidgetLoad", function (obj) {
  recents = obj.detail.recents;
  data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;

  goal_total = fieldData.goal_total;
  textOrder = fieldData.textOrder;
  textLabel = fieldData.textLabel;
  animationSpeed = fieldData.animationSpeed;
  speed = animationSpeed;

  switch (textOrder) {
    case "follower": goal_amount = data["follower-session"]["count"];    break;
    case "donation": goal_amount = data["tip-session"]["amount"];       break;
    case "bit":      goal_amount = data["cheer-session"]["amount"];      break;
    case "sub":      goal_amount = data["subscriber-session"]["count"];  break;
  }

  initStars();
  animateSprite();
  renderHTML();
  initAmbientSparkles();
});

// ═══════════════════════════════════════
//  EVENTS
// ═══════════════════════════════════════
window.addEventListener("onEventReceived", function (obj) {
  if (!obj.detail.event) return;
  if (typeof obj.detail.event.itemId !== "undefined")
    obj.detail.listener = "redemption-latest";

  const listener = obj.detail.listener;
  const event = obj.detail.event;

  switch (listener) {
    case "tip-latest":
      if (textOrder === "donation") { goal_amount += event.amount; triggerAnim(9,26); }
      break;
    case "follower-latest":
      if (textOrder === "follower") { goal_amount++; triggerAnim(9,26); }
      break;
    case "cheer-latest":
      if (textOrder === "bit")      { goal_amount += event.amount; triggerAnim(9,26); }
      break;
    case "subscriber-latest":
      if (textOrder === "sub" && !event.bulkGifted) { goal_amount++; triggerAnim(9,26); }
      break;
  }
  renderHTML();
});

// ═══════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════
function renderHTML() {
  let val = isNaN(goal_amount / goal_total) ? 100 : (goal_amount / goal_total) * 100;
  val = Math.max(0, Math.min(100, val));

  document.querySelector(".percent_value").textContent =
    Math.floor(goal_amount) + " / " + goal_total;
  document.querySelector(".goal_text").textContent = textLabel;

  if (val >= 100 && !wasComplete) {
    wasComplete = true;
    setTimeout(celebrate, 900);
  }
  if (val < 100) wasComplete = false;
}

// ═══════════════════════════════════════
//  SPRITE ANIMATION
// ═══════════════════════════════════════
function animateSprite() {
  animationId = requestAnimationFrame(animateSprite);
  frameDown++;
  if (frameDown % speed === 0) {
    currentFrame = currentFrame < maxFrame ? currentFrame + 1 : minFrame;
    frameX = currentFrame % totalFrame;
    frameY = Math.floor(currentFrame / totalFrame);
    ctx.clearRect(0, 0, 256, 256);
    ctx.drawImage(image, frameX*spriteWidth, frameY*spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    if (currentFrame === 26) { currentFrame = 0; setFrame(0, 8, animationSpeed); }
  }
}

function stopAnimation()          { cancelAnimationFrame(animationId); }
function triggerAnim(min, max)    { currentFrame = min; setFrame(min, max, animationSpeed); stopAnimation(); animateSprite(); }
function setFrame(mn, mx, spd)    { minFrame = mn; maxFrame = mx; speed = spd; frameDown = 0; }

// ═══════════════════════════════════════
//  CELEBRATE & PARTICLES
// ═══════════════════════════════════════
function celebrate() { spawnParticles(); spawnStars(); }

function spawnParticles() {
  const cont   = document.getElementById('particleCont');
  if (!cont) return;
  const colors = ['#f0abfc','#a855f7','#818cf8','#e879f9','#fff','#fbbf24'];
  for (let i = 0; i < 28; i++) {
    const el    = document.createElement('div');
    el.className= 'sp-particle';
    const angle = (i/28)*360 + Math.random()*13;
    const dist  = 60 + Math.random()*80;
    const rad   = angle * Math.PI / 180;
    const tx    = Math.cos(rad)*dist, ty = Math.sin(rad)*dist;
    const size  = 4 + Math.random()*7;
    const dur   = 0.6 + Math.random()*0.6;
    el.style.cssText = `left:50%;top:50%;width:${size}px;height:${size}px;background:${colors[i%colors.length]};--tx:${tx}px;--ty:${ty}px;--dur:${dur}s;box-shadow:0 0 ${size}px ${colors[i%colors.length]};`;
    cont.appendChild(el);
    setTimeout(() => el.remove(), dur*1000+100);
  }
}

function spawnStars() {
  const cont   = document.getElementById('particleCont');
  if (!cont) return;
  const emojis = ['✦','✧','⭐','💫','✨','⭐'];
  for (let i = 0; i < 10; i++) {
    const el    = document.createElement('div');
    el.className= 'star-burst';
    el.textContent = emojis[i % emojis.length];
    const angle = Math.random()*360;
    const dist  = 50 + Math.random()*100;
    const rad   = angle*Math.PI/180;
    const tx    = Math.cos(rad)*dist, ty = Math.sin(rad)*dist;
    const dur   = 0.7 + Math.random()*0.7;
    const rot   = (Math.random()-0.5)*360+'deg';
    el.style.cssText = `left:50%;top:50%;--tx:${tx}px;--ty:${ty}px;--dur:${dur}s;--rot:${rot};`;
    cont.appendChild(el);
    setTimeout(() => el.remove(), dur*1000+100);
  }
}

function initAmbientSparkles() {
  const cont = document.getElementById('particleCont');
  if (!cont) return;
  function spawn() {
    const el = document.createElement('div');
    el.className = 'ambient-sparkle';
    const angle  = Math.random()*360;
    const radius = 30 + Math.random()*55;
    const rad    = angle*Math.PI/180;
    const x      = 50 + Math.cos(rad)*radius;
    const y      = 50 + Math.sin(rad)*radius;
    const dur    = 1.8 + Math.random()*1.5;
    const drift  = -6 - Math.random()*12;
    const size   = 4 + Math.random()*5;
    el.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;--dur:${dur}s;--drift:${drift}px;`;
    cont.appendChild(el);
    setTimeout(() => el.remove(), dur*1000+50);
  }
  setInterval(spawn, 400+Math.random()*200);
  for (let i = 0; i < 5; i++) setTimeout(spawn, i*300);
}