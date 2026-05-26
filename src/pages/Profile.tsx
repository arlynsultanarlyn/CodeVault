import React, { useEffect, useState, useRef } from "react";
import { useIonRouter } from "@ionic/react";
import Layout from "../components/Layout";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePhoto,
} from "../services/api";

const CI3_BASE = "https://itservicesph.com/IT383/SULTAN/codevault";

const Profile: React.FC = () => {
  const router = useIonRouter();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile info form
  const [infoForm, setInfoForm] = useState({ full_name: "", email: "" });
  const [infoMsg, setInfoMsg] = useState("");
  const [infoError, setInfoError] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  // Photo upload
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoMsg, setPhotoMsg] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoSaving, setPhotoSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("user")) router.push("/login", "root");
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProfile();
        if (res.status === "success") {
          setProfile(res.data);
          setInfoForm({
            full_name: res.data.full_name || "",
            email: res.data.email || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const initial = (profile?.full_name || user.full_name || "U")
    .charAt(0)
    .toUpperCase();

  // ── Photo upload ──────────────────────────────────────────
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) return;
    setPhotoError("");
    setPhotoMsg("");
    setPhotoSaving(true);
    try {
      const fd = new FormData();
      fd.append("user_id", String(user.user_id));
      fd.append("profile_photo", photoFile);
      const res = await uploadProfilePhoto(fd);
      if (res.status === "success") {
        setPhotoMsg("Photo updated!");
        setProfile((p: any) => ({ ...p, profile_photo: res.filename }));
        // Sync localStorage so navbar avatar updates too
        const updated = { ...user, profile_photo: res.filename };
        localStorage.setItem("user", JSON.stringify(updated));
        setPhotoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setPhotoError(res.message || "Upload failed.");
      }
    } catch {
      setPhotoError("Something went wrong.");
    } finally {
      setPhotoSaving(false);
    }
  };

  // ── Update profile info ───────────────────────────────────
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError("");
    setInfoMsg("");
    setInfoSaving(true);
    try {
      const res = await updateProfile(infoForm);
      if (res.status === "success") {
        setInfoMsg("Profile updated!");
        const updated = {
          ...user,
          full_name: infoForm.full_name,
          email: infoForm.email,
        };
        localStorage.setItem("user", JSON.stringify(updated));
      } else {
        setInfoError(res.message || "Update failed.");
      }
    } catch {
      setInfoError("Something went wrong.");
    } finally {
      setInfoSaving(false);
    }
  };

  // ── Change password ───────────────────────────────────────
  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwMsg("");
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.new_password.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    setPwSaving(true);
    try {
      const res = await changePassword({
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      if (res.status === "success") {
        setPwMsg("Password changed successfully!");
        setPwForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        setPwError(res.message || "Change failed.");
      }
    } catch {
      setPwError("Something went wrong.");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading)
    return (
      <Layout activePage="profile">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </Layout>
    );

  return (
    <Layout activePage="profile">
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            {/* ── Photo + Info Card ── */}
            <div className="card mb-4">
              <div className="card-body">
                {/* Avatar header */}
                <div
                  className="d-flex align-items-center mb-4 pb-3"
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    {profile?.profile_photo ? (
                      <img
                        src={`${CI3_BASE}/uploads/avatars/${profile.profile_photo}`}
                        alt="Profile"
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #6571ff",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#6571ff,#504B8E)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "3px solid #6571ff",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "2rem",
                            fontWeight: 700,
                            color: "#fff",
                            lineHeight: 1,
                          }}
                        >
                          {initial}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ms-3">
                    <h5 className="mb-0">{profile?.full_name || ""}</h5>
                    <small className="text-muted">{profile?.email || ""}</small>
                    <br />
                    <span className="badge badge-primary mt-1">
                      {profile?.role
                        ? profile.role.charAt(0).toUpperCase() +
                          profile.role.slice(1)
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Change photo */}
                <h6 className="mb-3">Change Profile Photo</h6>
                {photoError && (
                  <div className="alert alert-danger py-2">{photoError}</div>
                )}
                {photoMsg && (
                  <div className="alert alert-success py-2">{photoMsg}</div>
                )}
                <form onSubmit={handlePhotoSubmit}>
                  <div
                    className="d-flex align-items-center gap-3 mb-4 pb-3"
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      style={{ maxWidth: "300px" }}
                      onChange={(e) =>
                        setPhotoFile(e.target.files?.[0] || null)
                      }
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-outline-primary"
                      disabled={photoSaving}
                    >
                      <i
                        data-feather="upload"
                        style={{
                          width: "14px",
                          height: "14px",
                          marginRight: "5px",
                        }}
                      ></i>
                      {photoSaving ? "Uploading…" : "Upload Photo"}
                    </button>
                  </div>
                </form>

                {/* Update profile info */}
                <h6 className="mb-3">Update Profile Info</h6>
                {infoError && (
                  <div className="alert alert-danger py-2">{infoError}</div>
                )}
                {infoMsg && (
                  <div className="alert alert-success py-2">{infoMsg}</div>
                )}
                <form onSubmit={handleInfoSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={infoForm.full_name}
                      onChange={(e) =>
                        setInfoForm((p) => ({
                          ...p,
                          full_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={infoForm.email}
                      onChange={(e) =>
                        setInfoForm((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={infoSaving}
                  >
                    <i
                      data-feather="save"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginRight: "5px",
                      }}
                    ></i>
                    {infoSaving ? "Saving…" : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Change Password Card ── */}
            <div className="card">
              <div className="card-body">
                <h6 className="mb-3">Change Password</h6>
                {pwError && (
                  <div className="alert alert-danger py-2">{pwError}</div>
                )}
                {pwMsg && (
                  <div className="alert alert-success py-2">{pwMsg}</div>
                )}
                <form onSubmit={handlePwSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter current password"
                      value={pwForm.current_password}
                      onChange={(e) =>
                        setPwForm((p) => ({
                          ...p,
                          current_password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="At least 6 characters"
                      value={pwForm.new_password}
                      onChange={(e) =>
                        setPwForm((p) => ({
                          ...p,
                          new_password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Repeat new password"
                      value={pwForm.confirm_password}
                      onChange={(e) =>
                        setPwForm((p) => ({
                          ...p,
                          confirm_password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={pwSaving}
                  >
                    <i
                      data-feather="lock"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginRight: "5px",
                      }}
                    ></i>
                    {pwSaving ? "Saving…" : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
