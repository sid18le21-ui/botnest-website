
document.addEventListener("DOMContentLoaded",()=>{
 const data=window.BOTNEST_CATALOGUE||[], search=document.getElementById("productSearch"), filter=document.getElementById("categoryFilter"), grid=document.getElementById("productCatalogue"), count=document.getElementById("resultCount");
 if(!grid)return;
 data.forEach(c=>{const o=document.createElement("option");o.value=c.category;o.textContent=c.category;filter.appendChild(o)});
 function render(){
  const q=(search.value||"").trim().toLowerCase(), selected=filter.value;
  const found=data.map(c=>({...c,items:c.items.filter(p=>(selected==="all"||selected===c.category)&&(!q||p.toLowerCase().includes(q)||c.category.toLowerCase().includes(q)))})).filter(c=>c.items.length);
  grid.innerHTML=found.map(c=>`<article class="category-card"><div class="category-head"><h3>${c.category}</h3><span>${c.items.length} LISTED</span></div><div class="product-list">${c.items.map(p=>`<span class="product-chip">${p}</span>`).join("")}</div><a class="category-enquire" href="contact.html?interest=${encodeURIComponent(c.category)}">Enquire about this category ↗</a></article>`).join("");
  const total=found.reduce((n,c)=>n+c.items.length,0);count.textContent=`${total} product type${total===1?"":"s"} shown`;
  if(!found.length)grid.innerHTML='<p class="micro-note">No matching product types. Try another search.</p>';
 }
 search.addEventListener("input",render);filter.addEventListener("change",render);render();
});
