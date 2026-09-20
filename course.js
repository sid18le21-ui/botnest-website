/*
 * ============================================================
 * BOTNEST ACADEMY
 * COURSE DATA + COURSE PAGE
 * ============================================================
 */


document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
     * ========================================================
     * COURSE DATA
     * ========================================================
     */

    const DATA = {

      Robotics: {

        icon: "🤖",

        description:
          "Learn electronics, sensors, actuators, programming and robotics through practical projects.",

        overview:
          "Build a strong understanding of robotics by combining electronics, sensors, motors, controllers and programming.",

        outcomes: [
          "Understand the fundamentals of robotics",
          "Work with sensors and actuators",
          "Program microcontrollers",
          "Build practical robotic systems",
          "Develop engineering and problem-solving skills"
        ],

        modules: {

          Beginner: [
            "Introduction to Robotics",
            "Basic Electronics",
            "Components and Circuits",
            "Arduino Fundamentals",
            "Sensors and Actuators",
            "Basic Robot Programming",
            "Mini Robotics Project"
          ],

          Intermediate: [
            "Advanced Electronics",
            "Motor Drivers",
            "DC Motors and Servos",
            "Ultrasonic and IR Sensors",
            "Robot Control Systems",
            "Obstacle Avoidance",
            "Intermediate Robotics Project"
          ],

          Expert: [
            "Advanced Robotics Architecture",
            "Autonomous Systems",
            "Sensor Fusion",
            "Advanced Motor Control",
            "Robotics Communication",
            "Intelligent Robotics",
            "Advanced Robotics Project"
          ]

        }

      },


      IoT: {

        icon: "🌐",

        description:
          "Build connected devices using microcontrollers, sensors, networking and cloud concepts.",

        overview:
          "Learn how physical devices communicate with software, networks and cloud platforms.",

        outcomes: [
          "Understand IoT architecture",
          "Work with sensors and microcontrollers",
          "Connect devices to networks",
          "Understand IoT communication protocols",
          "Build connected IoT projects"
        ],

        modules: {

          Beginner: [
            "Introduction to IoT",
            "Electronics Fundamentals",
            "Arduino Basics",
            "Sensors",
            "C Programming Fundamentals",
            "Basic IoT Communication",
            "Mini IoT Project"
          ],

          Intermediate: [
            "ESP32 and Advanced Controllers",
            "Wi-Fi and Networking",
            "MQTT Fundamentals",
            "HTTP and APIs",
            "IoT Data Handling",
            "Cloud Connectivity",
            "Intermediate IoT Project"
          ],

          Expert: [
            "Industrial IoT",
            "LoRaWAN",
            "Zigbee",
            "Advanced MQTT",
            "IoT Security",
            "Cloud Architecture",
            "Advanced IoT Project"
          ]

        }

      },


      "Artificial Intelligence": {

        icon: "🧠",

        description:
          "Explore AI concepts, problem solving, data and practical intelligent applications.",

        overview:
          "Understand the foundations of artificial intelligence and how intelligent systems solve problems using data and algorithms.",

        outcomes: [
          "Understand AI fundamentals",
          "Learn how intelligent systems work",
          "Explore data and algorithms",
          "Build simple AI applications",
          "Develop computational thinking"
        ],

        modules: {

          Beginner: [
            "Introduction to Artificial Intelligence",
            "AI in Everyday Life",
            "Problem Solving",
            "Data Fundamentals",
            "Introduction to Algorithms",
            "Simple AI Applications",
            "Mini AI Project"
          ],

          Intermediate: [
            "AI Algorithms",
            "Data Processing",
            "Feature Engineering",
            "Classification",
            "Prediction Systems",
            "AI Application Development",
            "Intermediate AI Project"
          ],

          Expert: [
            "Advanced AI Systems",
            "Intelligent Agents",
            "Advanced Algorithms",
            "AI Architecture",
            "Model Evaluation",
            "Real-World AI Systems",
            "Advanced AI Project"
          ]

        }

      },


      "Machine Learning": {

        icon: "📊",

        description:
          "Understand data, features, models and the foundations of machine learning.",

        overview:
          "Learn how machines use data to identify patterns, make predictions and support intelligent decision making.",

        outcomes: [
          "Understand machine learning fundamentals",
          "Work with datasets",
          "Understand features and labels",
          "Build basic machine learning models",
          "Evaluate model performance"
        ],

        modules: {

          Beginner: [
            "Introduction to Machine Learning",
            "Data and Datasets",
            "Features and Labels",
            "Training and Testing",
            "Basic Regression",
            "Basic Classification",
            "Mini ML Project"
          ],

          Intermediate: [
            "Data Preprocessing",
            "Feature Engineering",
            "Regression Models",
            "Classification Models",
            "Model Evaluation",
            "Machine Learning Pipelines",
            "Intermediate ML Project"
          ],

          Expert: [
            "Advanced Machine Learning",
            "Ensemble Models",
            "Model Optimization",
            "Advanced Feature Engineering",
            "Model Deployment",
            "ML System Architecture",
            "Advanced ML Project"
          ]

        }

      },


      "Deep Learning": {

        icon: "⚡",

        description:
          "Explore neural networks and modern deep-learning concepts through guided projects.",

        overview:
          "Explore neural networks, deep learning architectures and practical applications of modern AI systems.",

        outcomes: [
          "Understand neural networks",
          "Learn deep learning fundamentals",
          "Understand training and evaluation",
          "Explore modern architectures",
          "Build guided deep learning projects"
        ],

        modules: {

          Beginner: [
            "Introduction to Neural Networks",
            "Neurons and Layers",
            "Activation Functions",
            "Training Fundamentals",
            "Loss Functions",
            "Simple Neural Networks",
            "Mini Deep Learning Project"
          ],

          Intermediate: [
            "Deep Neural Networks",
            "Optimization",
            "Convolutional Neural Networks",
            "Image Classification",
            "Model Training",
            "Model Evaluation",
            "Intermediate Deep Learning Project"
          ],

          Expert: [
            "Advanced Neural Networks",
            "CNN Architectures",
            "Sequence Models",
            "Transfer Learning",
            "Model Optimization",
            "Deep Learning Systems",
            "Advanced Deep Learning Project"
          ]

        }

      },


      Automation: {

        icon: "⚙️",

        description:
          "Combine controllers, sensors and automation logic to solve real-world problems.",

        overview:
          "Learn how sensors, controllers, actuators and software can work together to create automated systems.",

        outcomes: [
          "Understand automation fundamentals",
          "Work with sensors and controllers",
          "Build control systems",
          "Understand automation logic",
          "Create practical automated systems"
        ],

        modules: {

          Beginner: [
            "Introduction to Automation",
            "Sensors and Inputs",
            "Controllers",
            "Relays and Outputs",
            "Basic Control Logic",
            "Simple Automation",
            "Mini Automation Project"
          ],

          Intermediate: [
            "Advanced Controllers",
            "Industrial Sensors",
            "Motor Control",
            "Automation Protocols",
            "Control Systems",
            "IoT Automation",
            "Intermediate Automation Project"
          ],

          Expert: [
            "Industrial Automation",
            "PLC Fundamentals",
            "SCADA Concepts",
            "Industrial Communication",
            "Advanced Control Systems",
            "Smart Automation",
            "Advanced Automation Project"
          ]

        }

      }

    };


    /*
     * ========================================================
     * LEVEL DATA
     * ========================================================
     */

    const LEVELS = {

      Beginner: {

        number: "01",

        title: "Beginner",

        short:
          "Build your foundation.",

        description:
          "Start from the fundamentals and develop the core knowledge needed to understand the technology.",

        colorClass:
          "level-beginner"

      },


      Intermediate: {

        number: "02",

        title: "Intermediate",

        short:
          "Build real systems.",

        description:
          "Combine concepts and work on more advanced practical systems and projects.",

        colorClass:
          "level-intermediate",

        prerequisite:
          "Beginner"

      },


      Expert: {

        number: "03",

        title: "Expert",

        short:
          "Engineer advanced systems.",

        description:
          "Explore advanced concepts, system architecture and challenging engineering projects.",

        colorClass:
          "level-expert",

        prerequisite:
          "Intermediate"

      }

    };


    /*
     * ========================================================
     * URL PARAMETERS
     * ========================================================
     */

    const params =
      new URLSearchParams(
        window.location.search
      );


    const requestedCourse =
      params.get(
        "course"
      );


    const requestedLevel =
      params.get(
        "level"
      );


    /*
     * Only allow known course names.
     *
     * This also prevents arbitrary URL parameters
     * from being inserted into the page.
     */

    const course =
      DATA[requestedCourse]
        ? requestedCourse
        : "Robotics";


    const level =
      LEVELS[requestedLevel]
        ? requestedLevel
        : "Beginner";


    const courseData =
      DATA[course];


    /*
     * ========================================================
     * ELEMENTS
     * ========================================================
     */

    const hero =
      document.getElementById(
        "courseHero"
      );


    const overview =
      document.getElementById(
        "courseOverview"
      );


    const levelSelector =
      document.getElementById(
        "levelSelector"
      );


    const levelDetails =
      document.getElementById(
        "levelDetails"
      );


    /*
     * ========================================================
     * RENDER
     * ========================================================
     */

    renderHero();

    renderOverview();

    renderLevelSelector();

    renderLevelDetails(
      level
    );


    /*
     * ========================================================
     * HERO
     * ========================================================
     */

    function renderHero() {

      hero.innerHTML = `

        <div class="course-icon-large">

          ${courseData.icon}

        </div>


        <p class="eyebrow">

          BOTNEST ACADEMY

        </p>


        <h1>

          ${escapeHtml(course)}

        </h1>


        <p class="course-hero-description">

          ${escapeHtml(
            courseData.description
          )}

        </p>


        <div class="course-hero-tags">

          <span>
            Beginner
          </span>

          <span>
            Intermediate
          </span>

          <span>
            Expert
          </span>

          <span>
            Project Based
          </span>

        </div>

      `;

    }


    /*
     * ========================================================
     * OVERVIEW
     * ========================================================
     */

    function renderOverview() {

      overview.innerHTML = `

        <div class="course-overview-main">

          <p class="eyebrow">
            PROGRAM OVERVIEW
          </p>

          <h2>
            Learn by
            <span class="gradient-text">
              building.
            </span>
          </h2>

          <p>
            ${escapeHtml(
              courseData.overview
            )}
          </p>

        </div>


        <div class="course-outcomes">

          <p class="eyebrow">
            WHAT YOU'LL DEVELOP
          </p>

          <ul>

            ${courseData.outcomes
              .map(
                outcome => `

                  <li>

                    <span>
                      ✓
                    </span>

                    ${escapeHtml(
                      outcome
                    )}

                  </li>

                `
              )
              .join("")
            }

          </ul>

        </div>

      `;

    }


    /*
     * ========================================================
     * LEVEL SELECTOR
     * ========================================================
     */

    function renderLevelSelector() {

      levelSelector.innerHTML =
        Object.keys(
          LEVELS
        )
          .map(
            levelName => {

              const data =
                LEVELS[
                  levelName
                ];


              const active =
                levelName === level
                  ? "active"
                  : "";


              const prerequisite =
                data.prerequisite
                  ? `
                    <small>
                      Requires ${escapeHtml(
                        data.prerequisite
                      )}
                    </small>
                  `
                  : `
                    <small>
                      No prerequisite
                    </small>
                  `;


              return `

                <button
                  type="button"
                  class="level-card ${active} ${data.colorClass}"
                  data-level="${escapeAttribute(
                    levelName
                  )}"
                >

                  <span class="level-number">
                    ${data.number}
                  </span>


                  <span class="level-card-content">

                    <strong>
                      ${escapeHtml(
                        data.title
                      )}
                    </strong>

                    <span>
                      ${escapeHtml(
                        data.short
                      )}
                    </span>

                    ${prerequisite}

                  </span>


                  <span class="level-arrow">
                    →
                  </span>

                </button>

              `;

            }
          )
          .join("");


      levelSelector
        .querySelectorAll(
          "[data-level]"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                const selectedLevel =
                  button.dataset.level;


                updateURL(
                  selectedLevel
                );


                renderLevelSelector();


                renderLevelDetails(
                  selectedLevel
                );


                levelDetails.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });

              }
            );

          }
        );

    }


    /*
     * ========================================================
     * LEVEL DETAILS
     * ========================================================
     */

    function renderLevelDetails(
      selectedLevel
    ) {

      const levelData =
        LEVELS[
          selectedLevel
        ];


      const modules =
        courseData.modules[
          selectedLevel
        ] || [];


      const prerequisite =
        levelData.prerequisite;


      levelDetails.innerHTML = `

        <div
          class="level-detail-header reveal reveal-left"
        >

          <div>

            <p class="eyebrow">
              LEVEL ${levelData.number}
            </p>

            <h2>

              ${escapeHtml(
                selectedLevel
              )}

              <span class="gradient-text">
                learning path.
              </span>

            </h2>

            <p>

              ${escapeHtml(
                levelData.description
              )}

            </p>

          </div>


          <div class="level-detail-icon">

            ${courseData.icon}

          </div>

        </div>


        <div class="level-detail-grid">


          <!-- CURRICULUM -->

          <div class="curriculum-card">

            <div class="curriculum-heading">

              <div>

                <p class="eyebrow">
                  CURRICULUM
                </p>

                <h3>
                  What you'll learn
                </h3>

              </div>

              <span>
                ${modules.length}
                Topics
              </span>

            </div>


            <div class="curriculum-list">

              ${modules
                .map(
                  (module, index) => `

                    <div
                      class="curriculum-item reveal reveal-right"
                    >

                      <span class="curriculum-number">

                        ${String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}

                      </span>


                      <span class="curriculum-title">

                        ${escapeHtml(
                          module
                        )}

                      </span>


                      <span class="curriculum-check">
                        +
                      </span>

                    </div>

                  `
                )
                .join("")
              }

            </div>

          </div>


          <!-- REGISTRATION -->

          <aside class="level-action-card">

            <div class="level-action-icon">

              ${courseData.icon}

            </div>


            <p class="eyebrow">
              ${escapeHtml(
                selectedLevel
              ).toUpperCase()}
              PROGRAM
            </p>


            <h3>

              Ready to start
              learning?

            </h3>


            <p>

              Register your child or student
              for this learning level.

            </p>


            ${
              prerequisite
                ? `
                  <div class="prerequisite-box">

                    <span>
                      REQUIRED BEFORE THIS LEVEL
                    </span>

                    <strong>
                      ${escapeHtml(
                        prerequisite
                      )}
                    </strong>

                  </div>
                `
                : `
                  <div class="prerequisite-box success">

                    <span>
                      PREREQUISITE
                    </span>

                    <strong>
                      No prerequisite
                    </strong>

                  </div>
                `
            }


            <a
              href="register.html?course=${encodeURIComponent(
                course
              )}&level=${encodeURIComponent(
                selectedLevel
              )}"
              class="btn btn-primary full-width"
            >

              Register Now

              <span>
                →
              </span>

            </a>


            <small class="level-action-note">

              You will need a BotNest Academy
              customer account before registering.

            </small>

          </aside>


        </div>

      `;

    }


    /*
     * ========================================================
     * URL UPDATE
     * ========================================================
     */

    function updateURL(
      selectedLevel
    ) {

      const url =
        new URL(
          window.location.href
        );


      url.searchParams.set(
        "course",
        course
      );


      url.searchParams.set(
        "level",
        selectedLevel
      );


      window.history.replaceState(
        {},
        "",
        url
      );

    }


    /*
     * ========================================================
     * HTML ESCAPING
     * ========================================================
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


    function escapeAttribute(
      value
    ) {

      return escapeHtml(
        value
      );

    }

  }
);
