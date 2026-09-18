document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // =====================================================
  // BOTNEST GOOGLE APPS SCRIPT BACKEND
  // =====================================================

  const BACKEND_URL =
    "https://script.google.com/macros/s/AKfycbxQulaFjq0dKw4HqVn1Zz32VNWmYUwPMiTU6BELDEkRahQpllvbH2jW12ndl--qTkDZ/exec";


  // =====================================================
  // GOOGLE AUTHENTICATION STATE
  // =====================================================

  let googleAuth = {
    signedIn: false,
    idToken: "",
    googleId: "",
    email: "",
    name: "",
    picture: ""
  };


  // =====================================================
  // GOOGLE SIGN-IN CALLBACK
  // =====================================================

  window.handleGoogleCredential = function (response) {

    try {

      if (!response || !response.credential) {
        throw new Error("Google did not return an authentication credential.");
      }

      const idToken = response.credential;

      /*
       * Google Identity Services returns a JWT.
       * We decode the payload locally only to display the
       * user's basic information.
       *
       * IMPORTANT:
       * The token will also be sent to Apps Script.
       * The backend will perform the actual verification.
       */

      const parts = idToken.split(".");

      if (parts.length !== 3) {
        throw new Error("Invalid Google credential.");
      }

      const payload = JSON.parse(
        decodeURIComponent(
          atob(parts[1])
            .split("")
            .map(function (char) {
              return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        )
      );


      // -----------------------------------------------
      // STORE GOOGLE ACCOUNT
      // -----------------------------------------------

      googleAuth.signedIn = true;
      googleAuth.idToken = idToken;
      googleAuth.googleId = payload.sub || "";
      googleAuth.email = payload.email || "";
      googleAuth.name = payload.name || "";
      googleAuth.picture = payload.picture || "";


      // -----------------------------------------------
      // UPDATE GOOGLE STATUS
      // -----------------------------------------------

      const googleStatus = $("googleStatus");

      if (googleStatus) {

        googleStatus.textContent =
          "Google account verified. Your registration will be associated with this account.";

        googleStatus.style.color = "#65f5b0";

      }


      // -----------------------------------------------
      // SHOW GOOGLE USER CARD
      // -----------------------------------------------

      const googleUser = $("googleUser");

      if (googleUser) {
        googleUser.classList.add("show");
      }


      if ($("googleUserName")) {

        $("googleUserName").textContent =
          googleAuth.name || "Google Account";

      }


      if ($("googleUserEmail")) {

        $("googleUserEmail").textContent =
          googleAuth.email || "";

      }


      if ($("googleUserPicture") && googleAuth.picture) {

        $("googleUserPicture").src =
          googleAuth.picture;

      }


      // -----------------------------------------------
      // PREFILL EMAIL
      // -----------------------------------------------

      const emailField = $("email");

      if (
        emailField &&
        googleAuth.email
      ) {

        emailField.value =
          googleAuth.email;

        emailField.dispatchEvent(
          new Event("input", {
            bubbles: true
          })
        );

      }


      // -----------------------------------------------
      // UPDATE GOOGLE BUTTON AREA
      // -----------------------------------------------

      const googleSignInBtn =
        $("googleSignInBtn");

      if (googleSignInBtn) {

        googleSignInBtn.style.opacity = "0.65";

      }


    } catch (error) {

      console.error(
        "Google authentication error:",
        error
      );


      googleAuth = {
        signedIn: false,
        idToken: "",
        googleId: "",
        email: "",
        name: "",
        picture: ""
      };


      if ($("googleStatus")) {

        $("googleStatus").textContent =
          "Google sign-in could not be completed. Please try again.";

        $("googleStatus").style.color =
          "#ff8dbb";

      }

    }

  };


  // =====================================================
  // COURSE / LEVEL
  // =====================================================

  const params =
    new URLSearchParams(
      window.location.search
    );


  const courseMap = {

    robotics: "Robotics",

    iot: "IoT",

    ai: "AI",

    ml: "Machine Learning",

    "machine-learning":
      "Machine Learning",

    dl: "Deep Learning",

    "deep-learning":
      "Deep Learning",

    automation: "Automation",

    coding: "Coding"

  };


  const levelMap = {

    beginner: "Beginner",

    intermediate: "Intermediate",

    expert: "Expert"

  };


  const rawCourse =
    (
      params.get("course") ||
      "Robotics"
    ).trim();


  const rawLevel =
    (
      params.get("level") ||
      "Beginner"
    ).trim();


  const course =
    courseMap[
      rawCourse
        .toLowerCase()
        .replace(/\s+/g, "-")
    ] ||
    rawCourse;


  const level =
    levelMap[
      rawLevel.toLowerCase()
    ] ||
    "Beginner";


  const $ =
    id => document.getElementById(id);


  // =====================================================
  // DISPLAY COURSE / LEVEL
  // =====================================================

  $("courseName").textContent =
    course;


  $("levelName").textContent =
    level;


  $("courseTitle").textContent =
    course + " — " + level;


  $("backToCourse").href =
    "course.html?course=" +
    encodeURIComponent(course);


  // =====================================================
  // PREREQUISITE LOGIC
  // =====================================================

  let prerequisiteLevel =
    null;


  if (level === "Intermediate") {

    prerequisiteLevel =
      "Beginner";

  }


  if (level === "Expert") {

    prerequisiteLevel =
      "Intermediate";

  }


  const prerequisiteArea =
    $("prerequisiteArea");


  const submitBtn =
    $("submitBtn");


  if (prerequisiteLevel) {

    prerequisiteArea.style.display =
      "block";


    $("prereqQuestion").innerHTML =
      "Have you already completed a " +
      prerequisiteLevel +
      "-level " +
      escapeHtml(course) +
      " course on any platform? " +
      '<span class="required">*</span>';


    $("prereqWarningText").textContent =
      "We recommend completing the " +
      prerequisiteLevel +
      "-level " +
      course +
      " course before enrolling in the " +
      level +
      " level. The " +
      level +
      " curriculum builds on the concepts and practical skills covered in the " +
      prerequisiteLevel +
      " level. Starting directly at " +
      level +
      " may make it harder to follow the curriculum and keep pace with the class.";


    $("prereqCourseLink").href =
      "course.html?course=" +
      encodeURIComponent(course) +
      "&level=" +
      encodeURIComponent(
        prerequisiteLevel
      );


    document
      .querySelectorAll(
        'input[name="prerequisite"]'
      )
      .forEach(function (radio) {

        radio.addEventListener(
          "change",
          updatePrerequisite
        );

      });


    submitBtn.disabled =
      true;


    updatePrerequisite();


  } else {

    // Beginner has NO prerequisite question.

    prerequisiteArea.style.display =
      "none";


    submitBtn.disabled =
      false;

  }


  function updatePrerequisite() {

    const selected =
      document.querySelector(
        'input[name="prerequisite"]:checked'
      )?.value || "";


    if (selected === "No") {

      $("prereqWarning")
        .classList.add("show");


      $("blockedNote")
        .classList.add("show");


      submitBtn.disabled =
        true;


    } else {

      $("prereqWarning")
        .classList.remove("show");


      $("blockedNote")
        .classList.remove("show");


      submitBtn.disabled =
        selected !== "Yes";

    }


    $("experienceIntro").textContent =
      selected === "Yes"
        ? "Great. Tell us about the student's previous " +
          prerequisiteLevel +
          "-level " +
          course +
          " learning and projects."
        : "Share the student's previous learning experience.";

  }


  // =====================================================
  // MINIMUM CONTACT DATE
  // =====================================================

  const now =
    new Date();


  $("contactDate").min =
    now.getFullYear() +
    "-" +
    String(
      now.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
      now.getDate()
    ).padStart(2, "0");


  // =====================================================
  // GOOGLE SIGN-IN STATUS
  // =====================================================

  /*
   * The actual Google button is rendered by
   * Google Identity Services in register.html.
   *
   * The callback is:
   *
   * window.handleGoogleCredential
   *
   * defined above.
   */


  // =====================================================
  // FORM SUBMISSION
  // =====================================================

  $("registrationForm").addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      $("errorBox")
        .classList.remove("show");


      // -----------------------------------------------
      // PREREQUISITE VALIDATION
      // -----------------------------------------------

      if (level !== "Beginner") {

        const selected =
          document.querySelector(
            'input[name="prerequisite"]:checked'
          )?.value;


        if (!selected) {

          showError(
            "Please answer the prerequisite question."
          );

          return;

        }


        if (selected === "No") {

          showError(
            "Please complete the recommended " +
            prerequisiteLevel +
            "-level " +
            course +
            " course before registering for " +
            level +
            "."
          );


          updatePrerequisite();

          return;

        }

      }


      // -----------------------------------------------
      // HTML FORM VALIDATION
      // -----------------------------------------------

      if (
        !$("registrationForm")
          .checkValidity()
      ) {

        $("registrationForm")
          .reportValidity();

        return;

      }


      // -----------------------------------------------
      // GOOGLE SIGN-IN CHECK
      // -----------------------------------------------

      if (!googleAuth.signedIn) {

        showError(
          "Please continue with Google before submitting your registration."
        );

        return;

      }


      // -----------------------------------------------
      // COLLECT FORM DATA
      // -----------------------------------------------

      const formData =
        Object.fromEntries(
          new FormData(
            $("registrationForm")
          ).entries()
        );


      const registrationData = {

        course:
          course,

        level:
          level,

        studentName:
          formData.studentName || "",

        age:
          formData.age || "",

        grade:
          formData.grade || "",

        school:
          formData.school || "",

        city:
          formData.city || "",

        parentName:
          formData.parentName || "",

        relationship:
          formData.relationship || "",

        phone:
          formData.phone || "",

        email:
          formData.email || "",

        prerequisite:
          formData.prerequisite || "",

        previousExperience:
          formData.previousExperience || "",

        goals:
          formData.goals || "",

        anythingElse:
          formData.anythingElse || "",

        contactDate:
          formData.contactDate || "",

        contactTime:
          formData.contactTime || "",

        submittedAt:
          new Date().toISOString(),

        website: "",


        // ---------------------------------------------
        // GOOGLE ACCOUNT INFORMATION
        // ---------------------------------------------

        googleIdToken:
          googleAuth.idToken || "",

        googleId:
          googleAuth.googleId || "",

        googleEmail:
          googleAuth.email || "",

        googleName:
          googleAuth.name || ""

      };


      // -----------------------------------------------
      // BUTTON LOADING STATE
      // -----------------------------------------------

      const originalButtonText =
        submitBtn.textContent;


      submitBtn.disabled =
        true;


      submitBtn.textContent =
        "Submitting registration…";


      // -----------------------------------------------
      // SEND TO GOOGLE APPS SCRIPT
      // -----------------------------------------------

      try {

        /*
         * no-cors is used because Google Apps Script
         * Web Apps do not expose normal browser CORS
         * headers.
         *
         * The request is still delivered to doPost().
         */

        await fetch(
          BACKEND_URL,
          {

            method: "POST",

            mode: "no-cors",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body:
              JSON.stringify(
                registrationData
              )

          }
        );


        // ---------------------------------------------
        // REGISTRATION SUCCESS
        // ---------------------------------------------

        showSuccess(
          registrationData
        );


      } catch (error) {

        console.error(
          "Registration error:",
          error
        );


        showError(
          "We couldn't submit your registration right now. Please try again or contact BotNest Academy on WhatsApp."
        );


        submitBtn.disabled =
          false;


        submitBtn.textContent =
          originalButtonText;

      }

    }
  );


  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  function showSuccess(data) {

    $("registrationForm")
      .style.display = "none";


    $("successCard")
      .classList.add("show");


    $("successCourse")
      .textContent =
      data.course;


    $("successLevel")
      .textContent =
      data.level + " Level";


    const dateText =
      new Date(
        data.contactDate +
        "T00:00:00"
      ).toLocaleDateString(
        "en-IN",
        {

          day: "numeric",

          month: "short",

          year: "numeric"

        }
      );


    $("successContact")
      .textContent =
      dateText +
      " • " +
      data.contactTime;


    // ---------------------------------------------
    // BOTNEST WHATSAPP
    // ---------------------------------------------

    const whatsappNumber =
      "918939129382";


    const message =
      "Hi BotNest Academy, I have completed my registration for " +
      data.course +
      " — " +
      data.level +
      ". I would like to confirm the next steps.";


    $("successWhatsApp").href =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(
        message
      );


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }


  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  function showError(message) {

    $("errorBox")
      .textContent =
      message;


    $("errorBox")
      .classList.add("show");

  }


  // =====================================================
  // HTML ESCAPE
  // =====================================================

  function escapeHtml(value) {

    return String(value).replace(
      /[&<>"']/g,
      function (char) {

        return {

          "&": "&amp;",

          "<": "&lt;",

          ">": "&gt;",

          '"': "&quot;",

          "'": "&#039;"

        }[char];

      }
    );

  }

});
