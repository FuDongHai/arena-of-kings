// Combat state is shared by player and AI; visuals never cause damage.
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const enemies=(g,p)=>g.units.filter(u=>u.hp>0&&u.team!==p.team);
const clamp=v=>Math.max(70,Math.min(2330,v));
export function effect(g,type,p,r=100,extra={}){
 const life=extra.life||.65;
 if(g.effects.length>=420)g.effects.splice(0,g.effects.length-419);
 g.effects.push({type,x:p.x,y:p.y,color:p.color||'#e5faff',r,life,max:life,angle:p.face||0,seed:++g.fxId,...extra,color:extra.color||p.color||(p.team===1?'#ffc48a':'#8edcff')});
}
function later(g,delay,source,run){g.pending.push({at:g.time+delay,source,run});}
function hit(g,p,u,amount,mark=true){if(u.hp<=0||g.result)return false;if(u.invulnerable>0||u.guard>0){g.damage(u,amount,p);return false;}g.damage(u,amount,p);if(p.heroId==='diaochan'&&mark&&u.hp>0){u.flowers??={};const n=(u.flowers[p.id]?.count||0)+1;u.flowers[p.id]={count:n,time:5};if(n>=4){delete u.flowers[p.id];effect(g,'bloom',u,150,{color:p.color,life:1});p.hp=Math.min(p.mhp,p.hp+125);for(const e of enemies(g,p))if(distance(u,e)<155){if(hit(g,p,e,p.atk*1.8,false)!==false)e.slow=1.3;}}}return true;}
function area(g,p,at,r,damage,stun=0){const struck=[];for(const u of enemies(g,p))if(distance(at,u)<r&&hit(g,p,u,damage)!==false){u.stun=Math.max(u.stun||0,stun);struck.push(u);}return struck;}
function dash(g,p,a,d,kind){const from={x:p.x,y:p.y,color:p.color,face:a};p.x=clamp(p.x+Math.cos(a)*d);p.y=clamp(p.y+Math.sin(a)*d);effect(g,kind,from,d,{tx:p.x,ty:p.y,angle:a,heroId:p.heroId,life:.7});}
function projectile(g,p,a,kind,damage,range=650,extra={}){const q={x:p.x,y:p.y,start:{x:p.x,y:p.y},source:p,team:p.team,angle:a,kind,color:p.color||(p.team===1?'#ffc48a':'#8edcff'),damage,speed:780,radius:35,range,travel:0,life:4,phase:'out',hits:new Set(),trail:[],...extra};g.projectiles.push(q);return q;}
export function basicAttack(g,p,t){
 if(p.hp<=0||t.hp<=0||p.cool>0||p.stun>0||p.dancing>0)return false;
 const power=p.empowered,reach=p.range+70+(power?170:0);if(distance(p,t)>reach)return false;
 const angle=Math.atan2(t.y-p.y,t.x-p.x),windup=p.kind==='hero'?(p.heroId==='wukong'?.26:p.heroId==='kai'?.24:.2):0;
 p.face=angle;p.cool=p.kind==='hero'?.7:1.2;p.empowered=null;
 if(p.kind==='hero')p.attackMotion={start:g.time,windup,duration:.56,angle,strong:!!power};
 const motion=p.attackMotion;const strike=()=>{
  if(p.stun>0||p.dancing>0||(windup&&p.attackMotion!==motion)||t.hp<=0||distance(p,t)>reach+45)return;
  let damage=p.atk*(power?.mult||1);
  if(p.heroId==='wukong'&&t.staffMarks?.[p.id]>0){damage+=p.atk*.65;t.staffMarks[p.id]--;}
  if(p.range>200){projectile(g,p,angle,p.heroId==='diaochan'?'petal':power?'chargedShot':'shot',damage,power?850:650,{target:power?null:t,speed:power?1300:1000,pierce:!!power,radius:power?48:25});effect(g,'muzzle',p,power?110:55,{life:.35});}
  else{const landed=hit(g,p,t,damage);effect(g,p.heroId==='wukong'?'staffSweep':'crescent',p,power?165:115,{angle,color:p.color,life:power?.65:.4,strong:!!power});effect(g,'impact',t,power?95:45,{color:p.color,life:.45});if(p.heroId==='libai'&&landed){p.passiveStacks=Math.min(4,(p.passiveStacks||0)+1);p.passiveTime=5;if(p.passiveStacks===4)effect(g,'unlock',p,90,{life:.7});}}
 };
 if(windup)later(g,windup,p,strike);else strike();return true;
}
export function castHero(g,p,i,aim){g.lastCastError='';if(g.result||p.hp<=0||p.stun>0||p.dancing>0||p.cd[i]>0)return false;const s=p.skills[i];if(!s)return false;const id=p.heroId;
 if(id==='libai'&&i===2&&(p.passiveStacks||0)<4){g.lastCastError='青莲剑歌：普攻命中四次，解锁大招';return false;}
 const staged=id==='libai'&&i===0&&p.dashStage;if(!staged&&p.mana<s.cost)return false;if(!staged)p.mana-=s.cost;p.cd[i]=s.cool;const a=aim||{x:p.x+Math.cos(p.face)*400,y:p.y+Math.sin(p.face)*400},angle=Math.atan2(a.y-p.y,a.x-p.x);p.face=angle;p.attackMotion=null;p.casting=.45;g.recall=0;
 if(id==='libai'){
  if(i===0){if(!p.dashStage){p.dashOrigin={x:p.x,y:p.y};p.dashStage=1;p.dashWindow=5;effect(g,'origin',p,50,{life:5});}else p.dashStage++;if(p.dashStage===3){const from={...p};Object.assign(p,p.dashOrigin);effect(g,'dashTrail',from,distance(from,p),{tx:p.x,ty:p.y,life:.65});p.dashStage=0;p.dashWindow=0;}else{const from={x:p.x,y:p.y};dash(g,p,angle,250,'dashTrail');for(const u of enemies(g,p))if(segmentDistance(u,from,p)<85){if(hit(g,p,u,p.atk*1.6)!==false)u.stun=.35;}p.cd[0]=.4;}}
  if(i===1){area(g,p,p,235,p.atk*1.5);p.invulnerable=.3;g.fields.push({kind:'swordCircle',x:p.x,y:p.y,r:235,time:2,max:2,source:p,hits:new Set()});effect(g,'swordCircle',p,235,{life:2});}
  if(i===2){p.passiveStacks=0;p.dancing=1.1;p.invulnerable=1.1;const center={x:p.x+Math.cos(angle)*150,y:p.y+Math.sin(angle)*150};effect(g,'swordDance',center,300,{angle,life:1.5,heroId:id});for(let j=0;j<5;j++)later(g,.08+j*.2,p,()=>{area(g,p,center,300,p.atk*.95);effect(g,'swordStrike',center,285,{angle:angle+(j%2?-.65:.65),life:.45});});}
 }
 if(id==='kai'){
  if(i===0)projectile(g,p,angle,'blade',p.atk*2,650,{speed:850,radius:55,chain:0});
  if(i===1){dash(g,p,angle,160,'dashTrail');p.empowered={time:5,mult:1.8};for(let j=0;j<2;j++)later(g,j*.2,p,()=>{area(g,p,p,205,p.atk*1.2,j?.65:0);effect(g,'crescent',p,205,{angle:angle+(j?-.4:.4),life:.6,strong:true});});}
  if(i===2){if(p.buff){p.atk-=p.buff.attack;p.armor-=p.buff.armor;}p.buff={time:8,attack:65,armor:30};p.atk+=65;p.armor+=30;effect(g,'armorRise',p,180,{life:1.2});area(g,p,p,180,p.atk);}
 }
 if(id==='diaochan'){
  if(i===0)projectile(g,p,angle,'flower',p.atk*1.45,650,{speed:700,radius:65,pierce:true});
  if(i===1){dash(g,p,angle,220,'petalDash');p.invulnerable=.25;const targets=enemies(g,p).filter(u=>distance(p,u)<500).sort((a,b)=>distance(p,a)-distance(p,b));for(let j=0;j<3;j++)if(targets.length)projectile(g,p,angle+j*.7,'petal',p.atk*.85,700,{target:targets[j%targets.length],speed:650,offset:j*.12,reduces:true});}
  if(i===2){g.fields.push({kind:'lotus',x:p.x,y:p.y,r:320,time:8,max:8,source:p});area(g,p,p,320,p.atk);effect(g,'bloom',p,240,{life:1});}
 }
 if(id==='sunshangxiang'){
  if(i===0){dash(g,p,angle,230,'rollTrail');p.empowered={time:5,mult:2.5};effect(g,'charge',p,90,{life:.7});}
  if(i===1){const d=Math.min(500,distance(p,a)),at={x:p.x+Math.cos(angle)*d,y:p.y+Math.sin(angle)*d};effect(g,'grenade',p,170,{tx:at.x,ty:at.y,life:.55});later(g,.55,p,()=>{for(const u of area(g,p,at,170,p.atk*2.8))u.slow=1.5;effect(g,'explosion',at,170,{color:'#ffb55f',life:1});});}
  if(i===2){projectile(g,p,angle,'cannon',p.atk*5,950,{speed:1050,radius:60});effect(g,'muzzle',p,150,{life:.5});}
 }
 if(id==='wukong'){
  p.empowered={time:5,mult:2.2};
  if(i===0){p.guard=1;effect(g,'guard',p,85,{life:1});}
  if(i===1){dash(g,p,angle,280,'cloudLeap');p.leaping=.55;}
  if(i===2){p.casting=.7;effect(g,'staffSlam',p,320,{life:1.3});later(g,.18,p,()=>{for(const u of area(g,p,p,320,p.atk*3.5,1)){u.staffMarks??={};u.staffMarks[p.id]=3;u.staffMarkTime=5;}effect(g,'fissure',p,320,{life:1.6});});}
 }
 return true;
}
function segmentDistance(u,a,b){const dx=b.x-a.x,dy=b.y-a.y,n=dx*dx+dy*dy,t=n?Math.max(0,Math.min(1,((u.x-a.x)*dx+(u.y-a.y)*dy)/n)):0;return Math.hypot(u.x-a.x-t*dx,u.y-a.y-t*dy);}
// Earliest swept circle intersection, including a target already overlapping the muzzle.
function contactTime(u,a,b,r){const dx=b.x-a.x,dy=b.y-a.y,ox=a.x-u.x,oy=a.y-u.y,A=dx*dx+dy*dy,C=ox*ox+oy*oy-r*r;if(C<=0)return 0;if(!A)return Infinity;const B=2*(ox*dx+oy*dy),d=B*B-4*A*C;if(d<0)return Infinity;const t=(-B-Math.sqrt(d))/(2*A);return t>=0?t:Infinity;}
export function tickCombat(g,dt){
 for(const p of g.heroes)if(p.hp<=0||p.stun>0||p.dancing>0)p.attackMotion=null;
 const ready=g.pending.filter(e=>e.at<=g.time);g.pending=g.pending.filter(e=>e.at>g.time&&e.source.hp>0);for(const e of ready)if(e.source.hp>0)e.run();
 for(const p of g.heroes){if(p.attackMotion&&g.time-p.attackMotion.start>=p.attackMotion.duration)p.attackMotion=null;for(const key of ['guard','invulnerable','dancing','leaping','slow','passiveTime'])p[key]=Math.max(0,(p[key]||0)-dt);if(p.passiveTime===0)p.passiveStacks=0;if(p.empowered&&(p.empowered.time-=dt)<=0)p.empowered=null;if(p.dashStage&&(p.dashWindow-=dt)<=0){p.dashStage=0;p.cd[0]=p.skills[0].cool;}if(p.hp<=0){p.empowered=null;p.passiveStacks=0;p.dashStage=0;p.guard=0;}}
 for(const u of g.units){if(u.flowers)for(const [id,m]of Object.entries(u.flowers))if((m.time-=dt)<=0)delete u.flowers[id];if(u.staffMarkTime&&(u.staffMarkTime-=dt)<=0)u.staffMarks={};if(u.kind!=='hero')u.slow=Math.max(0,(u.slow||0)-dt);}
 for(const f of g.fields){f.time-=dt;if(f.source.hp<=0){f.time=0;continue;}if(f.kind==='lotus'&&distance(f,f.source)<f.r){for(let i=0;i<2;i++)f.source.cd[i]=Math.max(0,f.source.cd[i]-dt*1.2);}if(f.kind==='swordCircle')for(const u of enemies(g,f.source))if(Math.abs(distance(u,f)-f.r)<35&&!f.hits.has(u.id)){f.hits.add(u.id);if(hit(g,f.source,u,f.source.atk*1.8)!==false)u.slow=1;}if(f.time<=0&&f.kind==='lotus'){area(g,f.source,f,f.r,f.source.atk);effect(g,'bloom',f,f.r,{color:f.source.color,life:.9});}}
 g.fields=g.fields.filter(f=>f.time>0);
 for(const q of g.projectiles){q.life-=dt;if(q.source.hp<=0){q.life=0;continue;}if(q.offset>0){q.offset-=dt;continue;}const from={x:q.x,y:q.y};let goal=q.target;if(q.phase==='return')goal=q.source;if(goal&&goal.hp>0){q.angle=Math.atan2(goal.y-q.y,goal.x-q.x);if(q.phase==='return'&&distance(q,goal)<q.speed*dt+20){if(q.kind==='blade')q.source.hp=Math.min(q.source.mhp,q.source.hp+240);effect(g,'catch',goal,65,{color:q.color,life:.5});q.life=0;continue;}}
  const step=q.speed*dt;q.x+=Math.cos(q.angle)*step;q.y+=Math.sin(q.angle)*step;q.travel+=step;q.trail.push(from);if(q.trail.length>12)q.trail.shift();
  const collisions=enemies(g,q.source).filter(u=>!q.hits.has(u.id)).map(u=>({u,time:contactTime(u,from,q,q.radius+20)})).filter(c=>c.time<=1).sort((a,b)=>a.time-b.time);for(const {u} of collisions){q.hits.add(u.id);const landed=hit(g,q.source,u,q.damage);effect(g,'impact',u,q.kind==='cannon'?110:45,{color:q.color,life:.45});if(q.reduces&&landed)q.source.cd[1]=Math.min(q.source.cd[1],2.5);
   if(q.kind==='cannon'){area(g,q.source,u,155,q.damage*.35);effect(g,'explosion',u,185,{color:'#ffd493',life:.9});q.life=0;break;}
   if(q.kind==='blade'){if(landed)u.slow=1;q.chain++;const next=enemies(g,q.source).filter(e=>!q.hits.has(e.id)&&distance(u,e)<300).sort((a,b)=>distance(u,a)-distance(u,b))[0];if(next&&q.chain<4)q.target=next;else{q.phase='return';q.target=q.source;}break;}
   if(!q.pierce){q.life=0;break;}
  }
  if(q.travel>=q.range&&q.phase==='out'){if(['flower','blade'].includes(q.kind)){q.phase='return';q.target=q.source;q.hits.clear();q.pierce=true;}else q.life=0;}
  if(q.x<0||q.y<0||q.x>2400||q.y>2400)q.life=0;
 }
 g.projectiles=g.projectiles.filter(q=>q.life>0);
}
