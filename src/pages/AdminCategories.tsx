import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import Layout from "../components/Layout";
import { getCategories, addCategory, deleteCategory } from "../services/api";

const AdminCategories: React.FC = () => {
  const router = useIonRouter();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        const res = await getCategories();
        if (res.status === "success") setCategories(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const res = await addCategory({ name });
      if (res.status === "success") {
        setCategories((prev) => [...prev, res.data]);
        setName("");
        setSuccess("Category added!");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(res.message || "Failed to add category.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    if (
      !window.confirm(
        `Delete category: ${catName}? Projects using this may be affected.`,
      )
    )
      return;
    try {
      const res = await deleteCategory(id);
      if (res.status === "success") {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.message || "Delete failed.");
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  return (
    <Layout activePage="categories">
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row">
          <div className="col-12 grid-margin">
            <h4 className="mb-1">Categories</h4>
            <p className="text-muted">Manage project categories.</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i
                    data-feather="plus-circle"
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "6px",
                    }}
                  ></i>
                  Add Category
                </h5>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2">{success}</div>
                )}

                <form onSubmit={handleAdd}>
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#333333",
                        border: "1px solid #d1d5db",
                      }}
                      placeholder="e.g. Web Development"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={submitting}
                  >
                    <i
                      data-feather="plus"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginRight: "4px",
                      }}
                    ></i>
                    {submitting ? "Adding…" : "+ Add Category"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i
                    data-feather="tag"
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "6px",
                    }}
                  ></i>
                  All Categories ({categories.length})
                </h5>

                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  </div>
                ) : categories.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Category Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat, i) => (
                          <tr key={cat.id}>
                            <td>{i + 1}</td>
                            <td>
                              <span className="badge badge-primary">
                                {cat.name}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(cat.id, cat.name)}
                              >
                                <i
                                  data-feather="trash-2"
                                  style={{ width: "13px", height: "13px" }}
                                ></i>{" "}
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i
                      data-feather="tag"
                      style={{ width: "48px", height: "48px", color: "#ccc" }}
                    ></i>
                    <p className="text-muted mt-3">No categories yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCategories;
