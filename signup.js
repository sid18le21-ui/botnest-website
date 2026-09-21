document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("signupForm");

  const errorBox =
    document.getElementById("signupError");

  const successBox =
    document.getElementById("signupSuccess");

  const button =
    document.getElementById("signupButton");

  const buttonText =
    document.getElementById("signupButtonText");

  const buttonLoader =
    document.getElementById("signupButtonLoader");


  /*
   * If the user already has a customer session,
   * there is no reason to create another account.
   */

  const existingToken =
    window.BotNest &&
    window.BotNest.getToken();

  if (existingToken) {

    /*
     * Verify that the session is still valid.
     */

    BotNest.api(
      "customerGetProfile"
    )
      .then(() => {

        window.location.href =
          "customer.html";

      })
      .catch(() => {

        BotNest.clearSession();

      });
  }


  /*
   * Password visibility buttons
   */

  document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const targetId =
            button.dataset.target;

          const input =
            document.getElementById(
              targetId
            );

          if (!input) {
            return;
          }


          if (
            input.type === "password"
          ) {

            input.type = "text";

            button.textContent =
              "Hide";

          } else {

            input.type = "password";

            button.textContent =
              "Show";
          }
        }
      );
    });


  /*
   * Submit
   */

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      hideMessages();


      const firstName =
        document
          .getElementById("firstName")
          .value
          .trim();


      const lastName =
        document
          .getElementById("lastName")
          .value
          .trim();


      const email =
        document
          .getElementById("email")
          .value
          .trim()
          .toLowerCase();


      const phone =
        document
          .getElementById("phone")
          .value
          .trim();


      const password =
        document
          .getElementById("password")
          .value;


      const confirmPassword =
        document
          .getElementById("confirmPassword")
          .value;


      const terms =
        document
          .getElementById("terms")
          .checked;


      /*
       * Client-side validation
       */

      if (!firstName) {

        showError(
          "Please enter your first name."
        );

        return;
      }


      if (!lastName) {

        showError(
          "Please enter your last name."
        );

        return;
      }


      if (!isValidEmail(email)) {

        showError(
          "Please enter a valid email address."
        );

        return;
      }


      if (!phone) {

        showError(
          "Please enter your phone number."
        );

        return;
      }


      if (password.length < 8) {

        showError(
          "Your password must contain at least 8 characters."
        );

        return;
      }


      if (password !== confirmPassword) {

        showError(
          "Passwords do not match."
        );

        return;
      }


      if (!terms) {

        showError(
          "Please confirm the information and terms checkbox."
        );

        return;
      }


      setLoading(true);


      try {

        const response =
          await BotNest.api(
            "createAccount",
            {
              firstName:
                firstName,

              lastName:
                lastName,

              email:
                email,

              phone:
                phone,

              password:
                password
            }
          );


        /*
         * Save secure session token.
         */

        BotNest.setSession(
          response
        );


        showSuccess(
          "Account created successfully. Redirecting to your dashboard..."
        );


        /*
         * Give the success message a moment
         * before redirecting.
         */

        setTimeout(
          () => {

            window.location.href =
              "customer.html";

          },
          800
        );


      } catch (error) {

        console.error(error);

        showError(
          error.message ||
          "Unable to create your account. Please try again."
        );

        setLoading(false);
      }
    }
  );


  /*
   * Helpers
   */

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


  function showSuccess(message) {

    successBox.textContent =
      message;

    successBox.hidden =
      false;

    errorBox.hidden =
      true;
  }


  function hideMessages() {

    errorBox.hidden =
      true;

    successBox.hidden =
      true;
  }


  function setLoading(loading) {

    button.disabled =
      loading;

    buttonText.hidden =
      loading;

    buttonLoader.hidden =
      !loading;
  }

});
