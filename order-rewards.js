(()=>{
const before=orderCard;
orderCard=function(order,index){const html=before(order,index);return order.kind===1?html.replace("Gain 2 adventurers of this round's recruitment type.",'Gain 2 '+TYPES[s.round%4]+'.'):html;};
render();
})();
