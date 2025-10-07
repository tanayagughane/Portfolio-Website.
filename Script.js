/* ================= Particle/Tech background ================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let DPR = window.devicePixelRatio || 1;
let w = innerWidth, h = innerHeight;
function resizeCanvas(){
  DPR = window.devicePixelRatio || 1;
  canvas.width = innerWidth * DPR;
  canvas.height = innerHeight * DPR;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  w = innerWidth; h = innerHeight;
}
resizeCanvas();

const particles = [];
const PCOUNT = Math.max(40, Math.floor((w*h)/70000));
function rand(min,max){return Math.random()*(max-min)+min}

class Particle{
  constructor(){ this.reset(); }
  reset(){
    this.x = rand(0,w);
    this.y = rand(0,h);
    this.vx = rand(-0.3,0.3);
    this.vy = rand(-0.3,0.3);
    this.r = rand(1.2,2.6);
    this.alpha = rand(0.2,0.9);
  }
  step(){ this.x += this.vx; this.y += this.vy; if(this.x < -50 || this.x > w+50 || this.y < -50 || this.y > h+50) this.reset(); }
  draw(){ ctx.beginPath(); ctx.globalAlpha = this.alpha; ctx.fillStyle = '#bfefff'; ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); }
}
for(let i=0;i<PCOUNT;i++) particles.push(new Particle());

function loop(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'rgba(124,92,255,0.03)');
  g.addColorStop(1,'rgba(0,212,255,0.02)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  for(let i=0;i<particles.length;i++){
    const p = particles[i];
    p.step(); p.draw();
    for(let j=i+1;j<particles.length;j++){
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if(d < 120){
        ctx.beginPath();
        ctx.globalAlpha = (1 - d/120) * 0.12;
        ctx.strokeStyle = '#9be8ff';
        ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
loop();

window.addEventListener('resize', () => { resizeCanvas(); });

/* ================= Typed intro ================= */
const typedEl = document.getElementById('typed');
const phrases = ['Web Developer','Full-stack Developer','Problem Solver','B.E. (CSE)-2025 (Fresher)'];
let pi = 0, ci = 0, del = false;
function typeTick(){
  const cur = phrases[pi];
  if(!del){
    typedEl.textContent = cur.slice(0, ci + 1);
    ci++;
    if(ci === cur.length){ del = true; setTimeout(typeTick,900); return; }
  } else {
    typedEl.textContent = cur.slice(0, ci - 1);
    ci--;
    if(ci === 0){ del = false; pi = (pi+1)%phrases.length; }
  }
  setTimeout(typeTick, del ? 50 : 110);
}
typeTick();

/* ================= Scroll reveal using IntersectionObserver ================= */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('visible'); });
}, {threshold: 0.12});
revels = reveals; reveals.forEach(r => io.observe(r));

/* ================= Nav active on scroll ================= */
const links = document.querySelectorAll('.nav-link');
const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href')));
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 140;
  for(let i = sections.length - 1; i >= 0; i--){
    if(sections[i] && pos >= sections[i].offsetTop){
      links.forEach(a => a.classList.remove('active'));
      links[i].classList.add('active');
      break;
    }
  }
});

/* ================= Theme toggle & resume download ================= */
document.getElementById('toggle-theme').addEventListener('click', () => document.body.classList.toggle('light'));
document.getElementById('download-resume').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = 'resume.pdf'; a.download = 'Tanaya_Gughane_Resume.pdf';
  document.body.appendChild(a); a.click(); a.remove();
});

/* ================= Contact form (mailto) ================= */
function sendMail(e){
  e.preventDefault();
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const subject = document.getElementById('csubject').value.trim() || 'Contact from Portfolio';
  const message = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${document.getElementById('cmessage').value.trim()}`);
  const mailto = `mailto:tanaya16gughane@gmail.com?subject=${encodeURIComponent(subject)}&body=${message}`;
  window.location.href = mailto;
}
function copyEmail(){ navigator.clipboard.writeText('tanaya16gughane@gmail.com').then(()=> alert('Email copied to clipboard')); }

/* Smooth scroll for nav & in-page anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  });
});

/* Accessibility: reveal outlines on keyboard nav */
document.body.addEventListener('keydown', (e) => { if(e.key === 'Tab') document.body.classList.add('keyboard-nav'); });
