document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);

  const courseMap = {
    robotics: "Robotics",
    iot: "IoT",
    ai: "AI",
    ml: "Machine Learning",
    "machine-learning": "Machine Learning",
    dl: "Deep Learning",
    "deep-learning": "Deep Learning",
    automation: "Automation",
    coding: "Coding"
  };

  const levelMap = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert"
  };

  const rawCourse = (params.get("course") || "Robotics").trim();
  const rawLevel = (params.get("level") || "Beginner").trim();

  const course = courseMap[rawCourse.toLowerCase().replace(/\s+/g, "-")] || rawCourse;
  const level = levelMap[rawLevel.toLowerCase()] || "Beginner";

  const $ = id => document.getElementById(id);

  // Always populate course/level first.
  $("courseName").textContent = course;
  $("levelName").textContent = level;
  $("courseTitle").textContent = course + " — " + level;
  $("backToCourse").href = "course.html?course=" + encodeURIComponent(course);

  // BEGINNER: no prerequisite question at all.
  // INTERMEDIATE: Beginner prerequisite.
  // EXPERT: Intermediate prerequisite.
  let prerequisiteLevel = null;
  if (level === "Intermediate") prerequisiteLevel = "Beginner";
  if (level === "Expert") prerequisiteLevel = "Intermediate";

  const prerequisiteArea = $("prerequisiteArea");
  const submitBtn = $("submitBtn");

  if (prerequisiteLevel) {
    prerequisiteArea.style.display = "block";

    $("prereqQuestion").innerHTML =
      "Have you already completed a " + prerequisiteLevel +
      "-level " + escapeHtml(course) +
      " course on any platform? <span class=\"required\">*</span>";

    $("prereqWarningText").textContent =
      "We recommend completing the " + prerequisiteLevel + "-level " + course +
      " course before enrolling in the " + level + " level. The " + level +
      " curriculum builds on the concepts and practical skills covered in the " +
      prerequisiteLevel + " level. Starting directly at " + level +
      " may make it harder to follow the curriculum and keep pace with the class.";

    $("prereqCourseLink").href =
      "course.html?course=" + encodeURIComponent(course) +
      "&level=" + encodeURIComponent(prerequisiteLevel);

    document.querySelectorAll('input[name="prerequisite"]').forEach(function (radio) {
      radio.addEventListener("change", updatePrerequisite);
    });

    submitBtn.disabled = true;
    updatePrerequisite();
  } else {
    // Explicitly keep prerequisite area hidden for Beginner.
    prerequisiteArea.style.display = "none";
    submitBtn.disabled = false;
  }

  function updatePrerequisite() {
    const selected = document.querySelector('input[name="prerequisite"]:checked')?.value || "";

    if (selected === "No") {
      $("prereqWarning").classList.add("show");
      $("blockedNote").classList.add("show");
      submitBtn.disabled = true;
    } else {
      $("prereqWarning").classList.remove("show");
      $("blockedNote").classList.remove("show");
      submitBtn.disabled = selected !== "Yes";
    }

    $("experienceIntro").textContent = selected === "Yes"
      ? "Great. Tell us about the student's previous " + prerequisiteLevel + "-level " + course + " learning and projects."
      : "Share the student's previous learning experience.";
  }

  // Minimum contact date = today.
  const now = new Date();
  $("contactDate").min =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0");

  $("googleSignInBtn").addEventListener("click", function () {
    $("googleStatus").textContent =
      "Google sign-in is not connected yet. We will activate it during the Google OAuth setup.";
  });

  $("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();
    $("errorBox").classList.remove("show");

    if (level !== "Beginner") {
      const selected = document.querySelector('input[name="prerequisite"]:checked')?.value;

      if (!selected) {
        showError("Please answer the prerequisite question.");
        return;
      }

      if (selected === "No") {
        showError("Please complete the recommended " + prerequisiteLevel + "-level " + course + " course before registering for " + level + ".");
        updatePrerequisite();
        return;
      }
    }

    if (!$("registrationForm").checkValidity()) {
      $("registrationForm").reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData($("registrationForm")).entries());
    data.course = course;
    data.level = level;
    data.submittedAt = new Date().toISOString();

    // Frontend-only test until Google Apps Script is connected.
    showSuccess(data);
  });

  function showSuccess(data) {
    $("registrationForm").style.display = "none";
    $("successCard").classList.add("show");

    $("successCourse").textContent = data.course;
    $("successLevel").textContent = data.level + " Level";

    const dateText = new Date(data.contactDate + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
    $("successContact").textContent = dateText + " • " + data.contactTime;

    const whatsappNumber = "918939129382";
    const message =
      "Hi BotNest Academy, I have completed my registration for " +
      data.course + " — " + data.level +
      ". I would like to confirm the next steps.";

    $("successWhatsApp").href =
      "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showError(message) {
    $("errorBox").textContent = message;
    $("errorBox").classList.add("show");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#039;"
      }[char];
    });
  }
});
