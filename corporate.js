
(()=> {
 document.addEventListener("DOMContentLoaded",()=>{
  const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
  const menu=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
  if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});}
  const items=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:"0px 0px -35px 0px"});
   items.forEach(el=>observer.observe(el));
  }else items.forEach(el=>el.classList.add("visible"));
  const form=document.getElementById("enquiry");
  if(form){
   const params=new URLSearchParams(location.search),interest=params.get("interest"),select=document.getElementById("interest");
   if(interest&&select){const option=[...select.options].find(o=>o.text.toLowerCase()===interest.toLowerCase());if(option)select.value=option.value;else if(interest.length<80){const o=document.createElement("option");o.textContent=interest;o.value=interest;select.add(o);select.value=interest;}}
   form.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent("BotNest project enquiry — "+d.get("interest"));const body=encodeURIComponent(`Name: ${d.get("name")}\nEmail: ${d.get("email")}\nInterest: ${d.get("interest")}\n\nRequirement:\n${d.get("message")}`);location.href=`mailto:botnest.officials@gmail.com?subject=${subject}&body=${body}`;});
  }
 });
})();
