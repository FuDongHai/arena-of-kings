import {HEROES} from './heroes.js';

export class HeroSprites {
 constructor(){this.atlases=new Map();this.ready=false;this.loading=Promise.all(HEROES.map(h=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{if(image.naturalWidth!==1536||image.naturalHeight!==1536){reject(new Error(`Invalid character frames: ${h.id}`));return;}this.atlases.set(h.id,{sheet:image,width:192,height:256});resolve();};image.onerror=()=>reject(new Error(`Character frames unavailable: ${h.id}`));image.src=`assets/models/${h.id}.png`;}))).then(()=>{this.ready=true;});}
 draw(ctx,u,time,moving){const a=this.atlases.get(u.heroId);if(!a)return false;const direction=((Math.round((Math.PI/2-u.face)/(Math.PI/4))%8)+8)%8,row=u.casting>0||u.cool>.4?5:moving?1+Math.floor(time*9)%4:0;const h=178,w=h*a.width/a.height;ctx.drawImage(a.sheet,direction*a.width,row*a.height,a.width,a.height,-w/2,-h+20,w,h);return true;}
}
