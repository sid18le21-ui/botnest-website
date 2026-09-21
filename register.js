document.addEventListener("DOMContentLoaded", () => {

  /*
   * ============================================================
   * BOTNEST ACADEMY
   * STUDENT REGISTRATION
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


  /*
   * ============================================================
   * COURSE / LEVEL DATA
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
   * DOM ELEMENTS
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
   * BASIC ELEMENT CHECK
   * ============================================================
   */

  if (!form) {

    console.error(
      "BotNest Registration: registrationForm was not found."
    );

    return;
  }


  /*
   * ============================================================
   * URL PARAMETERS
   * ============================================================
   */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const requestedCourse =
    params.get("course");

  const requestedLevel =
    params.get("level");


  /*
   * ============================================================
   * COURSE
   * ============================================================
   */

  const course =
    COURSES.includes(requestedCourse)
      ? requestedCourse
      : "Robotics";


  /*
   * ============================================================
   * LEVEL
   * ============================================================
   */

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


  /*
   * ============================================================
   * INITIALIZE
   * ============================================================
   */

  async function initialize() {

    /*
     * Check whether BotNest API/session system exists.
     */

    if (
      !window.BotNest ||
      typeof BotNest.getToken !== "function"
    ) {

      console.error(
        "BotNest API helper is not available."
      );

      showError(
        "The BotNest account system could not be loaded. Please refresh the page and try again."
      );

      return;
    }


    /*
     * Check customer session.
     */

    const token =
      BotNest.getToken();


    if (!token) {

      showLoginRequired();

      return;
    }


    try {

      /*
       * Verify session and get account information.
       */

      const profile =
        await BotNest.api(
          "customerGetProfile"
        );


      if (
        !profile ||
        !profile.success ||
        !profile.account
      ) {

        throw new Error(
          "Unable to retrieve your account information."
        );
      }


      setupRegistration(
        profile.account
      );


    } catch (error) {

      console.error(
        "BotNest registration initialization error:",
        error
      );


      /*
       * If the session is invalid/expired,
       * return to login state.
       */

      const message =
        getErrorMessage(error);


      if (
        message
          .toLowerCase()
          .includes("session")
      ) {

        BotNest.clearSession();

        showLoginRequired();

        return;
      }


      showError(
        "Unable to load your registration page. " +
        message
      );

    }

  }


  /*
   * ============================================================
   * SETUP REGISTRATION
   * ============================================================
   */

  function setupRegistration(account) {

    /*
     * Hide loading state.
     */

    if (loading) {
      loading.hidden = true;
    }


    /*
     * Hide login-required section.
     */

    if (loginRequired) {
      loginRequired.hidden = true;
    }


    /*
     * Show registration content.
     */

    if (content) {
      content.hidden = false;
    }


    /*
     * Course information.
     */

    if (selectedCourse) {

      selectedCourse.textContent =
        course;

    }


    if (selectedLevel) {

      selectedLevel.textContent =
        `${level} Level`;

    }


    /*
     * Account information.
     */

    const accountFullName =
      [
        account?.firstName,
        account?.lastName
      ]
        .filter(Boolean)
        .join(" ");


    const signedAccountName =
      document.getElementById(
        "signedAccountName"
      );


    if (signedAccountName) {

      signedAccountName.textContent =
        accountFullName ||
        "Customer";

    }


    const signedAccountEmail =
      document.getElementById(
        "signedAccountEmail"
      );


    if (signedAccountEmail) {

      signedAccountEmail.textContent =
        account?.email ||
        "";

    }


    /*
     * Prefill parent/guardian details
     * from customer account.
     *
     * These fields remain editable.
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


    if (
      parentName &&
      accountFullName
    ) {

      parentName.value =
        accountFullName;

    }


    if (
      phone &&
      account?.phone
    ) {

      phone.value =
        account.phone;

    }


    if (
      email &&
      account?.email
    ) {

      email.value =
        account.email;

    }


    /*
     * Minimum contact date.
     */

    setMinimumContactDate();


    /*
     * Configure prerequisite.
     */

    setupPrerequisite();


    /*
     * Attach submit handler only once.
     */

    form.addEventListener(
      "submit",
      submitRegistration,
      {
        once: true
      }
    );


    /*
     * Prerequisite radio buttons.
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
     * Logout.
     */

    if (logoutButton) {

      logoutButton.addEventListener(
        "click",
        logout
      );

    }

  }


  /*
   * ============================================================
   * PREREQUISITE SETUP
   * ============================================================
   */

  function setupPrerequisite() {

    /*
     * Beginner has no prerequisite.
     */

    if (!prerequisite) {

      if (prerequisiteSection) {

        prerequisiteSection.hidden =
          true;

      }

      setSubmitEnabled(true);

      return;
    }


    /*
     * Intermediate / Expert.
     */

    if (prerequisiteSection) {

      prerequisiteSection.hidden =
        false;

    }


    if (prerequisiteText) {

      prerequisiteText.textContent =
        `${prerequisite} Level`;

    }


    /*
     * Require explicit Yes.
     */

    setSubmitEnabled(false);

  }


  /*
   * ============================================================
   * PREREQUISITE VALIDATION
   * ============================================================
   */

  function validatePrerequisite() {

    /*
     * Beginner.
     */

    if (!prerequisite) {

      setSubmitEnabled(true);

      return true;
    }


    /*
     * Find selected radio.
     */

    const selected =
      document.querySelector(
        'input[name="prerequisite"]:checked'
      );


    /*
     * Nothing selected.
     */

    if (!selected) {

      setSubmitEnabled(false);

      return false;
    }


    /*
     * Student has not completed prerequisite.
     */

    if (
      selected.value !== "Yes"
    ) {

      showError(
        `This registration requires completion of the ${prerequisite} level first.`
      );

      setSubmitEnabled(false);

      return false;
    }


    /*
     * Valid.
     */

    hideMessages();

    setSubmitEnabled(true);

    return true;

  }


  /*
   * ============================================================
   * SUBMIT REGISTRATION
   * ============================================================
   */

  async function submitRegistration(event) {

    event.preventDefault();


    /*
     * Prevent accidental duplicate submission.
     */

    if (
      registerButton &&
      registerButton.disabled
    ) {

      return;
    }


    hideMessages();


    /*
     * Check session.
     */

    if (
      !BotNest ||
      !BotNest.getToken()
    ) {

      showLoginRequired();

      return;
    }


    /*
     * Validate prerequisite.
     */

    if (
      !validatePrerequisite()
    ) {

      return;
    }


    /*
     * ========================================================
     * GET FORM VALUES
     * ========================================================
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
     * ========================================================
     * CLIENT VALIDATION
     * ========================================================
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


    if (
      !validation.valid
    ) {

      showError(
        validation.message
      );

      return;
    }


    /*
     * ========================================================
     * PREREQUISITE ANSWER
     * ========================================================
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
     * ========================================================
     * REQUEST DATA
     * ========================================================
     */

    const registrationData = {

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

    };


    /*
     * ========================================================
     * DEBUG INFORMATION
     * ========================================================
     *
     * Safe debug log.
     *
     * Passwords are not present in this object.
     */

    console.log(
      "BotNest registration request:",
      registrationData
    );


    /*
     * ========================================================
     * START LOADING
     * ========================================================
     */

    setLoading(true);


    try {

      /*
       * ======================================================
       * SEND TO BOTNEST API
       * ======================================================
       */

      const response =
        await BotNest.api(
          "submitRegistration",
          registrationData
        );


      /*
       * Log response for debugging.
       */

      console.log(
        "BotNest registration response:",
        response
      );


      /*
       * Make sure we actually received
       * a response.
       */

      if (!response) {

        throw new Error(
          "The server returned an empty response."
        );
      }


      /*
       * If API explicitly reports failure.
       */

      if (
        response.success === false
      ) {

        throw new Error(
          response.message ||
          response.error ||
          "The server rejected the registration."
        );
      }


      /*
       * ======================================================
       * SUCCESS
       * ======================================================
       */

      showSuccess(
        response
      );


    } catch (error) {

      /*
       * ======================================================
       * IMPORTANT ERROR HANDLING
       * ======================================================
       *
       * Do NOT automatically scroll the page.
       *
       * Keep the user where they are and show the
       * exact error message.
       */

      console.error(
        "BOTNEST REGISTRATION API ERROR:",
        error
      );


      const message =
        getErrorMessage(error);


      /*
       * Session expired.
       */

      if (
        message
          .toLowerCase()
          .includes("session")
      ) {

        showError(
          "Your session has expired. Please log in again and retry the registration."
        );

        return;
      }


      /*
       * Display actual error.
       */

      showError(
        "Registration failed: " +
        message
      );


    } finally {

      /*
       * Re-enable button.
       */

      setLoading(false);

    }

  }


  /*
   * ============================================================
   * SUCCESS
   * ============================================================
   */

  function showSuccess(response) {

    /*
     * Hide registration form.
     */

    form.hidden = true;


    /*
     * Show success box.
     */

    if (successBox) {

      successBox.hidden = false;

    }


    /*
     * Registration ID.
     */

    const registrationId =
      response?.registrationId ||
      response?.data?.registrationId ||
      "";


    /*
     * Success message.
     */

    if (successMessage) {

      successMessage.textContent =
        registrationId

          ? `Registration ID: ${registrationId}. Our team will contact you using your preferred contact details.`

          : "Our team will contact you using your preferred contact details.";

    }


    /*
     * WhatsApp message.
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


    /*
     * WhatsApp button.
     */

    const whatsappLink =
      document.getElementById(
        "whatsappLink"
      );


    if (whatsappLink) {

      whatsappLink.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    }


    /*
     * Scroll only after SUCCESS.
     *
     * This is intentional.
     */

    if (successBox) {

      successBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }

  }


  /*
   * ============================================================
   * FORM VALIDATION
   * ============================================================
   */

  function validateForm(values) {

    /*
     * Student name.
     */

    if (
      !values.studentName
    ) {

      return {

        valid: false,

        message:
          "Please enter the student's full name."

      };

    }


    /*
     * Age.
     */

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


    /*
     * Grade.
     */

    if (
      !values.grade
    ) {

      return {

        valid: false,

        message:
          "Please enter the student's grade or class."

      };

    }


    /*
     * School.
     */

    if (
      !values.school
    ) {

      return {

        valid: false,

        message:
          "Please enter the school or college name."

      };

    }


    /*
     * City.
     */

    if (
      !values.city
    ) {

      return {

        valid: false,

        message:
          "Please enter the city."

      };

    }


    /*
     * Parent name.
     */

    if (
      !values.parentName
    ) {

      return {

        valid: false,

        message:
          "Please enter the parent or guardian name."

      };

    }


    /*
     * Relationship.
     */

    if (
      !values.relationship
    ) {

      return {

        valid: false,

        message:
          "Please select the relationship with the student."

      };

    }


    /*
     * Phone.
     */

    if (
      !values.phone
    ) {

      return {

        valid: false,

        message:
          "Please enter a contact phone number."

      };

    }


    /*
     * Email.
     */

    if (
      !isValidEmail(values.email)
    ) {

      return {

        valid: false,

        message:
          "Please enter a valid contact email address."

      };

    }


    /*
     * Learning goals.
     */

    if (
      !values.goals
    ) {

      return {

        valid: false,

        message:
          "Please tell us what the student would like to learn."

      };

    }


    /*
     * Preferred date.
     */

    if (
      !values.contactDate
    ) {

      return {

        valid: false,

        message:
          "Please select a preferred contact date."

      };

    }


    /*
     * Preferred time.
     */

    if (
      !values.contactTime
    ) {

      return {

        valid: false,

        message:
          "Please select a preferred contact time."

      };

    }


    /*
     * Everything valid.
     */

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

    if (loading) {

      loading.hidden = true;

    }


    if (content) {

      content.hidden = true;

    }


    if (loginRequired) {

      loginRequired.hidden = false;

    }


    /*
     * Do NOT force scroll.
     *
     * This prevents the page from jumping unexpectedly.
     */

  }


  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  async function logout() {

    if (logoutButton) {

      logoutButton.disabled = true;

    }


    try {

      await BotNest.api(
        "customerLogout"
      );

    } catch (error) {

      console.warn(
        "BotNest logout error:",
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
   * GET FORM VALUE
   * ============================================================
   */

  function getValue(id) {

    const element =
      document.getElementById(id);


    if (!element) {

      console.warn(
        `BotNest Registration: element #${id} was not found.`
      );

      return "";

    }


    return String(
      element.value || ""
    ).trim();

  }


  /*
   * ============================================================
   * EMAIL VALIDATION
   * ============================================================
   */

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }


  /*
   * ============================================================
   * ERROR MESSAGE
   * ============================================================
   */

  function showError(message) {

    /*
     * Log the error.
     */

    console.error(
      "BOTNEST REGISTRATION ERROR:",
      message
    );


    /*
     * Display error.
     */

    if (errorBox) {

      errorBox.textContent =
        "⚠️ " + message;

      errorBox.hidden =
        false;

    }


    /*
     * Hide success message.
     */

    if (successBox) {

      successBox.hidden =
        true;

    }


    /*
     * IMPORTANT:
     *
     * There is intentionally NO:
     *
     * errorBox.scrollIntoView()
     *
     * here.
     *
     * The user remains at the current position.
     */

  }


  /*
   * ============================================================
   * HIDE MESSAGES
   * ============================================================
   */

  function hideMessages() {

    if (errorBox) {

      errorBox.hidden =
        true;

    }


    if (successBox) {

      successBox.hidden =
        true;

    }

  }


  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  function setLoading(loadingState) {

    if (registerButton) {

      registerButton.disabled =
        loadingState;

    }


    if (registerButtonText) {

      registerButtonText.hidden =
        loadingState;

    }


    if (registerButtonLoader) {

      registerButtonLoader.hidden =
        !loadingState;

    }

  }


  /*
   * ============================================================
   * ENABLE / DISABLE SUBMIT
   * ============================================================
   */

  function setSubmitEnabled(enabled) {

    if (registerButton) {

      registerButton.disabled =
        !enabled;

    }

  }


  /*
   * ============================================================
   * ERROR NORMALIZATION
   * ============================================================
   */

  function getErrorMessage(error) {

    if (!error) {

      return "Unknown error.";

    }


    /*
     * Normal JavaScript Error.
     */

    if (
      typeof error.message === "string" &&
      error.message.trim()
    ) {

      return error.message.trim();

    }


    /*
     * String error.
     */

    if (
      typeof error === "string"
    ) {

      return error;

    }


    /*
     * Object containing message.
     */

    if (
      error.error &&
      typeof error.error === "string"
    ) {

      return error.error;

    }


    /*
     * Object containing details.
     */

    if (
      error.details &&
      typeof error.details === "string"
    ) {

      return error.details;

    }


    /*
     * Final fallback.
     */

    try {

      return JSON.stringify(
        error
      );

    } catch (jsonError) {

      return "Unknown error.";

    }

  }

});
