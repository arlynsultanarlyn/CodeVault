import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import Layout from "../components/Layout";
import { getCategories, uploadProject } from "../services/api";

const inputStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#333333",
  border: "1px solid #d1d5db",
};

const ProjectUpload: React.FC = () => {
  const router = useIonRouter();
  let user: any = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    authors: "",
    batch_year: new Date().getFullYear().toString(),
    category_id: "",
    tech_stack: "",
    description: "",
    abstract: "",
  });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [srcFile, setSrcFile] = useState<File | null>(null);

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
    getCategories().then((res) => {
      if (res.status === "success") setCategories(res.data || []);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("user_id", String(user.user_id));
      formData.append("title", form.title);
      formData.append("authors", form.authors);
      formData.append("batch_year", form.batch_year);
      formData.append("category_id", form.category_id);
      formData.append("tech_stack", form.tech_stack);
      formData.append("description", form.description);
      formData.append("abstract", form.abstract);

      if (docFile) formData.append("doc_file", docFile);
      if (srcFile) formData.append("source_code_file", srcFile);

      const result = await uploadProject(formData);
      if (result.status === "success") {
        setSuccess("Project uploaded successfully!");
        setTimeout(() => router.push("/projects", "back"), 1500);
      } else {
        setError(result.message || "Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout activePage="upload">
      <div className="container-xxl flex-grow-1 container-p-y">
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
            <li className="breadcrumb-item active">Upload</li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-10 col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Upload Project</h4>
                <p className="card-description text-muted">
                  Add a new project for students to access and download.
                </p>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Project Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        style={inputStyle}
                        placeholder="e.g. AI-Based Plant Disease Detection"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Authors <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="authors"
                        className="form-control"
                        style={inputStyle}
                        placeholder="e.g. Juan Dela Cruz, Maria Santos"
                        value={form.authors}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Batch Year <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="batch_year"
                        className="form-control"
                        style={inputStyle}
                        placeholder="e.g. 2025"
                        min="2000"
                        max="2099"
                        value={form.batch_year}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Category</label>
                      <select
                        name="category_id"
                        className="form-control"
                        style={inputStyle}
                        value={form.category_id}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Tech Stack</label>
                      <input
                        type="text"
                        name="tech_stack"
                        className="form-control"
                        style={inputStyle}
                        placeholder="e.g. PHP, MySQL, Bootstrap"
                        value={form.tech_stack}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        style={inputStyle}
                        rows={3}
                        placeholder="Brief overview of the project..."
                        value={form.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Abstract</label>
                      <textarea
                        name="abstract"
                        className="form-control"
                        style={inputStyle}
                        rows={5}
                        placeholder="Detailed abstract of the project..."
                        value={form.abstract}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Documentation File</label>
                      <div
                        className="border rounded p-3"
                        style={{ borderStyle: "dashed" }}
                      >
                        <input
                          type="file"
                          className="form-control"
                          style={inputStyle}
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                          onChange={(e) =>
                            setDocFile(e.target.files?.[0] || null)
                          }
                        />
                        <small className="text-muted">
                          PDF, DOC, DOCX, PPT, PPTX — max 20MB
                        </small>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Source Code File</label>
                      <div
                        className="border rounded p-3"
                        style={{ borderStyle: "dashed" }}
                      >
                        <input
                          type="file"
                          className="form-control"
                          style={inputStyle}
                          accept=".zip,.rar"
                          onChange={(e) =>
                            setSrcFile(e.target.files?.[0] || null)
                          }
                        />
                        <small className="text-muted">
                          ZIP, RAR — max 20MB
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      <i
                        data-feather="upload-cloud"
                        style={{
                          width: "14px",
                          height: "14px",
                          marginRight: "5px",
                        }}
                      ></i>
                      {submitting ? "Uploading…" : "Upload Project"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => router.push("/projects", "back")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectUpload;
