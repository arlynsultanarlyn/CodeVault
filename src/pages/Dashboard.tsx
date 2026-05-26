import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import Layout from "../components/Layout";
import { getDashboardStats } from "../services/api";

const Dashboard: React.FC = () => {
  const router = useIonRouter();

  // FIXED: safe JSON.parse
  let user: any = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    user = {};
  }

  const [stats, setStats] = useState({
    total_projects: 0,
    total_web: 0,
    total_mobile: 0,
    total_ai: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("user")) router.push("/login", "root");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardStats();
        if (result.status === "success") {
          setStats(result.stats || result.data || {});
          setRecentProjects(result.recent_projects || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const firstName = (user.full_name || "User").split(" ")[0];
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Layout activePage="dashboard">
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Welcome Header */}
        <div className="row">
          <div className="col-md-6 grid-margin">
            <h4 className="mb-1">👋 Welcome, {firstName}!</h4>
            <p className="text-muted">
              Here's what's happening in your CodeVault.
            </p>
          </div>
          <div className="col-md-6 grid-margin text-end">
            <p className="text-muted">
              <i className="mdi mdi-calendar me-1"></i>
              {today}
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="row">
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg,#a8c0f8,#7b9ef0)",
                border: "none",
                borderRadius: "14px",
              }}
            >
              <div
                className="card-body d-flex flex-column justify-content-between"
                style={{ padding: "1.5rem" }}
              >
                <div>
                  <p
                    className="mb-1 text-white"
                    style={{ fontSize: ".85rem", opacity: 0.85 }}
                  >
                    Total Projects
                  </p>
                  <h2 className="text-white font-weight-bold mb-0">
                    {loading ? "—" : stats.total_projects}
                  </h2>
                </div>
                <p
                  className="mb-0 text-white mt-3"
                  style={{ fontSize: ".8rem", opacity: 0.75 }}
                >
                  All submitted projects
                </p>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg,#7b5ea7,#5c3d8f)",
                border: "none",
                borderRadius: "14px",
              }}
            >
              <div
                className="card-body d-flex flex-column justify-content-between"
                style={{ padding: "1.5rem" }}
              >
                <div>
                  <p
                    className="mb-1 text-white"
                    style={{ fontSize: ".85rem", opacity: 0.85 }}
                  >
                    Web Projects
                  </p>
                  <h2 className="text-white font-weight-bold mb-0">
                    {loading ? "—" : stats.total_web}
                  </h2>
                </div>
                <p
                  className="mb-0 text-white mt-3"
                  style={{ fontSize: ".8rem", opacity: 0.75 }}
                >
                  Web-based systems
                </p>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg,#9b8fd4,#7b6fc0)",
                border: "none",
                borderRadius: "14px",
              }}
            >
              <div
                className="card-body d-flex flex-column justify-content-between"
                style={{ padding: "1.5rem" }}
              >
                <div>
                  <p
                    className="mb-1 text-white"
                    style={{ fontSize: ".85rem", opacity: 0.85 }}
                  >
                    Mobile Projects
                  </p>
                  <h2 className="text-white font-weight-bold mb-0">
                    {loading ? "—" : stats.total_mobile}
                  </h2>
                </div>
                <p
                  className="mb-0 text-white mt-3"
                  style={{ fontSize: ".8rem", opacity: 0.75 }}
                >
                  Mobile applications
                </p>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg,#f0908a,#e06b63)",
                border: "none",
                borderRadius: "14px",
              }}
            >
              <div
                className="card-body d-flex flex-column justify-content-between"
                style={{ padding: "1.5rem" }}
              >
                <div>
                  <p
                    className="mb-1 text-white"
                    style={{ fontSize: ".85rem", opacity: 0.85 }}
                  >
                    AI Projects
                  </p>
                  <h2 className="text-white font-weight-bold mb-0">
                    {loading ? "—" : stats.total_ai}
                  </h2>
                </div>
                <p
                  className="mb-0 text-white mt-3"
                  style={{ fontSize: ".8rem", opacity: 0.75 }}
                >
                  AI/ML based projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-clock-outline me-2 text-primary"></i>{" "}
                    Recent Projects
                  </h5>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => router.push("/projects", "forward")}
                  >
                    View All{" "}
                    <i
                      data-feather="arrow-right"
                      style={{
                        width: "13px",
                        height: "13px",
                        marginLeft: "4px",
                      }}
                    ></i>
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  </div>
                ) : recentProjects.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Project Title</th>
                          <th>Category</th>
                          <th>Date Added</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProjects.map((project, i) => (
                          <tr key={project.id}>
                            <td>{i + 1}</td>
                            <td>{project.title || "N/A"}</td>
                            <td>
                              <span className="badge badge-primary">
                                {project.category_name || "Uncategorized"}
                              </span>
                            </td>
                            <td>
                              {new Date(project.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i
                      data-feather="folder"
                      style={{ width: "48px", height: "48px", color: "#ccc" }}
                    ></i>
                    <p className="text-muted mt-3">
                      No projects yet. Start by adding one!
                    </p>
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

export default Dashboard;
