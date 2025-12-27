import React, { useState, useEffect, useMemo } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { Link } from "react-router-dom";

/**
 * React Reset Password Page
 * Works with Vite + React Router + Firebase
 */

const assetPath = (path) => `/${path}`;

const Reset = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const backgroundStyle = useMemo(
    () => ({ backgroundImage: `url(${assetPath("assets/img/bg/reset.webp")})` }),
    []
  );

  useEffect(() => {
    document.title = "Reset password";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setStatus({ type: "error", message: "Please enter your email." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "idle", message: "" });
      setShowErrorModal(false);

      console.log("Sending password reset email to:", email);
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");

      setStatus({
        type: "success",
        message: "Password reset email sent! Check your inbox (and spam folder).",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send reset email. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      setStatus({ type: "error", message: errorMessage });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-area fix">
      <button className="scroll__top scroll-to-target" data-target="html">
        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 19.3848V0.999995M11 0.999995L1.80762 10.1924M11 0.999995L20.1924 10.1924"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Top Left Logo */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <Link to="/">
          <img
            src={assetPath("assets/img/logo/whitelogo.png")}
            alt="logo"
            style={{
              width: '50px',
              height: 'auto'
            }}
          />
        </Link>
      </div>

      <main className="main-area fix">
        <section className="login__area">
          <div className="container-fluid p-0">
            <div className="row gx-0">
              <div className="col-md-6">
                <div className="login__left-side" style={backgroundStyle}>
                  <div className="login__left-content">
                    <p>
                      "Forgot your password? No worries! Reset it securely and regain access to your account."
                    </p>
                    <h4 className="title">Crescent TechnoServe</h4>
                    <span>IT Solutions Provider</span>
                  </div>
                </div>
              </div>
              {/* Right Side */}
              <div className="col-md-6">
                <div className="login__form-wrap" style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  margin: '20px',
                  maxWidth: '400px'
                }}>

                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 className="title" style={{
                      color: '#333',
                      fontSize: '24px',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>Reset your password</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Enter your email to receive reset instructions</p>
                  </div>

                  <form className="login__form" onSubmit={handleSubmit}>
                    <div className="form__grp" style={{ marginBottom: '15px' }}>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: '#fff',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: loading ? '#ccc' : '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                      }}
                    >
                      {loading ? "Sending..." : "Send reset email"}
                    </button>

                    {status.type !== "idle" && (
                      <div style={{
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        backgroundColor: status.type === "error" ? '#fee' : '#efe',
                        border: `1px solid ${status.type === "error" ? '#fcc' : '#cfc'}`,
                        color: status.type === "error" ? '#c33' : '#363'
                      }}>
                        {status.message}
                      </div>
                    )}
                  </form>

                  <div className="account__switch" style={{
                    textAlign: 'center',
                    padding: '15px 0',
                    borderTop: '1px solid #e1e5e9'
                  }}>
                    <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                      Remember your password?{" "}
                      <Link to="/login" style={{
                        color: '#667eea',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}>Sign in</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error Modal */}
        {showErrorModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">Reset Error</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowErrorModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-danger">{status.message}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowErrorModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Backdrop */}
        {showErrorModal && (
          <div className="modal-backdrop fade show"></div>
        )}
      </main>
    </div>
  );
};

export default Reset;

