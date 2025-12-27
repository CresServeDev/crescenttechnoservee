import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AssetInventory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.selectedPlan;

  const [assets, setAssets] = useState([]);
  const [currentAsset, setCurrentAsset] = useState({
    pcName: '',
    serialNumber: '',
    ram: '',
    processor: '',
    hdd: '',
    ssd: '',
    deviceType: '',
    model: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [nextAssetId, setNextAssetId] = useState(1);

  useEffect(() => {
    if (!selectedPlan) {
      navigate('/service-packages');
    }
  }, [selectedPlan, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchNextAssetId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchNextAssetId = async (userId) => {
    try {
      const assetsQuery = query(collection(db, "userAssets"), where("userId", "==", userId));
      const assetsSnapshot = await getDocs(assetsQuery);
      const assetCount = assetsSnapshot.size;
      setNextAssetId(assetCount + 1);
    } catch (error) {
      console.error("Error fetching asset count:", error);
    }
  };

  const generateAssetId = () => {
    return `CT-${String(nextAssetId).padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAsset(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAsset = () => {
    // Validate required fields
    const requiredFields = ['pcName', 'deviceType', 'serialNumber', 'ram', 'processor'];
    const missingFields = requiredFields.filter(field => !currentAsset[field].trim());

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.map(field => {
        const fieldNames = {
          pcName: 'PC Name',
          deviceType: 'Device Type',
          serialNumber: 'Serial Number',
          ram: 'RAM',
          processor: 'Processor'
        };
        return fieldNames[field];
      }).join(', ')}`);
      return;
    }

    // Check for duplicate serial number
    const duplicateSerial = assets.find(asset => asset.serialNumber.toLowerCase() === currentAsset.serialNumber.toLowerCase());
    if (duplicateSerial) {
      setError('This serial number has already been added. Please use a different serial number.');
      return;
    }

    const newAsset = {
      ...currentAsset,
      assetId: generateAssetId(),
      createdAt: new Date()
    };

    setAssets(prev => [...prev, newAsset]);
    setCurrentAsset({
      pcName: '',
      serialNumber: '',
      ram: '',
      processor: '',
      hdd: '',
      ssd: '',
      deviceType: '',
      model: ''
    });
    setNextAssetId(prev => prev + 1);
    setError('');
  };

  const removeAsset = (index) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckout = async () => {
    const minAssets = selectedPlan.id === 'basic' ? 5 : 1;

    if (assets.length < minAssets) {
      setError(`You must add at least ${minAssets} asset(s) for the ${selectedPlan.name} plan.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save assets to Firestore
      const assetPromises = assets.map(asset =>
        addDoc(collection(db, 'userAssets'), {
          ...asset,
          userId: currentUser.uid,
          planId: selectedPlan.id,
          createdAt: serverTimestamp()
        })
      );

      await Promise.all(assetPromises);

      // Navigate to checkout with assets data
      navigate('/service-checkout', {
        state: {
          selectedPlan,
          assets
        }
      });
    } catch (error) {
      console.error('Error saving assets:', error);
      setError('Failed to save assets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const minAssets = selectedPlan.id === 'basic' ? 5 : 1;

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh', padding: '20px 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              marginBottom: '20px',
              padding: '24px'
            }}>
              <div style={{
                backgroundColor: '#232f3e',
                color: 'white',
                padding: '16px',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                  Add Asset Inventory - {selectedPlan.name} Package
                </h2>
              </div>

              {/* Plan Summary */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                marginBottom: '24px'
              }}>
                <h4 style={{ color: '#111', marginBottom: '16px', fontSize: '18px' }}>Selected Plan</h4>
                <div className="row">
                  <div className="col-md-8">
                    <h3 style={{ color: '#007185', marginBottom: '8px', fontSize: '22px' }}>
                      {selectedPlan.name} Package
                    </h3>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', color: '#111' }}>
                        Minimum assets required: <strong>{minAssets}</strong>
                      </span>
                      <span style={{ fontSize: '16px', color: '#111' }}>
                        Current assets added: <strong>{assets.length}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#b12704' }}>
                      ₹{selectedPlan.price}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>per month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Asset Form Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              marginBottom: '20px',
              padding: '24px'
            }}>
              <h4 style={{ color: '#111', marginBottom: '24px', fontSize: '20px' }}>Add New Asset</h4>
              {/* Plan Summary */}
              <div className="mb-4 p-3 bg-light rounded">
                <h5>Selected Plan</h5>
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="text-primary">{selectedPlan.name} Package</h4>
                    <p className="mb-2">Minimum assets required: <strong>{minAssets}</strong></p>
                    <p className="mb-0">Current assets added: <strong>{assets.length}</strong></p>
                  </div>
                  <div className="col-md-4 text-end">
                    <h3 className="text-primary">₹{selectedPlan.price}</h3>
                    <small className="text-muted">per month</small>
                  </div>
                </div>
              </div>

              {/* Add Asset Form */}
              <div className="mb-4">
                <h5>Add New Asset</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="pcName" className="form-label">PC Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="pcName"
                      name="pcName"
                      value={currentAsset.pcName}
                      onChange={handleInputChange}
                      placeholder="e.g., Workstation-01"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="deviceType" className="form-label">Device Type *</label>
                    <select
                      className="form-control"
                      id="deviceType"
                      name="deviceType"
                      value={currentAsset.deviceType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Device Type</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Laptop">Laptop</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="serialNumber" className="form-label">Serial Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="serialNumber"
                      name="serialNumber"
                      value={currentAsset.serialNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., SN123456789"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="model" className="form-label">Model</label>
                    <input
                      type="text"
                      className="form-control"
                      id="model"
                      name="model"
                      value={currentAsset.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Dell OptiPlex 7090"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="ram" className="form-label">RAM *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ram"
                      name="ram"
                      value={currentAsset.ram}
                      onChange={handleInputChange}
                      placeholder="e.g., 16GB DDR4"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="processor" className="form-label">Processor *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="processor"
                      name="processor"
                      value={currentAsset.processor}
                      onChange={handleInputChange}
                      placeholder="e.g., Intel Core i7-10700K"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="hdd" className="form-label">HDD Storage</label>
                    <input
                      type="text"
                      className="form-control"
                      id="hdd"
                      name="hdd"
                      value={currentAsset.hdd}
                      onChange={handleInputChange}
                      placeholder="e.g., 1TB"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="ssd" className="form-label">SSD Storage</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ssd"
                      name="ssd"
                      value={currentAsset.ssd}
                      onChange={handleInputChange}
                      placeholder="e.g., 512GB NVMe"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={addAsset}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Asset (ID: {generateAssetId()})
                  </button>
                </div>
              </div>

              {/* Assets List */}
              {assets.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#111', marginBottom: '16px', fontSize: '18px' }}>
                    Added Assets ({assets.length})
                  </h4>
                  <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      backgroundColor: '#f7f7f7',
                      padding: '12px 16px',
                      borderBottom: '1px solid #ddd',
                      fontWeight: 'bold',
                      color: '#111'
                    }}>
                      Asset Details
                    </div>
                    {assets.map((asset, index) => (
                      <div key={index} style={{
                        padding: '16px',
                        borderBottom: index < assets.length - 1 ? '1px solid #ddd' : 'none',
                        backgroundColor: 'white'
                      }}>
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <div style={{
                              backgroundColor: '#232f3e',
                              color: 'white',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}>
                              {asset.assetId}
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              <span><strong>PC Name:</strong> {asset.pcName}</span>
                              <span><strong>Type:</strong> {asset.deviceType}</span>
                              <span><strong>Model:</strong> {asset.model || 'N/A'}</span>
                              <span><strong>Serial:</strong> {asset.serialNumber}</span>
                              <span><strong>RAM:</strong> {asset.ram}</span>
                              <span><strong>Processor:</strong> {asset.processor}</span>
                              {asset.hdd && <span><strong>HDD:</strong> {asset.hdd}</span>}
                              {asset.ssd && <span><strong>SSD:</strong> {asset.ssd}</span>}
                            </div>
                          </div>
                          <div className="col-md-2 text-end">
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => removeAsset(index)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px'
                              }}
                            >
                              <i className="fas fa-trash" style={{ marginRight: '4px' }}></i>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  border: '1px solid #f5c6cb',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate('/service-packages')}
                  style={{
                    backgroundColor: '#f7f7f7',
                    border: '1px solid #ccc',
                    color: '#111',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                  Back to Packages
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handleProceedToCheckout}
                  disabled={loading || assets.length < minAssets}
                  style={{
                    backgroundColor: loading || assets.length < minAssets ? '#ccc' : '#ffa41c',
                    border: '1px solid #ff8f00',
                    color: '#111',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: loading || assets.length < minAssets ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
                      Proceed to Checkout ({assets.length} assets)
                    </>
                  )}
                </button>
              </div>

              {assets.length < minAssets && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  border: '1px solid #ffeaa7',
                  marginTop: '16px'
                }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                  You need to add at least {minAssets - assets.length} more asset(s) to proceed.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetInventory;
