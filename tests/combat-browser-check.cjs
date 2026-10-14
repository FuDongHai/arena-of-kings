const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 // Combat must also work on devices without WebGL.
 await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:get.call(this,type,...args);};});
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:4173');
 await page.waitForFunction(()=>window.arena?.spriteModels?.ready);
 for(const id of ['libai','kai','diaochan','sunshangxiang','wukong']){
  const report=await page.evaluate(id=>{
   arena.start(id);const g=arena.game,p=g.player;g.aiEnabled=false;g.wave=0;p.x=1200;p.y=1200;
   for(const u of g.units)if(u!==p){u.x=2200;u.y=100;u.speed=0;u.atk=0;}
   const targets=g.heroes.filter(u=>u.team===1);targets.forEach((e,j)=>{e.x=1380+(j%2)*70;e.y=1140+j*40;e.mhp=e.hp=20000;});
   const e=targets[0];if(id==='libai'){e.x=1250;e.y=1200;for(let j=0;j<4;j++){p.cool=0;g.basicAttack(p,e);}g.cast(1);g.cast(2,e);}
   if(id==='kai'){g.cast(2,e);g.cast(0,e);g.cast(1,e);}
   if(id==='diaochan'){g.cast(2,e);g.cast(0,e);g.cast(1,{x:1200,y:1200});}
   if(id==='sunshangxiang'){g.cast(0,{x:1200,y:1450});g.basicAttack(p,e);g.cast(1,e);g.cast(2,e);}
   if(id==='wukong'){g.cast(0,e);g.damage(p,500,e);g.cast(2,e);}
   for(let j=0;j<5;j++)g.tick(.05);
   const report={effects:g.effects.length,projectiles:g.projectiles.length,fields:g.fields.length};g.tick=()=>{};return report;
  },id);
  assert.ok(report.effects>0);await page.waitForTimeout(250);await page.screenshot({path:`combat-${id}.png`});
 }
 await page.setViewportSize({width:844,height:390});await page.evaluate(()=>{arena.start('sunshangxiang');arena.cast(0);});await page.waitForTimeout(150);await page.screenshot({path:'combat-mobile.png'});assert.match(await page.textContent('#combatStatus'),/强化普攻/);
 await page.evaluate(()=>arena.start('libai'));await page.keyboard.press('r');assert.match(await page.textContent('#notice'),/普攻命中四次/);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({heroes:5,canvasEffects:true,mobile:true,noWebGL:true,lockedUltimateHint:true,pageErrors:errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
