(()=>{
let board=null,canvas=null,frame=0;
const style=document.createElement('style');style.textContent=`.board{position:relative;overflow:hidden!important}.map-canvas{position:absolute;left:0;top:0;transform-origin:top left}.map-canvas>.world{min-width:0!important;width:100%!important;overflow:hidden;container-type:inline-size;background:linear-gradient(90deg,#9fc5ce 0 20%,#ddc58d 20% 100%)}.city-core{position:relative;width:100%;container-type:size;isolation:isolate;background:#ddc58d}.map-canvas .landmark{max-height:none!important;overflow:visible!important}.world>.constructed-landmark{position:absolute;transform:translateX(-50%);width:22%;min-height:100px;max-height:none;overflow:visible;text-align:center;border:0!important;padding:5px;background:radial-gradient(ellipse,#f4e3baf7 30%,#ecd6a6d9 60%,transparent 77%)}.constructed-landmark .spaces{margin-top:4px}.construction-roads{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}.constructed-landmark{z-index:2}.scenery span.wave{color:#286d91!important;opacity:.55!important}#terrain .water{color:#286d91!important}`;document.head.appendChild(style);
function schedule(){if(!frame)frame=requestAnimationFrame(fit);}
function fit(){
 frame=0;if(!board?.isConnected||!canvas?.isConnected)return;
 const width=board.clientWidth,height=board.clientHeight;if(width<4||height<4)return;
 const logicalWidth=Math.max(720,width),baseHeight=Math.max(620,Math.round(logicalWidth*.7)),world=canvas.querySelector(':scope>.world'),core=world.querySelector(':scope>.city-core');
 canvas.style.width=logicalWidth+'px';core.style.height=baseHeight+'px';
 const plots=[...world.querySelectorAll(':scope>.constructed-landmark')];let y=baseHeight+20;const road=[];
 for(let i=0;i<plots.length;i+=3){const row=plots.slice(i,i+3);row.forEach((plot,j)=>{plot.style.left=[35,60,84][j]+'%';plot.style.top=y+'px';});const rowHeight=Math.max(100,...row.map(plot=>Math.max(plot.offsetHeight,plot.scrollHeight)));const centre=y+rowHeight/2;road.push('M '+(logicalWidth*.72)+' '+(i?y-20:baseHeight*.85)+' L '+(logicalWidth*.72)+' '+centre);row.forEach((plot,j)=>road.push('M '+(logicalWidth*.72)+' '+centre+' L '+(logicalWidth*[.35,.60,.84][j])+' '+centre));y+=rowHeight+28;}
 const totalHeight=plots.length?y:baseHeight;world.style.setProperty('height',totalHeight+'px','important');
 let roads=world.querySelector(':scope>.construction-roads');if(!roads){roads=document.createElementNS('http://www.w3.org/2000/svg','svg');roads.setAttribute('class','construction-roads');roads.setAttribute('aria-hidden','true');world.insertBefore(roads,world.firstChild);}
 roads.setAttribute('viewBox','0 0 '+logicalWidth+' '+totalHeight);roads.innerHTML=road.length?'<path d="'+road.join(' ')+'" fill="none" stroke="#a48858" stroke-width="5" opacity=".65" filter="url(#worn-road)"/>':'';
 const scale=Math.min(1,(width-2)/logicalWidth,(height-2)/(totalHeight+8));canvas.style.transform='scale('+scale+')';canvas.style.left=Math.max(0,(width-logicalWidth*scale)/2)+'px';canvas.dataset.scale=String(scale);
}
const observer=new ResizeObserver(schedule),before=render;
render=function(){
 before();observer.disconnect();board=document.querySelector('.board');canvas=null;if(!board)return;
 canvas=board.querySelector(':scope>.map-canvas');
 if(!canvas){const world=board.querySelector(':scope>.world');if(!world)return;const quay=world.querySelector('.quay'),plots=quay?[...quay.querySelectorAll('.plot')]:[];world.querySelector('.quay-title')?.remove();quay?.remove();const core=document.createElement('div');core.className='city-core';while(world.firstChild)core.appendChild(world.firstChild);world.appendChild(core);plots.forEach(plot=>{plot.classList.add('constructed-landmark');world.appendChild(plot);});canvas=document.createElement('div');canvas.className='map-canvas';board.appendChild(canvas);canvas.appendChild(world);}
 for(const el of [board,canvas,...canvas.querySelectorAll('.city-core,.constructed-landmark')])observer.observe(el);fit();schedule();
};
window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);if(document.fonts){document.fonts.ready.then(schedule);document.fonts.addEventListener('loadingdone',schedule);}render();
})();
(()=>{const script=document.createElement('script');script.src=new URL('boss-mode.js',document.currentScript.src).href;document.head.appendChild(script);})();
