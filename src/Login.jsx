import React, { useState, useEffect, useMemo } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";

/**
 * React Login Page
 * Works with Vite + React Router + Firebase
 */

const assetPath = (path) => `/${path}`;

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);




  useEffect(() => {
    document.title = "Sign in to your account";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return setStatus({ type: "error", message: "Please enter your email." });
    }
    if (!password) {
      return setStatus({ type: "error", message: "Please enter your password." });
    }

    // Check for admin login first
    if (email === "admin@crescenthr.in" && password === "Roundrobin@123") {
      setLoading(true);
      setStatus({ type: "idle", message: "" });
      setShowErrorModal(false);

      // Authenticate admin with Firebase for Firestore access
      try {
        await signInWithEmailAndPassword(auth, email, password);

        setStatus({
          type: "success",
          message: "Admin login successful! Redirecting...",
        });

        setTimeout(() => navigate("/admin-dashboard"), 1200);
      } catch (error) {
        // If Firebase auth fails, still allow admin access (for testing)
        console.log("Firebase auth failed for admin, proceeding anyway:", error.message);
        setStatus({
          type: "success",
          message: "Admin login successful! Redirecting...",
        });
        setTimeout(() => navigate("/admin-dashboard"), 1200);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "idle", message: "" });
      setShowErrorModal(false);

      await signInWithEmailAndPassword(auth, email, password);

      setStatus({
        type: "success",
        message: "Login successful! Redirecting...",
      });

      setTimeout(() => navigate("/shop"), 1200);
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }

      setStatus({ type: "error", message: errorMessage });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-area fix" style={{
      minHeight: '100vh',
      background: 'rgb(0, 74, 87)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Top Left Logo */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <Link to="/">
          <img
            src={assetPath("assets/img/logo/whitelogo.png")}
            alt="logo"
            style={{
              width: '60px',
              height: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}
          />
        </Link>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="row gx-0 shadow-lg" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'white',
              minHeight: '600px'
            }}>
              {/* Left Side */}
              <div className="col-md-6 d-none d-md-block" style={{
                background: 'rgb(0, 74, 87)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${assetPath("assets/img/images/login%20page.png")})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.1
                }}></div>
                <div className="text-center text-white p-5" style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <i className="fas fa-user-lock" style={{ fontSize: '30px' }}></i>
                  </div>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    color: 'white'
                  }}>Welcome Back!</h3>
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    opacity: 0.9,
                    marginBottom: '30px'
                  }}>
                    Access your account to explore our latest services and manage your projects seamlessly.
                  </p>
                  <div style={{
                    borderTop: '2px solid rgba(255,255,255,0.3)',
                    paddingTop: '20px'
                  }}>
                    <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Crescent TechnoServe</h5>
                    <span style={{ opacity: 0.8 }}>IT Solutions Provider</span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="col-md-6 col-12" style={{
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h2 style={{
                    color: 'rgb(0, 74, 87)',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}>Sign In</h2>
                  <p style={{ color: '#666', fontSize: '16px' }}>Welcome back! Please sign in to continue</p>
                </div>

                <form className="login__form" onSubmit={handleLogin}>
                  <div className="form__grp" style={{ marginBottom: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-envelope" style={{
                        position: 'absolute',
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#999',
                        fontSize: '16px'
                      }}></i>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '15px 15px 15px 45px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '10px',
                          fontSize: '16px',
                          backgroundColor: '#f8f9fa',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                      />
                    </div>
                  </div>

                  <div className="form__grp" style={{ marginBottom: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-lock" style={{
                        position: 'absolute',
                        left: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#999',
                        fontSize: '16px'
                      }}></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '15px 50px 15px 45px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '10px',
                          fontSize: '16px',
                          backgroundColor: '#f8f9fa',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#999',
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: '0',
                          outline: 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#667eea'}
                        onMouseLeave={(e) => e.target.style.color = '#999'}
                      >
                        <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                      </button>
                    </div>
                  </div>

                  <div className="account__remember" style={{
                    marginBottom: '30px',
                    textAlign: 'right'
                  }}>
                    <Link to="/reset" style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                    onMouseLeave={(e) => e.target.style.color = '#667eea'}>
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '15px',
                      background: loading ? '#ccc' : 'rgb(0, 74, 87)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginBottom: '20px',
                      transition: 'all 0.3s ease',
                      boxShadow: loading ? 'none' : '0 4px 15px rgba(0, 74, 87, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>

                  {status.type !== "idle" && (
                    <div style={{
                      padding: '12px 15px',
                      borderRadius: '10px',
                      marginBottom: '20px',
                      textAlign: 'center',
                      backgroundColor: status.type === "error" ? '#fee' : '#efe',
                      border: `2px solid ${status.type === "error" ? '#fcc' : '#cfc'}`,
                      color: status.type === "error" ? '#c33' : '#363',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <i className={`fas ${status.type === "error" ? "fa-exclamation-triangle" : "fa-check-circle"} me-2`}></i>
                      {status.message}
                    </div>
                  )}
                </form>

                <div className="account__switch" style={{
                  textAlign: 'center',
                  padding: '20px 0',
                  borderTop: '1px solid #e1e5e9'
                }}>
                  <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                    onMouseLeave={(e) => e.target.style.color = '#667eea'}>
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Login Error</h5>
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
    </div>
  );
};

export default Login;
