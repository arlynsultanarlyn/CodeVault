import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import feather from "feather-icons";

interface LayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage }) => {
  const router = useIonRouter();
  let user: any = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const initial = (user.full_name || "U").charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login", "root");
  };

  useEffect(() => {
    feather.replace();
  }, [activePage]);

  useEffect(() => {
    const close = () => {
      setProfileOpen(false);
      setNotifOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const navItem = (page: string, icon: string, label: string, path: string) => (
    <li
      className={`nav-item menu-items${activePage === page ? " active" : ""}`}
    >
      <button
        className="nav-link w-100 text-start border-0 bg-transparent"
        style={{ cursor: "pointer" }}
        onClick={() => router.push(path, "forward")}
      >
        <span className="menu-icon">
          <i data-feather={icon}></i>
        </span>
        <span className="menu-title">{label}</span>
      </button>
    </li>
  );

  return (
    <>
      <link rel="stylesheet" href="/assets/css/style.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/7.2.96/css/materialdesignicons.min.css"
      />

      <style>{`
        html, body { overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        body { overflow-x: hidden; margin: 0 !important; padding: 0 !important; }

        /* ✅ GLOBAL — container-xxl max-width override */
        .container-xxl, .container-xl, .container-lg, .container-md, .container-sm, .container-fluid {
          max-width: 100% !important;
          width: 100% !important;
        }

        /* ✅ OVERRIDE — pigilan ang template na mag-set ng margin/padding sa lahat ng containers */
        .page-body-wrapper {
          margin-left: 0 !important;
          padding-top: 0 !important;
        }
        .container-scroller {
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        .cv-body-wrapper {
          padding-left: 0 !important;
          padding-right: 0 !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
        }
        .content-wrapper {
          padding-left: 1.5rem !important;
          padding-right: 1.5rem !important;
          overflow-x: hidden !important;
        }

        .navbar {
          position: fixed !important;
          top: 0; left: 0; right: 0;
          z-index: 999;
          height: 63px;
          display: flex !important;
          flex-direction: row !important;
          padding: 0 !important;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .navbar-brand-wrapper {
          width: 250px !important;
          min-width: 250px !important;
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding-right: 12px !important;
          background: #fff;
          z-index: 1000;
        }
        .navbar .navbar-menu-wrapper {
          flex: 1 1 0% !important;
          min-width: 0 !important;
          display: flex !important;
          align-items: stretch !important;
          overflow: visible !important;
        }

        .hamburger-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .hamburger-btn:hover { background: #f0f2ff; }
        .hamburger-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: #504B8E;
          border-radius: 2px;
        }

        .sidebar {
          position: fixed !important;
          top: 63px !important;
          left: 0 !important;
          height: calc(100vh - 63px) !important;
          width: 250px !important;
          z-index: 100 !important;
          overflow-y: auto !important;
          background: #fff !important;
          transition: transform 0.25s ease;
        }
        .sidebar-brand-wrapper { display: none !important; }

        /* ✅ CUSTOM wrapper — hindi naaapektuhan ng template CSS */
        .cv-body-wrapper {
          padding-top: 63px !important;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.25s ease, width 0.25s ease;
          box-sizing: border-box !important;
        }
        .main-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .content-wrapper {
          flex: 1;
          background: #f9faff;
          position: relative;
          z-index: 1;
          padding-bottom: 20px;
        }
        .footer { margin-top: auto; background: #fff; z-index: 2; }

        .sidebar .nav .nav-item.menu-items > .nav-link,
        .sidebar .nav .nav-item.menu-items > button.nav-link {
          background: transparent !important; color: #3e4b5b !important;
        }
        .sidebar .nav .nav-item.menu-items.active > .nav-link,
        .sidebar .nav .nav-item.menu-items.active > button.nav-link {
          background: linear-gradient(135deg,#6571ff 0%,#504B8E 100%) !important;
          border-radius: 8px !important; color: #fff !important;
        }
        .sidebar .nav .nav-item.menu-items.active > button.nav-link .menu-title,
        .sidebar .nav .nav-item.menu-items.active > button.nav-link i,
        .sidebar .nav .nav-item.menu-items.active > button.nav-link svg {
          color: #fff !important; stroke: #fff !important; fill: none !important;
        }
        .sidebar .nav .nav-item.menu-items:not(.active) > button.nav-link:hover {
          background: #f0f2ff !important; border-radius: 8px !important; color: #6571ff !important;
        }
        .sidebar .nav .nav-item.nav-category > .nav-link { color: #9da5c9 !important; }

        .nav-item.nav-search .input-group {
          display: flex !important; align-items: center !important; flex-wrap: nowrap !important;
          background: #e8ecff !important; border: 1px solid #d0d5f5 !important;
          border-radius: 20px !important; padding: 4px 12px !important;
          max-width: 400px !important; height: 38px !important;
        }
        .nav-item.nav-search .input-group .input-group-text {
          background: transparent !important; border: none !important;
          padding: 0 6px 0 0 !important; color: #6571ff !important; font-size: 18px !important;
        }
        .nav-item.nav-search .input-group input.form-control {
          background: transparent !important; border: none !important;
          box-shadow: none !important; outline: none !important;
          color: #333 !important; font-size: 0.875rem !important; padding: 0 !important; flex: 1 !important;
        }
        .nav-item.nav-search .input-group input.form-control::placeholder { color: #9da5c9 !important; }

        .navbar-dropdown { min-width: 200px; }
        .show { display: block !important; }
      `}</style>

      <div className="container-scroller">
        {/* SIDEBAR */}
        <nav
          className="sidebar sidebar-offcanvas"
          id="sidebar"
          style={{
            transform: sidebarOpen ? "translateX(0)" : "translateX(-250px)",
          }}
        >
          <ul className="nav">
            <li className="nav-item nav-category">
              <span className="nav-link">Main</span>
            </li>
            {navItem("dashboard", "box", "Dashboard", "/dashboard")}
            {navItem("projects", "folder", "Projects", "/projects")}
            {user.role === "admin" && (
              <>
                {navItem(
                  "upload",
                  "upload-cloud",
                  "Upload Project",
                  "/projectsupload",
                )}
                <li className="nav-item nav-category">
                  <span className="nav-link">Admin</span>
                </li>
                {navItem("users", "users", "Manage Users", "/admin/users")}
                {navItem(
                  "categories",
                  "tag",
                  "Categories",
                  "/admin/categories",
                )}
              </>
            )}
          </ul>
        </nav>

        {/* ✅ PINALITAN ng cv-body-wrapper — walang template CSS na nag-o-override dito */}
        <div
          className="cv-body-wrapper"
          style={{ marginLeft: sidebarOpen ? "250px" : "0px" }}
        >
          {/* NAVBAR */}
          <nav className="navbar p-0 d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center">
              {/* Logo */}
              <button
                className="navbar-brand brand-logo border-0 bg-transparent"
                style={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => router.push("/dashboard", "root")}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 107 73"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="53.5" cy="36.5" r="36.5" fill="#D8E3FF" />
                    <path
                      d="M3.43651 12.0425C5.63232 12.2316 7.87829 12.7788 9.92735 14.1728C10.4109 14.576 10.9525 14.8862 11.3964 15.3781C11.8405 15.8591 12.3298 16.332 12.7064 16.8622C13.0606 17.3289 13.4047 17.7933 13.7386 18.2771C19.212 18.6508 24.6736 19.3881 30.0833 20.6322C33.8508 21.4791 37.5741 22.6347 41.2594 24.0012C44.4983 25.2983 47.7186 26.8565 50.7235 29.0196C41.603 19.039 31.7885 15.4665 27.1317 13.8558C16.9991 10.3487 7.94427 10.7712 1.39374 12.0144C2.06847 11.9888 2.75431 12.0048 3.43651 12.0425Z"
                      fill="#504B8E"
                    />
                    <path
                      d="M29.6337 23.8305C25.952 22.9304 22.2231 22.3062 18.4881 21.7691C17.5835 21.6347 16.679 21.5003 15.7789 21.4008C16.8632 23.1541 17.881 25.0088 18.8113 26.9191C18.9996 27.3051 19.1861 27.7041 19.3743 28.101C24.2552 28.4621 29.1319 29.1347 33.9746 30.2077L36.7441 30.9255L38.1262 31.2952L39.4955 31.7388L42.2324 32.6369C43.1424 32.9849 44.0405 33.3501 44.945 33.7285C48.5316 35.2352 52.0678 37.1267 55.3103 39.7375C57.9671 41.8501 60.4786 44.453 62.4359 47.6648C61.3012 44.9632 59.9406 42.1865 58.3161 39.415C56.192 36.434 53.6627 34.0269 50.9281 32.1159C47.6803 29.8819 44.1793 28.2239 40.5843 26.9698C36.9891 25.7288 33.3354 24.6134 29.6337 23.8305Z"
                      fill="#504B8E"
                    />
                    <path
                      d="M54.3269 41.9417C51.1357 39.7237 47.7379 37.9604 44.2168 36.6725L41.5898 35.6714L38.9171 34.8352L37.5757 34.4224L36.2216 34.0836L33.5217 33.406C29.894 32.5894 26.2426 31.9097 22.5698 31.4562C21.9652 31.3629 21.3587 31.2783 20.7504 31.2068C21.1777 32.1843 21.6035 33.0266 22.1355 33.7899C23.4403 35.6508 25.1018 37.0657 26.9724 37.9627C27.9042 38.4265 28.8713 38.7448 29.8922 39.0354L33.0483 39.9197L45.6553 43.6285L51.9336 45.5534C54.1242 46.3634 56.1813 47.6595 58.0231 49.3143C61.5847 52.5155 64.3584 56.8168 66.612 61.4247C65.7823 57.5422 64.462 53.8882 62.6337 50.7675C60.4634 47.0169 57.4857 44.2049 54.3269 41.9417Z"
                      fill="#504B8E"
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#504B8E",
                      letterSpacing: ".3px",
                    }}
                  >
                    Skydash
                  </span>
                </span>
              </button>

              {/* HAMBURGER — kanan ng logo */}
              <button
                className="hamburger-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen((o) => !o);
                }}
                title="Toggle Sidebar"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>

            <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
              <ul className="navbar-nav w-100">
                <li className="nav-item nav-search">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="mdi mdi-magnify"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search now"
                    />
                  </div>
                </li>
              </ul>

              <ul className="navbar-nav navbar-nav-right">
                <li
                  className="nav-item dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifOpen((o) => !o);
                    setProfileOpen(false);
                  }}
                >
                  <span
                    className="nav-link count-indicator"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="mdi mdi-bell-outline"></i>
                    <span className="count-symbol bg-danger"></span>
                  </span>
                  {notifOpen && (
                    <div
                      className="dropdown-menu dropdown-menu-right navbar-dropdown show"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h6 className="p-3 mb-0">Notifications</h6>
                      <div className="dropdown-divider"></div>
                      <span className="dropdown-item">
                        <div className="preview-item-content">
                          <p className="preview-subject mb-1">
                            No new notifications
                          </p>
                        </div>
                      </span>
                    </div>
                  )}
                </li>

                <li
                  className="nav-item nav-profile dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen((o) => !o);
                    setNotifOpen(false);
                  }}
                >
                  <span className="nav-link" style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "linear-gradient(135deg,#6571ff,#504B8E)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        {initial}
                      </span>
                    </div>
                  </span>
                  {profileOpen && (
                    <div
                      className="dropdown-menu navbar-dropdown show"
                      style={{ right: 0, left: "auto" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-3 py-2 border-bottom">
                        <p
                          className="mb-0 fw-semibold"
                          style={{ fontSize: ".9rem" }}
                        >
                          {user.full_name}
                        </p>
                        <small className="text-muted">{user.email}</small>
                      </div>
                      <button
                        className="dropdown-item border-0 bg-transparent"
                        onClick={() => router.push("/profile", "forward")}
                      >
                        <i className="mdi mdi-account-outline me-2 text-primary"></i>{" "}
                        My Profile
                      </button>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item border-0 bg-transparent"
                        onClick={handleLogout}
                      >
                        <i className="mdi mdi-logout me-2 text-danger"></i>{" "}
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </nav>

          <div className="main-panel">
            <div className="content-wrapper">{children}</div>
            <footer className="footer">
              <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
                  Copyright © {new Date().getFullYear()}{" "}
                  <button className="border-0 bg-transparent p-0 text-primary">
                    CodeVault
                  </button>
                  . All rights reserved.
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
