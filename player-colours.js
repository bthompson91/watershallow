(()=>{
const palette=[{id:'teal',ink:'#165f69',tint:'#c4ded8'},{id:'red',ink:'#8b342b',tint:'#ebc7b5'},{id:'violet',ink:'#664282',tint:'#dbcee6'},{id:'ochre',ink:'#79531c',tint:'#efdda0'},{id:'green',ink:'#345e35',tint:'#cdddaf'}];
let pending=null,auto=null;
function ensure(){if(!s)return;const used=new Set();for(const p of s.players){if(!palette.some(c=>c.id===p.playerColour)||used.has(p.playerColour))delete p.playerColour;else used.add(p.playerColour);}const remaining=shuffle(palette.filter(c=>!used.has(c.id)));for(const p of s.players)if(!p.playerColour)p.playerColour=remaining.pop().id;}
const colour=i=>palette.find(c=>c.id===s.players[i].playerColour)||palette[0];
const baseSlots=slots;
slots=function(...args){ensure();return baseSlots(...args).replace(/<button\b[^>]*>[\s\S]*?<\/button>/g,h=>{const k=h.match(/data-key="([^"]+)"/)?.[1]||h.match(/data-act="space,([^"]+)"/)?.[1];if(!k||!Object.hasOwn(s.used,k))return h;const c=colour(s.used[k]);return h.replace('<button','<button style="background:'+c.tint+'!important;color:'+c.ink+'!important;border-color:'+c.ink+'!important"');});};
const baseRender=render;
render=function(){
 ensure();baseRender();if(!s){clearTimeout(auto);pending=null;return;}
 document.querySelectorAll('.rival').forEach((el,i)=>{if(s.players[i]){const col=colour(i);el.style.borderLeft='4px solid '+col.ink;el.style.paddingLeft='8px';el.style.background=col.tint+'80';el.querySelector('h3')?.insertAdjacentHTML('beforeend',' <span style="color:'+col.ink+'" aria-label="'+s.players[i].playerColour+' player">●</span>');}});
 const c=s.combat;if(c){document.querySelectorAll('.combat-die').forEach((el,i)=>{const col=colour(i?c.d:c.a);el.style.setProperty('color',col.ink,'important');el.style.setProperty('background','transparent','important');el.style.setProperty('border','none','important');el.style.setProperty('box-shadow','none','important');});}
 const aiOnly=c&&s.players[c.a].ai&&s.players[c.d].ai;
 if(aiOnly){const button=document.querySelector('button[data-combat="continue"]');if(button){button.disabled=true;button.textContent=c.diceAnimated?'Continuing automatically...':'Rolling...';}}
 if(aiOnly&&c.diceAnimated){if(pending!==c){clearTimeout(auto);pending=c;auto=setTimeout(()=>{if(s?.combat===c){delete s.combat;s.step='quest';save();render();}pending=null;},650);}}
 else{clearTimeout(auto);pending=null;}
 save();
};
render();
})();
