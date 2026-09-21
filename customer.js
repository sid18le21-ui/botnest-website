document.addEventListener("DOMContentLoaded", () => {

  const loading =
    document.getElementById(
      "dashboardLoading"
    );

  const errorBox =
    document.getElementById(
      "dashboardError"
    );

  const errorMessage =
    document.getElementById(
      "dashboardErrorMessage"
    );

  const content =
    document.getElementById(
      "dashboardContent"
    );

  const logoutButton =
    document.getElementById(
      "logoutButton"
    );


  /*
   * Dashboard data
   */

  let dashboardData = null;


  /*
   * Require a session.
   */

  const token =
    window.BotNest &&
    BotNest.getToken();


  if (!token) {

    window.location.href =
      "login.html";

    return;
  }


  /*
   * Logout
   */

  logoutButton.addEventListener(
    "click",
    async () => {

      logoutButton.disabled =
        true;

      try {

        await BotNest.api(
          "customerLogout"
        );

      } catch (error) {

        console.warn(
          "Logout request failed:",
          error
        );

      } finally {

        BotNest.clearSession();

        window.location.href =
          "login.html";

      }

    }
  );


  /*
   * Load dashboard
   */

  loadDashboard();


  async function loadDashboard() {

    try {

      const response =
        await BotNest.api(
          "customerGetDashboard"
        );


      dashboardData =
        response;


      renderDashboard(
        dashboardData
      );


      loading.hidden =
        true;

      errorBox.hidden =
        true;

      content.hidden =
        false;


    } catch (error) {

      console.error(error);

      loading.hidden =
        true;

      content.hidden =
        true;

      errorBox.hidden =
        false;

      errorMessage.textContent =
        error.message ||
        "Your session may have expired. Please login again.";

    }

  }


  /*
   * Render everything
   */

  function renderDashboard(data) {

    const account =
      data.account || {};

    const registrations =
      Array.isArray(
        data.registrations
      )
        ? data.registrations
        : [];


    /*
     * Account
     */

    const fullName =
      [
        account.firstName,
        account.lastName
      ]
        .filter(Boolean)
        .join(" ") ||
      "Customer";


    document.getElementById(
      "customerName"
    ).textContent =
      account.firstName ||
      "Customer";


    document.getElementById(
      "accountName"
    ).textContent =
      fullName;


    document.getElementById(
      "accountEmail"
    ).textContent =
      account.email ||
      "—";


    document.getElementById(
      "accountPhone"
    ).textContent =
      account.phone ||
      "—";


    /*
     * Stats
     */

    const uniqueStudents =
      new Set(
        registrations.map(
          registration =>
            registration.studentName
        )
      );


    const completedEnrollments =
      registrations.filter(
        registration =>
          String(
            registration.status || ""
          ).toLowerCase() ===
          "completed"
      ).length;


    const totalProgress =
      registrations.reduce(
        (
          total,
          registration
        ) => {

          return total +
            Number(
              registration.progress &&
              registration.progress.percentage
                ? registration.progress.percentage
                : 0
            );

        },
        0
      );


    const averageProgress =
      registrations.length
        ? Math.round(
            totalProgress /
            registrations.length
          )
        : 0;


    document.getElementById(
      "studentCount"
    ).textContent =
      uniqueStudents.size;


    document.getElementById(
      "courseCount"
    ).textContent =
      registrations.length;


    document.getElementById(
      "completedCount"
    ).textContent =
      completedEnrollments;


    document.getElementById(
      "averageProgress"
    ).textContent =
      `${averageProgress}%`;


    /*
     * Students
     */

    renderStudents(
      registrations
    );

  }


  /*
   * Render registrations
   */

  function renderStudents(
    registrations
  ) {

    const container =
      document.getElementById(
        "studentsContainer"
      );

    const empty =
      document.getElementById(
        "noStudents"
      );


    container.innerHTML =
      "";


    if (!registrations.length) {

      container.hidden =
        true;

      empty.hidden =
        false;

      return;
    }


    container.hidden =
      false;

    empty.hidden =
      true;


    registrations.forEach(
      registration => {

        container.appendChild(
          createStudentCard(
            registration
          )
        );

      }
    );

  }


  /*
   * Student card
   */

  function createStudentCard(
    registration
  ) {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "student-dashboard-card reveal";


    const progress =
      registration.progress ||
      {};


    const attendance =
      registration.attendance ||
      {};


    const topics =
      Array.isArray(
        progress.topics
      )
        ? progress.topics
        : [];


    const attendanceRecords =
      Array.isArray(
        attendance.records
      )
        ? attendance.records
        : [];


    const progressPercentage =
      clamp(
        Number(
          progress.percentage || 0
        ),
        0,
        100
      );


    const attendancePercentage =
      clamp(
        Number(
          attendance.percentage || 0
        ),
        0,
        100
      );


    const status =
      registration.status ||
      "New";


    card.innerHTML = `

      <div class="student-card-top">

        <div>

          <span class="student-card-label">
            STUDENT
          </span>

          <h3>
            ${escapeHtml(
              registration.studentName ||
              "Student"
            )}
          </h3>

        </div>

        <span class="status-badge">
          ${escapeHtml(status)}
        </span>

      </div>


      <div class="student-course">

        <strong>
          ${escapeHtml(
            registration.course ||
            "Course"
          )}
        </strong>

        <span>
          ${escapeHtml(
            registration.level ||
            "Level"
          )}
        </span>

      </div>


      <div class="student-card-progress">

        <div class="metric-heading">

          <span>
            Course Progress
          </span>

          <strong>
            ${progressPercentage}%
          </strong>

        </div>

        <div class="progress-track">

          <div
            class="progress-fill"
            style="width:${progressPercentage}%"
          ></div>

        </div>

        <div class="progress-meta">

          <span>
            ${Number(progress.completed || 0)}
            completed
          </span>

          <span>
            ${Number(progress.total || 0)}
            topics
          </span>

        </div>

      </div>


      <div class="student-card-attendance">

        <div class="metric-heading">

          <span>
            Attendance
          </span>

          <strong>
            ${attendancePercentage}%
          </strong>

        </div>


        <div class="attendance-stats">

          <div class="attendance-stat present">
            <strong>
              ${Number(
                attendance.present || 0
              )}
            </strong>
            <span>Present</span>
          </div>


          <div class="attendance-stat late">
            <strong>
              ${Number(
                attendance.late || 0
              )}
            </strong>
            <span>Late</span>
          </div>


          <div class="attendance-stat absent">
            <strong>
              ${Number(
                attendance.absent || 0
              )}
            </strong>
            <span>Absent</span>
          </div>


          <div class="attendance-stat total">
            <strong>
              ${Number(
                attendance.total || 0
              )}
            </strong>
            <span>Total</span>
          </div>

        </div>

      </div>


      <div class="student-card-details">

        <details>

          <summary>
            View Topic Progress
          </summary>

          <div class="topic-list">

            ${
              topics.length
                ? topics
                    .map(
                      topic =>
                        renderTopic(
                          topic
                        )
                    )
                    .join("")
                : `
                  <div class="empty-inline">
                    Progress has not been
                    updated yet.
                  </div>
                `
            }

          </div>

        </details>


        <details>

          <summary>
            View Attendance
          </summary>

          <div class="attendance-table-wrap">

            ${
              attendanceRecords.length
                ? renderAttendanceTable(
                    attendanceRecords
                  )
                : `
                  <div class="empty-inline">
                    No classes have been
                    recorded yet.
                  </div>
                `
            }

          </div>

        </details>

      </div>


      <div class="student-card-footer">

        <div>

          <span>
            Registration ID
          </span>

          <strong>
            ${escapeHtml(
              registration.registrationId ||
              "—"
            )}
          </strong>

        </div>

        <div>

          <span>
            Registered
          </span>

          <strong>
            ${escapeHtml(
              formatDate(
                registration.createdAt
              )
            )}
          </strong>

        </div>

      </div>

    `;


    return card;
  }


  /*
   * Topic row
   */

  function renderTopic(topic) {

    const percentage =
      clamp(
        Number(
          topic.progressPercent || 0
        ),
        0,
        100
      );


    let icon =
      "○";


    if (
      String(
        topic.status || ""
      ) === "Completed"
    ) {

      icon =
        "✓";

    } else if (
      String(
        topic.status || ""
      ) === "In Progress"
    ) {

      icon =
        "→";

    }


    return `

      <div class="topic-row">

        <div class="topic-icon">
          ${icon}
        </div>

        <div class="topic-info">

          <strong>
            ${escapeHtml(
              topic.topic ||
              "Topic"
            )}
          </strong>

          <span>
            ${escapeHtml(
              topic.status ||
              "Not Started"
            )}
          </span>

        </div>

        <div class="topic-percent">
          ${percentage}%
        </div>

      </div>

    `;

  }


  /*
   * Attendance table
   */

  function renderAttendanceTable(
    records
  ) {

    return `

      <table class="attendance-table">

        <thead>

          <tr>
            <th>Class</th>
            <th>Date</th>
            <th>Attendance</th>
            <th>Remarks</th>
          </tr>

        </thead>

        <tbody>

          ${
            records
              .map(
                record => `

                  <tr>

                    <td>
                      ${escapeHtml(
                        String(
                          record.classNumber ||
                          "—"
                        )
                      )}
                    </td>

                    <td>
                      ${escapeHtml(
                        formatDate(
                          record.classDate
                        )
                      )}
                    </td>

                    <td>

                      <span
                        class="attendance-pill ${attendanceClass(
                          record.attendance
                        )}"
                      >
                        ${escapeHtml(
                          record.attendance ||
                          "—"
                        )}
                      </span>

                    </td>

                    <td>
                      ${escapeHtml(
                        record.remarks ||
                        "—"
                      )}
                    </td>

                  </tr>

                `
              )
              .join("")
          }

        </tbody>

      </table>

    `;

  }


  /*
   * Helpers
   */

  function attendanceClass(
    value
  ) {

    const normalized =
      String(value || "")
        .toLowerCase();


    if (
      normalized === "present"
    ) {

      return "attendance-present";

    }


    if (
      normalized === "late"
    ) {

      return "attendance-late";

    }


    if (
      normalized === "absent"
    ) {

      return "attendance-absent";

    }


    return "";

  }


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

      return String(value);

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


  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(
      Math.max(
        value,
        min
      ),
      max
    );

  }


  function escapeHtml(
    value
  ) {

    return String(
      value ?? ""
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }

});
