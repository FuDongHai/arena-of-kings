import {HEROES} from './heroes.js';

export class HeroSprites {
 constructor(){this.atlases=new Map();this.ready=false;this.loading=Promise.all(HEROES.map(h=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{if(image.naturalWidth!==1536||![1536,3072].includes(image.naturalHeight)){reject(new Error(`Invalid character frames: ${h.id}`));return;}this.atlases.set(h.id,{sheet:image,width:192,height:256,rows:image.naturalHeight/256});resolve();};image.onerror=()=>reject(new Error(`Character frames unavailable: ${h.id}`));image.src=`assets/models/${h.id}.png`;}))).then(()=>{this.ready=true;});}
 draw(ctx,u,time,moving){const a=this.atlases.get(u.heroId);if(!a)return false;const motion=u.attackMotion,elapsed=motion?Math.max(0,time-motion.start):0,progress=motion?Math.min(1,elapsed/motion.duration):0;
  const face=motion?motion.angle:u.face,direction=((Math.round((Math.PI/2-face)/(Math.PI/4))%8)+8)%8;
  const row=motion&&a.rows===12?5+Math.min(6,Math.floor(progress*7)):u.casting>0?(a.rows===12?8:5):moving?1+Math.floor(time*9)%4:0;
  const h=178,w=h*a.width/a.height;ctx.save();if(motion){const lunge=Math.sin(Math.max(0,(progress-.36)/.64)*Math.PI)*9;ctx.translate(Math.cos(face)*lunge,Math.sin(face)*lunge*.72);}
  ctx.drawImage(a.sheet,direction*a.width,row*a.height,a.width,a.height,-w/2,-h+20,w,h);ctx.restore();return true;}
}
