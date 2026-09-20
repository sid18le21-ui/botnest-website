document.addEventListener("DOMContentLoaded", () => {

  /*
   * ============================================================
   * BOTNEST REGISTRATION
   * ============================================================
   *
   * Authentication:
   * Customer account session
   *
   * No Google Sign-In
   * No Google JWT
   * No OTP
   * No CAPTCHA
   *
   * ============================================================
   */

  const COURSES = [
    "Robotics",
    "IoT",
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Automation"
  ];

  const LEVELS = [
    "Beginner",
    "Intermediate",
    "Expert"
  ];

  const WHATSAPP_NUMBER = "918939129382";


  /*
   * ============================================================
   * ELEMENTS
   * ============================================================
   */

  const loading =
    document.getElementById("registerLoading");

  const loginRequired =
    document.getElementById("loginRequired");

  const content =
    document.getElementById("registrationContent");

  const form =
    document.getElementById("registrationForm");

  const errorBox =
    document.getElementById("registerError");

  const successBox =
    document.getElementById("registerSuccess");

  const successMessage =
    document.getElementById("successMessage");

  const selectedCourse =
    document.getElementById("selectedCourse");

  const selectedLevel =
    document.getElementById("selectedLevel");

  const prerequisiteSection =
    document.getElementById("prerequisiteSection");

  const prerequisiteText =
    document.getElementById("prerequisiteText");

  const registerButton =
    document.getElementById("registerButton");

  const registerButtonText =
    document.getElementById("registerButtonText");

  const registerButtonLoader =
    document.getElementById("registerButtonLoader");

  const logoutButton =
    document.getElementById("logoutButton");


  /*
   * ============================================================
   * URL PARAMETERS
   * ============================================================
   */

  const params =
    new URLSearchParams(window.location.search);

  const requestedCourse =
    params.get("course");

  const requestedLevel =
    params.get("level");

  const course =
    COURSES.includes(requestedCourse)
      ? requestedCourse
      : "Robotics";

  const level =
    LEVELS.includes(requestedLevel)
      ? requestedLevel
      : "Beginner";


  /*
   * ============================================================
   * PREREQUISITE
   * ============================================================
   */

  let prerequisite = null;

  if (level === "Intermediate") {

    prerequisite = "Beginner";

  } else if (level === "Expert") {

    prerequisite = "Intermediate";

  }


  /*
   * ============================================================
   * START
   * ============================================================
   */

  initialize();


  async function initialize() {

    /*
     * No session?
     */

    const token =
      window.BotNest &&
      BotNest.getToken();

    if (!token) {

      showLoginRequired();

      return;
    }


    try {

      /*
       * Verify session and retrieve
       * account details from backend.
       */

      const profile =
        await BotNest.api(
          "customerGetProfile"
        );

      setupRegistration(
        profile.account
      );


    } catch (error) {

      console.error(
        "REGISTRATION INITIALIZATION ERROR:",
        error
      );

      BotNest.clearSession();

      showLoginRequired();

    }

  }


  /*
   * ============================================================
   * SETUP REGISTRATION
   * ============================================================
   */

  function setupRegistration(account) {

    loading.hidden = true;

    loginRequired.hidden = true;

    content.hidden = false;


    /*
     * Course information
     */

    selectedCourse.textContent =
      course;

    selectedLevel.textContent =
      `${level} Level`;


    /*
     * Account information
     */

    const accountFullName =
      [
        account.firstName,
        account.lastName
      ]
        .filter(Boolean)
        .join(" ");


    document.getElementById(
      "signedAccountName"
    ).textContent =
      accountFullName ||
      "Customer";


    document.getElementById(
      "signedAccountEmail"
    ).textContent =
      account.email ||
      "";


    /*
     * Prefill parent / guardian details.
     *
     * These values remain editable.
     */

    const parentName =
      document.getElementById(
        "parentName"
      );

    const phone =
      document.getElementById(
        "phone"
      );

    const email =
      document.getElementById(
        "email"
      );


    if (accountFullName) {

      parentName.value =
        accountFullName;

    }


    if (account.phone) {

      phone.value =
        account.phone;

    }


    if (account.email) {

      email.value =
        account.email;

    }


    /*
     * Set minimum contact date
     */

    setMinimumContactDate();


    /*
     * Configure prerequisite
     */

    setupPrerequisite();


    /*
     * Form submit
     */

    form.addEventListener(
      "submit",
      submitRegistration
    );


    /*
     * Prerequisite radio change
     */

    document
      .querySelectorAll(
        'input[name="prerequisite"]'
      )
      .forEach(
        radio => {

          radio.addEventListener(
            "change",
            validatePrerequisite
          );

        }
      );


    /*
     * Logout
     */

    logoutButton.addEventListener(
      "click",
      logout
    );

  }


  /*
   * ============================================================
   * PREREQUISITE SETUP
   * ============================================================
   */

  function setupPrerequisite() {

    if (!prerequisite) {

      prerequisiteSection.hidden =
        true;

      return;
    }


    prerequisiteSection.hidden =
      false;


    prerequisiteText.textContent =
      `${prerequisite} Level`;


    /*
     * User must explicitly select Yes.
     */

    setSubmitEnabled(false);

  }


  /*
   * ============================================================
   * PREREQUISITE VALIDATION
   * ============================================================
   */

  function validatePrerequisite() {

    if (!prerequisite) {

      setSubmitEnabled(true);

      return true;
    }


    const selected =
      document.querySelector(
        'input[name="prerequisite"]:checked'
      );


    if (!selected) {

      setSubmitEnabled(false);

      return false;
    }


    if (selected.value !== "Yes") {

      showError(
        `This registration requires completion of the ${prerequisite} level first.`
      );

      setSubmitEnabled(false);

      return false;
    }


    hideMessages();

    setSubmitEnabled(true);

    return true;

  }


  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  async function submitRegistration(event) {

    event.preventDefault();

    hideMessages();


    /*
     * Re-check authentication before
     * sending anything.
     */

    if (!BotNest.getToken()) {

      showLoginRequired();

      return;
    }


    /*
     * Prerequisite
     */

    if (!validatePrerequisite()) {

      return;
    }


    /*
     * Form values
     */

    const studentName =
      getValue("studentName");

    const age =
      getValue("age");

    const grade =
      getValue("grade");

    const school =
      getValue("school");

    const city =
      getValue("city");

    const parentName =
      getValue("parentName");

    const relationship =
      getValue("relationship");

    const phone =
      getValue("phone");

    const email =
      getValue("email")
        .toLowerCase();

    const previousExperience =
      getValue("previousExperience");

    const goals =
      getValue("goals");

    const anythingElse =
      getValue("anythingElse");

    const contactDate =
      getValue("contactDate");

    const contactTime =
      getValue("contactTime");


    /*
     * Client validation
     */

    const validation =
      validateForm({
        studentName,
        age,
        grade,
        school,
        city,
        parentName,
        relationship,
        phone,
        email,
        goals,
        contactDate,
        contactTime
      });


    if (!validation.valid) {

      showError(
        validation.message
      );

      return;
    }


    /*
     * Selected prerequisite
     */

    let prerequisiteAnswer = "";

    if (prerequisite) {

      const selected =
        document.querySelector(
          'input[name="prerequisite"]:checked'
        );


      if (!selected) {

        showError(
          "Please answer the course prerequisite question."
        );

        return;
      }


      prerequisiteAnswer =
        selected.value;

    }


    /*
     * Disable button
     */

    setLoading(true);


    try {

      /*
       * Send registration to backend.
       */

      const response =
        await BotNest.api(
          "submitRegistration",
          {

            course:
              course,

            level:
              level,

            studentName:
              studentName,

            age:
              age,

            grade:
              grade,

            school:
              school,

            city:
              city,

            parentName:
              parentName,

            relationship:
              relationship,

            phone:
              phone,

            email:
              email,

            prerequisite:
              prerequisiteAnswer,

            previousExperience:
              previousExperience,

            goals:
              goals,

            anythingElse:
              anythingElse,

            contactDate:
              contactDate,

            contactTime:
              contactTime

          }
        );


      /*
       * Registration saved.
       */

      showSuccess(
        response
      );


    } catch (error) {

      /*
       * ========================================================
       * IMPORTANT DEBUGGING CHANGE
       * ========================================================
       *
       * Show the actual backend/API error on the webpage.
       * This makes it possible to diagnose the problem without
       * opening browser developer tools.
       */

      console.error(
        "REGISTRATION ERROR:",
        error
      );


      const message =
        String(
          error?.message ||
          error ||
          "Unknown registration error."
        );


      showError(
        "Registration failed: " +
        message
      );


    } finally {

      setLoading(false);

    }

  }


  /*
   * ============================================================
   * SUCCESS
   * ============================================================
   */

  function showSuccess(response) {

    form.hidden = true;

    successBox.hidden = false;


    const registrationId =
      response &&
      response.registrationId
        ? response.registrationId
        : "";


    successMessage.textContent =
      registrationId
        ? `Registration ID: ${registrationId}. Our team will contact you using your preferred contact details.`
        : "Our team will contact you using your preferred contact details.";


    /*
     * WhatsApp
     */

    const whatsappMessage =
      encodeURIComponent(
        [
          "Hello BotNest Academy,",
          "",
          "I have submitted a course registration.",
          "",
          `Course: ${course}`,
          `Level: ${level}`,
          registrationId
            ? `Registration ID: ${registrationId}`
            : ""
        ]
          .filter(Boolean)
          .join("\n")
      );


    const whatsappLink =
      document.getElementById(
        "whatsappLink"
      );


    whatsappLink.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;


    successBox.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  /*
   * ============================================================
   * FORM VALIDATION
   * ============================================================
   */

  function validateForm(values) {

    if (!values.studentName) {

      return {
        valid: false,
        message:
          "Please enter the student's full name."
      };

    }


    const age =
      Number(values.age);


    if (
      !Number.isInteger(age) ||
      age < 5 ||
      age > 60
    ) {

      return {
        valid: false,
        message:
          "Please enter a valid student age."
      };

    }


    if (!values.grade) {

      return {
        valid: false,
        message:
          "Please enter the student's grade or class."
      };

    }


    if (!values.school) {

      return {
        valid: false,
        message:
          "Please enter the school or college name."
      };

    }


    if (!values.city) {

      return {
        valid: false,
        message:
          "Please enter the city."
      };

    }


    if (!values.parentName) {

      return {
        valid: false,
        message:
          "Please enter the parent or guardian name."
      };

    }


    if (!values.relationship) {

      return {
        valid: false,
        message:
          "Please select the relationship with the student."
      };

    }


    if (!values.phone) {

      return {
        valid: false,
        message:
          "Please enter a contact phone number."
      };

    }


    if (!isValidEmail(values.email)) {

      return {
        valid: false,
        message:
          "Please enter a valid contact email address."
      };

    }


    if (!values.goals) {

      return {
        valid: false,
        message:
          "Please tell us what the student would like to learn."
      };

    }


    if (!values.contactDate) {

      return {
        valid: false,
        message:
          "Please select a preferred contact date."
      };

    }


    if (!values.contactTime) {

      return {
        valid: false,
        message:
          "Please select a preferred contact time."
      };

    }


    return {
      valid: true
    };

  }


  /*
   * ============================================================
   * DATE
   * ============================================================
   */

  function setMinimumContactDate() {

    const input =
      document.getElementById(
        "contactDate"
      );


    if (!input) {
      return;
    }


    const today =
      new Date();


    const year =
      today.getFullYear();


    const month =
      String(
        today.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        today.getDate()
      ).padStart(
        2,
        "0"
      );


    input.min =
      `${year}-${month}-${day}`;

  }


  /*
   * ============================================================
   * LOGIN REQUIRED
   * ============================================================
   */

  function showLoginRequired() {

    loading.hidden = true;

    content.hidden = true;

    loginRequired.hidden = false;


    loginRequired.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  async function logout() {

    logoutButton.disabled = true;


    try {

      await BotNest.api(
        "customerLogout"
      );

    } catch (error) {

      console.warn(
        "Logout error:",
        error
      );

    } finally {

      BotNest.clearSession();

      window.location.href =
        "login.html";

    }

  }


  /*
   * ============================================================
   * UI HELPERS
   * ============================================================
   */

  function getValue(id) {

    const element =
      document.getElementById(id);


    if (!element) {
      return "";
    }


    return element.value.trim();

  }


  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }


  function showError(message) {

    errorBox.textContent =
      message;


    errorBox.hidden =
      false;


    successBox.hidden =
      true;


    errorBox.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  function hideMessages() {

    errorBox.hidden =
      true;

    successBox.hidden =
      true;

  }


  function setLoading(loadingState) {

    registerButton.disabled =
      loadingState;


    registerButtonText.hidden =
      loadingState;


    registerButtonLoader.hidden =
      !loadingState;

  }


  function setSubmitEnabled(enabled) {

    registerButton.disabled =
      !enabled;

  }

});
