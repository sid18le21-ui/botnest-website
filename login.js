document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("loginForm");

  const errorBox =
    document.getElementById("loginError");

  const successBox =
    document.getElementById("loginSuccess");

  const button =
    document.getElementById("loginButton");

  const buttonText =
    document.getElementById("loginButtonText");

  const buttonLoader =
    document.getElementById("loginButtonLoader");


  /*
   * If the customer is already logged in,
   * send them directly to their dashboard.
   */

  const existingToken =
    window.BotNest &&
    window.BotNest.getToken();


  if (existingToken) {

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
   * Password visibility
   */

  document
    .querySelectorAll(".password-toggle")
    .forEach(toggle => {

      toggle.addEventListener(
        "click",
        () => {

          const targetId =
            toggle.dataset.target;

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

            toggle.textContent =
              "Hide";

          } else {

            input.type = "password";

            toggle.textContent =
              "Show";
          }

        }
      );

    });


  /*
   * Login
   */

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      hideMessages();


      const email =
        document
          .getElementById("email")
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById("password")
          .value;


      if (!isValidEmail(email)) {

        showError(
          "Please enter a valid email address."
        );

        return;
      }


      if (!password) {

        showError(
          "Please enter your password."
        );

        return;
      }


      setLoading(true);


      try {

        const response =
          await BotNest.api(
            "customerLogin",
            {
              email: email,
              password: password
            }
          );


        /*
         * Save session token.
         */

        BotNest.setSession(
          response
        );


        showSuccess(
          "Login successful. Opening your dashboard..."
        );


        setTimeout(
          () => {

            window.location.href =
              "customer.html";

          },
          600
        );


      } catch (error) {

        console.error(error);

        showError(
          error.message ||
          "Unable to login. Please check your email and password."
        );

        setLoading(false);
      }

    }
  );


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
