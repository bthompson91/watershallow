(()=>{
'use strict';
if(window.__watershallowBossMode)return;
window.__watershallowBossMode=true;
const key='watershallow-boss-mode',title=document.title;
let enabled=false;
try{enabled=localStorage.getItem(key)==='1';}catch(_){}
const plain=t=>String(t).replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/\s+/g,' ').trim();
function chart(){
 const rows=LOC.map(([id,name,reward])=>({id,name:plain(name),reward,n:id==='guild'||id==='harbour'?3:1}));
 for(const b of s.built)rows.push({id:b.id,name:b.name,reward:b.reward,n:1,owner:s.players[b.owner]?.name});
 const maximum=Math.max(4,...rows.map(r=>Object.values(r.reward).reduce((a,b)=>a+b,0)));
 return '<h2>Resource allocation by location</h2><p class="boss-caption">Allocation units · bars show total resource yield; special actions have no resource bar.</p><div class="boss-axis" aria-hidden="true">0 &nbsp; · &nbsp; '+maximum+' units</div>'+rows.map(r=>{
 const quantity=Object.values(r.reward).reduce((a,b)=>a+b,0);
 const special={foundry:'Construct building',council:'First player + Order',guild:'Acquire commission',harbour:'Order + later reassignment'}[r.id];
 return '<section class="boss-row"><div class="boss-row-label">'+esc(r.name)+(r.owner?'<small>Owner: '+esc(r.owner)+'</small>':'')+'</div><div class="boss-plot"><div class="boss-bar" style="width:'+(quantity/maximum*100)+'%" aria-hidden="true"></div><span>'+esc(special||plain(res(r.reward)))+'</span></div><div class="boss-controls">'+slots(r.id,r.n)+'</div></section>';
 }).join('');
}
function apply(){
 document.documentElement.classList.toggle('boss-mode',enabled);
 document.title=enabled?'Resource Allocation.xlsx':title;
 const target=document.querySelector('.top')||document.querySelector('.menu')||document.querySelector('.panel');
 if(target&&!document.getElementById('boss-mode-toggle')){const button=document.createElement('button');button.id='boss-mode-toggle';button.dataset.bossToggle='1';button.type='button';button.textContent=enabled?'Boss Mode: On':'Boss Mode: Off';button.setAttribute('aria-pressed',String(enabled));button.title='Toggle spreadsheet appearance (Alt+Shift+B)';target.appendChild(button);}
 if(!enabled)return;
 const board=document.querySelector('.board');
 if(board&&s){const dashboard=document.createElement('section');dashboard.className='boss-dashboard';dashboard.setAttribute('aria-label','Resource allocation dashboard');dashboard.innerHTML=chart();board.appendChild(dashboard);}
 const brand=document.querySelector('.brand');if(brand?.firstChild?.nodeType===3)brand.firstChild.textContent='RESOURCE ALLOCATION ';
 const app=document.getElementById('app');
 if(app){const walker=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement?.closest('pre,script,style,textarea'))continue;node.nodeValue=node.nodeValue.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'');}}
 if(typeof fitHands==='function')fitHands();
}
const previous=render;render=function(...args){const result=previous.apply(this,args);apply();return result;};
function toggle(){enabled=!enabled;try{localStorage.setItem(key,enabled?'1':'0');}catch(_){}render();document.getElementById('boss-mode-toggle')?.focus({preventScroll:true});}
document.addEventListener('click',e=>{if(e.target.closest('[data-boss-toggle]'))toggle();});
document.addEventListener('keydown',e=>{if(e.altKey&&e.shiftKey&&e.code==='KeyB'&&!e.repeat&&!e.isComposing){e.preventDefault();toggle();}});
const css=document.createElement('style');css.id='boss-mode-styles';css.textContent=`
html.boss-mode{color-scheme:light}
html.boss-mode body,html.boss-mode #app{background:#f3f4f5!important;color:#242424!important;background-image:none!important}
html.boss-mode body *,html.boss-mode body *::before,html.boss-mode body *::after{font-family:Calibri,'Segoe UI',Arial,sans-serif!important;text-shadow:none!important;box-shadow:none!important}
html.boss-mode .top{background:#217346!important;color:#fff!important;border-color:#185c37!important}
html.boss-mode .brand,html.boss-mode .brand span,html.boss-mode .top .resources,html.boss-mode .top span{color:#fff!important}
html.boss-mode .sidebar,html.boss-mode .hand,html.boss-mode .board,html.boss-mode .panel,html.boss-mode .menu,html.boss-mode .modal,html.boss-mode .card,html.boss-mode .stack,html.boss-mode .rival,html.boss-mode .foot,html.boss-mode .secret-identity,html.boss-mode .secret-reveal{background:#fff!important;background-image:none!important;color:#242424!important;border-color:#d4d4d4!important;border-radius:0!important}
html.boss-mode h1,html.boss-mode h2,html.boss-mode h3{color:#217346!important;letter-spacing:0!important}
html.boss-mode .small,html.boss-mode .reward{color:#555!important}
html.boss-mode .sidebar-art,html.boss-mode .menu pre{display:none!important}
html.boss-mode .board>.map-canvas,html.boss-mode .board>.world{visibility:hidden!important;pointer-events:none!important}
html.boss-mode .board{isolation:isolate}
html.boss-mode .board .boss-dashboard{position:absolute;inset:0;overflow:auto;padding:18px;background:#fff;color:#242424;z-index:3}
html.boss-mode .boss-dashboard h2{margin:0 0 8px;font-size:19px}
html.boss-mode .boss-caption{font-size:12px;color:#666;margin:0 0 8px}
html.boss-mode .boss-axis{text-align:right;font-size:11px;color:#666;padding:0 8px 6px}
html.boss-mode .boss-row{display:grid;grid-template-columns:minmax(100px,1fr) minmax(90px,1.4fr) minmax(95px,1fr);gap:10px;align-items:center;border:1px solid #e0e0e0;border-bottom:0;padding:10px;min-height:58px}
html.boss-mode .boss-row:last-child{border-bottom:1px solid #e0e0e0}
html.boss-mode .boss-row-label{font-size:13px;overflow-wrap:anywhere}
html.boss-mode .boss-row-label small{display:block;font-size:11px;color:#666}
html.boss-mode .boss-plot{position:relative;min-height:34px;display:flex;align-items:center;background:repeating-linear-gradient(90deg,transparent 0,transparent calc(25% - 1px),#ddd calc(25% - 1px),#ddd 25%)}
html.boss-mode .boss-bar{position:absolute;inset:4px auto 4px 0;background:#c6e0b4;border-left:3px solid #217346;max-width:100%}
html.boss-mode .boss-plot span{position:relative;z-index:1;padding:4px 6px;font-size:12px;color:#202020}
html.boss-mode .boss-controls .spaces{margin:0;display:flex;flex-wrap:wrap;gap:4px}
html.boss-mode body button:not(:disabled){background:#217346!important;color:#fff!important;border:1px solid #185c37!important;border-radius:2px!important}
html.boss-mode body button:not(:disabled):hover{background:#185c37!important;outline-color:#107c41!important}
html.boss-mode body button:disabled{background:#eee!important;color:#777!important;border:1px solid #ccc!important;border-radius:2px!important}
html.boss-mode body button:focus-visible{outline:2px solid #107c41!important;outline-offset:2px}
html.boss-mode .rival.active{border-left:3px solid #217346!important;background:#eaf3ed!important}
html.boss-mode .commission-badge{background:#217346!important;color:#fff!important}
html.boss-mode .commission-affordable{outline-color:#217346!important}
#boss-mode-toggle{font:12px Arial,sans-serif!important;white-space:nowrap}
@media(max-width:600px){html.boss-mode .boss-row{grid-template-columns:1fr 1fr;gap:6px}html.boss-mode .boss-controls{grid-column:1 / -1}html.boss-mode .board .boss-dashboard{padding:10px}}
`;
document.head.appendChild(css);render();
})();
