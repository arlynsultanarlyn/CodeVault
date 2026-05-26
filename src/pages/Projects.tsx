import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { getProjects, deleteProject } from "../services/api";

const Projects: React.FC = () => {
  const router = useIonRouter();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [projects, setProjects] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("user")) router.push("/login", "root");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProjects();
        if (result.status === "success") {
          setProjects(result.data || []);
          setFiltered(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      projects.filter((p) =>
        (p.title + p.authors + p.category_name + p.batch_year)
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [search, projects]);

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
      alert("Something went wrong while deleting.");
      console.error("Delete error:", error);
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const base = "https://itservicesph.com/IT383/SULTAN/codevault";
    const cleanPath = filePath.startsWith("http")
      ? filePath
      : `${base}/${filePath.replace(/^\//, "")}`;
    const a = document.createElement("a");
    a.href = cleanPath;
    a.download = fileName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Layout activePage="projects">
      <div className="container-xxl flex-grow-1 container-p-y">
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

        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Project List</h5>
                  <input
                    type="text"
                    className="form-control form-control-sm w-auto"
                    placeholder="Search…"
                    style={{
                      minWidth: "200px",
                      backgroundColor: "#ffffff",
                      color: "#333333",
                      border: "1px solid #d1d5db",
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

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
                    <Icon name="folder" size={48} />
                    <h5 className="mt-3 text-muted">No projects yet</h5>
                    {user.role === "admin" && (
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
