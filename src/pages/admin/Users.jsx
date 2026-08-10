import React, {
  useEffect,
  useState,
} from "react";

import {
  getUsers,
  updateUserStatus,
  deleteUser,
} from "../../services/api";

import "./Users.css";

function Users() {
  const [users, setUsers] =
    useState([]);

  const [searchText, setSearchText] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const roles = [
    "All",
    "Admin",
    "Editor",
    "Reporter",
  ];

  // ==================================================
  // LOAD USERS
  // ==================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getUsers();

      setUsers(
        response.users || []
      );
    } catch (error) {
      console.error(
        "Get users error:",
        error
      );

      setError(
        error.message ||
          "ಬಳಕೆದಾರರನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ==================================================
  // FILTER USERS
  // ==================================================

  const filteredUsers =
    users.filter((user) => {
      const search =
        searchText
          .trim()
          .toLowerCase();

      const name =
        user.name ||
        user.fullName ||
        "";

      const email =
        user.email || "";

      const role =
        user.role || "";

      const matchesSearch =
        !search ||
        name
          .toLowerCase()
          .includes(search) ||
        email
          .toLowerCase()
          .includes(search);

      const matchesRole =
        roleFilter === "All" ||
        role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });

  // ==================================================
  // CHANGE STATUS
  // ==================================================

  const handleStatusChange =
    async (user) => {
      const userId =
        user._id || user.id;

      const currentStatus =
        user.status || "Active";

      const newStatus =
        currentStatus ===
        "Active"
          ? "Inactive"
          : "Active";

      try {
        setError("");
        setSuccess("");

        await updateUserStatus(
          userId,
          newStatus
        );

        setSuccess(
          newStatus === "Active"
            ? "ಬಳಕೆದಾರರನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ."
            : "ಬಳಕೆದಾರರನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ."
        );

        await loadUsers();
      } catch (error) {
        console.error(
          "Update user status error:",
          error
        );

        setError(
          error.message ||
            "ಬಳಕೆದಾರರ ಸ್ಥಿತಿಯನ್ನು ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
        );
      }
    };

  // ==================================================
  // DELETE USER
  // ==================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "ಈ ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteUser(id);

      setSuccess(
        "ಬಳಕೆದಾರರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ."
      );

      await loadUsers();
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      setError(
        error.message ||
          "ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    }
  };

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const clearFilters = () => {
    setSearchText("");
    setRoleFilter("All");
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "kn-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="users-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            ಬಳಕೆದಾರರ ನಿರ್ವಹಣೆ
          </h1>

          <p>
            ಆಡಳಿತ ಬಳಕೆದಾರರು ಮತ್ತು
            ಸಿಬ್ಬಂದಿಯನ್ನು ನಿರ್ವಹಿಸಿ.
          </p>

        </div>

      </div>

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {success && (
        <div className="admin-success-message">
          {success}
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* ==================================================
          FILTERS
      ================================================== */}

      <section className="users-filters">

        <div className="users-filter-group">

          <label htmlFor="userSearch">
            ಹುಡುಕಿ
          </label>

          <input
            type="search"
            id="userSearch"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="ಹೆಸರು ಅಥವಾ ಇಮೇಲ್ ಹುಡುಕಿ..."
          />

        </div>

        <div className="users-filter-group">

          <label htmlFor="roleFilter">
            ಪಾತ್ರ
          </label>

          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
          >

            {roles.map(
              (role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role === "All"
                    ? "ಎಲ್ಲಾ ಪಾತ್ರಗಳು"
                    : role}
                </option>
              )
            )}

          </select>

        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={
            clearFilters
          }
        >
          Clear
        </button>

      </section>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="users-summary">

        <span>
          ತೋರಿಸಲಾಗುತ್ತಿದೆ:{" "}
          <strong>
            {
              filteredUsers.length
            }
          </strong>
        </span>

        <span>
          ಒಟ್ಟು ಬಳಕೆದಾರರು:{" "}
          <strong>
            {users.length}
          </strong>
        </span>

      </div>

      {/* ==================================================
          USERS TABLE
      ================================================== */}

      <section className="admin-table-card">

        <div className="admin-table-wrapper">

          <table className="admin-table users-table">

            <thead>

              <tr>
                <th>#</th>
                <th>ಹೆಸರು</th>
                <th>ಇಮೇಲ್</th>
                <th>ಪಾತ್ರ</th>
                <th>ಸ್ಥಿತಿ</th>
                <th>ಸೇರಿದ ದಿನಾಂಕ</th>
                <th>ಕ್ರಿಯೆಗಳು</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>

                  <td
                    colSpan="7"
                    className="admin-empty"
                  >
                    ಬಳಕೆದಾರರನ್ನು
                    ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
                  </td>

                </tr>
              ) : filteredUsers.length ===
                0 ? (
                <tr>

                  <td
                    colSpan="7"
                    className="admin-empty"
                  >
                    ಯಾವುದೇ ಬಳಕೆದಾರರು
                    ಕಂಡುಬಂದಿಲ್ಲ.
                  </td>

                </tr>
              ) : (
                filteredUsers.map(
                  (
                    user,
                    index
                  ) => {

                    const userId =
                      user._id ||
                      user.id;

                    const name =
                      user.name ||
                      user.fullName ||
                      "—";

                    const email =
                      user.email ||
                      "—";

                    const role =
                      user.role ||
                      "User";

                    const status =
                      user.status ||
                      "Active";

                    return (
                      <tr
                        key={
                          userId
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {name}
                          </strong>
                        </td>

                        <td>
                          {email}
                        </td>

                        <td>

                          <span className="user-role">
                            {role}
                          </span>

                        </td>

                        <td>

                          <button
                            type="button"
                            className={
                              status ===
                              "Active"
                                ? "status-active"
                                : "status-inactive"
                            }
                            onClick={() =>
                              handleStatusChange(
                                user
                              )
                            }
                          >

                            {status ===
                            "Active"
                              ? "ಸಕ್ರಿಯ"
                              : "ನಿಷ್ಕ್ರಿಯ"}

                          </button>

                        </td>

                        <td>
                          {formatDate(
                            user.createdAt ||
                              user.date
                          )}
                        </td>

                        <td>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(
                                userId
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}

export default Users;