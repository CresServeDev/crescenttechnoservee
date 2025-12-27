import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginIcon from "./LoginIcon";
import Header from "./Header";

const OrderTracking = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [serviceSubscriptions, setServiceSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  const orderStatuses = [
    { key: "pending", label: "Order Placed", description: "Your order has been received and is being processed." },
    { key: "processing", label: "Processing", description: "Your order is being prepared for shipment." },
    { key: "shipped", label: "Shipped", description: "Your order has been shipped and is on its way." },
    { key: "delivered", label: "Delivered", description: "Your order has been successfully delivered." }
  ];

  const getCurrentStep = (status) => {
    return orderStatuses.findIndex(step => step.key === status);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserOrders(currentUser.uid);
      } else {
        setOrders([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (location.state && location.state.orderId) {
      setOrderId(location.state.orderId);
      handleTrackOrder(null, location.state.orderId);
    }
  }, [location.state]);

  const fetchUserOrders = async (userId) => {
    try {
      // Fetch regular orders
      const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
      const ordersSnapshot = await getDocs(ordersQuery);
      const userOrders = [];
      ordersSnapshot.forEach((doc) => {
        userOrders.push({ id: doc.id, ...doc.data() });
      });
      setOrders(userOrders);

      // Fetch service subscriptions
      const subscriptionsQuery = query(collection(db, "serviceSubscriptions"), where("userId", "==", userId));
      const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
      const userSubscriptions = [];
      subscriptionsSnapshot.forEach((doc) => {
        userSubscriptions.push({ id: doc.id, ...doc.data() });
      });
      setServiceSubscriptions(userSubscriptions);
    } catch (error) {
      console.error("Error fetching orders and subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = async (e, providedOrderId = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setOrderData(null);

    const idToUse = providedOrderId || orderId;

    if (!idToUse.trim()) {
      setError("Please enter a valid Order ID.");
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "orders", idToUse);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrderData(docSnap.data());
      } else {
        setError("Order not found. Please check your Order ID.");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to fetch order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const assetPath = (path) => `${process.env.PUBLIC_URL || ""}/${path}`;

  const styles = {
    orderTrackingPage: {
      padding: '20px 0',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
    },
    orderTrackingForm: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      marginBottom: '30px',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    formTitle: {
      marginBottom: '25px',
      color: '#2c3e50',
      fontSize: '2rem',
      fontWeight: '700',
      textAlign: 'center',
      position: 'relative',
    },
    formGroup: {
      marginBottom: '25px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#34495e',
      fontSize: '1.1rem',
    },
    formInput: {
      width: '100%',
      padding: '15px 20px',
      border: '2px solid #e1e8ed',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    submitBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102,126,234,0.6)',
    },
    submitBtnDisabled: {
      background: '#bdc3c7',
      cursor: 'not-allowed',
      boxShadow: 'none',
      transform: 'none',
    },
    orderTrackingDetails: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    orderHeader: {
      borderBottom: '1px solid #ddd',
      paddingBottom: '20px',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    orderTitle: {
      margin: '0',
      color: '#333',
    },
    orderDate: {
      color: '#666',
      margin: '5px 0 0 0',
    },
    trackingProgress: {
      position: 'relative',
      marginBottom: '50px',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
    },
    progressSteps: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: '2',
    },
    step: {
      flex: '1',
      textAlign: 'center',
      position: 'relative',
      transition: 'all 0.3s ease',
    },
    stepCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      margin: '0 auto 15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      border: '3px solid #fff',
    },
    stepCompleted: {
      background: 'linear-gradient(135deg, #00a650 0%, #28a745 100%)',
      transform: 'scale(1.1)',
      boxShadow: '0 6px 20px rgba(0,166,80,0.4)',
    },
    stepCurrent: {
      background: 'linear-gradient(135deg, #ff9900 0%, #ff8c00 100%)',
      transform: 'scale(1.1)',
      boxShadow: '0 6px 20px rgba(255,153,0,0.4)',
      animation: 'pulse 2s infinite',
    },
    stepTitle: {
      margin: '0 0 8px 0',
      fontSize: '16px',
      fontWeight: '600',
      color: '#2c3e50',
    },
    stepDescription: {
      margin: '0',
      fontSize: '14px',
      color: '#7f8c8d',
      lineHeight: '1.4',
    },
    stepDate: {
      color: '#34495e',
      fontWeight: '600',
      fontSize: '13px',
      marginTop: '8px',
    },
    progressLine: {
      position: 'absolute',
      top: '30px',
      left: '0',
      right: '0',
      height: '4px',
      background: 'linear-gradient(90deg, #bdc3c7 0%, #95a5a6 100%)',
      zIndex: '1',
      borderRadius: '2px',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #00a650 0%, #28a745 100%)',
      transition: 'width 0.5s ease-in-out',
      borderRadius: '2px',
      boxShadow: '0 2px 10px rgba(0,166,80,0.3)',
    },
    section: {
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #eee',
    },
    sectionTitle: {
      marginBottom: '15px',
      color: '#333',
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom: '1px solid #f0f0f0',
    },
    itemTitle: {
      margin: '0 0 5px 0',
      fontSize: '16px',
    },
    itemDetail: {
      margin: '2px 0',
      color: '#666',
      fontSize: '14px',
    },
    orderTotal: {
      textAlign: 'right',
      marginTop: '20px',
      fontSize: '18px',
      color: '#333',
    },
    addressDetail: {
      margin: '5px 0',
      color: '#666',
    },
    errorText: {
      color: '#dc3545',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    tabButton: {
      background: 'transparent',
      border: 'none',
      padding: '15px 30px',
      margin: '0 10px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      color: '#34495e',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    tabButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
      transform: 'translateY(-2px)',
    },
    tabButtonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    tabIcon: {
      marginRight: '8px',
      fontSize: '18px',
    },
  };

  return (
    <div className="order-tracking-page">
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
        <section className="breadcrumb__area breadcrumb__bg fix" style={{
          backgroundImage: `url(${assetPath("assets/img/bg/breadcrumb_bg.jpg")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '200px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb__content">
                  <h2 className="title">Order Tracking</h2>
                  <nav className="breadcrumb">
                    <span>
                      <a href="index.html">Home</a>
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span>Order Tracking</span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <div className="order-tracking-hero" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          padding: '60px 40px',
          marginBottom: '60px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            zIndex: 2,
            position: 'relative'
          }}>Track Your Orders</h1>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '0',
            opacity: '0.9',
            zIndex: 2,
            position: 'relative',
            maxWidth: '600px',
            margin: '0 auto 20px'
          }}>Stay updated on your order status and delivery information</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            zIndex: 2,
            position: 'relative',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '15px 25px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{margin: '0', fontSize: '1.5rem', fontWeight: 'bold'}}>Real-time Updates</h3>
              <p style={{margin: '5px 0 0', fontSize: '0.9rem'}}>Get instant notifications</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '15px 25px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{margin: '0', fontSize: '1.5rem', fontWeight: 'bold'}}>Secure Tracking</h3>
              <p style={{margin: '5px 0 0', fontSize: '0.9rem'}}>Your data is protected</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '15px 25px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{margin: '0', fontSize: '1.5rem', fontWeight: 'bold'}}>24/7 Support</h3>
              <p style={{margin: '5px 0 0', fontSize: '0.9rem'}}>Always here to help</p>
            </div>
          </div>
        </div>

        <section className="order-tracking__area section-py-140">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {user ? (
                  <>
                    {/* Tab Navigation */}
                    <div style={styles.tabContainer}>
                      <button
                        style={{
                          ...styles.tabButton,
                          ...(activeTab === "orders" ? styles.tabButtonActive : {}),
                        }}
                        onClick={() => setActiveTab("orders")}
                        onMouseEnter={(e) => {
                          if (activeTab !== "orders") {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeTab !== "orders") {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <span style={styles.tabIcon}>📦</span>
                        Your Orders ({orders.length})
                      </button>
                      <button
                        style={{
                          ...styles.tabButton,
                          ...(activeTab === "subscriptions" ? styles.tabButtonActive : {}),
                        }}
                        onClick={() => setActiveTab("subscriptions")}
                        onMouseEnter={(e) => {
                          if (activeTab !== "subscriptions") {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeTab !== "subscriptions") {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <span style={styles.tabIcon}>🔄</span>
                        Service Subscriptions ({serviceSubscriptions.length})
                      </button>
                      <button
                        style={{
                          ...styles.tabButton,
                          ...(activeTab === "track" ? styles.tabButtonActive : {}),
                        }}
                        onClick={() => setActiveTab("track")}
                        onMouseEnter={(e) => {
                          if (activeTab !== "track") {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeTab !== "track") {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <span style={styles.tabIcon}>🔍</span>
                        Track Order
                      </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "orders" && (
                      <div style={styles.orderTrackingForm}>
                        <h2 style={styles.formTitle}>Your Orders</h2>
                        {loading ? (
                          <p>Loading your orders...</p>
                        ) : orders.length === 0 ? (
                          <p>You have no orders yet.</p>
                        ) : (
                          <div>
                            {orders.map((order) => (
                              <div key={order.id} style={{...styles.orderTrackingDetails, marginBottom: '20px'}}>
                                <div style={styles.orderHeader}>
                                  <h3 style={styles.orderTitle}>Order #{order.id}</h3>
                                  <p style={styles.orderDate}>Ordered on {new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
                                  <span style={{
                                    padding: '5px 15px',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    backgroundColor: order.status === 'delivered' ? '#d4edda' : order.status === 'shipped' ? '#cce5ff' : '#fff3cd',
                                    color: order.status === 'delivered' ? '#155724' : order.status === 'shipped' ? '#004085' : '#856404'
                                  }}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </div>

                                {/* Amazon-style Progress Bar */}
                                <div style={styles.trackingProgress}>
                                  <div style={styles.progressSteps}>
                                    {orderStatuses.map((step, index) => {
                                      const currentStep = getCurrentStep(order.status);
                                      const isCompleted = index <= currentStep;
                                      const isCurrent = index === currentStep;

                                      return (
                                        <div key={step.key} style={styles.step}>
                                          <div style={{
                                            ...styles.stepCircle,
                                            ...(isCompleted ? styles.stepCompleted : {}),
                                            ...(isCurrent ? styles.stepCurrent : {}),
                                          }}>
                                            {isCompleted && <span>✓</span>}
                                          </div>
                                          <div>
                                            <h4 style={styles.stepTitle}>{step.label}</h4>
                                            <p style={styles.stepDescription}>{step.description}</p>
                                            {isCurrent && (
                                              <p style={styles.stepDate}>
                                                {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div style={styles.progressLine}>
                                    <div
                                      style={{
                                        ...styles.progressFill,
                                        width: `${(getCurrentStep(order.status) + 1) / orderStatuses.length * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div style={styles.section}>
                                  <h4 style={styles.sectionTitle}>Items in Your Order</h4>
                                  <div>
                                    {order.items.map((item, index) => (
                                      <div key={index} style={styles.orderItem}>
                                        <div>
                                          <h5 style={styles.itemTitle}>{item.title}</h5>
                                          <p style={styles.itemDetail}>Quantity: {item.qty}</p>
                                          <p style={styles.itemDetail}>Price: ₹{(item.price * item.qty * 83).toFixed(2)}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div style={styles.orderTotal}>
                                    <strong>Total: ₹{order.total.toFixed(2)}</strong>
                                  </div>
                                </div>

                                {/* Delivery Address */}
                                <div style={styles.section}>
                                  <h4 style={styles.sectionTitle}>Delivery Address</h4>
                                  <div>
                                    <p style={styles.addressDetail}><strong>{order.billingDetails.firstName} {order.billingDetails.lastName}</strong></p>
                                    <p style={styles.addressDetail}>{order.billingDetails.street1}</p>
                                    {order.billingDetails.street2 && <p style={styles.addressDetail}>{order.billingDetails.street2}</p>}
                                    <p style={styles.addressDetail}>{order.billingDetails.town}, {order.billingDetails.district}</p>
                                    <p style={styles.addressDetail}>{order.billingDetails.zip}</p>
                                    <p style={styles.addressDetail}>{order.billingDetails.country}</p>
                                    <p style={styles.addressDetail}>Phone: {order.billingDetails.phone}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "subscriptions" && (
                      <div style={styles.orderTrackingForm}>
                        <h2 style={styles.formTitle}>Your Service Subscriptions</h2>
                        {loading ? (
                          <p>Loading your subscriptions...</p>
                        ) : serviceSubscriptions.length === 0 ? (
                          <p>You have no service subscriptions yet.</p>
                        ) : (
                          <div>
                            {serviceSubscriptions.map((subscription) => (
                              <div key={subscription.id} style={{...styles.orderTrackingDetails, marginBottom: '20px'}}>
                                <div style={styles.orderHeader}>
                                  <h3 style={styles.orderTitle}>Subscription #{subscription.id}</h3>
                                  <p style={styles.orderDate}>Subscribed on {new Date(subscription.createdAt.seconds * 1000).toLocaleString()}</p>
                                  <span style={{
                                    padding: '5px 15px',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    backgroundColor: subscription.status === 'active' ? '#d4edda' : '#f8d7da',
                                    color: subscription.status === 'active' ? '#155724' : '#721c24'
                                  }}>
                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                  </span>
                                </div>

                                {/* Subscription Details */}
                                <div style={styles.section}>
                                  <h4 style={styles.sectionTitle}>Subscription Details</h4>
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '20px'
                                  }}>
                                    <div style={styles.orderItem}>
                                      <div>
                                        <h5 style={styles.itemTitle}>{subscription.planName}</h5>
                                        <p style={styles.itemDetail}>Plan ID: {subscription.planId}</p>
                                        <p style={styles.itemDetail}>Price: ₹{subscription.planPrice.toFixed(2)}</p>
                                      </div>
                                    </div>
                                    <div style={styles.orderItem}>
                                      <div>
                                        <h5 style={styles.itemTitle}>Subscription Period</h5>
                                        <p style={styles.itemDetail}>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</p>
                                        <p style={styles.itemDetail}>End Date: {new Date(subscription.endDate).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Billing Details */}
                                <div style={styles.section}>
                                  <h4 style={styles.sectionTitle}>Billing Details</h4>
                                  <div>
                                    <p style={styles.addressDetail}><strong>{subscription.billingDetails.firstName} {subscription.billingDetails.lastName}</strong></p>
                                    <p style={styles.addressDetail}>{subscription.billingDetails.company}</p>
                                    <p style={styles.addressDetail}>{subscription.billingDetails.street1}</p>
                                    {subscription.billingDetails.street2 && <p style={styles.addressDetail}>{subscription.billingDetails.street2}</p>}
                                    <p style={styles.addressDetail}>{subscription.billingDetails.town}, {subscription.billingDetails.district}</p>
                                    <p style={styles.addressDetail}>{subscription.billingDetails.zip}</p>
                                    <p style={styles.addressDetail}>{subscription.billingDetails.country}</p>
                                    <p style={styles.addressDetail}>Email: {subscription.billingDetails.email}</p>
                                    <p style={styles.addressDetail}>Phone: {subscription.billingDetails.phone}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "track" && (
                      <div style={styles.orderTrackingForm}>
                        <h2 style={styles.formTitle}>Track Specific Order</h2>
                        <form onSubmit={handleTrackOrder}>
                          <div style={styles.formGroup}>
                            <label htmlFor="order-id" style={styles.formLabel}>Order ID</label>
                            <input
                              type="text"
                              id="order-id"
                              value={orderId}
                              onChange={(e) => setOrderId(e.target.value)}
                              placeholder="Enter your Order ID"
                              required
                              style={styles.formInput}
                            />
                          </div>
                          <button
                            type="submit"
                            style={{
                              ...styles.submitBtn,
                              ...(loading ? styles.submitBtnDisabled : {}),
                            }}
                            disabled={loading}
                          >
                            {loading ? "Tracking..." : "Track Order"}
                          </button>
                        </form>
                        {error && <p style={{...styles.errorText, marginTop: '20px'}}>{error}</p>}
                      </div>
                    )}

                    {orderData && (
                      <div style={styles.orderTrackingDetails}>
                        <div style={styles.orderHeader}>
                          <h3 style={styles.orderTitle}>Specific Order #{orderId}</h3>
                          <p style={styles.orderDate}>Ordered on {new Date(orderData.createdAt.seconds * 1000).toLocaleString()}</p>
                        </div>

                        {/* Amazon-style Progress Bar */}
                        <div style={styles.trackingProgress}>
                          <div style={styles.progressSteps}>
                            {orderStatuses.map((step, index) => {
                              const currentStep = getCurrentStep(orderData.status);
                              const isCompleted = index <= currentStep;
                              const isCurrent = index === currentStep;

                              return (
                                <div key={step.key} style={styles.step}>
                                  <div style={{
                                    ...styles.stepCircle,
                                    ...(isCompleted ? styles.stepCompleted : {}),
                                    ...(isCurrent ? styles.stepCurrent : {}),
                                  }}>
                                    {isCompleted && <span>✓</span>}
                                  </div>
                                  <div>
                                    <h4 style={styles.stepTitle}>{step.label}</h4>
                                    <p style={styles.stepDescription}>{step.description}</p>
                                    {isCurrent && (
                                      <p style={styles.stepDate}>
                                        {new Date(orderData.createdAt.seconds * 1000).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div style={styles.progressLine}>
                            <div
                              style={{
                                ...styles.progressFill,
                                width: `${(getCurrentStep(orderData.status) + 1) / orderStatuses.length * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div style={styles.section}>
                          <h4 style={styles.sectionTitle}>Items in Your Order</h4>
                          <div>
                            {orderData.items.map((item, index) => (
                              <div key={index} style={styles.orderItem}>
                                <div>
                                  <h5 style={styles.itemTitle}>{item.title}</h5>
                                  <p style={styles.itemDetail}>Quantity: {item.qty}</p>
                                  <p style={styles.itemDetail}>Price: ₹{(item.price * item.qty * 83).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={styles.orderTotal}>
                            <strong>Total: ₹{orderData.total.toFixed(2)}</strong>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div style={styles.section}>
                          <h4 style={styles.sectionTitle}>Delivery Address</h4>
                          <div>
                            <p style={styles.addressDetail}><strong>{orderData.billingDetails.firstName} {orderData.billingDetails.lastName}</strong></p>
                            <p style={styles.addressDetail}>{orderData.billingDetails.street1}</p>
                            {orderData.billingDetails.street2 && <p style={styles.addressDetail}>{orderData.billingDetails.street2}</p>}
                            <p style={styles.addressDetail}>{orderData.billingDetails.town}, {orderData.billingDetails.district}</p>
                            <p style={styles.addressDetail}>{orderData.billingDetails.zip}</p>
                            <p style={styles.addressDetail}>{orderData.billingDetails.country}</p>
                            <p style={styles.addressDetail}>Phone: {orderData.billingDetails.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={styles.orderTrackingForm}>
                    <h2 style={styles.formTitle}>Please Log In</h2>
                    <p>You need to be logged in to view your orders. <Link to="/login">Login here</Link></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderTracking;
