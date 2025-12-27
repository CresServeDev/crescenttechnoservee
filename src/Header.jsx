import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfilePhoto(userData.profilePhoto || null);
          }
        } catch (error) {
          console.error('Error fetching profile photo:', error);
        }
      } else {
        setProfilePhoto(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={{
      backgroundColor: 'rgb(1, 72, 90)',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      borderBottom: '2px solid #ff6b6b'
    }}>
      {/* Main header */}
      <div className="container-fluid" style={{ padding: '8px 15px' }}>
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-auto">
            <Link to="/shop" style={{
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              fontSize: '26px',
              fontWeight: 'bold'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                padding: '10px',
                marginRight: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <img
                  src="/assets/img/logo/whitelogo.png"
                  alt="Crescent TechnoServe"
                  style={{
                    height: '35px',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <span style={{
                background: 'linear-gradient(45deg, #fff, #f0f8ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '20px',
                fontWeight: '700'
              }}>
                Crescent
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="col">
            <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products and services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '30px 0 0 30px',
                    padding: '12px 20px',
                    fontSize: '15px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: '#333',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    fontWeight: '500'
                  }}
                />
                <button
                  className="btn"
                  type="submit"
                  style={{
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                    border: '2px solid rgba(255,107,107,0.5)',
                    borderRadius: '0 30px 30px 0',
                    padding: '12px 25px',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 6px 20px rgba(255,107,107,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255,107,107,0.3)';
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: '16px' }}></i>
                </button>
              </div>
            </form>
          </div>

          {/* Right side navigation */}
          <div className="col-auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              {/* Navigation Links */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <Link
                  to="/shop"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-store" style={{ marginRight: '6px' }}></i>
                  Shop
                </Link>

                <Link
                  to="/cart"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-shopping-cart" style={{ marginRight: '6px' }}></i>
                  Cart
                </Link>

                <Link
                  to="/service-packages"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-cogs" style={{ marginRight: '6px' }}></i>
                  Services
                </Link>

                {user && user.email === 'admin@crescenthr.in' && (
                  <Link
                    to="/admin-dashboard"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: '600',
                      padding: '10px 18px',
                      borderRadius: '25px',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-user-shield" style={{ marginRight: '6px' }}></i>
                    Admin
                  </Link>
                )}
              </div>

              {/* User Account */}
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '15px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                  onClick={() => navigate('/profile')}
                >
                  <div style={{
                    background: 'linear-gradient(45deg, #fff, #f0f8ff)',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                  }}>
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <i className="fas fa-user" style={{ color: '#667eea', fontSize: '16px' }}></i>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#fff' }}>
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>

                <div style={{
                  width: '1px',
                  height: '40px',
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }}></div>

                <button
                  className="btn"
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(255,107,107,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255,107,107,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(255,107,107,0.3)';
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </header>
  );
};

export default Header;
