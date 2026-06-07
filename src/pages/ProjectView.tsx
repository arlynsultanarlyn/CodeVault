import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getProject,
  deleteProject,
  incrementViewCount,
  getRelatedProjects,
  getPopularProjects,
} from "../services/api";

const ProjectView: React.FC = () => {
  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("user")) router.push("/login", "root");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProject(Number(id));
        if (result.status === "success") {
          setProject(result.data);
          await incrementViewCount(Number(id));

          // Fetch recommendations
          const [relatedResult, popularResult] = await Promise.all([
            getRelatedProjects(Number(id), result.data.category_id),
            getPopularProjects(),
          ]);
          if (relatedResult.status === "success")
            setRelated(relatedResult.data || []);
          if (popularResult.status === "success")
            setPopular(popularResult.data || []);
        } else {
          setError(result.message || "Project not found.");
        }
      } catch {
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this project permanently?")) return;
    try {
      await deleteProject(Number(id));
      router.push("/projects", "back");
    } catch {
      alert("Delete failed.");
    }
  };

  const handleDownload = async (type: "documentation" | "source") => {
    try {
      const url = `https://itservicesph.com/IT383/SULTAN/codevault/index.php/projects/download/${id}/${type}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download =
        type === "documentation" ? "documentation.pdf" : "source_code.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Download failed. Please try again.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <Layout activePage="projects">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </Layout>
    );

  if (error || !project)
    return (
      <Layout activePage="projects">
        <div className="alert alert-danger m-4">
          {error || "Project not found."}
        </div>
      </Layout>
    );

  const techTags = project.tech_stack
    ? project.tech_stack
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <Layout activePage="projects">
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button
                className="border-0 bg-transparent p-0 text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/projects", "back")}
              >
                Projects
              </button>
            </li>
            <li className="breadcrumb-item active">
              {project.title?.substring(0, 40)}
              {project.title?.length > 40 ? "…" : ""}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* MAIN CARD */}
          <div className="col-lg-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="icon-box me-3"
                    style={{
                      width: "56px",
                      height: "56px",
                      background: "#f4f7fd",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      data-feather="folder"
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "#6571ff",
                      }}
                    ></i>
                  </div>
                  <div>
                    <h4 className="mb-1">{project.title || ""}</h4>
                    <span className="badge badge-primary">
                      {project.category_name || "Uncategorized"}
                    </span>
                    {project.batch_year && (
                      <span className="badge badge-secondary ms-1">
                        {project.batch_year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Authors */}
                {project.authors && (
                  <>
                    <h6 className="text-muted mb-1">Authors</h6>
                    <p className="mb-3">
                      <i
                        data-feather="users"
                        style={{
                          width: "14px",
                          height: "14px",
                          marginRight: "4px",
                          color: "#6571ff",
                        }}
                      ></i>
                      {project.authors}
                    </p>
                  </>
                )}

                {/* Tech Stack */}
                {techTags.length > 0 && (
                  <>
                    <h6 className="text-muted mb-2">Tech Stack</h6>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {techTags.map((tech: string) => (
                        <span
                          key={tech}
                          className="badge badge-outline-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Abstract */}
                <h6 className="text-muted mb-2">Abstract</h6>
                {project.abstract ? (
                  <p className="mb-4" style={{ whiteSpace: "pre-line" }}>
                    {project.abstract}
                  </p>
                ) : (
                  <p className="text-muted mb-4">
                    <em>No description provided.</em>
                  </p>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-2 flex-wrap align-items-center">
                  {project.doc_file ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDownload("documentation")}
                    >
                      <i
                        data-feather="file-text"
                        style={{
                          width: "14px",
                          height: "14px",
                          marginRight: "5px",
                        }}
                      ></i>
                      Download Documentation
                    </button>
                  ) : (
                    <button className="btn btn-primary" disabled>
                      No Documentation
                    </button>
                  )}

                  {project.source_code_file ? (
                    <button
                      className="btn btn-success"
                      onClick={() => handleDownload("source")}
                    >
                      <i
                        data-feather="code"
                        style={{
                          width: "14px",
                          height: "14px",
                          marginRight: "5px",
                        }}
                      ></i>
                      Download Source Code
                    </button>
                  ) : (
                    <button className="btn btn-success" disabled>
                      No Source Code
                    </button>
                  )}

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => router.push("/projects", "back")}
                  >
                    <i
                      data-feather="arrow-left"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginRight: "5px",
                      }}
                    ></i>
                    Back to Projects
                  </button>

                  {user.role === "admin" && (
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleDelete}
                    >
                      <i
                        data-feather="trash-2"
                        style={{
                          width: "14px",
                          height: "14px",
                          marginRight: "5px",
                        }}
                      ></i>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-lg-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Project Details</h6>
                <ul className="list-unstyled mb-0">
                  {[
                    { label: "Project ID", value: `#${project.id}` },
                    {
                      label: "Category",
                      value: (
                        <span className="badge badge-primary">
                          {project.category_name || "—"}
                        </span>
                      ),
                    },
                    { label: "Batch Year", value: project.batch_year || "—" },
                    {
                      label: "Uploaded By",
                      value: project.uploaded_by_name || "—",
                    },
                    {
                      label: "Date Added",
                      value: project.created_at
                        ? new Date(project.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "—",
                    },
                    {
                      label: "Documentation",
                      value: project.doc_file ? (
                        <span className="badge badge-success">Available</span>
                      ) : (
                        <span className="badge badge-secondary">
                          Not Uploaded
                        </span>
                      ),
                    },
                    {
                      label: "Source Code",
                      value: project.source_code_file ? (
                        <span className="badge badge-success">Available</span>
                      ) : (
                        <span className="badge badge-secondary">
                          Not Uploaded
                        </span>
                      ),
                    },
                    {
                      label: "Views",
                      value: (
                        <span className="text-dark">
                          <i
                            data-feather="eye"
                            style={{
                              width: "14px",
                              height: "14px",
                              marginRight: "4px",
                              color: "#6571ff",
                            }}
                          ></i>
                          {project.view_count ?? 0} views
                        </span>
                      ),
                    },
                  ].map(({ label, value }) => (
                    <li key={label} className="mb-3">
                      <small
                        className="text-muted d-block text-uppercase"
                        style={{ fontSize: ".72rem", letterSpacing: ".07em" }}
                      >
                        {label}
                      </small>
                      <span className="text-dark">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RECOMMENDER SYSTEM ← BAGONG DAGDAG ===== */}

        {/* You Might Also Like */}
        {related.length > 0 && (
          <div className="row mt-2">
            <div className="col-12">
              <h5 className="mb-3">
                <i
                  data-feather="thumbs-up"
                  style={{
                    width: "16px",
                    height: "16px",
                    marginRight: "6px",
                    color: "#6571ff",
                  }}
                ></i>
                You Might Also Like
              </h5>
            </div>
            {related.map((p) => (
              <div key={p.id} className="col-md-3 grid-margin">
                <div
                  className="card h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/projects/${p.id}`, "forward")}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <i
                        data-feather="folder"
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#6571ff",
                          marginRight: "8px",
                        }}
                      ></i>
                      <span className="badge badge-primary">
                        {p.category_name || "—"}
                      </span>
                    </div>
                    <h6 className="mb-1" style={{ fontSize: ".9rem" }}>
                      {p.title?.substring(0, 40)}
                      {p.title?.length > 40 ? "…" : ""}
                    </h6>
                    <small className="text-muted d-block mb-2">
                      {p.authors || "—"}
                    </small>
                    <small className="text-muted">
                      <i
                        data-feather="eye"
                        style={{
                          width: "12px",
                          height: "12px",
                          marginRight: "3px",
                        }}
                      ></i>
                      {p.view_count ?? 0} views
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Most Popular */}
        {popular.length > 0 && (
          <div className="row mt-2">
            <div className="col-12">
              <h5 className="mb-3">
                <i
                  data-feather="trending-up"
                  style={{
                    width: "16px",
                    height: "16px",
                    marginRight: "6px",
                    color: "#6571ff",
                  }}
                ></i>
                Most Popular Projects
              </h5>
            </div>
            {popular.map((p) => (
              <div key={p.id} className="col-md-3 grid-margin">
                <div
                  className="card h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/projects/${p.id}`, "forward")}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <i
                        data-feather="folder"
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#6571ff",
                          marginRight: "8px",
                        }}
                      ></i>
                      <span className="badge badge-primary">
                        {p.category_name || "—"}
                      </span>
                    </div>
                    <h6 className="mb-1" style={{ fontSize: ".9rem" }}>
                      {p.title?.substring(0, 40)}
                      {p.title?.length > 40 ? "…" : ""}
                    </h6>
                    <small className="text-muted d-block mb-2">
                      {p.authors || "—"}
                    </small>
                    <small className="text-muted">
                      <i
                        data-feather="eye"
                        style={{
                          width: "12px",
                          height: "12px",
                          marginRight: "3px",
                        }}
                      ></i>
                      {p.view_count ?? 0} views
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectView;
