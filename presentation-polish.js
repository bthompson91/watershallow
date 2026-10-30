(()=>{
function polish(){
 const root=document.getElementById('app');if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){if(node.parentElement.closest('pre,script,style,.compass,#terrain,.sidebar-art,.building-art'))continue;node.nodeValue=node.nodeValue.replace(/\b[A-Z]{2,}\b/g,w=>w[0]+w.slice(1).toLowerCase());}
 root.querySelectorAll('h1,h2,h3,.brand,.quay-title,.map-caption').forEach(el=>{if(el.dataset.polishedSize)return;const size=parseFloat(getComputedStyle(el).fontSize);if(Number.isFinite(size)){el.style.setProperty('font-size',(size+4)+'px','important');el.dataset.polishedSize='1';}});
 if(typeof fitHands==='function')fitHands();
}
const before=render;render=function(){before();polish();};polish();
})();
