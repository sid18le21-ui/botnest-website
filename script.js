(() => {
  const BOTNEST_API_URL = "https://botnest-api.botnest-officials.workers.dev/";
  const STORAGE_KEYS = { token:"botnest_session_token", role:"botnest_session_role", account:"botnest_account" };
  const PROGRAMS = [
    {name:"Robotics",icon:"🤖",desc:"Learn electronics, sensors, actuators, programming and robotics through practical projects."},
    {name:"IoT",icon:"🌐",desc:"Build connected devices using microcontrollers, sensors, networking and cloud concepts."},
    {name:"Artificial Intelligence",icon:"🧠",desc:"Explore AI concepts, problem solving, data and practical intelligent applications."},
    {name:"Machine Learning",icon:"📊",desc:"Understand data, features, models and the foundations of machine learning."},
    {name:"Deep Learning",icon:"⚡",desc:"Explore neural networks and modern deep-learning concepts through guided projects."},
    {name:"Automation",icon:"⚙️",desc:"Combine controllers, sensors and automation logic to solve real-world problems."}
  ];

  window.BotNest = {
    API_URL: BOTNEST_API_URL,
    getToken(){return localStorage.getItem(STORAGE_KEYS.token)},
    getRole(){return localStorage.getItem(STORAGE_KEYS.role)},
    getAccount(){try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.account)||"null")}catch{return null}},
    setSession(data){if(!data||!data.sessionToken)return;localStorage.setItem(STORAGE_KEYS.token,data.sessionToken);localStorage.setItem(STORAGE_KEYS.role,data.role||"customer");if(data.account)localStorage.setItem(STORAGE_KEYS.account,JSON.stringify(data.account))},
    clearSession(){localStorage.removeItem(STORAGE_KEYS.token);localStorage.removeItem(STORAGE_KEYS.role);localStorage.removeItem(STORAGE_KEYS.account)},
    async api(action,payload={}){const body={action,...payload};const token=this.getToken();if(token)body.sessionToken=token;const response=await fetch(BOTNEST_API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)});let data;try{data=await response.json()}catch{throw new Error("The server returned an invalid response.")}if(!response.ok||data.success===false)throw new Error(data.message||"Request failed.");return data}
  };

  document.addEventListener("DOMContentLoaded",()=>{
    initializePrograms();initializeNavigation();updateAccountNavigation();initializeYear();initializeScrollProgress();initializeScrollAnimations();initializeParallax();
  });

  function initializePrograms(){
    const grid=document.getElementById("programGrid");if(!grid)return;
    grid.innerHTML=PROGRAMS.map((p,i)=>`<article class="program-card reveal ${getRevealClass(i)}"><div class="program-card-glow"></div><div class="program-top"><span class="program-icon">${p.icon}</span><span class="program-index">${String(i+1).padStart(2,"0")}</span></div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.desc)}</p><div class="program-levels"><a href="course.html?course=${encodeURIComponent(p.name)}&level=Beginner"><span>Beginner</span><strong>→</strong></a><a href="course.html?course=${encodeURIComponent(p.name)}&level=Intermediate"><span>Intermediate</span><strong>→</strong></a><a href="course.html?course=${encodeURIComponent(p.name)}&level=Expert"><span>Expert</span><strong>→</strong></a></div><a class="program-explore" href="course.html?course=${encodeURIComponent(p.name)}">Explore Program <span>→</span></a></article>`).join("");window.BotNestAnimations?.refresh?.();
  }
  function getRevealClass(i){return ["reveal-left","reveal-up","reveal-right","reveal-up"][i%4]}

  function initializeNavigation(){
    const button=document.getElementById("menuBtn"),nav=document.getElementById("mainNav");if(!button||!nav)return;
    button.addEventListener("click",()=>{const open=nav.classList.toggle("mobile-open");button.classList.toggle("active",open);button.setAttribute("aria-expanded",String(open))});
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("mobile-open");button.classList.remove("active");button.setAttribute("aria-expanded","false")}));
  }

  function updateAccountNavigation(){
    const box=document.getElementById("navAccount");if(!box)return;
    const token=BotNest.getToken(),role=BotNest.getRole();
    if(!token){box.innerHTML=`<a class="nav-login" href="login.html">Login</a><a class="nav-cta" href="signup.html">Create Account</a>`;return}
    box.innerHTML=role==="admin"?`<a class="nav-login" href="admin.html">Admin Panel</a><button class="nav-logout" id="globalLogoutButton" type="button">Logout</button>`:`<a class="nav-login" href="customer.html">Dashboard</a><button class="nav-logout" id="globalLogoutButton" type="button">Logout</button>`;
    document.getElementById("globalLogoutButton")?.addEventListener("click",async e=>{e.currentTarget.disabled=true;try{await BotNest.api(role==="admin"?"adminLogout":"customerLogout")}catch(err){console.warn(err)}finally{BotNest.clearSession();location.reload()}});
  }
  function initializeYear(){document.querySelectorAll("#year").forEach(el=>el.textContent=new Date().getFullYear())}
  function initializeScrollProgress(){const bar=document.getElementById("scrollProgress");if(!bar)return;const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?(scrollY/max)*100:0)+"%"};addEventListener("scroll",update,{passive:true});update()}

  function initializeScrollAnimations(){
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;if(reduced){document.querySelectorAll(".reveal").forEach(e=>e.classList.add("reveal-visible"));return}
    let lastY=scrollY,direction="down";
    addEventListener("scroll",()=>{const y=scrollY;if(y>lastY+2)direction="down";else if(y<lastY-2)direction="up";document.body.classList.toggle("scrolling-down",direction==="down");document.body.classList.toggle("scrolling-up",direction==="up");lastY=y},{passive:true});
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{const el=entry.target;el.classList.toggle("entering-from-bottom",direction==="down");el.classList.toggle("entering-from-top",direction==="up");if(entry.isIntersecting){el.classList.add("reveal-visible");el.classList.remove("reveal-hidden");el.dataset.scrollDirection=direction}else{el.classList.remove("reveal-visible");el.classList.add("reveal-hidden")}}),{threshold:.12,rootMargin:"0px 0px -8% 0px"});
    const observe=()=>document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));observe();window.BotNestAnimations={refresh:observe};
  }
  function initializeParallax(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const els=document.querySelectorAll("[data-parallax]");if(!els.length)return;let ticking=false;const update=()=>{els.forEach(el=>{const speed=Number(el.dataset.parallax)||0,rect=el.getBoundingClientRect(),distance=rect.top+rect.height/2-innerHeight/2;el.style.transform=`translate3d(0,${distance*speed}px,0)`});ticking=false};addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update()}
  function escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
})();
