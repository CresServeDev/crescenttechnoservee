import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginIcon from "./LoginIcon";
import gstService from "./gstService";

const Profile = () => {
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep'
  ];

  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem('profileData');
    return savedData ? JSON.parse(savedData) : {
      firstName: '',
      lastName: '',
      companyName: '',
      contactNumber: '',
      email: '',
      gstNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    };
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [gstVerifying, setGstVerifying] = useState(false);
  const [gstVerified, setGstVerified] = useState(null);
  const [fetchingCompany, setFetchingCompany] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser);
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  const fetchUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, "userProfiles", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          companyName: userData.companyName || '',
          contactNumber: userData.contactNumber || '',
          email: userId.email || userData.email || '',
          gstNumber: userData.gstNumber || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zipCode: userData.zipCode || ''
        });

        // Auto-fetch company name if GST exists but company name is missing
        if (userData.gstNumber && !userData.companyName) {
          await fetchCompanyDetails(userData.gstNumber);
        }
      } else {
        // Set default email from auth
        setProfileData(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'gstNumber') {
      // Clean GST number: remove spaces and convert to uppercase
      const cleanedGst = value.replace(/\s/g, '').toUpperCase();
      setProfileData(prev => ({
        ...prev,
        [name]: cleanedGst
      }));

      // Auto-fetch company name when cleaned GST number is 15 characters
      if (cleanedGst.length === 15) {
        await fetchCompanyDetails(cleanedGst);
      }
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'companyName', 'contactNumber', 'email', 'address'];
    if (profileData.companyName.trim()) {
      requiredFields.push('gstNumber');
    }
    const missingFields = requiredFields.filter(field => !profileData[field].trim());

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map(field => {
        const fieldNames = {
          firstName: 'First Name',
          lastName: 'Last Name',
          companyName: 'Company Name',
          contactNumber: 'Contact Number',
          email: 'Contact Email',
          gstNumber: 'GST Number',
          address: 'Address'
        };
        return fieldNames[field];
      }).join(', ')}`);
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, "userProfiles", user.uid);
      await setDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date()
      }, { merge: true });

      alert("Profile updated successfully!");
      setIsEditing(false); // Make form non-editable after saving
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const fetchCompanyDetails = async (gstNumber) => {
    if (!gstNumber || gstNumber.length !== 15) return;

    setFetchingCompany(true);
    try {
      const companyData = await gstService.fetchCompanyDetails(gstNumber);
      setProfileData(prev => ({
        ...prev,
        companyName: companyData.companyName
      }));
    } catch (error) {
      console.error("Error fetching company details:", error);
      // Clear company name if GST number is not found or invalid
      setProfileData(prev => ({
        ...prev,
        companyName: ''
      }));
      alert("GST number not found or invalid. Please verify the GST number is correct and registered.");
    } finally {
      setFetchingCompany(false);
    }
  };

  const verifyGST = async () => {
    if (!profileData.gstNumber) {
      alert("Please enter a GST number first.");
      return;
    }

    setGstVerifying(true);
    try {
      const isValid = await gstService.verifyGST(profileData.gstNumber);
      setGstVerified(isValid);
      if (isValid) {
        alert("GST number is valid and registered.");
      } else {
        alert("Invalid GST number format or not registered.");
      }
    } catch (error) {
      console.error("Error verifying GST:", error);
      setGstVerified(false);
      alert("Error verifying GST number. Please try again.");
    } finally {
      setGstVerifying(false);
    }
  };



  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Please log in to view your profile.
      </div>
    );
  }

  const assetPath = (path) => `${process.env.PUBLIC_URL || ""}/${path}`;

  return (
    <div className="profile-page">
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

      <main className="main-area fix">
        <section className="breadcrumb__area breadcrumb__bg fix" style={{ backgroundImage: `url(${assetPath("assets/img/bg/breadcrumb_bg.jpg")})` }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb__content">
                  <h2 className="title">Profile</h2>
                  <nav className="breadcrumb">
                    <span>
                      <a href="index.html">Home</a>
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span>Profile</span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile__area section-py-140">
          <div className="container">
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'rgb(0, 74, 87)',
                color: 'white',
                padding: '40px 30px',
                textAlign: 'center'
              }}>
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  color: 'white'
                }}>{user?.displayName || user?.email?.split('@')[0] || 'User'}'s Profile</h1>
                <p style={{
                  fontSize: '1.2rem',
                  opacity: '0.9'
                }}>Manage your account</p>
              </div>

              <div style={{ padding: '40px 30px' }}>
                <div className="user-details" style={{
                  marginBottom: '40px',
                  padding: '30px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef'
                }}>
                  <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    color: '#333'
                  }}>User Details</h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                  }}>
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      border: '1px solid #e9ecef'
                    }}>
                      <strong style={{ color: '#667eea' }}>Email:</strong> {user.email}
                    </div>
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      border: '1px solid #e9ecef'
                    }}>
                      <strong style={{ color: '#667eea' }}>User ID:</strong> {user.uid}
                      </div>

                    </div>
                    <div style={{
                      marginTop: '30px',
                      textAlign: 'center'
                    }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        padding: '12px 30px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <div className="edit-profile" style={{
                  marginBottom: '40px',
                  padding: '30px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      color: '#333',
                      margin: 0
                    }}>Edit Profile</h2>
                    {!isEditing && (
                      <button
                        onClick={handleEditClick}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        title="Edit Profile"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ color: '#667eea' }}
                        >
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleSaveProfile}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '20px'
                    }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Company Name</label>
                        {isEditing ? (
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              id="companyName"
                              name="companyName"
                              value={profileData.companyName}
                              onChange={handleInputChange}
                              disabled={fetchingCompany}
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                backgroundColor: fetchingCompany ? '#f8f9fa' : 'white'
                              }}
                            />
                            {fetchingCompany && (
                              <div style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '0.9rem',
                                color: '#667eea',
                                fontWeight: 'bold'
                              }}>
                                Fetching...
                              </div>
                            )}
                          </div>
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.companyName}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Contact Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={profileData.contactNumber}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.contactNumber}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Contact Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.email}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>GST Number</label>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="text"
                              id="gstNumber"
                              name="gstNumber"
                              value={profileData.gstNumber}
                              onChange={handleInputChange}
                              style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '1rem'
                              }}
                            />
                            <button
                              type="button"
                              onClick={verifyGST}
                              disabled={gstVerifying}
                              style={{
                                padding: '10px 20px',
                                backgroundColor: gstVerifying ? '#6c757d' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                cursor: gstVerifying ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.3s ease'
                              }}
                              onMouseOver={(e) => !gstVerifying && (e.target.style.backgroundColor = '#0056b3')}
                              onMouseOut={(e) => !gstVerifying && (e.target.style.backgroundColor = '#007bff')}
                            >
                              {gstVerifying ? 'Verifying...' : 'Verify GST'}
                            </button>
                          </div>
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.gstNumber}</p>
                        )}
                        {gstVerified !== null && (
                          <p style={{
                            marginTop: '5px',
                            fontSize: '0.9rem',
                            color: gstVerified ? '#28a745' : '#dc3545',
                            fontWeight: 'bold'
                          }}>
                            {gstVerified ? '✓ GST number is valid and registered' : '✗ Invalid GST number or not registered'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Address</label>
                        {isEditing ? (
                          <textarea
                            id="address"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            rows="3"
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem',
                              resize: 'vertical'
                            }}
                          />
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef', whiteSpace: 'pre-wrap' }}>{profileData.address}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.city}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>State</label>
                        {isEditing ? (
                          <select
                            id="state"
                            name="state"
                            value={profileData.state}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem',
                              backgroundColor: 'white'
                            }}
                          >
                            <option value="">Select State</option>
                            {indianStates.map((state, index) => (
                              <option key={index} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.state}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Zip Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={profileData.zipCode}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              fontSize: '1rem'
                            }}
                          />
                        ) : (
                          <p style={{ padding: '10px', margin: 0, backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>{profileData.zipCode}</p>
                        )}
                      </div>
                    </div>
                    <div style={{
                      marginTop: '30px',
                      textAlign: 'center'
                    }}>
                      <button
                        type="submit"
                        disabled={saving}
                        style={{
                          padding: '12px 30px',
                          backgroundColor: saving ? '#6c757d' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          cursor: saving ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => !saving && (e.target.style.backgroundColor = '#218838')}
                        onMouseOut={(e) => !saving && (e.target.style.backgroundColor = '#28a745')}
                      >
                        {saving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
