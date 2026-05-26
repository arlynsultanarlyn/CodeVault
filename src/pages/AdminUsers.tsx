import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { getUsers, addUser, deleteUser } from "../services/api";

// const Icon = ({ name, size = 13 }: { name: string; size?: number }) => {
//   const paths: Record<string, React.ReactNode> = {
//     "user-plus": (
//       <>
//         <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//         <circle cx="8.5" cy="7" r="4" />
//         <line x1="20" y1="8" x2="20" y2="14" />
//         <line x1="23" y1="11" x2="17" y2="11" />
//       </>
//     ),
//     users: (
//       <>
//         <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//         <circle cx="9" cy="7" r="4" />
//         <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//         <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//       </>
//     ),
//     lock: (
//       <>
//         <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//         <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//       </>
//     ),
//     "trash-2": (
//       <>
//         <polyline points="3 6 5 6 21 6" />
//         <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//         <path d="M10 11v6" />
//         <path d="M14 11v6" />
//         <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//       </>
//     ),
//     plus: (
//       <>
//         <line x1="12" y1="5" x2="12" y2="19" />
//         <line x1="5" y1="12" x2="19" y2="12" />
//       </>
//     ),
//   };

//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       style={{ display: "inline-block", verticalAlign: "middle" }}
//     >
//       {paths[name] ?? null}
//     </svg>
//   );
// };

const AdminUsers: React.FC = () => {
  const router = useIonRouter();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login", "root");
      return;
    }
    if (user.role !== "admin") {
      router.push("/dashboard", "root");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers();
        if (res.status === "success") setUsers(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const roleBadge = (role: string) => {
    if (role === "admin") return "badge-danger";
    if (role === "teacher") return "badge-warning";
    return "badge-primary";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const res = await addUser(form);
      if (res.status === "success") {
        setSuccess("User added successfully!");
        setUsers((prev) => [...prev, res.data]);
        setForm({ full_name: "", email: "", password: "", role: "student" });
        setTimeout(() => {
          setModalOpen(false);
          setSuccess("");
        }, 1200);
      } else {
        setError(res.message || "Failed to add user.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      const res = await deleteUser(id);
      if (res.status === "success") {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(res.message || "Delete failed.");
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  return (
    <Layout activePage="users">
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Header */}
        <div className="row">
          <div className="col-12 grid-margin">
            <h4 className="mb-1">Manage Users</h4>
            <p className="text-muted">Add, view, and delete system users.</p>
          </div>
        </div>

        {/* Add User Button */}
        <div className="row">
          <div className="col-12 grid-margin">
            <button
              className="btn btn-primary"
              onClick={() => {
                setError("");
                setSuccess("");
                setModalOpen(true);
              }}
            >
              <Icon name="user-plus" size={14} /> Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <Icon name="users" size={16} /> All Users ({users.length})
                </h5>

                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id}>
                            <td>{i + 1}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    flexShrink: 0,
                                    background:
                                      "linear-gradient(135deg,#667eea,#764ba2)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: "#fff",
                                  }}
                                >
                                  {(u.full_name || "U").charAt(0).toUpperCase()}
                                </div>
                                {u.full_name}
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`badge ${roleBadge(u.role)}`}>
                                {u.role
                                  ? u.role.charAt(0).toUpperCase() +
                                    u.role.slice(1)
                                  : ""}
                              </span>
                            </td>
                            <td>
                              {String(u.id) === String(user.user_id) ? (
                                <span className="badge badge-secondary">
                                  <Icon name="lock" size={11} /> You
                                </span>
                              ) : (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() =>
                                    handleDelete(u.id, u.full_name)
                                  }
                                >
                                  <Icon name="trash-2" /> Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {modalOpen && (
          <div
            className="modal show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setModalOpen(false)}
          >
            <div
              className="modal-dialog"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <Icon name="user-plus" size={16} /> Add New User
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalOpen(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                  )}
                  {success && (
                    <div className="alert alert-success py-2">{success}</div>
                  )}
                  <form id="addUserForm" onSubmit={handleAddUser}>
                    <div className="form-group mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        placeholder="Juan Dela Cruz"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="juan@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Role</label>
                      <select
                        name="role"
                        className="form-control"
                        value={form.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </form>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="addUserForm"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    <Icon name="plus" size={14} />{" "}
                    {submitting ? "Adding…" : "Add User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;
