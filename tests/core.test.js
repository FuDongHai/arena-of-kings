import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,ITEMS} from '../core.js';
test('creates 5v5 teams and advances minion waves',()=>{const g=new Game();assert.equal(g.heroes.length,10);g.tick(1);assert.equal(g.units.filter(e=>e.kind==='minion').length,24);});
test('skill consumes mana and cannot bypass cooldown',()=>{const g=new Game();const p=g.player;assert.equal(g.cast(0,{x:p.x+100,y:p.y}),true);const mana=p.mana;assert.equal(g.cast(0),false);assert.equal(p.mana,mana);});
test('purchase enforces balance and increases power',()=>{const g=new Game();g.player.gold=1000;const atk=g.player.atk;assert.equal(g.buy(0),true);assert.equal(g.player.gold,1000-ITEMS[0].cost);assert.ok(g.player.atk>atk);g.player.gold=0;assert.equal(g.buy(1),false);});
test('heroes die and respawn',()=>{const g=new Game();g.damage(g.player,99999,g.heroes[5]);assert.equal(g.player.hp,0);for(let i=0;i<300;i++)g.tick(.05);assert.ok(g.player.hp>0);});
test('destroying enemy core resolves victory',()=>{const g=new Game();g.damage(g.units.find(u=>u.kind==='core'&&u.team===1),99999,g.player);assert.equal(g.result,'victory');});
test('long simulation stays finite and bounded',()=>{const g=new Game();for(let i=0;i<12000&&!g.result;i++)g.tick(.05);assert.ok(g.units.length<1000);for(const u of g.units){assert.ok(Number.isFinite(u.x)&&Number.isFinite(u.hp));}});
