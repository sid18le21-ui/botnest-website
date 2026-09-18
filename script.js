const PROGRAMS=[
{name:"Robotics",icon:"🤖",desc:"Learn electronics, sensors, actuators, programming and robotics through practical projects."},
{name:"IoT",icon:"🌐",desc:"Build connected devices using microcontrollers, sensors, networking and cloud concepts."},
{name:"Artificial Intelligence",icon:"🧠",desc:"Explore AI concepts, problem solving, data and practical intelligent applications."},
{name:"Machine Learning",icon:"📊",desc:"Understand data, features, models and the foundations of machine learning."},
{name:"Deep Learning",icon:"⚡",desc:"Explore neural networks and modern deep-learning concepts through guided projects."},
{name:"Automation",icon:"⚙️",desc:"Combine controllers, sensors and automation logic to solve real-world problems."}
];
const grid=document.getElementById("programGrid");
if(grid){grid.innerHTML=PROGRAMS.map((p,i)=>`<article class="program-card reveal"><div class="eyebrow">${String(i+1).padStart(2,"0")} / PROGRAM</div><h3>${p.icon} ${p.name}</h3><p>${p.desc}</p><div class="levels"><span class="level">Beginner</span><span class="level">Intermediate</span><span class="level">Expert</span></div><a class="program-link" href="course.html?course=${encodeURIComponent(p.name)}">Explore ${p.name} →</a></article>`).join("")}
const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav"),progress=document.getElementById("scrollProgress");
menuBtn?.addEventListener("click",()=>nav?.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>nav?.classList.remove("open")));
function reveal(){document.querySelectorAll(".reveal").forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight*.9)el.classList.add("is-visible")})}
addEventListener("scroll",()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(scrollY/h*100)+"%";reveal()},{passive:true});reveal();
document.getElementById("year").textContent=new Date().getFullYear();
