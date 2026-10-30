(()=>{
let draft=null;
const loot=k=>{const id=k.split(':')[0],r=LOC.find(x=>x[0]===id)?.[2]||s.built.find(x=>x.id===id)?.reward;return r&&Object.keys(r).length?r:{gold:2};};
const legal=k=>!!s&&s.phase==='placement'&&s.step==='place'&&!s.combat&&actor().left>0&&Object.hasOwn(s.used,k)&&s.used[k]!==s.active&&!k.startsWith('harbour:')&&!(s.fightRound===s.round&&s.fights?.[k]);
function die(n){const p=[['     ','  o  ','     '],['o    ','     ','    o'],['o    ','  o  ','    o'],['o   o','     ','o   o'],['o   o','  o  ','o   o'],['o   o','o   o','o   o']][n-1];return ['+-------+',...p.map(x=>'| '+x+' |'),'+-------+'].join('\n');}
function fight(k,g){
 if(!legal(k)||!Number.isInteger(g)||g<0||g>Math.min(3,actor().r.guards))return;
 const a=s.active,d=s.used[k],ap=s.players[a],dp=s.players[d],dg=Math.min(3,dp.r.guards),ar=1+Math.floor(Math.random()*6),dr=1+Math.floor(Math.random()*6),at=ar+g,dt=dr+dg+1,w=at>dt?a:d,l=w===a?d:a,taken={};
 ap.left--;if(g)ap.r.guards--;if(dg)dp.r.guards--;
 for(const [r,n]of Object.entries(loot(k))){const amount=Math.min(n,s.players[l].r[r]||0);if(amount){s.players[l].r[r]-=amount;s.players[w].r[r]+=amount;taken[r]=amount;}}
 if(w===a)s.used[k]=a;
 if(s.fightRound!==s.round){s.fightRound=s.round;s.fights={};}s.fights[k]=true;
 s.combat={k,a,d,g,dg,ar,dr,at,dt,w,taken};s.step='combat-result';draft=null;view=null;
 say(`${ap.name} attacks ${dp.name}: d6 ${ar}+${g}=${at} vs d6 ${dr}+${dg}+1=${dt}. ${s.players[w].name} wins ${res(taken)}; guard casualties ${g?1:0}/${dg?1:0}.`);save();render();
}
const oldSlots=slots;
slots=function(id,n){return oldSlots(id,n).replace(/<button\b[^>]*>[\s\S]*?<\/button>/g,h=>{const k=h.match(/data-act="space,([^"]+)"/)?.[1];return k&&isHuman()&&legal(k)?`<button class="occupied" data-combat="challenge" data-key="${esc(k)}">Challenge ${esc(s.players[s.used[k]].name)}</button>`:h;});};
const oldOverlays=overlays;
overlays=function(){
 if(s.combat){const c=s.combat,side=(who,r,g,total,def)=>`<section><h3>${esc(s.players[who].name)} / ${def?'Defender':'Attacker'}</h3><pre class="combat-die" role="img" aria-label="d6 roll ${r}">${die(r)}</pre><p>${r} + ${g} guards${def?' + 1 defence':''} = ${total}</p></section>`;
 return modal('Combat result',`<div class="modal-grid">${side(c.a,c.ar,c.g,c.at,false)}${side(c.d,c.dr,c.dg,c.dt,true)}</div><p>${esc(s.players[c.w].name)} wins ${res(c.taken)}${c.at===c.dt?' (tie: defender wins)':''}.</p><p>Guard casualties: attacker ${c.g?1:0}, defender ${c.dg?1:0}. ${c.w===c.a?'Attacker takes the space.':'Defender holds.'} Both workers are spent until next round. No normal location reward.</p><button data-combat="continue">Continue</button>`,false);}
 if(draft){if(!legal(draft)){draft=null;return oldOverlays();}const dp=s.players[s.used[draft]],max=Math.min(3,actor().r.guards);
 return modal('Challenge '+esc(label(draft.split(':')[0])),`<p>${esc(dp.name)} defends with d6 + ${Math.min(3,dp.r.guards)} guards + 1. Ties defend.</p><p>Spend one worker. Each side fielding guards loses one guard. Winner steals up to ${res(loot(draft))} from loser after casualties, capped at their pool. No normal activation. One challenge per space per round.</p><label>Commit guards <select id="combat-force">${Array.from({length:max+1},(_,i)=>`<option ${i===max?'selected':''}>${i}</option>`).join('')}</select></label><p><button data-combat="roll">Roll both d6</button> <button data-combat="cancel">Cancel</button></p>`,false);}
 const html=oldOverlays();return view==='help'?html.replace('</section>','<p>Combat: challenge occupied enemy spaces during normal placement, except Harbour. Spend a worker; commit 0–3 guards. Both roll d6; defence adds up to 3 guards and +1. Ties defend. Each side fielding guards loses 1 guard. Winner steals the location reward from the loser, or 2 gold at special locations, capped at available resources. No normal activation; one challenge per space per round. AI can raid too.</p></section>'):html;
};
const oldAI=ai;
ai=function(){if(s?.combat)return;if(s&&actor().ai&&s.phase==='placement'&&s.step==='place'){const targets=Object.keys(s.used).filter(legal).filter(k=>actor().r.guards>s.players[s.used[k]].r.guards&&Object.entries(loot(k)).some(([r,n])=>n>0&&s.players[s.used[k]].r[r]>0));if(targets.length&&Math.random()<.3){fight(targets[0],Math.min(3,actor().r.guards));return;}}oldAI();};
document.addEventListener('click',e=>{const b=e.target.closest('button[data-combat]');if(!b||b.disabled)return;e.preventDefault();e.stopImmediatePropagation();const act=b.dataset.combat;if(act==='continue'&&s?.combat){delete s.combat;s.step='quest';save();render();return;}if(!s||!isHuman())return;if(act==='challenge'&&legal(b.dataset.key)){draft=b.dataset.key;view=null;render();}if(act==='cancel'){draft=null;render();}if(act==='roll'&&draft)fight(draft,Number(document.getElementById('combat-force')?.value));},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&draft){draft=null;render();}});
const style=document.createElement('style');style.textContent='.combat-die{font-family:Courier New,monospace!important;font-size:24px;line-height:1.15;white-space:pre;margin:12px 0}';document.head.appendChild(style);
render();
})();
