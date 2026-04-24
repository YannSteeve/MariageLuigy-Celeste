const palette=['#a94c61','#d8aa47','#211005','#8f3446','#f1d58b','#6f2435','#d8aa47','#2f0710'];

function fillSegments(id,count=24){
  const el=document.getElementById(id);
  if(!el) return;
  for(let i=0;i<count;i++){
    const s=document.createElement('div');
    s.className='kente-seg';
    s.style.background=palette[i%palette.length];
    el.appendChild(s);
  }
}
fillSegments('kenteTop');
fillSegments('kenteBottom');

const strip=document.getElementById('accentStrip');
if(strip){
  palette.concat(palette.slice(0,2)).forEach(c=>{
    const b=document.createElement('div');
    b.className='accent-block';
    b.style.background=c;
    strip.appendChild(b);
  });
}

const syms=['✦','◈','⬡','✣','◆','✧','⬢','✥'];
const bg=document.getElementById('adinkra-bg');
if(bg){
  for(let i=0;i<48;i++){
    const c=document.createElement('div');
    c.className='adinkra-cell';
    c.style.setProperty('--i',i);
    c.textContent=syms[i%syms.length];
    bg.appendChild(c);
  }
}

const canvas=document.getElementById('sparkle-canvas');
const ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
resize();
addEventListener('resize',resize);

const COLORS=['#d8aa47','#f1d58b','#a94c61','#ffffff','#fff7ec','#8f3446'];
const SHAPES=['diamond','cross','star','circle','dove','adinkra'];

class Particle{
  constructor(x,y,burst=false){
    this.x=x;
    this.y=y;
    this.vx=(Math.random()-.5)*(burst?14:3.6);
    this.vy=(Math.random()-.5)*(burst?12:3)-Math.random()*(burst?7:1.5);
    this.size=burst?Math.random()*5+2:Math.random()*2.8+1;
    this.color=COLORS[Math.floor(Math.random()*COLORS.length)];
    this.shape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
    this.life=1;
    this.decay=burst?Math.random()*.016+.008:Math.random()*.008+.004;
    this.rot=Math.random()*Math.PI*2;
    this.rotV=(Math.random()-.5)*.22;
    this.gravity=burst?.17:.035;
  }
  update(){
    this.x+=this.vx;
    this.y+=this.vy;
    this.vy+=this.gravity;
    this.vx*=.982;
    this.rot+=this.rotV;
    this.life-=this.decay;
  }
  draw(c){
    c.save();
    c.globalAlpha=Math.max(0,this.life);
    c.translate(this.x,this.y);
    c.rotate(this.rot);
    c.fillStyle=this.color;
    c.strokeStyle=this.color;
    const s=this.size;
    if(this.shape==='diamond'){
      c.beginPath();c.moveTo(0,-s);c.lineTo(s,0);c.lineTo(0,s);c.lineTo(-s,0);c.closePath();c.fill();
    }else if(this.shape==='cross'){
      c.lineWidth=s*.45;c.beginPath();c.moveTo(-s,0);c.lineTo(s,0);c.moveTo(0,-s);c.lineTo(0,s);c.stroke();
    }else if(this.shape==='star'){
      c.beginPath();
      for(let i=0;i<5;i++){
        const a=i*Math.PI*2/5-Math.PI/2;
        const a2=a+Math.PI/5;
        c.lineTo(Math.cos(a)*s,Math.sin(a)*s);
        c.lineTo(Math.cos(a2)*s*.4,Math.sin(a2)*s*.4);
      }
      c.closePath();c.fill();
    }else if(this.shape==='dove'){
      c.font=(s*4)+'px serif';c.textAlign='center';c.textBaseline='middle';c.fillText('🕊',0,0);
    }else if(this.shape==='adinkra'){
      c.font=(s*3.5)+'px serif';c.textAlign='center';c.textBaseline='middle';c.fillText('✦',0,0);
    }else{
      c.beginPath();c.arc(0,0,s*.55,0,Math.PI*2);c.fill();
    }
    c.restore();
  }
}

let particles=[];
function burst(x,y,count){
  for(let i=0;i<count;i++) particles.push(new Particle(x,y,true));
}

(function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles=particles.filter(p=>p.life>0);
  particles.forEach(p=>{p.update();p.draw(ctx)});
  requestAnimationFrame(tick);
})();

const rG=document.getElementById('rideau-gauche');
const rD=document.getElementById('rideau-droite');
const flash=document.getElementById('flash-dore');

setTimeout(()=>{
  flash.classList.add('actif');
  setTimeout(()=>flash.classList.add('efface'),90);
  setTimeout(()=>flash.remove(),520);
  rG.classList.add('ouvert');
  rD.classList.add('ouvert');
  setTimeout(()=>{rG.remove();rD.remove()},1450);
},450);

setTimeout(()=>{
  const cx=innerWidth/2, cy=innerHeight/2;
  burst(cx,cy,55);
  setTimeout(()=>burst(cx-110,cy-70,70),240);
  setTimeout(()=>burst(cx+110,cy-70,70),420);
  setTimeout(()=>burst(cx,cy-135,110),620);
},1750);

setInterval(()=>{
  const x=Math.random()*innerWidth;
  const y=Math.random()*innerHeight*.82;
  for(let i=0;i<2;i++) particles.push(new Particle(x,y,false));
},560);

setInterval(()=>{
  const pos=[[.14,.26],[.86,.26],[.5,.12],[.12,.78],[.88,.78]];
  const [px,py]=pos[Math.floor(Math.random()*pos.length)];
  burst(innerWidth*px,innerHeight*py,38);
},3400);

function spawnSymbol(){
  const el=document.createElement('div');
  el.className='float-symbol';
  const symbols=['✦','✝','◆','✧','◈','🕊'];
  el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
  const dur=Math.random()*3+3;
  el.style.setProperty('--dur',dur+'s');
  el.style.setProperty('--x',(Math.random()*90+5)+'vw');
  el.style.setProperty('--y',(Math.random()*62+18)+'vh');
  el.style.setProperty('--rot',(Math.random()*70-35)+'deg');
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),(dur+.4)*1000);
}
setInterval(spawnSymbol,2200);
for(let i=0;i<7;i++) setTimeout(spawnSymbol,i*180);

function scriptureGlow(){
  const lines=['Dieu est amour','Alliance bénie','Unis par la grâce','Soli Deo Gloria'];
  const el=document.createElement('div');
  el.className='scripture-glow';
  el.textContent=lines[Math.floor(Math.random()*lines.length)];
  el.style.setProperty('--x',(Math.random()*55+22)+'vw');
  el.style.setProperty('--y',(Math.random()*45+18)+'vh');
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),4200);
}
setInterval(scriptureGlow,5200);
setTimeout(scriptureGlow,2600);

document.addEventListener('click',e=>{
  burst(e.clientX,e.clientY,18);
  const halo=document.createElement('div');
  halo.className='click-blessing';
  halo.style.left=e.clientX+'px';
  halo.style.top=e.clientY+'px';
  document.body.appendChild(halo);
  setTimeout(()=>halo.remove(),1200);
});
