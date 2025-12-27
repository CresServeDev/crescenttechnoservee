import React, { useEffect, useMemo, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "./firebase";

/**
 * React Register Page
 * Works with Vite + React Router + Firebase
 */

const assetPath = (path) => `/${path}`;

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);




  useEffect(() => {
    document.title = "Create an account";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return setStatus({ type: "error", message: "Please enter your email." });
    }
    if (!password) {
      return setStatus({ type: "error", message: "Please enter a password." });
    }
    if (password.length < 6) {
      return setStatus({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
    }
    if (password !== confirmPassword) {
      return setStatus({
        type: "error",
        message: "Passwords do not match.",
      });
    }
    if (!acceptedTerms) {
      return setStatus({
        type: "error",
        message: "Please accept the terms of use.",
      });
    }

    try {
      setLoading(true);
      setStatus({ type: "idle", message: "" });

      await createUserWithEmailAndPassword(auth, email, password);

      setStatus({
        type: "success",
        message: "Account created successfully! Redirecting...",
      });

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      }

      setStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-area fix">
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
              {/* Left Side */}
              <div className="col-md-6">
                <div className="login__left-side" style={{
                  backgroundImage: `url(${assetPath("assets/img/images/register%20page.png")})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  height: '100vh',
                  position: 'relative'
                }}>
                  <div className="login__left-content" style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    color: 'white',
                    textShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}>
                    <p>
                      "This software simplifies the website building process,
                      making it a breeze to manage our online presence."
                    </p>
                    <h4 className="title">Crescent Technoserve</h4>
                    <span>Founder & CEO</span>
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
                    }}>Create Account</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Join us today</p>
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

                    <div className="form__grp" style={{ marginBottom: '15px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 40px 12px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#fff',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            fontSize: '14px',
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

                    <div className="form__grp" style={{ marginBottom: '15px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 40px 12px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            backgroundColor: '#fff',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            fontSize: '14px',
                            cursor: 'pointer',
                            padding: '0',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#667eea'}
                          onMouseLeave={(e) => e.target.style.color = '#999'}
                        >
                          <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </button>
                      </div>
                    </div>

                    <div className="account__check" style={{
                      marginBottom: '30px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          marginRight: '10px',
                          accentColor: '#667eea'
                        }}
                      />
                      <label htmlFor="terms" style={{
                        color: '#555',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        I read and accept the{" "}
                        <Link to="/contact" style={{
                          color: '#667eea',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}>terms of use</Link>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: loading ? '#ccc' : 'rgb(0, 74, 87)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          marginBottom: '15px'
                        }}
                    >
                      {loading ? "Creating account..." : "Create Account"}
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
                      Already have an account?{" "}
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


      </main>
    </div>
  );
};

export default Register;
