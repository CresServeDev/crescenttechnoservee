import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ServiceCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.selectedPlan;
  const assets = location.state?.assets || [];

  console.log('ServiceCheckout - location.state:', location.state);
  console.log('ServiceCheckout - selectedPlan:', selectedPlan);

  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    street1: '',
    street2: '',
    town: '',
    district: '',
    zip: '',
    country: 'India'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!selectedPlan) {
      navigate('/service-packages');
    }
  }, [selectedPlan, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserProfile(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, "userProfiles", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setBillingDetails({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || currentUser?.email || '',
          phone: userData.contactNumber || '',
          company: userData.companyName || '',
          street1: userData.address || '',
          street2: '',
          town: userData.city || '',
          district: userData.state || '',
          zip: userData.zipCode || '',
          country: 'India'
        });
      } else {
        // Set default email from auth
        setBillingDetails(prev => ({
          ...prev,
          email: currentUser?.email || ''
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate start and end dates
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // Add exactly one month

      const subscriptionData = {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planPrice: selectedPlan.price,
        billingDetails,
        assets: assets.map(asset => ({
          assetId: asset.assetId,
          pcName: asset.pcName,
          serialNumber: asset.serialNumber,
          ram: asset.ram,
          processor: asset.processor,
          hdd: asset.hdd,
          ssd: asset.ssd
        })),
        status: 'active',
        createdAt: serverTimestamp(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: currentUser ? currentUser.uid : null
      };

      await addDoc(collection(db, 'serviceSubscriptions'), subscriptionData);

      alert(`Service subscription created successfully! Your subscription is valid from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`);
      navigate('/service-packages');
    } catch (error) {
      console.error('Error creating subscription:', error);
      setError('Failed to create subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Service Checkout</h3>
            </div>
            <div className="card-body">
              {/* Selected Plan Summary */}
              <div className="mb-4 p-3 bg-light rounded">
                <h5>Selected Plan</h5>
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="text-primary">{selectedPlan.name} Package</h4>
                    <ul className="list-unstyled">
                      {selectedPlan.services.map((service, index) => (
                        <li key={index} className="mb-1">
                          <i className="fas fa-check text-success me-2"></i>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-4 text-end">
                    <h3 className="text-primary">₹{selectedPlan.price}</h3>
                    <small className="text-muted">per month</small>
                  </div>
                </div>
              </div>

              {/* Assets Summary */}
              {assets.length > 0 && (
                <div className="mb-4 p-3 bg-info bg-opacity-10 rounded">
                  <h5>Added Assets ({assets.length})</h5>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Asset ID</th>
                          <th>PC Name</th>
                          <th>Serial Number</th>
                          <th>RAM</th>
                          <th>Processor</th>
                          <th>HDD</th>
                          <th>SSD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((asset, index) => (
                          <tr key={index}>
                            <td><strong>{asset.assetId}</strong></td>
                            <td>{asset.pcName}</td>
                            <td>{asset.serialNumber}</td>
                            <td>{asset.ram}</td>
                            <td>{asset.processor}</td>
                            <td>{asset.hdd || '-'}</td>
                            <td>{asset.ssd || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Billing Form */}
              <form onSubmit={handleSubmit}>
                <h5 className="mb-3">Billing Details</h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={billingDetails.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={billingDetails.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={billingDetails.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="company" className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company"
                    name="company"
                    value={billingDetails.company}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="street1" className="form-label">Street Address 1 *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street1"
                    name="street1"
                    value={billingDetails.street1}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="street2" className="form-label">Street Address 2</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street2"
                    name="street2"
                    value={billingDetails.street2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="town" className="form-label">Town/City *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="town"
                      name="town"
                      value={billingDetails.town}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="district" className="form-label">District/State *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="district"
                      name="district"
                      value={billingDetails.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="zip" className="form-label">ZIP Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      name="zip"
                      value={billingDetails.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="country" className="form-label">Country *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={billingDetails.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate('/asset-inventory', { state: { selectedPlan } })}
                  >
                    Back to Asset Inventory
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCheckout;
