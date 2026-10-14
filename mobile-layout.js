export class MobileLayout{
 constructor(onChange){this.onChange=onChange;this.playing=false;this.hint=document.getElementById('rotateHint');this.coarse=matchMedia('(pointer:coarse)');this.update=this.update.bind(this);window.addEventListener('resize',this.update);window.addEventListener('orientationchange',this.update);window.visualViewport?.addEventListener('resize',this.update);this.coarse.addEventListener?.('change',this.update);document.getElementById('tryLandscape').onclick=()=>this.enterLandscape();this.update();}
 get mobile(){return this.coarse.matches;}
 setPlaying(value){this.playing=value;this.update();}
 update(){const blocked=this.playing&&this.mobile&&innerHeight>innerWidth;this.hint.hidden=!blocked;document.documentElement.classList.toggle('mobile-device',this.mobile);if(blocked!==this.blocked){this.blocked=blocked;this.onChange(blocked);}}
 async enterLandscape(){if(!this.mobile)return;try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();}catch{}try{await screen.orientation?.lock?.('landscape');}catch{}this.update();}
}
