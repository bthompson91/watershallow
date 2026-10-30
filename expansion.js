(()=>{
function cleanVoyage(v){
  if(!v||!v.duelVersion)return v;
  const early=v.duelOver&&v.phase==='over'&&v.round<8;
  for(const k of Object.keys(v))if(k.startsWith('duel')||k==='pendingDuel')delete v[k];
  for(const p of v.players)for(const k of ['hp','mana','manaMax','army','colour'])delete p[k];
  if(early){v.phase='end';v.step='place';delete v.pending;}
  return v;
}
const oldRead=read;read=function(){return cleanVoyage(oldRead());};
const oldRender=render;render=function(){if(s){cleanVoyage(s);if(s.phase==='over'&&s.players.some(p=>!Number.isFinite(p.total)))scoreFinal();}oldRender();};
const oldOverlay=overlays;overlays=function(){let html=oldOverlay();if(s?.combat&&!s.combat.diceAnimated){html=html.replace('<div class="modal-grid">','<p role="status">Rolling the dice...</p><div class="modal-grid dice-rolling">').replace('<button data-combat="continue">','<button data-combat="continue" disabled>');queueMicrotask(()=>animate(s?.combat));}return html;};
let animation=null,clock=null;
function face(n){const rows=[['     ','  o  ','     '],['o    ','     ','    o'],['o    ','  o  ','    o'],['o   o','     ','o   o'],['o   o','  o  ','o   o'],['o   o','o   o','o   o']][n-1];return ['+-------+',...rows.map(r=>'| '+r+' |'),'+-------+'].join('\n');}
function animate(c){if(!c||c.diceAnimated||(animation===c&&clock))return;clearInterval(clock);animation=c;let frame=0;const start=performance.now();clock=setInterval(()=>{if(s?.combat!==c){clearInterval(clock);clock=null;animation=null;return;}const elapsed=performance.now()-start;document.querySelectorAll('.combat-die').forEach((el,i)=>{const done=elapsed>=(i?1450:1050);el.textContent=done?face(i?c.dr:c.ar):frame%3?face(1+(frame*5+i*3)%6):'    /\\\n   / o\\\n  /o   /\n  \\ o /\n   \\/';el.setAttribute('aria-label',done?'d6 roll '+(i?c.dr:c.ar):'Rolling d6');});frame++;if(elapsed>=1500){clearInterval(clock);clock=null;animation=null;c.diceAnimated=true;save();render();}},85);}
const oldCity=city;city=function(){return oldCity().replace('<path class="road-edge"',`<defs><filter id="worn-road" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="2" seed="17" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale=".38" xChannelSelector="R" yChannelSelector="G" result="rough"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0"/><feComponentTransfer result="chips"><feFuncA type="discrete" tableValues="0 1 1"/></feComponentTransfer><feComposite in="rough" in2="chips" operator="in"/></filter></defs><g filter="url(#worn-road)"><path class="road-edge"`).replace('<path class="dock"','</g><path class="dock"');};
const style=document.createElement('style');style.textContent='.roads .road-edge,.roads .road-fill{stroke-dasharray:none!important;stroke-linecap:butt!important}.modal:has(.dice-rolling)>p:not([role="status"]),.dice-rolling section>p{visibility:hidden}.dice-rolling .combat-die{min-height:6em;min-width:10ch}@media(max-width:1100px){.top{position:sticky;top:0;z-index:4;flex-wrap:wrap;gap:5px;padding:6px;background:#eeddb4;box-shadow:0 2px 5px #49332155}.top .resources{flex:1 1 100%;gap:6px;order:1}.top .duel-status{font-size:11px;flex:1 1 100%;order:2}.top .brand{font-size:17px}.top>button{font-size:11px}body{overflow-x:hidden}}';document.head.appendChild(style);
render();
})();
