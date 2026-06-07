import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { getProjects, deleteProject, getCategories } from "../services/api";

const Projects: React.FC = () => {
  const router = useIonRouter();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [projects, setProjects] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("user")) router.push("/login", "root");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResult, categoryResult] = await Promise.all([
          getProjects(),
          getCategories(),
        ]);
        if (projectResult.status === "success") {
          const data = projectResult.data || [];
          setProjects(data);
          setFiltered(data);
        }
        if (categoryResult.status === "success") {
          setCategories(categoryResult.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      projects.filter((p) => {
        const matchesKeyword =
          !q ||
          (p.title + p.authors + p.tech_stack + p.category_name + p.batch_year)
            .toLowerCase()
            .includes(q);
        const matchesCategory =
          !selectedCategory || p.category_id == selectedCategory;
        const matchesYear =
          !selectedYear || String(p.batch_year).includes(selectedYear);
        return matchesKeyword && matchesCategory && matchesYear;
      }),
    );
  }, [search, selectedCategory, selectedYear, projects]);

  const handleClear = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedYear("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await deleteProject(id);
      if (res.status === "success") {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setFiltered((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Delete failed: " + (res.message || "Unknown error"));
      }
    } catch (error) {
      alert("Delete failed: " + error);
      console.error("Delete error:", error);
    }
  };

  // ← FIXED: correct path para sa uploads
  const handleDownload = (filePath: string, fileName: string) => {
    const base = "https://itservicesph.com/IT383/SULTAN/codevault";
    let cleanPath = "";

    if (filePath.startsWith("http")) {
      cleanPath = filePath;
    } else if (filePath.startsWith("uploads/")) {
      cleanPath = `${base}/${filePath}`;
    } else {
      cleanPath = `${base}/uploads/projects/${filePath}`;
    }

    const a = document.createElement("a");
    a.href = cleanPath;
    a.download = fileName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isSearching = search || selectedCategory || selectedYear;

  return (
    <Layout activePage="projects">
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* PAGE TITLE */}
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h4 className="mb-1">All Projects</h4>
                <p className="text-muted mb-0">
                  Browse and download submitted project files.
                </p>
              </div>
              {user.role === "admin" && (
                <button
                  className="btn btn-primary btn-sm mt-2 mt-md-0"
                  onClick={() => router.push("/projectsupload", "forward")}
                >
                  <Icon name="upload-cloud" size={14} /> Upload Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="row g-2 align-items-end">
                  <div className="col-md-5">
                    <label
                      className="form-label text-muted"
                      style={{ fontSize: ".75rem" }}
                    >
                      Keyword
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search by title, author, tech stack..."
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#333333",
                        border: "1px solid #d1d5db",
                      }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label
                      className="form-label text-muted"
                      style={{ fontSize: ".75rem" }}
                    >
                      Category
                    </label>
                    <select
                      className="form-control form-control-sm"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#333333",
                        border: "1px solid #d1d5db",
                      }}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label
                      className="form-label text-muted"
                      style={{ fontSize: ".75rem" }}
                    >
                      Year
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="e.g. 2024"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#333333",
                        border: "1px solid #d1d5db",
                      }}
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    />
                  </div>

                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-secondary btn-sm w-100"
                      onClick={handleClear}
                    >
                      <Icon name="x" size={13} /> Clear
                    </button>
                  </div>
                </div>

                {isSearching && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Showing <strong>{filtered.length}</strong> result(s)
                      {search && (
                        <>
                          {" "}
                          for "<strong>{search}</strong>"
                        </>
                      )}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS TABLE */}
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Project List</h5>

                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th>Authors</th>
                          <th>Category</th>
                          <th>Year</th>
                          <th>Date Added</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((project, i) => (
                          <tr key={project.id}>
                            <td>{i + 1}</td>
                            <td>
                              <button
                                className="fw-semibold text-dark border-0 bg-transparent p-0"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  router.push(
                                    `/projects/${project.id}`,
                                    "forward",
                                  )
                                }
                              >
                                {project.title || ""}
                              </button>
                              {project.abstract && (
                                <>
                                  <br />
                                  <small className="text-muted">
                                    {project.abstract.substring(0, 50)}…
                                  </small>
                                </>
                              )}
                            </td>
                            <td>{project.authors || "—"}</td>
                            <td>
                              <span className="badge badge-primary">
                                {project.category_name || "—"}
                              </span>
                            </td>
                            <td>{project.batch_year || "—"}</td>
                            <td>
                              <small>
                                {project.created_at
                                  ? new Date(
                                      project.created_at,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "—"}
                              </small>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-primary btn-sm me-1"
                                onClick={() =>
                                  router.push(
                                    `/projects/${project.id}`,
                                    "forward",
                                  )
                                }
                              >
                                <Icon name="eye" />
                              </button>
                              {project.doc_file && (
                                <button
                                  className="btn btn-outline-success btn-sm me-1"
                                  title="Download Documentation"
                                  onClick={() =>
                                    handleDownload(
                                      project.doc_file,
                                      `${project.title}_docs`,
                                    )
                                  }
                                >
                                  <Icon name="file-text" />
                                </button>
                              )}
                              {project.source_code_file && (
                                <button
                                  className="btn btn-outline-info btn-sm me-1"
                                  title="Download Source Code"
                                  onClick={() =>
                                    handleDownload(
                                      project.source_code_file,
                                      `${project.title}_source`,
                                    )
                                  }
                                >
                                  <Icon name="code" />
                                </button>
                              )}
                              {user.role === "admin" && (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(project.id)}
                                >
                                  <Icon name="trash-2" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <Icon name="search" size={48} />
                    <h5 className="mt-3 text-muted">
                      {isSearching ? "No projects found." : "No projects yet."}
                    </h5>
                    {user.role === "admin" && !isSearching && (
                      <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() =>
                          router.push("/projects/upload", "forward")
                        }
                      >
                        Upload First Project
                      </button>
                    )}
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

export default Projects;
