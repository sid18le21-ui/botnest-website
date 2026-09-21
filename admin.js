document.addEventListener("DOMContentLoaded", () => {

  /*
   * ============================================================
   * BOTNEST ACADEMY — ADMIN DASHBOARD
   * ============================================================
   *
   * Authentication:
   * Admin email + password
   *
   * Backend:
   * Cloudflare Worker
   *       ↓
   * Google Apps Script
   *       ↓
   * Google Sheets
   *
   * ============================================================
   */


  /*
   * ============================================================
   * ELEMENTS
   * ============================================================
   */

  const loginSection =
    document.getElementById(
      "adminLoginSection"
    );


  const dashboardSection =
    document.getElementById(
      "adminDashboardSection"
    );


  const loginForm =
    document.getElementById(
      "adminLoginForm"
    );


  const loginError =
    document.getElementById(
      "adminLoginError"
    );


  const loginButton =
    document.getElementById(
      "adminLoginButton"
    );


  const loginText =
    document.getElementById(
      "adminLoginText"
    );


  const loginLoader =
    document.getElementById(
      "adminLoginLoader"
    );


  const logoutButton =
    document.getElementById(
      "adminLogoutButton"
    );


  const dashboardError =
    document.getElementById(
      "adminDashboardError"
    );


  const registrationList =
    document.getElementById(
      "registrationList"
    );


  const searchInput =
    document.getElementById(
      "registrationSearch"
    );


  const statusFilter =
    document.getElementById(
      "registrationStatusFilter"
    );


  const refreshButton =
    document.getElementById(
      "refreshRegistrations"
    );


  const detailPanel =
    document.getElementById(
      "adminDetailPanel"
    );


  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  let registrations = [];

  let selectedRegistrationId = null;


  /*
   * ============================================================
   * START
   * ============================================================
   */

  initialize();


  async function initialize() {

    const token =
      BotNest.getToken();


    const role =
      BotNest.getRole();


    /*
     * Only admin sessions are accepted.
     */

    if (
      token &&
      role === "admin"
    ) {

      await loadDashboard();

      return;
    }


    showLogin();

  }


  /*
   * ============================================================
   * ADMIN LOGIN
   * ============================================================
   */

  loginForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      hideLoginError();


      const email =
        document
          .getElementById(
            "adminEmail"
          )
          .value
          .trim()
          .toLowerCase();


      const password =
        document
          .getElementById(
            "adminPassword"
          )
          .value;


      if (!email) {

        showLoginError(
          "Please enter the admin email."
        );

        return;
      }


      if (!password) {

        showLoginError(
          "Please enter the admin password."
        );

        return;
      }


      setLoginLoading(true);


      try {

        const response =
          await BotNest.api(
            "adminLogin",
            {
              email,
              password
            }
          );


        /*
         * Store admin session.
         */

        BotNest.setSession(
          response
        );


        await loadDashboard();


      } catch (error) {

        console.error(error);

        showLoginError(
          error.message ||
          "Admin login failed."
        );

      } finally {

        setLoginLoading(false);

      }

    }
  );


  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  logoutButton.addEventListener(
    "click",
    async () => {

      logoutButton.disabled =
        true;


      try {

        await BotNest.api(
          "adminLogout"
        );

      } catch (error) {

        console.warn(
          error
        );

      } finally {

        BotNest.clearSession();

        window.location.href =
          "admin.html";

      }

    }
  );


  /*
   * ============================================================
   * LOAD DASHBOARD
   * ============================================================
   */

  async function loadDashboard() {

    hideDashboardError();


    try {

      const response =
        await BotNest.api(
          "adminGetRegistrations"
        );


      registrations =
        Array.isArray(
          response.registrations
        )
          ? response.registrations
          : [];


      showDashboard();


      renderStatistics();


      renderRegistrationList();


    } catch (error) {

      console.error(error);


      const message =
        error.message ||
        "Unable to load the admin dashboard.";


      /*
       * Session expired or invalid.
       */

      if (
        message
          .toLowerCase()
          .includes("session")
      ) {

        BotNest.clearSession();

        showLogin();

        showLoginError(
          "Your admin session has expired. Please login again."
        );

        return;
      }


      showDashboardError(
        message
      );

    }

  }


  /*
   * ============================================================
   * SHOW LOGIN
   * ============================================================
   */

  function showLogin() {

    loginSection.hidden =
      false;

    dashboardSection.hidden =
      true;

    logoutButton.hidden =
      true;

  }


  /*
   * ============================================================
   * SHOW DASHBOARD
   * ============================================================
   */

  function showDashboard() {

    loginSection.hidden =
      true;

    dashboardSection.hidden =
      false;

    logoutButton.hidden =
      false;

  }


  /*
   * ============================================================
   * STATISTICS
   * ============================================================
   */

  function renderStatistics() {

    const total =
      registrations.length;


    const newCount =
      registrations.filter(
        item =>
          item.status === "New"
      ).length;


    const contacted =
      registrations.filter(
        item =>
          item.status === "Contacted"
      ).length;


    const converted =
      registrations.filter(
        item =>
          item.status === "Converted"
      ).length;


    document.getElementById(
      "totalRegistrations"
    ).textContent =
      total;


    document.getElementById(
      "newRegistrations"
    ).textContent =
      newCount;


    document.getElementById(
      "contactedRegistrations"
    ).textContent =
      contacted;


    document.getElementById(
      "convertedRegistrations"
    ).textContent =
      converted;

  }


  /*
   * ============================================================
   * SEARCH / FILTER
   * ============================================================
   */

  searchInput.addEventListener(
    "input",
    renderRegistrationList
  );


  statusFilter.addEventListener(
    "change",
    renderRegistrationList
  );


  refreshButton.addEventListener(
    "click",
    async () => {

      refreshButton.disabled =
        true;

      refreshButton.textContent =
        "Refreshing...";


      try {

        await loadDashboard();


        /*
         * If a registration was already
         * selected, reload its details.
         */

        if (
          selectedRegistrationId
        ) {

          await openRegistration(
            selectedRegistrationId,
            false
          );

        }

      } finally {

        refreshButton.disabled =
          false;

        refreshButton.textContent =
          "↻ Refresh";

      }

    }
  );


  /*
   * ============================================================
   * REGISTRATION LIST
   * ============================================================
   */

  function renderRegistrationList() {

    const search =
      searchInput.value
        .trim()
        .toLowerCase();


    const selectedStatus =
      statusFilter.value;


    const filtered =
      registrations.filter(
        registration => {

          const searchable = [
            registration.registrationId,
            registration.studentName,
            registration.course,
            registration.level,
            registration.email,
            registration.phone,
            registration.school,
            registration.city
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          const matchesSearch =
            !search ||
            searchable.includes(
              search
            );


          const matchesStatus =
            !selectedStatus ||
            registration.status ===
              selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );


    if (!filtered.length) {

      registrationList.innerHTML = `

        <div class="empty-state">

          <div>
            ◌
          </div>

          <h3>
            No registrations found
          </h3>

          <p>
            Try changing the search or status filter.
          </p>

        </div>

      `;

      return;
    }


    registrationList.innerHTML =
      filtered
        .map(
          registration =>
            createRegistrationCard(
              registration
            )
        )
        .join("");


    /*
     * Add click events.
     */

    registrationList
      .querySelectorAll(
        "[data-registration-id]"
      )
      .forEach(
        element => {

          element.addEventListener(
            "click",
            () => {

              openRegistration(
                element.dataset.registrationId
              );

            }
          );

        }
      );


    /*
     * Highlight selected item.
     */

    if (
      selectedRegistrationId
    ) {

      const selected =
        registrationList.querySelector(
          `[data-registration-id="${CSS.escape(selectedRegistrationId)}"]`
        );


      if (selected) {

        selected.classList.add(
          "active"
        );

      }

    }

  }


  /*
   * ============================================================
   * REGISTRATION CARD
   * ============================================================
   */

  function createRegistrationCard(
    registration
  ) {

    const status =
      registration.status ||
      "New";


    const progress =
      registration.progressSummary ||
      registration.progress ||
      {};


    const progressPercentage =
      clamp(
        Number(
          progress.percentage ||
          progress.progressPercentage ||
          0
        )
      );


    const student =
      escapeHtml(
        registration.studentName ||
        "Unnamed Student"
      );


    const course =
      escapeHtml(
        registration.course ||
        "Course"
      );


    const level =
      escapeHtml(
        registration.level ||
        "Level"
      );


    const statusClass =
      getStatusClass(
        status
      );


    return `

      <button
        type="button"
        class="registration-item"
        data-registration-id="${escapeAttribute(
          registration.registrationId
        )}"
      >

        <div class="registration-item-top">

          <strong>
            ${student}
          </strong>

          <span class="status-badge ${statusClass}">
            ${escapeHtml(status)}
          </span>

        </div>


        <div class="registration-item-course">

          ${course}

          <span>
            ·
          </span>

          ${level}

        </div>


        <div class="registration-item-meta">

          <span>
            ${escapeHtml(
              registration.school ||
              "School not provided"
            )}
          </span>

          <span>
            ${escapeHtml(
              registration.city ||
              ""
            )}
          </span>

        </div>


        <div class="registration-item-bottom">

          <span>
            ${formatDate(
              registration.createdAt
            )}
          </span>

          <span>
            Progress:
            ${progressPercentage}%
          </span>

        </div>

      </button>

    `;

  }


  /*
   * ============================================================
   * OPEN REGISTRATION
   * ============================================================
   */

  async function openRegistration(
    registrationId,
    scroll = true
  ) {

    if (!registrationId) {
      return;
    }


    selectedRegistrationId =
      registrationId;


    renderRegistrationList();


    detailPanel.innerHTML = `

      <div class="admin-detail-loading">

        <div class="loading-orbit"></div>

        <h2>
          Loading student details...
        </h2>

        <p>
          Please wait.
        </p>

      </div>

    `;


    try {

      const response =
        await BotNest.api(
          "adminGetRegistrationDetails",
          {
            registrationId
          }
        );


      renderRegistrationDetails(
        response.registration,
        response.attendance || [],
        response.progress || []
      );


      if (scroll) {

        detailPanel.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }


    } catch (error) {

      console.error(error);


      showDashboardError(
        error.message ||
        "Unable to load registration details."
      );

    }

  }


  /*
   * ============================================================
   * RENDER DETAILS
   * ============================================================
   */

  function renderRegistrationDetails(
    registration,
    attendance,
    progress
  ) {

    if (!registration) {

      detailPanel.innerHTML = `

        <div class="admin-detail-empty">

          <h2>
            Registration not found
          </h2>

        </div>

      `;

      return;
    }


    const progressPercentage =
      calculateProgress(
        progress
      );


    const attendanceSummary =
      calculateAttendance(
        attendance
      );


    detailPanel.innerHTML = `

      <div class="admin-detail-content">


        <!-- ================================================
             DETAIL HEADER
             ================================================ -->

        <div class="detail-header">

          <div>

            <p class="eyebrow">
              REGISTRATION
            </p>

            <h2>
              ${escapeHtml(
                registration.studentName ||
                "Student"
              )}
            </h2>

            <p class="detail-registration-id">
              ${escapeHtml(
                registration.registrationId ||
                ""
              )}
            </p>

          </div>


          <div class="detail-status-control">

            <label>
              Registration Status
            </label>

            <select
              id="registrationStatus"
            >

              ${createStatusOptions(
                registration.status
              )}

            </select>

            <button
              type="button"
              id="saveRegistrationStatus"
              class="small-button primary-small-button"
            >
              Save Status
            </button>

          </div>

        </div>


        <!-- ================================================
             COURSE
             ================================================ -->

        <div class="detail-course-banner">

          <div>

            <span>
              PROGRAM
            </span>

            <strong>
              ${escapeHtml(
                registration.course ||
                ""
              )}
            </strong>

          </div>


          <div>

            <span>
              LEVEL
            </span>

            <strong>
              ${escapeHtml(
                registration.level ||
                ""
              )}
            </strong>

          </div>


          <div>

            <span>
              REGISTERED
            </span>

            <strong>
              ${formatDate(
                registration.createdAt
              )}
            </strong>

          </div>

        </div>


        <!-- ================================================
             STUDENT INFORMATION
             ================================================ -->

        <section class="detail-section">

          <div class="detail-section-heading">

            <div>

              <p class="eyebrow">
                STUDENT
              </p>

              <h3>
                Student Information
              </h3>

            </div>

          </div>


          <div class="detail-info-grid">

            ${detailInfo(
              "Student",
              registration.studentName
            )}

            ${detailInfo(
              "Age",
              registration.age
            )}

            ${detailInfo(
              "Grade / Class",
              registration.grade
            )}

            ${detailInfo(
              "School / College",
              registration.school
            )}

            ${detailInfo(
              "City",
              registration.city
            )}

            ${detailInfo(
              "Previous Experience",
              registration.previousExperience,
              true
            )}

            ${detailInfo(
              "Learning Goals",
              registration.learningGoals ||
              registration.goals,
              true
            )}

            ${detailInfo(
              "Additional Information",
              registration.anythingElse,
              true
            )}

          </div>

        </section>


        <!-- ================================================
             PARENT INFORMATION
             ================================================ -->

        <section class="detail-section">

          <div class="detail-section-heading">

            <div>

              <p class="eyebrow">
                CONTACT
              </p>

              <h3>
                Parent / Guardian
              </h3>

            </div>

          </div>


          <div class="detail-info-grid">

            ${detailInfo(
              "Parent / Guardian",
              registration.parentName
            )}

            ${detailInfo(
              "Relationship",
              registration.relationship
            )}

            ${detailInfo(
              "Phone",
              registration.phone
            )}

            ${detailInfo(
              "Email",
              registration.email
            )}

            ${detailInfo(
              "Preferred Date",
              registration.contactDate
            )}

            ${detailInfo(
              "Preferred Time",
              registration.contactTime
            )}

          </div>

        </section>


        <!-- ================================================
             PROGRESS SUMMARY
             ================================================ -->

        <section class="detail-section">

          <div class="detail-section-heading">

            <div>

              <p class="eyebrow">
                LEARNING
              </p>

              <h3>
                Course Progress
              </h3>

            </div>

            <strong class="detail-percentage">
              ${progressPercentage}%
            </strong>

          </div>


          <div class="large-progress-bar">

            <span
              style="width:${progressPercentage}%"
            ></span>

          </div>


          <div class="detail-summary-grid">

            <div>
              <span>
                Completed
              </span>

              <strong>
                ${progress.filter(
                  item =>
                    item.status ===
                    "Completed"
                ).length}
              </strong>
            </div>


            <div>
              <span>
                In Progress
              </span>

              <strong>
                ${progress.filter(
                  item =>
                    item.status ===
                    "In Progress"
                ).length}
              </strong>
            </div>


            <div>
              <span>
                Not Started
              </span>

              <strong>
                ${progress.filter(
                  item =>
                    item.status ===
                    "Not Started"
                ).length}
              </strong>
            </div>

          </div>


          <!-- Progress rows -->

          <div class="admin-edit-list">

            ${progress.length
              ? progress
                  .map(
                    item =>
                      createProgressRow(
                        item
                      )
                  )
                  .join("")
              : `
                <div class="empty-inline">
                  No progress topics have been created yet.
                </div>
              `
            }

          </div>


          <!-- Add progress -->

          <div class="admin-add-box">

            <h4>
              Add / Update Topic
            </h4>

            <div class="admin-form-grid">


              <div class="field">

                <label>
                  Topic Number
                </label>

                <input
                  type="number"
                  id="newProgressNumber"
                  min="1"
                  placeholder="1"
                >

              </div>


              <div class="field field-wide">

                <label>
                  Topic
                </label>

                <input
                  type="text"
                  id="newProgressTopic"
                  maxlength="200"
                  placeholder="Topic name"
                >

              </div>


              <div class="field">

                <label>
                  Status
                </label>

                <select
                  id="newProgressStatus"
                >

                  <option value="Not Started">
                    Not Started
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>


              <div class="field">

                <label>
                  Progress %
                </label>

                <input
                  type="number"
                  id="newProgressPercent"
                  min="0"
                  max="100"
                  value="0"
                >

              </div>


              <div class="field field-wide">

                <label>
                  Instructor Note
                </label>

                <input
                  type="text"
                  id="newProgressNote"
                  maxlength="1000"
                  placeholder="Optional internal note"
                >

              </div>


            </div>


            <button
              type="button"
              id="saveNewProgress"
              class="small-button primary-small-button"
            >
              Save Progress
            </button>

          </div>

        </section>


        <!-- ================================================
             ATTENDANCE
             ================================================ -->

        <section class="detail-section">

          <div class="detail-section-heading">

            <div>

              <p class="eyebrow">
                ATTENDANCE
              </p>

              <h3>
                Class Attendance
              </h3>

            </div>

          </div>


          <div class="detail-summary-grid">

            <div>
              <span>
                Attendance Rate
              </span>

              <strong>
                ${attendanceSummary.percentage}%
              </strong>
            </div>


            <div>
              <span>
                Present
              </span>

              <strong>
                ${attendanceSummary.present}
              </strong>
            </div>


            <div>
              <span>
                Absent
              </span>

              <strong>
                ${attendanceSummary.absent}
              </strong>
            </div>


            <div>
              <span>
                Late
              </span>

              <strong>
                ${attendanceSummary.late}
              </strong>
            </div>

          </div>


          <!-- Attendance rows -->

          <div class="admin-edit-list">

            ${attendance.length
              ? attendance
                  .map(
                    item =>
                      createAttendanceRow(
                        item
                      )
                  )
                  .join("")
              : `
                <div class="empty-inline">
                  No attendance records have been added yet.
                </div>
              `
            }

          </div>


          <!-- Add attendance -->

          <div class="admin-add-box">

            <h4>
              Add Attendance
            </h4>

            <div class="admin-form-grid">


              <div class="field">

                <label>
                  Class Number
                </label>

                <input
                  type="number"
                  id="newAttendanceClass"
                  min="1"
                  placeholder="1"
                >

              </div>


              <div class="field">

                <label>
                  Class Date
                </label>

                <input
                  type="date"
                  id="newAttendanceDate"
                >

              </div>


              <div class="field">

                <label>
                  Attendance
                </label>

                <select
                  id="newAttendanceStatus"
                >

                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                  <option value="Late">
                    Late
                  </option>

                </select>

              </div>


              <div class="field field-wide">

                <label>
                  Remarks
                </label>

                <input
                  type="text"
                  id="newAttendanceRemarks"
                  maxlength="1000"
                  placeholder="Optional remarks"
                >

              </div>

            </div>


            <button
              type="button"
              id="saveNewAttendance"
              class="small-button primary-small-button"
            >
              Save Attendance
            </button>

          </div>

        </section>

      </div>

    `;


    /*
     * Bind detail events.
     */

    bindDetailEvents(
      registration.registrationId
    );

  }


  /*
   * ============================================================
   * STATUS OPTIONS
   * ============================================================
   */

  function createStatusOptions(
    current
  ) {

    const statuses = [
      "New",
      "Contacted",
      "Follow-up",
      "Converted",
      "Not Interested"
    ];


    return statuses
      .map(
        status => `
          <option
            value="${escapeAttribute(status)}"
            ${status === current ? "selected" : ""}
          >
            ${escapeHtml(status)}
          </option>
        `
      )
      .join("");

  }


  /*
   * ============================================================
   * DETAIL EVENTS
   * ============================================================
   */

  function bindDetailEvents(
    registrationId
  ) {


    /*
     * Status
     */

    const statusButton =
      document.getElementById(
        "saveRegistrationStatus"
      );


    if (statusButton) {

      statusButton.addEventListener(
        "click",
        async () => {

          const status =
            document.getElementById(
              "registrationStatus"
            ).value;


          statusButton.disabled =
            true;


          statusButton.textContent =
            "Saving...";


          try {

            await BotNest.api(
              "adminUpdateStatus",
              {
                registrationId,
                status
              }
            );


            await loadDashboard();


            await openRegistration(
              registrationId,
              false
            );


          } catch (error) {

            showDashboardError(
              error.message ||
              "Unable to update registration status."
            );

          } finally {

            statusButton.disabled =
              false;

            statusButton.textContent =
              "Save Status";

          }

        }
      );

    }


    /*
     * Add progress
     */

    const progressButton =
      document.getElementById(
        "saveNewProgress"
      );


    if (progressButton) {

      progressButton.addEventListener(
        "click",
        async () => {

          const topicNumber =
            document.getElementById(
              "newProgressNumber"
            ).value;


          const topic =
            document.getElementById(
              "newProgressTopic"
            ).value.trim();


          const status =
            document.getElementById(
              "newProgressStatus"
            ).value;


          const progressPercent =
            document.getElementById(
              "newProgressPercent"
            ).value;


          const instructorNote =
            document.getElementById(
              "newProgressNote"
            ).value.trim();


          if (!topicNumber) {

            showDashboardError(
              "Please enter a topic number."
            );

            return;
          }


          if (!topic) {

            showDashboardError(
              "Please enter the topic name."
            );

            return;
          }


          progressButton.disabled =
            true;


          progressButton.textContent =
            "Saving...";


          try {

            await BotNest.api(
              "adminUpdateProgress",
              {

                registrationId,

                topicNumber:
                  Number(
                    topicNumber
                  ),

                topic,

                status,

                progressPercent:
                  Number(
                    progressPercent
                  ),

                instructorNote

              }
            );


            await loadDashboard();


            await openRegistration(
              registrationId,
              false
            );


          } catch (error) {

            showDashboardError(
              error.message ||
              "Unable to save progress."
            );

          } finally {

            progressButton.disabled =
              false;

            progressButton.textContent =
              "Save Progress";

          }

        }
      );

    }


    /*
     * Add attendance
     */

    const attendanceButton =
      document.getElementById(
        "saveNewAttendance"
      );


    if (attendanceButton) {

      attendanceButton.addEventListener(
        "click",
        async () => {

          const classNumber =
            document.getElementById(
              "newAttendanceClass"
            ).value;


          const classDate =
            document.getElementById(
              "newAttendanceDate"
            ).value;


          const attendance =
            document.getElementById(
              "newAttendanceStatus"
            ).value;


          const remarks =
            document.getElementById(
              "newAttendanceRemarks"
            ).value.trim();


          if (!classNumber) {

            showDashboardError(
              "Please enter the class number."
            );

            return;
          }


          if (!classDate) {

            showDashboardError(
              "Please select the class date."
            );

            return;
          }


          attendanceButton.disabled =
            true;


          attendanceButton.textContent =
            "Saving...";


          try {

            await BotNest.api(
              "adminUpdateAttendance",
              {

                registrationId,

                classNumber:
                  Number(
                    classNumber
                  ),

                classDate,

                attendance,

                remarks

              }
            );


            await loadDashboard();


            await openRegistration(
              registrationId,
              false
            );


          } catch (error) {

            showDashboardError(
              error.message ||
              "Unable to save attendance."
            );

          } finally {

            attendanceButton.disabled =
              false;

            attendanceButton.textContent =
              "Save Attendance";

          }

        }
      );

    }


    /*
     * Existing progress rows
     */

    detailPanel
      .querySelectorAll(
        "[data-save-progress]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            async () => {

              const row =
                button.closest(
                  ".admin-edit-row"
                );


              if (!row) {
                return;
              }


              const progressId =
                row.dataset.progressId;


              const topicNumber =
                row.querySelector(
                  "[data-progress-number]"
                ).value;


              const topic =
                row.querySelector(
                  "[data-progress-topic]"
                ).value.trim();


              const status =
                row.querySelector(
                  "[data-progress-status]"
                ).value;


              const progressPercent =
                row.querySelector(
                  "[data-progress-percent]"
                ).value;


              const instructorNote =
                row.querySelector(
                  "[data-progress-note]"
                ).value.trim();


              button.disabled =
                true;


              button.textContent =
                "Saving...";


              try {

                await BotNest.api(
                  "adminUpdateProgress",
                  {

                    registrationId,

                    progressId,

                    topicNumber:
                      Number(
                        topicNumber
                      ),

                    topic,

                    status,

                    progressPercent:
                      Number(
                        progressPercent
                      ),

                    instructorNote

                  }
                );


                await loadDashboard();


                await openRegistration(
                  registrationId,
                  false
                );


              } catch (error) {

                showDashboardError(
                  error.message ||
                  "Unable to update progress."
                );

              } finally {

                button.disabled =
                  false;

                button.textContent =
                  "Save";

              }

            }
          );

        }
      );


    /*
     * Existing attendance rows
     */

    detailPanel
      .querySelectorAll(
        "[data-save-attendance]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            async () => {

              const row =
                button.closest(
                  ".admin-edit-row"
                );


              if (!row) {
                return;
              }


              const attendanceId =
                row.dataset.attendanceId;


              const classNumber =
                row.querySelector(
                  "[data-attendance-class]"
                ).value;


              const classDate =
                row.querySelector(
                  "[data-attendance-date]"
                ).value;


              const attendance =
                row.querySelector(
                  "[data-attendance-status]"
                ).value;


              const remarks =
                row.querySelector(
                  "[data-attendance-remarks]"
                ).value.trim();


              button.disabled =
                true;


              button.textContent =
                "Saving...";


              try {

                await BotNest.api(
                  "adminUpdateAttendance",
                  {

                    registrationId,

                    attendanceId,

                    classNumber:
                      Number(
                        classNumber
                      ),

                    classDate,

                    attendance,

                    remarks

                  }
                );


                await loadDashboard();


                await openRegistration(
                  registrationId,
                  false
                );


              } catch (error) {

                showDashboardError(
                  error.message ||
                  "Unable to update attendance."
                );

              } finally {

                button.disabled =
                  false;

                button.textContent =
                  "Save";

              }

            }
          );

        }
      );

  }


  /*
   * ============================================================
   * PROGRESS ROW
   * ============================================================
   */

  function createProgressRow(
    item
  ) {

    return `

      <div
        class="admin-edit-row"
        data-progress-id="${escapeAttribute(
          item.progressId ||
          ""
        )}"
      >

        <div class="admin-edit-row-grid">


          <div class="field">

            <label>
              #
            </label>

            <input
              type="number"
              data-progress-number
              min="1"
              value="${escapeAttribute(
                item.topicNumber ||
                ""
              )}"
            >

          </div>


          <div class="field field-wide">

            <label>
              Topic
            </label>

            <input
              type="text"
              data-progress-topic
              maxlength="200"
              value="${escapeAttribute(
                item.topic ||
                ""
              )}"
            >

          </div>


          <div class="field">

            <label>
              Status
            </label>

            <select
              data-progress-status
            >

              ${createProgressStatusOptions(
                item.status
              )}

            </select>

          </div>


          <div class="field">

            <label>
              %
            </label>

            <input
              type="number"
              data-progress-percent
              min="0"
              max="100"
              value="${escapeAttribute(
                item.progressPercent ??
                0
              )}"
            >

          </div>


          <div class="field field-wide">

            <label>
              Instructor Note
            </label>

            <input
              type="text"
              data-progress-note
              maxlength="1000"
              value="${escapeAttribute(
                item.instructorNote ||
                ""
              )}"
            >

          </div>


          <div class="admin-row-action">

            <button
              type="button"
              class="small-button primary-small-button"
              data-save-progress
            >
              Save
            </button>

          </div>


        </div>

      </div>

    `;

  }


  /*
   * ============================================================
   * PROGRESS STATUS OPTIONS
   * ============================================================
   */

  function createProgressStatusOptions(
    current
  ) {

    const statuses = [
      "Not Started",
      "In Progress",
      "Completed"
    ];


    return statuses
      .map(
        status => `

          <option
            value="${escapeAttribute(status)}"
            ${status === current ? "selected" : ""}
          >
            ${escapeHtml(status)}
          </option>

        `
      )
      .join("");

  }


  /*
   * ============================================================
   * ATTENDANCE ROW
   * ============================================================
   */

  function createAttendanceRow(
    item
  ) {

    return `

      <div
        class="admin-edit-row"
        data-attendance-id="${escapeAttribute(
          item.attendanceId ||
          ""
        )}"
      >

        <div class="admin-edit-row-grid">


          <div class="field">

            <label>
              Class #
            </label>

            <input
              type="number"
              data-attendance-class
              min="1"
              value="${escapeAttribute(
                item.classNumber ||
                ""
              )}"
            >

          </div>


          <div class="field">

            <label>
              Date
            </label>

            <input
              type="date"
              data-attendance-date
              value="${escapeAttribute(
                normalizeDateInput(
                  item.classDate
                )
              )}"
            >

          </div>


          <div class="field">

            <label>
              Attendance
            </label>

            <select
              data-attendance-status
            >

              ${createAttendanceOptions(
                item.attendance
              )}

            </select>

          </div>


          <div class="field field-wide">

            <label>
              Remarks
            </label>

            <input
              type="text"
              data-attendance-remarks
              maxlength="1000"
              value="${escapeAttribute(
                item.remarks ||
                ""
              )}"
            >

          </div>


          <div class="admin-row-action">

            <button
              type="button"
              class="small-button primary-small-button"
              data-save-attendance
            >
              Save
            </button>

          </div>


        </div>

      </div>

    `;

  }


  /*
   * ============================================================
   * ATTENDANCE OPTIONS
   * ============================================================
   */

  function createAttendanceOptions(
    current
  ) {

    const values = [
      "Present",
      "Absent",
      "Late"
    ];


    return values
      .map(
        value => `

          <option
            value="${escapeAttribute(value)}"
            ${value === current ? "selected" : ""}
          >
            ${escapeHtml(value)}
          </option>

        `
      )
      .join("");

  }


  /*
   * ============================================================
   * DETAIL INFO
   * ============================================================
   */

  function detailInfo(
    label,
    value,
    fullWidth = false
  ) {

    return `

      <div
        class="detail-info ${fullWidth ? "detail-info-full" : ""}"
      >

        <span>
          ${escapeHtml(label)}
        </span>

        <strong>
          ${escapeHtml(
            value ||
            "Not provided"
          )}
        </strong>

      </div>

    `;

  }


  /*
   * ============================================================
   * PROGRESS CALCULATION
   * ============================================================
   */

  function calculateProgress(
    progress
  ) {

    if (
      !progress ||
      !progress.length
    ) {

      return 0;
    }


    const total =
      progress.reduce(
        (sum, item) =>
          sum +
          Number(
            item.progressPercent ||
            0
          ),
        0
      );


    return Math.round(
      total /
      progress.length
    );

  }


  /*
   * ============================================================
   * ATTENDANCE CALCULATION
   * ============================================================
   */

  function calculateAttendance(
    attendance
  ) {

    const result = {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0
    };


    if (
      !attendance ||
      !attendance.length
    ) {

      return result;
    }


    result.total =
      attendance.length;


    attendance.forEach(
      item => {

        if (
          item.attendance ===
          "Present"
        ) {

          result.present++;

        } else if (
          item.attendance ===
          "Absent"
        ) {

          result.absent++;

        } else if (
          item.attendance ===
          "Late"
        ) {

          result.late++;

        }

      }
    );


    result.percentage =
      Math.round(
        (
          (
            result.present +
            result.late
          ) /
          result.total
        ) *
        100
      );


    return result;

  }


  /*
   * ============================================================
   * ERROR HELPERS
   * ============================================================
   */

  function showLoginError(
    message
  ) {

    loginError.textContent =
      message;

    loginError.hidden =
      false;

  }


  function hideLoginError() {

    loginError.hidden =
      true;

    loginError.textContent =
      "";

  }


  function showDashboardError(
    message
  ) {

    dashboardError.textContent =
      message;

    dashboardError.hidden =
      false;


    dashboardError.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  function hideDashboardError() {

    dashboardError.hidden =
      true;

    dashboardError.textContent =
      "";

  }


  /*
   * ============================================================
   * LOGIN LOADING
   * ============================================================
   */

  function setLoginLoading(
    loading
  ) {

    loginButton.disabled =
      loading;


    loginText.hidden =
      loading;


    loginLoader.hidden =
      !loading;

  }


  /*
   * ============================================================
   * STATUS CLASS
   * ============================================================
   */

  function getStatusClass(
    status
  ) {

    switch (
      status
    ) {

      case "Converted":
        return "status-success";

      case "Contacted":
        return "status-info";

      case "Follow-up":
        return "status-warning";

      case "Not Interested":
        return "status-danger";

      default:
        return "status-new";

    }

  }


  /*
   * ============================================================
   * DATE FORMAT
   * ============================================================
   */

  function formatDate(
    value
  ) {

    if (!value) {
      return "—";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return String(
        value
      );

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  }


  /*
   * ============================================================
   * DATE INPUT NORMALIZATION
   * ============================================================
   */

  function normalizeDateInput(
    value
  ) {

    if (!value) {
      return "";
    }


    const string =
      String(value);


    /*
     * Already YYYY-MM-DD
     */

    if (
      /^\d{4}-\d{2}-\d{2}$/
        .test(string)
    ) {

      return string;

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "";

    }


    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${year}-${month}-${day}`;

  }


  /*
   * ============================================================
   * NUMBER CLAMP
   * ============================================================
   */

  function clamp(
    value
  ) {

    return Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );

  }


  /*
   * ============================================================
   * HTML ESCAPING
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


  function escapeAttribute(
    value
  ) {

    return escapeHtml(
      value
    );

  }

});
