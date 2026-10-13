import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../core.js';
test('chosen hero configures identity, model and combat statistics',()=>{const g=new Game('sunshangxiang');assert.equal(g.player.name,'孙尚香');assert.equal(g.player.heroId,'sunshangxiang');assert.ok(g.player.range>250);assert.equal(g.player.skills[0].name,'翻滚突袭');});
test('invalid hero selection falls back to Li Bai',()=>{assert.equal(new Game('missing').player.heroId,'libai');});
test('armored warrior has more health than assassin',()=>{assert.ok(new Game('kai').player.mhp>new Game('libai').player.mhp);});
test('mage ranged skill hits a distant enemy without teleporting',()=>{const g=new Game('diaochan'),p=g.player,e=g.heroes[5];e.x=p.x+300;e.y=p.y;const x=p.x,hp=e.hp;assert.equal(g.cast(0,{x:e.x,y:e.y}),true);assert.equal(p.x,x);assert.ok(e.hp<hp);});
test('selection gives both teams five distinct heroes',()=>{const g=new Game('wukong');assert.equal(new Set(g.heroes.filter(h=>h.team===0).map(h=>h.heroId)).size,5);assert.equal(new Set(g.heroes.filter(h=>h.team===1).map(h=>h.heroId)).size,5);});
