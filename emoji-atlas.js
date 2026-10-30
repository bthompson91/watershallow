/* Original emoji atlas presentation. Rules and saves remain in watershallow.js. */
(() => {
  'use strict';
  Object.assign(POS,{guards:[37,13],gold:[62,23],mages:[84,10],scouts:[35,38],council:[62,45],healers:[86,37],guild:[29,62],harbour:[55,66],foundry:[84,64]});
  const icons={guards:'🏰 🛡️ 🏰',gold:'💰 🏛️ 🪙',mages:'✨ 🗼 🔮',scouts:'🏘️ 🗡️ 🏮',council:'⚖️ 👑 🏛️',healers:'🌳 ⛪ 🌿',guild:'📜 🏪 📜',harbour:'⚓ ⛵ 🐚',foundry:'🔨 🏭 🔥'};
  const style=document.createElement('style');
  style.textContent=`
    .world{background:#ddc58d}.landmark{width:20%;max-height:23%;z-index:2;background:radial-gradient(ellipse,#f4e3baf7 30%,#ecd6a6d9 60%,transparent 77%)}
    .landmark-icon{font-size:clamp(16px,2.8cqh,30px);line-height:1.05;white-space:nowrap}
    .landmark .building-art{font-size:clamp(6px,.9cqh,8px);line-height:1;max-height:36px;overflow:hidden}
    .landmark h3{font-size:clamp(10px,.78vw,14px)}.landmark .reward{font-size:clamp(9px,.65vw,11px)}
    .landmark .spaces{gap:2px}.landmark .spaces button{font-size:clamp(10px,.65vw,11px);padding:3px 4px}
    .sea-name,.treeline{display:none}.scenery,.roads,.map-caption{position:absolute;inset:0;pointer-events:none;user-select:none}
    .scenery{z-index:0;overflow:hidden}.scenery span{position:absolute;transform:translate(-50%,-50%);font-size:clamp(13px,2.6cqh,27px);line-height:1;filter:saturate(.85)}
    .scenery span.wave{opacity:.68;font-size:clamp(14px,3.1cqh,32px)}.scenery span.house{font-size:clamp(11px,2.1cqh,23px)}
    .roads{width:100%;height:100%;z-index:0}.roads .road-edge{fill:none;stroke:#a48858;stroke-width:1.1;stroke-dasharray:1.8 .45 .6 .3 2.1 .6;opacity:.75;stroke-dasharray:1.8 .45 .6 .3 2.1 .6;opacity:.75;stroke-linecap:round;stroke-linejoin:round}
    .roads .road-fill{fill:none;stroke:#f5e6b8;stroke-width:.65;stroke-dasharray:2.3 .3 .7 .4 1.4 .5;opacity:.85;stroke-dasharray:2.3 .3 .7 .4 1.4 .5;opacity:.85;stroke-linecap:round;stroke-linejoin:round}
    .roads .dock{stroke:#775b37;stroke-width:.4;fill:none}.map-caption{inset:auto;z-index:1;font-size:clamp(9px,.7vw,13px);font-weight:bold;letter-spacing:1px;color:#244d61;text-shadow:0 1px #e8dfb1}
    .quay-title{top:84%;z-index:3}.quay{top:88%;z-index:3;background:#e4cda299}.plot{background:#efdab2ed}
    @media(min-width:1101px) and (max-height:650px){.landmark .building-art{display:none}.landmark-icon{font-size:19px}.landmark{max-height:24%}.quay-title{top:84%}.quay{top:88%}}
    @media(max-width:1100px){.landmark .building-art{display:none}.landmark{max-height:23%}.landmark-icon{font-size:21px}.landmark .reward{font-size:10px}}
  `;
  document.head.appendChild(style);
  function scatter(){
    let out='',seed=73019;
    const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    const put=(x,y,e,c='')=>{out+=`<span class="${c}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%">${e}</span>`};
    for(let i=0;i<45;i++){const y=3+rnd()*94,x=1+rnd()*(17+3*Math.sin(y/12));put(x,y,i%17===0?'🐟':i%29===0?'🐚':'~','wave')}
    [[7,18,'⛵'],[13,43,'🚢'],[5,69,'⛵'],[17,79,'⚓'],[12,89,'🛶']].forEach(a=>put(...a));
    for(let i=0;i<85;i++){let x,y;if(i<60){x=24+rnd()*74;y=1+rnd()*5}else{x=96+rnd()*3;y=6+rnd()*75}put(x,y,i%5===0?'🌳':'🌲')}
    const near=(x,y)=>Object.values(POS).some(([a,b])=>Math.abs(x-a)<12&&y>b-7&&y<b+15);
    const houses=['🏠','🏘️','🏡','🏪','🛖','🏚️'];
    for(let i=0;i<220;i++){const x=24+rnd()*68,y=10+rnd()*70;if(!near(x,y))put(x,y,houses[i%houses.length],'house')}
    [[93,24,'🌳'],[94,29,'🌲'],[94,43,'🌳'],[75,13,'⛰️'],[78,7,'🪨'],[40,82,'📦'],[46,79,'⚓'],[61,80,'⛵'],[73,81,'📦'],[22,67,'🐚']].forEach(a=>put(...a));
    return '<div class="scenery" aria-hidden="true">'+out+'</div>';
  }
  const road='M37 13 Q45 8 50 18 T62 23 Q76 26 84 10 M62 23 Q55 33 62 45 Q71 50 86 37 M37 13 Q27 26 35 38 Q42 49 29 62 Q36 77 55 66 Q68 59 84 64 M35 38 Q49 32 62 45 Q57 57 55 66 M86 37 Q92 51 84 64 M55 66 Q61 78 72 85';
  const baseCity=city;
  city=function(){
    let html=baseCity();
    html=html.replace('<pre id="terrain"',scatter()+`<svg class="roads" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="road-edge" d="${road}"/><path class="road-fill" d="${road}"/><path class="dock" d="M21 68 H30 M21 70 H29 M22 73 H31 M23 75 H33 M24 78 H36"/></svg><span class="map-caption" aria-hidden="true" style="left:2%;top:53%;writing-mode:vertical-rl">THE SHALLOW SEA</span><span class="map-caption" aria-hidden="true" style="left:46%;top:8%;color:#446238">KINGSGROVE 🌳</span><pre id="terrain"`);
    for(const [id,name] of LOC)html=html.replace('<h3>'+name+'</h3>',`<div class="landmark-icon" aria-hidden="true">${icons[id]}</div><h3>${name}</h3>`);
    return html;
  };
  paint=function(){
    const el=$('terrain'),world=$('world');if(!el||!world)return;
    const cols=Math.ceil(world.clientWidth/3.62),rows=Math.ceil(world.clientHeight/7);if(!cols||!rows)return;
    let out='';
    for(let y=0;y<rows;y++){let run='',last='';
      for(let x=0;x<cols;x++){const u=x/cols,v=y/rows,sea=u<.205+.025*Math.sin(v*14)||v>.965,forest=!sea&&(v<.075||u>.955),kind=sea?'water':forest?'forest':'town',pattern=sea?' ~                     ':forest?' ^ A ^ | ':' /\\__|[]_ ';
        if(kind!==last){if(run)out+=`<span class="${last}">${esc(run)}</span>`;run='';last=kind}run+=pattern[(x*3+y*5)%pattern.length];
      }out+=`<span class="${last}">${esc(run)}</span>\n`;
    }el.style.fontSize='6px';el.style.lineHeight='7px';el.innerHTML=out;
  };
  render();
})();
