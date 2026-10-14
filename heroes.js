export const HEROES = [
  {id:'libai',name:'李白',title:'青莲剑仙',role:'刺客',lane:'打野 / 游走',quote:'大河之剑天上来。',color:'#a5dbea',number:'01',hp:2000,atk:105,speed:230,range:95,armor:12,ratings:[9,6,4,10],description:'白衣仗剑，纵情山河。以灵动的身法切入战场，用剑阵与青莲剑歌终结对手。',skills:[
    {name:'将进酒',icon:'➶',type:'dash',cost:55,cool:5,desc:'两次突进斩击并短暂眩晕，第三次返回起点；5 秒内完成连段。',damage:2,distance:250,radius:180},
    {name:'神来之笔',icon:'◎',type:'area',cost:75,cool:8,desc:'挥剑展开剑阵，短暂不可被命中；触碰剑阵边缘的敌人受伤并减速。',damage:2.8,radius:235,stun:.5},
    {name:'青莲剑歌',icon:'✦',type:'area',cost:110,cool:16,desc:'普攻命中四次解锁：化为剑影连续斩击五次，期间不可被命中。',damage:5,radius:350,stun:1.1,heal:300}]},
  {id:'kai',name:'铠',title:'破灭刃锋',role:'战士',lane:'对抗路',quote:'以绝望挥剑，着逝者为铠。',color:'#65b9ff',number:'02',hp:2850,atk:115,speed:195,range:110,armor:30,ratings:[8,5,10,6],description:'蓝银重甲，魔刃破阵。凭借强大的生存能力直面敌人，开启魔铠后化身战场的锋刃。',skills:[
    {name:'回旋之刃',icon:'◈',type:'projectile',cost:55,cool:5,desc:'投出回旋刃，在敌人之间弹射并减速；刀刃返回时回复生命。',damage:2.3,distance:650,radius:95,heal:240},
    {name:'极刃风暴',icon:'⚔',type:'dash',cost:75,cool:8,desc:'冲锋后连续挥砍两次，第二击控制敌人，并强化下一次普攻。',damage:3,distance:200,radius:200,stun:.7},
    {name:'不灭魔躯',icon:'♜',type:'buff',cost:110,cool:18,desc:'召唤蓝焰魔铠，冲击附近敌人，8 秒内获得攻击与护甲加成。',attackBonus:65,armorBonus:30,duration:8,heal:600}]},
  {id:'diaochan',name:'貂蝉',title:'绝世舞姬',role:'法师',lane:'中路',quote:'花有再开的那天，人有重逢的时候吗？',color:'#eface0',number:'03',hp:1850,atk:95,speed:215,range:280,armor:8,ratings:[9,9,4,9],description:'花瓣流转，步步生莲。用花球远程消耗，灵活位移后在绽放的法阵中持续战斗。',skills:[
    {name:'落·红雨',icon:'❀',type:'projectile',cost:55,cool:5,desc:'释放往返花球，来回各造成一次伤害并叠加花印；四层花印引爆并回血。',damage:3,distance:650,radius:100},
    {name:'缘·心结',icon:'✧',type:'dash',cost:65,cool:6,desc:'轻盈位移并短暂不可被命中，发出三枚追踪花瓣；命中缩短此技能冷却。',damage:2.5,distance:220,radius:260,heal:100},
    {name:'绽·风华',icon:'❃',type:'field',cost:110,cool:17,desc:'展开 8 秒莲花法阵，开启和结束时造成伤害；阵内加快前两项技能冷却。',damage:1.1,radius:320,duration:8}]},
  {id:'sunshangxiang',name:'孙尚香',title:'千金重弩',role:'射手',lane:'发育路',quote:'大小姐驾到，通通闪开！',color:'#b5dc86',number:'04',hp:1750,atk:125,speed:210,range:340,armor:8,ratings:[10,8,3,8],description:'机巧重炮，百步穿杨。翻滚调整位置，远程火力压制对手，保持距离是制胜关键。',skills:[
    {name:'翻滚突袭',icon:'➶',type:'dash',cost:45,cool:5,desc:'向指定方向翻滚，强化下一次普攻的伤害和射程，发射穿透炮弹。',damage:2.5,distance:230,radius:340},
    {name:'红莲爆弹',icon:'✹',type:'bomb',cost:70,cool:8,desc:'抛出红莲爆弹，短暂延迟后爆炸，造成范围伤害与减速。',damage:2.8,distance:500,radius:170,stun:.5},
    {name:'究极弩炮',icon:'⊕',type:'projectile',cost:100,cool:16,desc:'发射远距离重炮，命中首个敌人后爆炸，波及附近目标。',damage:5.5,distance:950,radius:130}]},
  {id:'wukong',name:'孙悟空',title:'齐天大圣',role:'刺客',lane:'打野 / 对抗路',quote:'俺老孙来也！',color:'#f4ca78',number:'05',hp:2350,atk:125,speed:220,range:115,armor:18,ratings:[10,5,7,9],description:'金甲红披，踏云而至。以护身法术抵挡攻击，跃入敌阵，用金箍棒击碎敌人的防线。',skills:[
    {name:'护身咒法',icon:'◉',type:'shield',cost:55,cool:7,desc:'开启 1 秒护身咒，成功抵挡一次攻击后获得 3 秒护盾，强化下一次普攻。',duration:3,heal:150},
    {name:'斗战冲锋',icon:'➶',type:'dash',cost:65,cool:7,desc:'腾云向前跃进，强化下一次金箍棒普攻，追击落点附近的敌人。',damage:3,distance:280,radius:200},
    {name:'如意金箍',icon:'♛',type:'area',cost:110,cool:17,desc:'金箍棒震地，造成范围伤害与眩晕，叠加三层印记强化后续棒击。',damage:5,radius:320,stun:1.5}]}
];
export const heroById=id=>HEROES.find(h=>h.id===id)||HEROES[0];
export const heroArt=id=>`assets/heroes/${heroById(id).id}.jpg`;
export const heroAvatar=id=>`assets/heroes/${heroById(id).id}-avatar.jpg`;
