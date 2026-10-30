(()=>{
'use strict';
const pair=(a,b)=>({type:'quests',cats:[a,b]});
const roles=[
 ['Tide Warden',pair(0,3)],['Reef Pathfinder',pair(1,4)],['Mooncaller',pair(1,2)],['Harbour Speaker',pair(2,3)],['Salt Merchant',pair(0,4)],
 ['Piermaster',{type:'buildings'}],['Quaymaster',{type:'orders'}],['Dutybearer',{type:'duties'}],['Deep Collector',{type:'collection'}],['Coinwright',{type:'coins'}],['Beaconkeeper',{type:'commissions'}],['Tidewatcher',{type:'mixed'}]
];
const defs=[
 ['Harbour Purse','Gain 4 coins.'],['Quiet Recruitment',''],['Shared Expedition','Gain 2 guards and 1 mage; next rival gains 1 guard.'],['Unwelcome Duty','Give the next rival one of six mandatory duties.'],['Supply Seizure','Take the first available adventurer type from the next rival, or gain 2 coins.'],
 ['Tidal Favor','Gain 2 of your least-held adventurer type (ties: guards, scouts, healers, mages).'],['Crew Recall','Recall your first occupied non-Harbour agent for another placement. Requires an eligible agent.'],['Guild Introduction','Draw 1 Order and gain 1 coin.'],['Open Ledgers','Gain 2 coins; next rival gains 1 coin.'],['Watch Rotation','Gain 2 guards; every rival gains 1 guard.'],['Lantern Collection','Gain 2 healers; next rival gains 1 healer.'],['Star Reading','Gain 2 mages; next rival gains 1 mage.'],['Reef Survey','Gain 2 scouts; next rival gains 1 scout.'],['Harbour Bazaar','Gain 1 adventurer of each type.'],['Council Decree','Gain 3 coins and draw 1 Order.']
];
const duties=[
 ['Defend the salt road',{guards:2,mages:1},2],['Inspect the sealed cargo',{guards:1,scouts:1,mages:1},2],['Mediate the quay dispute',{healers:1,guards:1,mages:1},4],['Restore the storm shelter',{healers:2,guards:1},4],['Search the flooded tunnels',{healers:1,scouts:2},2],['Secure the pilgrim ferry',{healers:1,guards:1,scouts:1},2]
];
let creating=false;
function init(){
 if(!s)return;
 if(!s.safeExpansion){
  s.safeExpansion=1;
  const ids=shuffle(roles.map((_,i)=>i));
  s.players.forEach((p,i)=>{p.secret=creating?{name:roles[ids[i]][0],...roles[ids[i]][1]}:{name:'Original charter',type:'quests',cats:[...p.agenda]};p.orderCount=0;p.dutyCount=0;p.engines=[];if(creating)p.agenda=p.secret.cats||[];});
 }
}
function bonus(p,i){const id=p.secret,build=s.built.filter(b=>b.owner===i).length;switch(id.type){case 'quests':return p.done.filter(k=>id.cats.includes(k)).length*4;case 'buildings':return build*6;case 'orders':return p.orderCount*3;case 'duties':return p.dutyCount*5;case 'collection':return TYPES.filter(k=>p.r[k]>=3).length*2;case 'coins':return Math.floor(p.r.gold/3);case 'commissions':return Math.min(12,p.done.length*3);case 'mixed':return p.done.length*2+build*2;default:throw Error('Unknown secret identity');}}
function rule(p){const id=p.secret;return ({quests:'4 VP per completed '+(id.cats||[]).map(k=>CATEGORIES[k]).join(' or ')+' commission',buildings:'6 VP per building you control',orders:'3 VP per Order played',duties:'5 VP per mandatory duty completed',collection:'2 VP per adventurer type with at least 3 held',coins:'1 VP per 3 coins held',commissions:'3 VP per completed commission, maximum 12 VP',mixed:'2 VP per completed commission and per controlled building'})[id.type];}
function recallKey(){return Object.keys(s.used).find(k=>s.used[k]===s.active&&!k.startsWith('harbour:'));}
const originalFresh=fresh;fresh=function(){creating=true;try{return originalFresh();}finally{creating=false;}};
const originalOrders=orders;orders=function(){const names=originalOrders();return Array.from({length:60},(_,i)=>({id:'o'+i,kind:i%15,name:i%15<5?names[i%names.length].name:defs[i%15][0]}));};
const originalQuests=quests;quests=function(){let n=0;return originalQuests().map((q,i)=>{const copy={...q,plot:null};if((i+1)%6===0){copy.engine=n++%2?{kind:q.kind,vp:2}:{kind:q.kind,reward:{[TYPES[i%4]]:1}};copy.vp=Math.max(4,q.vp-3);}return copy;});};
const originalAvailable=available;available=function(){const spaces=originalAvailable();if(!s)return spaces;const usable=actor().hand.some(o=>o.kind!==6||recallKey());return usable?spaces:spaces.filter(k=>!k.startsWith('harbour:'));};
const originalPlay=playOrder;playOrder=function(i){
 init();if(s.step!=='order')return;
 const p=actor(),o=p.hand[i];if(!o)return;
 if(o.kind===6&&!recallKey())return;
 const target=s.players[(s.active+1)%s.players.length];
 if(o.kind<5){
  const before=p.hand.length,mandatory=target.mandatory.length;
  originalPlay(i);
  if(p.hand.length>=before)return;
  if(o.kind===3&&target.mandatory.length>mandatory){const d=duties[Math.floor(Math.random()*duties.length)],q=target.mandatory[target.mandatory.length-1];Object.assign(q,{name:d[0],cost:{...d[1]},vp:d[2]});}
 }else{
  p.hand.splice(i,1);s.discard.push(o);
  switch(o.kind){
   case 5:{const k=[...TYPES].sort((a,b)=>p.r[a]-p.r[b])[0];gain(p,{[k]:2});break;}
   case 6:{delete s.used[recallKey()];if(s.phase==='harbour')s.safeExtra=(s.safeExtra||0)+1;else p.left++;break;}
   case 7:giveOrder(p);gain(p,{gold:1});break;
   case 8:gain(p,{gold:2});gain(target,{gold:1});break;
   case 9:gain(p,{guards:2});s.players.filter(x=>x!==p).forEach(x=>gain(x,{guards:1}));break;
   case 10:gain(p,{healers:2});gain(target,{healers:1});break;
   case 11:gain(p,{mages:2});gain(target,{mages:1});break;
   case 12:gain(p,{scouts:2});gain(target,{scouts:1});break;
   case 13:gain(p,Object.fromEntries(TYPES.map(k=>[k,1])));break;
   case 14:gain(p,{gold:3});giveOrder(p);break;
   default:throw Error('Unknown Order');
  }
  say(p.name+' plays '+o.name);s.step='quest';view=null;
 }
 p.orderCount++;save();render();
};
const originalEnd=endTurn;endTurn=function(){if(s?.phase==='harbour'&&s.safeExtra>0&&['quest','done'].includes(s.step)){s.safeExtra--;s.step='place';delete s.pending;view=null;save();render();return;}return originalEnd();};
const originalComplete=complete;complete=function(i,mandatory=false){
 init();if(s.step!=='quest')return;
 const p=actor(),q=(mandatory?p.mandatory:p.q)[i];
 if(!q||!can(p,q.cost)||(!mandatory&&p.mandatory.length))return;
 const engines=[...p.engines];originalComplete(i,mandatory);
 if(s.step!=='done')return;
 if(mandatory)p.dutyCount++;
 else{for(const e of engines)if(e.kind===q.kind){if(e.vp)p.score+=e.vp;if(e.reward)gain(p,e.reward);}if(q.engine)p.engines.push(q.engine);}
 save();render();
};
const originalFinal=scoreFinal;scoreFinal=function(){init();originalFinal();for(let i=0;i<s.players.length;i++){const p=s.players[i];p.total-=p.final.agenda;p.final.agenda=bonus(p,i);p.total+=p.final.agenda;}save();};
const originalCard=commission;commission=function(q,i,m=false){let html=originalCard(q,i,m);if(q.engine){const text=q.engine.vp?'+2 VP':res(q.engine.reward);html=html.replace('</h3>','</h3><p>Ongoing: '+text+' after each future '+esc(CATEGORIES[q.kind])+' commission.</p>');}return html;};
orderCard=function(o,i){const text=o.kind===1?'Gain 2 '+TYPES[s.round%4]+'.':defs[o.kind]?.[1]||'Unknown Order';const legal=o.kind!==6||!!recallKey();return '<article class="card"><h3>\ud83d\uddc2 '+esc(o.name)+'</h3><p>'+esc(text)+'</p>'+btn('Play Order','order,'+i,!isHuman()||s.step!=='order'||!legal)+(o.kind===6&&!legal?'<button data-expansion-discard="'+i+'" '+(!isHuman()||s.step!=='order'?'disabled':'')+'>Discard unusable recall</button>':'')+'</article>';};
const originalAI=ai;
ai=function(){
 if(!s||!actor().ai||s.combat)return originalAI();init();const p=actor();
 const value=q=>{const id=p.secret;return q.vp+(id.type==='quests'&&id.cats.includes(q.kind)?4:0)+(id.type==='commissions'&&p.done.length<4?3:0)+(id.type==='mixed'?2:0)+(q.engine?3:0);};
 if(s.step==='guild'&&s.market.length){let best=0;s.market.forEach((q,i)=>{if(value(q)-deficit(p,q)>value(s.market[best])-deficit(p,s.market[best]))best=i;});return takeQuest(best);}
 if(s.step==='quest'&&!p.mandatory.length){const eligible=p.q.map((q,i)=>({q,i})).filter(x=>can(p,x.q.cost)).sort((a,b)=>value(b.q)-value(a.q));if(eligible.length)return complete(eligible[0].i);}
 if(s.step==='order'){const i=p.hand.findIndex(o=>o.kind!==6||recallKey());if(i>=0)return playOrder(i);const own=p.hand[0];if(own?.kind===6){p.hand.shift();s.discard.push(own);say(p.name+' discards an unusable recall Order');s.step='quest';save();render();return;}}
 if(s.step==='place'&&s.phase==='placement'&&Math.random()<.65){const id=p.secret.type,av=available();if(id==='buildings'||id==='mixed'){if(av.includes('foundry:0')&&s.bm.some(b=>b.cost<=p.r.gold))return selectSpace('foundry:0');}if(id==='orders'){const harbour=av.find(k=>k.startsWith('harbour:'));if(harbour&&p.hand.some(o=>o.kind!==6||recallKey()))return selectSpace(harbour);}if(id==='coins'&&av.includes('gold:0'))return selectSpace('gold:0');if(id==='collection'){const k=[...TYPES].sort((a,b)=>p.r[a]-p.r[b]).find(k=>p.r[k]<3&&av.includes(k+':0'));if(k)return selectSpace(k+':0');}}
 return originalAI();
};
const originalRender=render;render=function(){
 init();originalRender();if(!s)return;
 const sidebar=document.querySelector('.sidebar');
 if(sidebar){for(const h of sidebar.querySelectorAll('h2'))if(h.textContent.includes('AGENDA')){for(let n=0;n<2;n++){const p=h.nextElementSibling;if(p?.tagName==='P')p.remove();}h.remove();}const p=s.players[0];sidebar.insertAdjacentHTML('afterbegin','<section class="secret-identity"><h2>Your secret identity</h2><h3>'+esc(p.secret.name)+'</h3><p>'+esc(rule(p))+'</p><p>Current end-game bonus: '+bonus(p,0)+' VP</p>'+(p.engines.length?'<p>Active ongoing benefits: '+p.engines.map(e=>(e.vp?'+2 VP':res(e.reward))+' / '+CATEGORIES[e.kind]).map(esc).join('; ')+'</p>':'')+'</section>');}
 if(s.phase==='over'){const ranked=[...s.players].map((p,i)=>({p,i})).sort((a,b)=>b.p.total-a.p.total||b.p.r.gold-a.p.r.gold);const cards=document.querySelectorAll('.panel .card');cards.forEach((el,j)=>{const p=ranked[j]?.p;if(p)el.insertAdjacentHTML('beforeend','<section class="secret-reveal"><h3>Secret identity revealed: '+esc(p.secret.name)+'</h3><p>'+esc(rule(p))+'</p><p>Identity bonus: '+p.final.agenda+' VP</p></section>');});}
 save();
};
const originalHelp=overlays;overlays=function(){const html=originalHelp();return view==='help'?html.replace('</section>','<p>Secret identity bonuses appear in the sidebar and are revealed at final scoring. Existing voyages retain their original two-category charter. New voyages use 12 named identities, 60 Orders across 15 effects, six mandatory duties, and ten ongoing commissions. Ongoing effects trigger only on future matching commissions, not themselves or mandatory duties. Recall reopens an occupied non-Harbour space and grants one replacement placement, including during Harbour reassignment. Version-2 saves remain supported.</p></section>'):html;};
document.addEventListener('click',e=>{const b=e.target.closest('button[data-expansion-discard]');if(!b||b.disabled||!s||!isHuman()||s.step!=='order')return;const i=Number(b.dataset.expansionDiscard),p=actor(),o=p.hand[i];if(o?.kind!==6||recallKey())return;p.hand.splice(i,1);s.discard.push(o);say(p.name+' discards an unusable recall Order');s.step='quest';save();render();});
const style=document.createElement('style');style.textContent='.secret-identity{border:1px solid #8e7044;padding:8px;margin:0 0 10px;overflow-wrap:anywhere}.secret-identity h2,.secret-identity h3{margin:4px 0}.secret-identity p,.secret-reveal p{font-size:12px;margin:6px 0}.secret-reveal{border-top:1px solid #8e7044;margin-top:8px;padding-top:6px}';document.head.appendChild(style);
render();
})();
