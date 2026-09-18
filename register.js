(() => {
  "use strict";

  // URL format:
  // register.html?course=Robotics&level=Beginner
  const params = new URLSearchParams(window.location.search);

  const COURSE_ALIASES = {
    robotics: "Robotics",
    iot: "IoT",
    ai: "AI",
    "machine-learning": "Machine Learning",
    ml: "Machine Learning",
    "deep-learning": "Deep Learning",
    dl: "Deep Learning",
    automation: "Automation",
    coding: "Coding"
  };

  const LEVELS = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert"
  };

  const rawCourse = (params.get("course") || "Robotics").trim();
  const rawLevel = (params.get("level") || "Beginner").trim();

  const courseKey = rawCourse.toLowerCase().replace(/\s+/g, "-");
  const course = COURSE_ALIASES[courseKey] || rawCourse;
  const level = LEVELS[rawLevel.toLowerCase()] || "Beginner";

  const $ = (id) => document.getElementById(id);

  const courseName = $("courseName");
  const levelName = $("levelName");
  const courseTitle = $("courseTitle");
  const prereqBlock = $("prerequisiteBlock");
  const prereqQuestion = $("prereqQuestion");
  const prereqWarning = $("prereqWarning");
  const prereqWarningText = $("prereqWarningText");
  const prereqCourseLink = $("prereqCourseLink");
  const blockedNote = $("blockedNote");
  const form = $("registrationForm");
  const submitBtn = $("submitBtn");
  const errorBox = $("errorBox");
  const successCard = $("successCard");
  const registrationShell = $("registrationShell");

  courseName.textContent = course;
  levelName.textContent = level;
  courseTitle.textContent = `${course} — ${level}`;

  // Return to the correct course page.
  const courseUrl = `course.html?course=${encodeURIComponent(course)}`;
  $("backToCourse").href = courseUrl;

  // Beginner = NO prerequisite question.
  // Intermediate = Beginner prerequisite.
  // Expert = Intermediate prerequisite.
  let prerequisiteLevel = null;

  if (level === "Intermediate") prerequisiteLevel = "Beginner";
  if (level === "Expert") prerequisiteLevel = "Intermediate";

  if (prerequisiteLevel) {
    prereqBlock.hidden = false;
    prereqQuestion.innerHTML =
      `Have you already completed a ${prerequisiteLevel}-level ${escapeHtml(course)} course on any platform? <span class="required">*</span>`;

    prereqWarningText.textContent =
      `We recommend completing the ${prerequisiteLevel}-level ${course} course before enrolling in the ${level} level. ` +
      `The ${level} curriculum builds on the concepts and practical skills covered in the ${prerequisiteLevel} level. ` +
      `Starting directly at ${level} may make it harder to follow the curriculum and keep pace with the class.`;

    prereqCourseLink.href =
      `course.html?course=${encodeURIComponent(course)}&level=${encodeURIComponent(prerequisiteLevel)}`;

    document.querySelectorAll('input[name="prerequisite"]').forEach((radio) => {
      radio.addEventListener("change", updatePrerequisiteState);
    });

    updatePrerequisiteState();
  }

  function updatePrerequisiteState() {
    const selected = document.querySelector('input[name="prerequisite"]:checked')?.value || "";

    if (selected === "No") {
      prereqWarning.classList.add("show");
      blockedNote.classList.add("show");
      submitBtn.disabled = true;
    } else {
      prereqWarning.classList.remove("show");
      blockedNote.classList.remove("show");
      submitBtn.disabled = false;
    }

    if (selected === "Yes") {
      $("experienceIntro").textContent =
        `Great. Tell us about the student's previous ${prerequisiteLevel}-level ${course} learning and projects.`;
    } else {
      $("experienceIntro").textContent =
        `Help us understand the student's previous learning experience.`;
    }
  }

  // Set minimum contact date to today.
  const dateInput = $("contactDate");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");

    if (level !== "Beginner") {
      const prerequisite = document.querySelector('input[name="prerequisite"]:checked')?.value;
      if (!prerequisite) {
        showError(`Please answer the prerequisite question before submitting.`);
        return;
      }
      if (prerequisite === "No") {
        updatePrerequisiteState();
        showError(`Please complete the recommended ${prerequisiteLevel}-level ${course} course before registering for ${level}.`);
        return;
      }
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    // Always include the course and level in the registration payload.
    data.course = course;
    data.level = level;
    data.prerequisiteLevel = prerequisiteLevel || "";
    data.submittedAt = new Date().toISOString();

    // Backend will be connected in the next step through config.js.
    const endpoint = window.BOTNEST_CONFIG?.APPS_SCRIPT_URL || "";

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      if (!endpoint) {
        // Frontend test mode only. Do NOT use this as the final live registration setup.
        console.warn("BOTNEST_CONFIG.APPS_SCRIPT_URL is not configured. Running frontend test mode.");
        await new Promise((resolve) => setTimeout(resolve, 700));
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          mode: "cors",
          headers: {"Content-Type": "text/plain;charset=utf-8"},
          body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Registration service returned an error.");

        const result = await response.json().catch(() => ({success: true}));
        if (result.success === false) {
          throw new Error(result.message || "Registration could not be completed.");
        }
      }

      showSuccess(data);
    } catch (error) {
      console.error(error);
      showError("We couldn't submit the registration right now. Please try again or contact BotNest on WhatsApp.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Registration →";
    }
  });

  function showSuccess(data) {
    form.style.display = "none";
    errorBox.classList.remove("show");
    successCard.classList.add("show");

    $("successCourse").textContent = data.course;
    $("successLevel").textContent = `${data.level} Level`;

    const prettyDate = data.contactDate
      ? new Date(`${data.contactDate}T00:00:00`).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        })
      : data.contactDate;

    $("successContact").textContent = `${prettyDate} • ${data.contactTime}`;

    // Replace this number with your final BotNest WhatsApp number if needed.
    const whatsappNumber = "918939129382";
    const message = `Hi BotNest Academy, I have completed my registration for ${data.course} — ${data.level}. I would like to confirm the next steps.`;
    $("successWhatsApp").href =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.scrollTo({top: 0, behavior: "smooth"});
  }

  $("googleSignInBtn").addEventListener("click", () => {
    const clientId = window.BOTNEST_CONFIG?.GOOGLE_CLIENT_ID || "";
    if (!clientId) {
      $("googleStatus").textContent =
        "Google sign-in is not connected yet. We will add your Google OAuth Client ID during the backend setup.";
      return;
    }
    $("googleStatus").textContent =
      "Google sign-in configuration detected. The Google Identity Services button will be activated during the OAuth setup.";
  });

  // Scroll progress.
  const progress = document.querySelector(".scroll-progress");
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }, {passive: true});

  function showError(message) {
    if (!message) {
      errorBox.textContent = "";
      errorBox.classList.remove("show");
      return;
    }
    errorBox.textContent = message;
    errorBox.classList.add("show");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[char]));
  }
})();
