export const SIZE=2400;
export const LANES=[[[210,2190],[210,210],[2190,210]],[[210,2190],[2190,210]],[[210,2190],[2190,2190],[2190,210]]];
export const ITEMS=[{name:'破军',icon:'⚔',cost:650,desc:'攻击 +45',atk:45},{name:'影忍之足',icon:'♜',cost:450,desc:'移速 +35 · 护甲 +12',speed:35,armor:12},{name:'不死鸟之眼',icon:'◈',cost:700,desc:'生命 +600',mhp:600},{name:'泣血之刃',icon:'✦',cost:800,desc:'攻击 +35 · 吸血 15%',atk:35,leech:.15},{name:'贤者的庇护',icon:'◇',cost:950,desc:'生命 +800 · 护甲 +25',mhp:800,armor:25},{name:'宗师之力',icon:'♛',cost:900,desc:'攻击 +55 · 移速 +15',atk:55,speed:15}];
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const spawn=t=>({x:t?2190:210,y:t?210:2190});
const names=['凌霄','青羽','玄策','月璃','云岚','赤焰','霜华','夜刃','星河','苍岩'];
export class Game{
 constructor(){this.time=0;this.wave=-1;this.units=[];this.effects=[];this.events=[];this.score=[0,0];this.result=null;this.nextId=0;this.move=null;this.attack=false;this.aim=null;this.heroes=[];
  for(let t=0;t<2;t++){for(let i=0;i<5;i++){const s=spawn(t);const h=this.add({kind:'hero',team:t,x:s.x+(i%3)*45,y:s.y-(i%3)*45,mhp:2000,atk:100,speed:205,range:i===1||i===3?240:90,lane:i%3,name:names[t*5+i],model:i,level:1,xp:0,gold:600,mana:600,maxMana:600,kills:0,deaths:0,items:[],cd:[0,0,0,0,0,0],armor:12,leech:0});this.heroes.push(h);}
   this.add({kind:'core',team:t,...spawn(t),mhp:6500,atk:180,range:260,name:'水晶'});
   LANES.forEach((lane,l)=>[.09,.21,.34].forEach(f=>{const p=this.point(l,t,f);this.add({kind:'tower',team:t,...p,mhp:3000,atk:170,range:270,name:'防御塔'});}));
  }this.player=this.heroes[0];
  [[770,850],[1590,1560],[700,1550],[1650,720]].forEach(([x,y],i)=>this.add({kind:'monster',team:2,x,y,mhp:i<2?2600:1000,atk:75,range:100,speed:60,name:i<2?'远古守卫':'苍狼',home:{x,y},respawn:0}));
 }
 add(o){const u={id:this.nextId++,hp:o.mhp,cool:0,face:-.8,...o};this.units.push(u);return u;}
 point(l,t,f){const ps=t?[...LANES[l]].reverse():LANES[l];const lens=ps.slice(1).map((p,i)=>Math.hypot(p[0]-ps[i][0],p[1]-ps[i][1]));let n=lens.reduce((a,b)=>a+b,0)*f;for(let i=0;i<lens.length;i++){if(n<=lens[i])return {x:ps[i][0]+(ps[i+1][0]-ps[i][0])*n/lens[i],y:ps[i][1]+(ps[i+1][1]-ps[i][1])*n/lens[i]};n-=lens[i];}return {x:ps.at(-1)[0],y:ps.at(-1)[1]};}
 message(text){this.events.unshift({text,time:this.time});this.events=this.events.slice(0,5);}
 fx(x,y,type,color='#6edbff',r=100){this.effects.push({x,y,type,color,r,life:.7,max:.7});}
 damage(target,amount,source){if(target.hp<=0||this.result)return;const d=amount*(100/(100+(target.armor||0)));target.hp=Math.max(0,target.hp-d);this.effects.push({x:target.x,y:target.y,type:'number',text:Math.round(d),color:source?.team===0?'#ffe6a1':'#ff9696',life:.8,max:.8,r:0});target.aggro=source;if(source?.leech)source.hp=Math.min(source.mhp,source.hp+d*source.leech);
  if(target.hp===0){if(target.kind==='hero'){target.deaths++;target.respawn=8+target.level;this.score[source?.team===1?1:0]++;if(source?.kind==='hero')source.kills++;this.message(`${source?.name||'防御塔'} 击败了 ${target.name}`);}if(source?.kind==='hero'){source.gold+=target.kind==='hero'?240:target.kind==='minion'?35:target.kind==='monster'?140:200;source.xp+=target.kind==='hero'?180:target.kind==='minion'?35:100;}if(target.kind==='core'){this.result=target.team===1?'victory':'defeat';}if(target.kind==='monster')target.respawn=28;this.fx(target.x,target.y,'burst',target.team?'#ff925a':'#64b9ff',65);}
 }
 buy(i){const p=this.player,it=ITEMS[i];if(!it||p.gold<it.cost||p.items.length>=6)return false;p.gold-=it.cost;p.items.push(i);for(const k of ['atk','speed','mhp','armor','leech'])p[k]=(p[k]||0)+(it[k]||0);p.hp=Math.min(p.mhp,p.hp+(it.mhp||0));return true;}
 cast(i,aim){const p=this.player;if(this.result||p.hp<=0||p.cd[i]>0)return false;const costs=[55,75,110,0,0,0],cool=[5,8,16,35,60,25];if(p.mana<costs[i])return false;p.mana-=costs[i];p.cd[i]=cool[i];this.recall=0;const a=aim||this.aim||{x:p.x+Math.cos(p.face)*200,y:p.y+Math.sin(p.face)*200};const angle=Math.atan2(a.y-p.y,a.x-p.x);p.face=angle;
  if(i===0||i===4){const n=i===0?240:330;p.x=Math.max(70,Math.min(SIZE-70,p.x+Math.cos(angle)*n));p.y=Math.max(70,Math.min(SIZE-70,p.y+Math.sin(angle)*n));this.fx(p.x,p.y,'slash','#7be7ff',150);if(i===0)for(const u of this.units)if(u.team!==0&&u.hp>0&&dist(p,u)<180)this.damage(u,p.atk*2,p);}
  if(i===1||i===2){const r=i===1?235:350;this.fx(p.x,p.y,i===2?'ultimate':'ring',i===2?'#d3b2ff':'#7bedff',r);for(const u of this.units)if(u.team!==0&&u.hp>0&&dist(p,u)<r){this.damage(u,p.atk*(i===1?2.8:5),p);u.stun=i===2?1.3:.5;}if(i===2)p.hp=Math.min(p.mhp,p.hp+350);}
  if(i===3){p.hp=Math.min(p.mhp,p.hp+p.mhp*.35);p.mana=Math.min(p.maxMana,p.mana+180);this.fx(p.x,p.y,'ring','#74ffb5',90);}
  if(i===5){this.recall=4;this.message('回城引导中，请勿移动');}return true;
 }
 walk(u,p,dt){const d=dist(u,p);if(d<4)return;const n=Math.min(d,u.speed*dt);u.face=Math.atan2(p.y-u.y,p.x-u.x);u.x+=Math.cos(u.face)*n;u.y+=Math.sin(u.face)*n;}
 target(u,r){let best=null,b=Infinity;for(const e of this.units){if(e.hp<=0||e.team===u.team||e.team===2&&u.kind!=='hero'||e.team!==2&&u.team===2&&e!==u.aggro)continue;const d=dist(u,e);const priority=d+(e.kind==='hero'?0:e.kind==='minion'?-35:40);if(d<r&&priority<b){b=priority;best=e;}}return best;}
 tick(dt){if(this.result)return;dt=Math.min(.1,dt);this.time+=dt;this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.units=this.units.filter(u=>u.kind!=='minion'||u.hp>0);
  if(Math.floor(this.time/18)>this.wave){this.wave=Math.floor(this.time/18);for(let t=0;t<2;t++)for(let l=0;l<3;l++)for(let i=0;i<3;i++){const s=this.point(l,t,0);this.add({kind:'minion',team:t,...s,x:s.x+i*22,y:s.y+i*22,mhp:i===2?480:360,atk:i===2?45:30,speed:115,range:i===2?185:70,lane:l,progress:0,name:'士兵'});}if(this.wave===0)this.message('欢迎来到峡谷 · 全军出击');}
  const p=this.player;
  if(this.recall>0){this.recall-=dt;if(this.recall<=0){Object.assign(p,spawn(0));p.hp=p.mhp;p.mana=p.maxMana;this.fx(p.x,p.y,'ring','#7deaff',160);}}
  for(const u of this.units){u.cool=Math.max(0,u.cool-dt);u.stun=Math.max(0,(u.stun||0)-dt);
   if(u.hp<=0){if(u.kind==='hero'||u.kind==='monster'){u.respawn-=dt;if(u.respawn<=0){Object.assign(u,u.kind==='hero'?spawn(u.team):u.home);u.hp=u.mhp;u.mana=u.maxMana;u.aggro=null;}}continue;}
   if(u.kind==='hero'){u.gold+=dt*3;u.mana=Math.min(u.maxMana,u.mana+dt*12);u.cd=u.cd.map(c=>Math.max(0,c-dt));if(u.xp>=u.level*150&&u.level<15){u.xp-=u.level*150;u.level++;u.mhp+=180;u.hp=Math.min(u.mhp,u.hp+400);u.atk+=12;this.fx(u.x,u.y,'ring','#ffdc80',110);}if(dist(u,spawn(u.team))<240)u.hp=Math.min(u.mhp,u.hp+u.mhp*.2*dt);else u.hp=Math.min(u.mhp,u.hp+dt*4);}
   if(u.stun>0)continue;
   if(u===p){if(this.move){this.walk(u,this.move,dt);this.recall=0;}if(this.attack){const t=this.target(u,u.range+70);if(t&&u.cool<=0){this.damage(t,u.atk,u);u.cool=.6;this.fx(t.x,t.y,'slash','#c1f4ff',45);u.face=Math.atan2(t.y-u.y,t.x-u.x);}}continue;}
   if(u.kind==='tower'||u.kind==='core'){const t=this.target(u,u.range);if(t&&u.cool<=0){this.damage(t,u.atk,u);u.cool=1;this.effects.push({x:u.x,y:u.y,tx:t.x,ty:t.y,type:'bolt',color:u.team?'#ff785c':'#61d7ff',r:0,life:.3,max:.3});}continue;}
   if(u.kind==='monster'&&(!u.aggro||u.aggro.hp<=0||dist(u,u.home)>250)){u.aggro=null;this.walk(u,u.home,dt);u.hp=Math.min(u.mhp,u.hp+dt*30);continue;}
   if(u.kind==='hero'&&u.hp<u.mhp*.25){this.walk(u,spawn(u.team),dt);continue;}
   const t=this.target(u,u.kind==='hero'?380:u.kind==='monster'?270:230);
   if(t){if(dist(u,t)>u.range)this.walk(u,t,dt);else if(u.cool<=0){this.damage(t,u.atk,u);u.cool=u.kind==='hero'?.8:1.2;this.fx(t.x,t.y,'slash',u.team?'#ffc48a':'#8edcff',35);}}
   else if(u.kind==='hero'){const laneUnits=this.units.filter(e=>e.team===u.team&&e.kind==='minion'&&e.lane===u.lane&&e.hp>0);const lead=laneUnits.sort((a,b)=>b.progress-a.progress)[0];const to=lead||this.point(u.lane,u.team,.3);this.walk(u,to,dt);}
   else if(u.kind==='minion'){u.progress=Math.min(1,u.progress+dt*u.speed/(u.lane===1?2800:3960));this.walk(u,this.point(u.lane,u.team,u.progress),dt);}
  }
 }
}
