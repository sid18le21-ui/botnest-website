(() => {

  /*
   * ============================================================
   * BOTNEST ACADEMY
   * GLOBAL FRONTEND ENGINE
   * ============================================================
   *
   * Responsibilities:
   *
   * 1. API communication
   * 2. Authentication/session storage
   * 3. Navigation account state
   * 4. Program cards
   * 5. Mobile navigation
   * 6. Scroll progress
   * 7. Scroll direction detection
   * 8. Re-triggerable reveal animations
   * 9. Horizontal / directional animations
   * 10. Lightweight parallax effects
   *
   * ============================================================
   */


  /*
   * ============================================================
   * API CONFIGURATION
   * ============================================================
   *
   * IMPORTANT:
   *
   * Replace this URL with your Cloudflare Worker URL.
   *
   * DO NOT put your Google Apps Script URL here.
   *
   * The browser communicates with:
   *
   * GitHub Pages
   *      ↓
   * Cloudflare Worker
   *      ↓
   * Google Apps Script
   *      ↓
   * Google Sheets
   *
   * ============================================================
   */

  const BOTNEST_API_URL =
    "https://botnest-api.botnest-officials.workers.dev/";


  /*
   * ============================================================
   * STORAGE KEYS
   * ============================================================
   */

  const STORAGE_KEYS = {

    token:
      "botnest_session_token",

    role:
      "botnest_session_role",

    account:
      "botnest_account"

  };


  /*
   * ============================================================
   * PROGRAM DATA
   * ============================================================
   */

  const PROGRAMS = [

    {
      name: "Robotics",
      icon: "🤖",
      desc:
        "Learn electronics, sensors, actuators, programming and robotics through practical projects."
    },

    {
      name: "IoT",
      icon: "🌐",
      desc:
        "Build connected devices using microcontrollers, sensors, networking and cloud concepts."
    },

    {
      name: "Artificial Intelligence",
      icon: "🧠",
      desc:
        "Explore AI concepts, problem solving, data and practical intelligent applications."
    },

    {
      name: "Machine Learning",
      icon: "📊",
      desc:
        "Understand data, features, models and the foundations of machine learning."
    },

    {
      name: "Deep Learning",
      icon: "⚡",
      desc:
        "Explore neural networks and modern deep-learning concepts through guided projects."
    },

    {
      name: "Automation",
      icon: "⚙️",
      desc:
        "Combine controllers, sensors and automation logic to solve real-world problems."
    }

  ];


  /*
   * ============================================================
   * SESSION / API OBJECT
   * ============================================================
   */

  window.BotNest = {

    /*
     * ----------------------------------------------------------
     * API URL
     * ----------------------------------------------------------
     */

    API_URL:
      BOTNEST_API_URL,


    /*
     * ----------------------------------------------------------
     * Get session token
     * ----------------------------------------------------------
     */

    getToken() {

      return localStorage.getItem(
        STORAGE_KEYS.token
      );

    },


    /*
     * ----------------------------------------------------------
     * Get session role
     * ----------------------------------------------------------
     */

    getRole() {

      return localStorage.getItem(
        STORAGE_KEYS.role
      );

    },


    /*
     * ----------------------------------------------------------
     * Get stored account
     * ----------------------------------------------------------
     */

    getAccount() {

      const value =
        localStorage.getItem(
          STORAGE_KEYS.account
        );


      if (!value) {
        return null;
      }


      try {

        return JSON.parse(
          value
        );

      } catch {

        return null;

      }

    },


    /*
     * ----------------------------------------------------------
     * Store session
     * ----------------------------------------------------------
     */

    setSession(data) {

      if (
        !data ||
        !data.sessionToken
      ) {

        throw new Error(
          "Invalid session response."
        );

      }


      localStorage.setItem(
        STORAGE_KEYS.token,
        data.sessionToken
      );


      if (data.role) {

        localStorage.setItem(
          STORAGE_KEYS.role,
          data.role
        );

      }


      if (data.account) {

        localStorage.setItem(
          STORAGE_KEYS.account,
          JSON.stringify(
            data.account
          )
        );

      }

    },


    /*
     * ----------------------------------------------------------
     * Clear session
     * ----------------------------------------------------------
     */

    clearSession() {

      localStorage.removeItem(
        STORAGE_KEYS.token
      );

      localStorage.removeItem(
        STORAGE_KEYS.role
      );

      localStorage.removeItem(
        STORAGE_KEYS.account
      );

    },


    /*
     * ----------------------------------------------------------
     * API REQUEST
     * ----------------------------------------------------------
     */

    async api(
      action,
      payload = {}
    ) {

      if (
        !BOTNEST_API_URL ||
        BOTNEST_API_URL.includes(
          "YOUR-BOTNEST-API"
        )
      ) {

        throw new Error(
          "BotNest API is not configured yet. Update BOTNEST_API_URL in script.js."
        );

      }


      const body = {

        ...payload,

        action

      };


      const token =
        this.getToken();


      if (token) {

        body.sessionToken =
          token;

      }


      let response;


      try {

        response =
          await fetch(
            BOTNEST_API_URL,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:
                JSON.stringify(
                  body
                ),

              cache:
                "no-store"

            }
          );

      } catch (error) {

        console.error(
          "BotNest API network error:",
          error
        );


        throw new Error(
          "Unable to connect to the BotNest server. Please try again."
        );

      }


      const responseText =
        await response.text();


      let data;


      try {

        data =
          JSON.parse(
            responseText
          );

      } catch {

        console.error(
          "Invalid API response:",
          responseText
        );


        throw new Error(
          "The BotNest server returned an invalid response."
        );

      }


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "The request could not be completed."
        );

      }


      return data;

    }

  };


  /*
   * ============================================================
   * INITIALIZE GLOBAL UI
   * ============================================================
   */

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      initializePrograms();

      initializeNavigation();

      initializeAccountNavigation();

      initializeYear();

      initializeScrollProgress();

      initializeScrollAnimations();

      initializeParallax();

    }
  );


  /*
   * ============================================================
   * PROGRAM CARDS
   * ============================================================
   */

  function initializePrograms() {

    const grid =
      document.getElementById(
        "programGrid"
      );


    if (!grid) {
      return;
    }


    grid.innerHTML =
      PROGRAMS
        .map(
          (program, index) => {

            return `

              <article
                class="program-card reveal ${
                  getRevealClass(index)
                }"
              >

                <div class="program-card-glow"></div>


                <div class="program-top">

                  <span class="program-icon">
                    ${program.icon}
                  </span>

                  <span class="program-index">
                    ${String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                </div>


                <h3>
                  ${escapeHtml(
                    program.name
                  )}
                </h3>


                <p>
                  ${escapeHtml(
                    program.desc
                  )}
                </p>


                <div class="program-levels">

                  <a
                    href="course.html?course=${encodeURIComponent(
                      program.name
                    )}&level=Beginner"
                  >
                    <span>
                      Beginner
                    </span>

                    <strong>
                      →
                    </strong>
                  </a>


                  <a
                    href="course.html?course=${encodeURIComponent(
                      program.name
                    )}&level=Intermediate"
                  >
                    <span>
                      Intermediate
                    </span>

                    <strong>
                      →
                    </strong>
                  </a>


                  <a
                    href="course.html?course=${encodeURIComponent(
                      program.name
                    )}&level=Expert"
                  >
                    <span>
                      Expert
                    </span>

                    <strong>
                      →
                    </strong>
                  </a>

                </div>


                <a
                  href="course.html?course=${encodeURIComponent(
                    program.name
                  )}"
                  class="program-explore"
                >

                  Explore Program

                  <span>
                    →
                  </span>

                </a>

              </article>

            `;

          }
        )
        .join("");


    /*
     * The cards are generated after DOMContentLoaded.
     *
     * Therefore we need to refresh the animation
     * observer so the new cards are observed too.
     */

    if (
      window.BotNestAnimations &&
      typeof
        window.BotNestAnimations.refresh ===
          "function"
    ) {

      window.BotNestAnimations.refresh();

    }

  }


  /*
   * ============================================================
   * REVEAL DIRECTION
   * ============================================================
   */

  function getRevealClass(
    index
  ) {

    const pattern =
      [
        "reveal-left",
        "reveal-up",
        "reveal-right",
        "reveal-up"
      ];


    return pattern[
      index %
      pattern.length
    ];

  }


  /*
   * ============================================================
   * MOBILE NAVIGATION
   * ============================================================
   */

  function initializeNavigation() {

    const menuButton =
      document.getElementById(
        "menuBtn"
      );


    const nav =
      document.getElementById(
        "mainNav"
      );


    if (
      !menuButton ||
      !nav
    ) {

      return;
    }


    menuButton.addEventListener(
      "click",
      () => {

        const open =
          nav.classList.toggle(
            "mobile-open"
          );


        menuButton.classList.toggle(
          "active",
          open
        );


        menuButton.setAttribute(
          "aria-expanded",
          String(open)
        );

      }
    );


    /*
     * Close mobile navigation after
     * clicking a normal anchor.
     */

    nav
      .querySelectorAll(
        "a"
      )
      .forEach(
        link => {

          link.addEventListener(
            "click",
            () => {

              nav.classList.remove(
                "mobile-open"
              );


              menuButton.classList.remove(
                "active"
              );


              menuButton.setAttribute(
                "aria-expanded",
                "false"
              );

            }
          );

        }
      );

  }


  /*
   * ============================================================
   * ACCOUNT NAVIGATION
   * ============================================================
   */

  function initializeAccountNavigation() {

    const navAccount =
      document.getElementById(
        "navAccount"
      );


    if (!navAccount) {
      return;
    }


    updateAccountNavigation(
      navAccount
    );

  }


  function updateAccountNavigation(
    navAccount
  ) {

    const token =
      BotNest.getToken();


    const role =
      BotNest.getRole();


    if (
      !token
    ) {

      navAccount.innerHTML = `

        <a
          href="login.html"
          class="nav-login"
        >
          Login
        </a>

        <a
          href="signup.html"
          class="nav-cta"
        >
          Create Account
        </a>

      `;


      return;

    }


    if (
      role === "admin"
    ) {

      navAccount.innerHTML = `

        <a
          href="admin.html"
          class="nav-login"
        >
          Admin Panel
        </a>

        <button
          type="button"
          class="nav-logout"
          id="globalLogoutButton"
        >
          Logout
        </button>

      `;

    } else {

      navAccount.innerHTML = `

        <a
          href="customer.html"
          class="nav-login"
        >
          Dashboard
        </a>

        <button
          type="button"
          class="nav-logout"
          id="globalLogoutButton"
        >
          Logout
        </button>

      `;

    }


    const logout =
      document.getElementById(
        "globalLogoutButton"
      );


    if (!logout) {
      return;
    }


    logout.addEventListener(
      "click",
      async () => {

        logout.disabled =
          true;


        const currentRole =
          BotNest.getRole();


        try {

          if (
            currentRole ===
            "admin"
          ) {

            await BotNest.api(
              "adminLogout"
            );

          } else {

            await BotNest.api(
              "customerLogout"
            );

          }

        } catch (
          error
        ) {

          console.warn(
            "Logout request failed:",
            error
          );

        } finally {

          BotNest.clearSession();


          /*
           * Refresh current page.
           */

          window.location.reload();

        }

      }
    );

  }


  /*
   * ============================================================
   * YEAR
   * ============================================================
   */

  function initializeYear() {

    document
      .querySelectorAll(
        "#year"
      )
      .forEach(
        element => {

          element.textContent =
            new Date()
              .getFullYear();

        }
      );

  }


  /*
   * ============================================================
   * SCROLL PROGRESS
   * ============================================================
   */

  function initializeScrollProgress() {

    const progress =
      document.getElementById(
        "scrollProgress"
      );


    if (!progress) {
      return;
    }


    let ticking =
      false;


    function update() {

      const scrollTop =
        window.scrollY;


      const documentHeight =
        document.documentElement
          .scrollHeight;


      const viewportHeight =
        window.innerHeight;


      const maxScroll =
        documentHeight -
        viewportHeight;


      const percentage =
        maxScroll > 0
          ? (
              scrollTop /
              maxScroll
            ) * 100
          : 0;


      progress.style.width =
        `${percentage}%`;


      ticking =
        false;

    }


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            update
          );

          ticking =
            true;

        }

      },
      {
        passive: true
      }
    );


    update();

  }


  /*
   * ============================================================
   * SCROLL-DIRECTION ANIMATION ENGINE
   * ============================================================
   *
   * This is intentionally different from a normal
   * "animate once" IntersectionObserver.
   *
   * Elements are allowed to animate again whenever
   * they leave and re-enter the viewport.
   *
   * The current scroll direction is also added to
   * the element:
   *
   *    scrolling-down
   *    scrolling-up
   *
   * CSS can use those classes to change the animation.
   *
   * ============================================================
   */

  function initializeScrollAnimations() {

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    /*
     * Accessibility:
     *
     * If the user specifically requests reduced
     * motion, reveal elements without movement.
     */

    if (
      reducedMotion
    ) {

      document
        .querySelectorAll(
          ".reveal"
        )
        .forEach(
          element => {

            element.classList.add(
              "reveal-visible"
            );

          }
        );


      return;

    }


    let lastScrollY =
      window.scrollY;


    let direction =
      "down";


    let ticking =
      false;


    /*
     * ----------------------------------------------------------
     * Direction detection
     * ----------------------------------------------------------
     */

    function updateDirection() {

      const currentY =
        window.scrollY;


      if (
        currentY >
        lastScrollY + 2
      ) {

        direction =
          "down";

      } else if (
        currentY <
        lastScrollY - 2
      ) {

        direction =
          "up";

      }


      document.body.classList.toggle(
        "scrolling-down",
        direction === "down"
      );


      document.body.classList.toggle(
        "scrolling-up",
        direction === "up"
      );


      lastScrollY =
        currentY;


      ticking =
        false;

    }


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            updateDirection
          );

          ticking =
            true;

        }

      },
      {
        passive: true
      }
    );


    /*
     * ----------------------------------------------------------
     * Intersection Observer
     * ----------------------------------------------------------
     *
     * IMPORTANT:
     *
     * We DO NOT use:
     *
     *    unobserve()
     *
     * after the first animation.
     *
     * Therefore an element can animate again.
     * ----------------------------------------------------------
     */

    let observer;


    function createObserver() {

      observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

                const element =
                  entry.target;


                /*
                 * Add the current direction
                 * to the element.
                 */

                element.classList.toggle(
                  "entering-from-bottom",
                  direction === "down"
                );


                element.classList.toggle(
                  "entering-from-top",
                  direction === "up"
                );


                /*
                 * Element entered viewport.
                 */

                if (
                  entry.isIntersecting
                ) {

                  element.classList.add(
                    "reveal-visible"
                  );


                  element.classList.remove(
                    "reveal-hidden"
                  );


                  /*
                   * Store the direction for
                   * CSS / future animation logic.
                   */

                  element.dataset.scrollDirection =
                    direction;

                }


                /*
                 * Element left viewport.
                 *
                 * This is the important part.
                 *
                 * We remove the visible class so
                 * it can animate again next time.
                 */

                else {

                  element.classList.remove(
                    "reveal-visible"
                  );


                  element.classList.add(
                    "reveal-hidden"
                  );

                }

              }
            );

          },

          {
            threshold:
              0.12,

            rootMargin:
              "0px 0px -8% 0px"

          }

        );


      observeRevealElements();

    }


    function observeRevealElements() {

      if (!observer) {
        return;
      }


      document
        .querySelectorAll(
          ".reveal"
        )
        .forEach(
          element => {

            observer.observe(
              element
            );

          }
        );

    }


    createObserver();


    /*
     * Public refresh method.
     *
     * Program cards are created dynamically
     * after DOMContentLoaded.
     */

    window.BotNestAnimations = {

      refresh() {

        if (
          observer
        ) {

          observeRevealElements();

        }

      }

    };

  }


  /*
   * ============================================================
   * PARALLAX ENGINE
   * ============================================================
   *
   * Elements with:
   *
   *    data-parallax="0.2"
   *
   * move subtly according to scroll position.
   *
   * We deliberately keep this lightweight.
   * ============================================================
   */

  function initializeParallax() {

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    if (
      reducedMotion
    ) {

      return;

    }


    const elements =
      document.querySelectorAll(
        "[data-parallax]"
      );


    if (!elements.length) {

      /*
       * Some elements may be added later.
       * We still return safely.
       */

      return;

    }


    let ticking =
      false;


    function update() {

      const scrollY =
        window.scrollY;


      elements.forEach(
        element => {

          const speed =
            Number(
              element.dataset.parallax
            ) || 0;


          const rect =
            element.getBoundingClientRect();


          const center =
            rect.top +
            rect.height / 2;


          const viewportCenter =
            window.innerHeight / 2;


          const distance =
            center -
            viewportCenter;


          const movement =
            distance *
            speed;


          element.style.transform =
            `translate3d(0, ${movement}px, 0)`;

        }
      );


      ticking =
        false;

    }


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          requestAnimationFrame(
            update
          );

          ticking =
            true;

        }

      },
      {
        passive: true
      }
    );


    update();

  }


  /*
   * ============================================================
   * ESCAPE HTML
   * ============================================================
   */

  function escapeHtml(
    value
  ) {

    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );

  }

})();
