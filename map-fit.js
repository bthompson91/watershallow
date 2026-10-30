(()=>{
let board=null,frame=null;
const style=document.createElement('style');
style.textContent=`.board{position:relative;overflow:hidden!important}.map-canvas{position:absolute;left:0;top:0;transform-origin:top left}.map-canvas .world{height:640px!important;min-width:0!important;width:100%!important;overflow:hidden}.map-canvas>.quay-title{position:relative!important;inset:auto!important;display:block;width:100%;white-space:normal;padding:5px 0;min-height:24px}.map-canvas>.quay{position:relative!important;inset:auto!important;width:100%;height:auto!important;max-height:none!important;overflow:visible!important;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;padding:8px;margin:0}.map-canvas>.quay .plot{overflow:visible;min-height:100px}.map-canvas>.quay>.small{grid-column:1/-1}.scenery span.wave{color:#286d91!important;opacity:.55!important}#terrain .water{color:#286d91!important}`;
document.head.appendChild(style);
function fit(){frame=null;if(!board?.isConnected)return;const canvas=board.querySelector(':scope>.map-canvas');if(!canvas)return;const width=board.clientWidth,height=board.clientHeight;if(!width||!height)return;canvas.style.width=Math.max(800,width)+'px';const logicalHeight=canvas.offsetHeight;if(!logicalHeight)return;const scale=Math.min(1,width/canvas.offsetWidth,height/logicalHeight);canvas.style.transform='scale('+scale+')';canvas.style.left=Math.max(0,(width-canvas.offsetWidth*scale)/2)+'px';}
function schedule(){if(frame===null)frame=requestAnimationFrame(fit);}
const observer=new ResizeObserver(schedule);
const before=render;
render=function(){
 before();
 const next=document.querySelector('.board');
 if(next!==board){observer.disconnect();board=next;if(board)observer.observe(board);}
 if(!board)return;
 if(!board.querySelector(':scope>.map-canvas')){
  const world=board.querySelector(':scope>.world');if(!world)return;
  const title=world.querySelector('.quay-title'),quay=world.querySelector('.quay'),canvas=document.createElement('div');canvas.className='map-canvas';
  board.appendChild(canvas);canvas.appendChild(world);if(title)canvas.appendChild(title);if(quay){quay.removeAttribute('data-scroll');canvas.appendChild(quay);}
 }
 fit();schedule();
};
window.addEventListener('resize',schedule);
if(document.fonts)document.fonts.ready.then(schedule);
render();
})();
