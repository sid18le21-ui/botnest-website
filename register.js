/*************************************************
 * BOTNEST ACADEMY
 * COURSE REGISTRATION FRONTEND
 *
 * FINAL VERSION
 *************************************************/


/*************************************************
 * BACKEND CONFIGURATION
 *************************************************/

const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbxQulaFjq0dKw4HqVn1Zz32VNWmYUwPMiTU6BELDEkRahQpllvbH2jW12ndl--qTkDZ/exec";


/*************************************************
 * GOOGLE AUTHENTICATION STATE
 *************************************************/

let googleAuth = {

  signedIn: false,

  idToken: "",

  googleId: "",

  email: "",

  name: "",

  picture: ""

};


/*************************************************
 * PAGE INITIALIZATION
 *************************************************/

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /*************************************************
     * HELPER
     *************************************************/

    function $(id) {

      return document.getElementById(id);

    }


    /*************************************************
     * READ COURSE AND LEVEL FROM URL
     *************************************************/

    const params =
      new URLSearchParams(
        window.location.search
      );


    const course =
      params.get("course") ||
      "Course";


    const level =
      params.get("level") ||
      "Beginner";


    /*************************************************
     * UPDATE PAGE COURSE INFORMATION
     *************************************************/

    if ($("courseTitle")) {

      $("courseTitle").textContent =
        course;

    }


    if ($("courseName")) {

      $("courseName").textContent =
        course;

    }


    if ($("levelName")) {

      $("levelName").textContent =
        level;

    }


    /*************************************************
     * BACK TO COURSE LINK
     *************************************************/

    if ($("backToCourse")) {

      $("backToCourse").href =
        "course.html?course=" +
        encodeURIComponent(course) +
        "&level=" +
        encodeURIComponent(level);

    }


    /*************************************************
     * PREREQUISITE LOGIC
     *************************************************/

    let prerequisiteLevel =
      null;


    if (
      level ===
      "Intermediate"
    ) {

      prerequisiteLevel =
        "Beginner";

    }


    if (
      level ===
      "Expert"
    ) {

      prerequisiteLevel =
        "Intermediate";

    }


    const prerequisiteArea =
      $("prerequisiteArea");


    const submitBtn =
      $("submitBtn");


    function updatePrerequisite() {

      const selected =
        document.querySelector(
          'input[name="prerequisite"]:checked'
        )?.value || "";


      if (
        selected ===
        "No"
      ) {

        if ($("prereqWarning")) {

          $("prereqWarning")
            .classList
            .add("show");

        }


        if ($("blockedNote")) {

          $("blockedNote")
            .classList
            .add("show");

        }


        submitBtn.disabled =
          true;

      } else {

        if ($("prereqWarning")) {

          $("prereqWarning")
            .classList
            .remove("show");

        }


        if ($("blockedNote")) {

          $("blockedNote")
            .classList
            .remove("show");

        }


        /*
         * Beginner:
         * no prerequisite.
         *
         * Intermediate / Expert:
         * must select Yes.
         */

        if (
          prerequisiteLevel
        ) {

          submitBtn.disabled =
            selected !== "Yes";

        } else {

          submitBtn.disabled =
            false;

        }

      }


      if ($("experienceIntro")) {

        $("experienceIntro")
          .textContent =

          selected === "Yes"

            ? "Great. Tell us about the student's previous " +
              prerequisiteLevel +
              "-level " +
              course +
              " learning and projects."

            : "Share the student's previous learning experience.";

      }

    }


    if (
      prerequisiteLevel
    ) {

      if (
        prerequisiteArea
      ) {

        prerequisiteArea.style.display =
          "block";

      }


      if ($("prereqQuestion")) {

        $("prereqQuestion")
          .innerHTML =

          "Have you already completed a " +
          prerequisiteLevel +
          "-level " +
          escapeHtml(course) +
          " course on any platform? " +
          '<span class="required">*</span>';

      }


      if ($("prereqWarningText")) {

        $("prereqWarningText")
          .textContent =

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

      }


      if ($("prereqCourseLink")) {

        $("prereqCourseLink").href =

          "course.html?course=" +
          encodeURIComponent(course) +
          "&level=" +
          encodeURIComponent(
            prerequisiteLevel
          );

      }


      document
        .querySelectorAll(
          'input[name="prerequisite"]'
        )
        .forEach(
          function (radio) {

            radio.addEventListener(
              "change",
              updatePrerequisite
            );

          }
        );


      submitBtn.disabled =
        true;


      updatePrerequisite();

    } else {

      /*
       * Beginner has no prerequisite.
       */

      if (
        prerequisiteArea
      ) {

        prerequisiteArea.style.display =
          "none";

      }


      submitBtn.disabled =
        false;

    }


    /*************************************************
     * MINIMUM CONTACT DATE
     *************************************************/

    const now =
      new Date();


    if ($("contactDate")) {

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

    }


    /*************************************************
     * GOOGLE SIGN-IN
     *************************************************/

    /*
     * Google Identity Services calls:
     *
     * window.handleGoogleCredential()
     *
     * after successful sign-in.
     */


    window.handleGoogleCredential =
      function (response) {

        try {


          if (
            !response ||
            !response.credential
          ) {

            throw new Error(
              "Google did not return an authentication credential."
            );

          }


          const idToken =
            response.credential;


          /*******************************************
           * DECODE JWT PAYLOAD
           *******************************************/

          const parts =
            idToken.split(".");


          if (
            parts.length !== 3
          ) {

            throw new Error(
              "Invalid Google credential."
            );

          }


          const base64Url =
            parts[1];


          const base64 =
            base64Url
              .replace(
                /-/g,
                "+"
              )
              .replace(
                /_/g,
                "/"
              );


          const jsonPayload =
            decodeURIComponent(

              atob(base64)
                .split("")
                .map(
                  function (char) {

                    return (
                      "%" +
                      (
                        "00" +
                        char
                          .charCodeAt(0)
                          .toString(16)
                      ).slice(-2)
                    );

                  }
                )
                .join("")

            );


          const payload =
            JSON.parse(
              jsonPayload
            );


          /*******************************************
           * STORE GOOGLE AUTH DATA
           *******************************************/

          googleAuth = {

            signedIn:
              true,

            idToken:
              idToken,

            googleId:
              payload.sub ||
              "",

            email:
              (
                payload.email ||
                ""
              )
                .trim()
                .toLowerCase(),

            name:
              payload.name ||
              "",

            picture:
              payload.picture ||
              ""

          };


          /*******************************************
           * VERIFY BASIC GOOGLE DATA
           *******************************************/

          if (
            !googleAuth.email ||
            !googleAuth.googleId
          ) {

            throw new Error(
              "Google account information is incomplete."
            );

          }


          /*******************************************
           * PRE-FILL EMAIL
           *******************************************/

          const emailField =
            $("email");


          if (emailField) {

            emailField.value =
              googleAuth.email;

            /*
             * Prevent the customer from changing
             * the email to a different account.
             */

            emailField.readOnly =
              true;

          }


          /*******************************************
           * DISPLAY GOOGLE USER
           *******************************************/

          if ($("googleUserName")) {

            $("googleUserName")
              .textContent =
              googleAuth.name ||
              "Google Account";

          }


          if ($("googleUserEmail")) {

            $("googleUserEmail")
              .textContent =
              googleAuth.email;

          }


          if (
            $("googleUserPicture")
          ) {

            if (
              googleAuth.picture
            ) {

              $("googleUserPicture")
                .src =
                googleAuth.picture;

            }

          }


          if ($("googleUser")) {

            $("googleUser")
              .classList
              .add("show");

          }


          if ($("googleStatus")) {

            $("googleStatus")
              .textContent =
              "Google account verified. You can now submit your registration.";

          }


          /*******************************************
           * GOOGLE SIGN-IN BUTTON
           *******************************************/

          if (
            $("googleSignInBtn")
          ) {

            $("googleSignInBtn")
              .style.display =
              "none";

          }


        } catch (error) {

          console.error(
            "Google authentication error:",
            error
          );


          googleAuth = {

            signedIn:
              false,

            idToken:
              "",

            googleId:
              "",

            email:
              "",

            name:
              "",

            picture:
              ""

          };


          if ($("googleStatus")) {

            $("googleStatus")
              .textContent =
              "Google sign-in failed. Please try again.";

          }


          showError(
            "Google sign-in could not be verified. Please sign in with Google again."
          );

        }

      };


    /*************************************************
     * FORM SUBMISSION
     *************************************************/

    $("registrationForm")
      .addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();


          /*******************************************
           * CLEAR PREVIOUS ERROR
           *******************************************/

          if ($("errorBox")) {

            $("errorBox")
              .classList
              .remove("show");

          }


          /*******************************************
           * GOOGLE AUTHENTICATION CHECK
           *******************************************/

          if (
            !googleAuth ||
            !googleAuth.signedIn ||
            !googleAuth.idToken
          ) {

            showError(
              "Please sign in with Google before submitting your registration."
            );

            return;

          }


          /*******************************************
           * PREREQUISITE VALIDATION
           *******************************************/

          if (
            level !==
            "Beginner"
          ) {

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


            if (
              selected ===
              "No"
            ) {

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


          /*******************************************
           * HTML FORM VALIDATION
           *******************************************/

          if (
            !$("registrationForm")
              .checkValidity()
          ) {

            $("registrationForm")
              .reportValidity();

            return;

          }


          /*******************************************
           * COLLECT FORM DATA
           *******************************************/

          const formData =
            Object.fromEntries(

              new FormData(
                $("registrationForm")
              ).entries()

            );


          /*******************************************
           * FINAL EMAIL CHECK
           *******************************************/

          if (
            String(
              formData.email ||
              ""
            )
              .trim()
              .toLowerCase() !==
            googleAuth.email
          ) {

            showError(
              "The registration email must match your Google account."
            );

            return;

          }

          console.log("GOOGLE AUTH BEFORE SUBMISSION:", googleAuth);
console.log("GOOGLE TOKEN EXISTS:", !!googleAuth.idToken);
console.log("GOOGLE EMAIL:", googleAuth.email);

          /*******************************************
           * CREATE REGISTRATION DATA
           *******************************************/

          const registrationData = {

            course:
              course,

            level:
              level,

            studentName:
              formData.studentName ||
              "",

            age:
              formData.age ||
              "",

            grade:
              formData.grade ||
              "",

            school:
              formData.school ||
              "",

            city:
              formData.city ||
              "",

            parentName:
              formData.parentName ||
              "",

            relationship:
              formData.relationship ||
              "",

            phone:
              formData.phone ||
              "",

            email:
              formData.email ||
              "",

            prerequisite:
              formData.prerequisite ||
              "",

            previousExperience:
              formData.previousExperience ||
              "",

            goals:
              formData.goals ||
              "",

            anythingElse:
              formData.anythingElse ||
              "",

            contactDate:
              formData.contactDate ||
              "",

            contactTime:
              formData.contactTime ||
              "",

            submittedAt:
              new Date()
                .toISOString(),

            website:
              "",


            /*****************************************
             * GOOGLE ACCOUNT DATA
             *****************************************/

            googleIdToken:
              googleAuth.idToken,

            googleId:
              googleAuth.googleId,

            googleEmail:
              googleAuth.email,

            googleName:
              googleAuth.name

          };


          /*******************************************
           * BUTTON LOADING STATE
           *******************************************/

          const originalButtonText =
            submitBtn.textContent;


          submitBtn.disabled =
            true;


          submitBtn.textContent =
            "Submitting registration…";


          /*******************************************
           * SEND TO GOOGLE APPS SCRIPT
           *******************************************/

          try {


            await fetch(

              BACKEND_URL,

              {

                method:
                  "POST",

                mode:
                  "no-cors",

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


            /*****************************************
             * SHOW SUCCESS
             *****************************************/

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


    /*************************************************
     * SUCCESS SCREEN
     *************************************************/

    function showSuccess(
      data
    ) {

      $("registrationForm")
        .style
        .display =
        "none";


      $("successCard")
        .classList
        .add("show");


      if ($("successCourse")) {

        $("successCourse")
          .textContent =
          data.course;

      }


      if ($("successLevel")) {

        $("successLevel")
          .textContent =
          data.level +
          " Level";

      }


      let dateText =
        data.contactDate;


      try {

        dateText =
          new Date(
            data.contactDate +
            "T00:00:00"
          )
            .toLocaleDateString(
              "en-IN",
              {

                day:
                  "numeric",

                month:
                  "short",

                year:
                  "numeric"

              }
            );

      } catch (error) {

        console.error(
          "Date formatting error:",
          error
        );

      }


      if ($("successContact")) {

        $("successContact")
          .textContent =

          dateText +
          " • " +
          data.contactTime;

      }


      /*******************************************
       * WHATSAPP
       *******************************************/

      const whatsappNumber =
        "918939129382";


      const message =

        "Hi BotNest Academy, I have completed my registration for " +
        data.course +
        " — " +
        data.level +
        ". I would like to confirm the next steps.";


      if (
        $("successWhatsApp")
      ) {

        $("successWhatsApp")
          .href =

          "https://wa.me/" +
          whatsappNumber +
          "?text=" +
          encodeURIComponent(
            message
          );

      }


      /*******************************************
       * SCROLL TO TOP
       *******************************************/

      window.scrollTo({

        top:
          0,

        behavior:
          "smooth"

      });

    }


    /*************************************************
     * ERROR MESSAGE
     *************************************************/

    function showError(
      message
    ) {

      if (!$("errorBox")) {

        alert(message);

        return;

      }


      $("errorBox")
        .textContent =
        message;


      $("errorBox")
        .classList
        .add("show");


      $("errorBox")
        .scrollIntoView({

          behavior:
            "smooth",

          block:
            "center"

        });

    }


    /*************************************************
     * HTML ESCAPE
     *************************************************/

    function escapeHtml(
      value
    ) {

      return String(
        value
      ).replace(

        /[&<>"']/g,

        function (char) {

          return {

            "&":
              "&amp;",

            "<":
              "&lt;",

            ">":
              "&gt;",

            '"':
              "&quot;",

            "'":
              "&#039;"

          }[char];

        }

      );

    }


  }
);
