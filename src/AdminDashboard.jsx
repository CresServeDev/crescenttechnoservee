import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [billingDetails, setBillingDetails] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [serviceSubscriptions, setServiceSubscriptions] = useState([]);
  const [subscriptionChartData, setSubscriptionChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log("Fetching data from Firebase...");

      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Orders fetched:", ordersData.length, ordersData);
      setOrders(ordersData);

      // Fetch user profiles from "users" collection
      let usersData = [];
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("User profiles fetched:", usersData.length, usersData);
      } catch (error) {
        console.log("users collection doesn't exist or error fetching:", error.message);
        // Create mock user data from orders if users collection doesn't exist
        const uniqueUserIds = [...new Set(ordersData.map(order => order.userId))];
        usersData = uniqueUserIds.map(userId => {
          // Get billing details from the user's orders
          const userOrder = ordersData.find(order => order.userId === userId);
          const billing = userOrder?.billingDetails;
          const displayName = billing ? `${billing.firstName || ''} ${billing.lastName || ''}`.trim() || 'N/A' : 'N/A';
          const email = billing?.email || 'N/A';
          return {
            id: userId,
            email,
            displayName,
            name: displayName
          };
        });
        console.log("Mock users created:", usersData.length, usersData);
      }
      setUsers(usersData);

      // Fetch billing details
      try {
        const billingSnapshot = await getDocs(collection(db, "billingDetails"));
        const billingData = {};
        billingSnapshot.docs.forEach(doc => {
          billingData[doc.id] = doc.data();
        });
        console.log("Billing details fetched:", Object.keys(billingData).length, billingData);
        setBillingDetails(billingData);
      } catch (error) {
        console.error("Error fetching billing details:", error);
      }

      // Process sales data for chart
      const salesByDate = {};
      ordersData.forEach(order => {
        const date = order.createdAt?.toDate()?.toISOString().split('T')[0] || 'Unknown';
        if (!salesByDate[date]) {
          salesByDate[date] = 0;
        }
        salesByDate[date] += order.total || 0;
      });

      const chartData = Object.keys(salesByDate).map(date => ({
        date,
        sales: salesByDate[date]
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log("Sales data processed:", chartData);
      setSalesData(chartData);

      // Fetch service subscriptions
      try {
        const subscriptionsSnapshot = await getDocs(collection(db, "serviceSubscriptions"));
        const subscriptionsData = subscriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Service subscriptions fetched:", subscriptionsData.length, subscriptionsData);
        setServiceSubscriptions(subscriptionsData);
      } catch (error) {
        console.error("Error fetching service subscriptions:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Process subscription data for chart
  useEffect(() => {
    if (serviceSubscriptions.length > 0) {
      // Group subscriptions by plan name
      const planCounts = {};
      serviceSubscriptions.forEach(subscription => {
        const planName = subscription.planName || 'Unknown';
        planCounts[planName] = (planCounts[planName] || 0) + 1;
      });

      // Convert to chart data format
      const chartData = Object.keys(planCounts).map(planName => ({
        plan: planName,
        subscriptions: planCounts[planName],
        revenue: planCounts[planName] * (serviceSubscriptions.find(s => s.planName === planName)?.planPrice || 0)
      }));

      setSubscriptionChartData(chartData);
    }
  }, [serviceSubscriptions]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getUserName = (userId) => {
    // First try to get from user profiles
    const user = users.find(u => u.id === userId);
    if (user && (user.displayName || user.name)) {
      return user.displayName || user.name;
    }

    // Try to get from saved billing details collection (fetched at component level)
    const billingData = billingDetails[userId];
    if (billingData) {
      const { firstName, lastName } = billingData;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (lastName) {
        return lastName;
      }
    }

    // If no saved billing details, get from billing details in orders
    const userOrder = orders.find(order => order.userId === userId);
    if (userOrder && userOrder.billingDetails) {
      const { firstName, lastName } = userOrder.billingDetails;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (lastName) {
        return lastName;
      }
    }

    // Fallback to a default username
    return `User ${userId.slice(-4)}`;
  };

  const getUserEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.email || 'N/A';
  };

  const getUserAddress = (userId) => {
    // Try to get from saved billing details collection (fetched at component level)
    const billingData = billingDetails[userId];
    if (billingData) {
      const { street1, street2, town, district, zip, country } = billingData;
      const addressParts = [street1, street2, town, district, zip, country].filter(part => part);
      return addressParts.join(', ') || 'N/A';
    }

    // If no saved billing details, get from billing details in orders
    const userOrder = orders.find(order => order.userId === userId);
    if (userOrder && userOrder.billingDetails) {
      const { street1, street2, town, district, zip, country } = userOrder.billingDetails;
      const addressParts = [street1, street2, town, district, zip, country].filter(part => part);
      return addressParts.join(', ') || 'N/A';
    }

    return 'N/A';
  };

  const renderOverviewTab = () => (
    <>
      {/* Key Metrics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-shopping-cart text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                <h3 className="text-primary mb-0">{orders.length}</h3>
              </div>
              <h6 className="text-muted mb-0">Total Orders</h6>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-users text-success me-2" style={{ fontSize: '1.5rem' }}></i>
                <h3 className="text-success mb-0">{users.length}</h3>
              </div>
              <h6 className="text-muted mb-0">Total Users</h6>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-rupee-sign text-info me-2" style={{ fontSize: '1.5rem' }}></i>
                <h3 className="text-info mb-0">₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}</h3>
              </div>
              <h6 className="text-muted mb-0">Total Sales</h6>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-clock text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
                <h3 className="text-warning mb-0">{orders.filter(order => order.status === 'pending').length}</h3>
              </div>
              <h6 className="text-muted mb-0">Pending Orders</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-line text-primary me-2"></i>
                Sales Overview
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6c757d" />
                  <YAxis stroke="#6c757d" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-bar text-success me-2"></i>
                Service Subscriptions
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subscriptionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="plan" stroke="#6c757d" />
                  <YAxis stroke="#6c757d" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="subscriptions" fill="#28a745" name="Subscriptions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderOrdersTab = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="fas fa-shopping-bag text-primary me-2"></i>
          {selectedUser ? `Orders for ${getUserName(selectedUser.id)}` : 'All Orders'}
        </h5>
        {selectedUser && (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setSelectedUser(null)}
          >
            <i className="fas fa-times me-1"></i>
            Show All Orders
          </button>
        )}
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0 fw-semibold">Order ID</th>
                <th className="border-0 fw-semibold">Customer</th>
                <th className="border-0 fw-semibold">Products</th>
                <th className="border-0 fw-semibold">Total</th>
                <th className="border-0 fw-semibold">Status</th>
                <th className="border-0 fw-semibold">Date</th>
                <th className="border-0 fw-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(selectedUser ? orders.filter(order => order.userId === selectedUser.id) : orders).map(order => (
                <tr key={order.id}>
                  <td className="align-middle">
                    <code className="text-muted">{order.id.slice(-8)}</code>
                  </td>
                  <td className="align-middle">{getUserName(order.userId)}</td>
                  <td className="align-middle">
                    <div style={{ maxWidth: '250px' }}>
                      {order.items && order.items.length > 0 ? (
                        <small className="text-muted">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.title} <span className="badge bg-light text-dark">×{item.qty}</span>
                            </div>
                          ))}
                        </small>
                      ) : (
                        <span className="text-muted">No products</span>
                      )}
                    </div>
                  </td>
                  <td className="align-middle fw-semibold text-primary">₹{order.total?.toFixed(2) || '0.00'}</td>
                  <td className="align-middle">
                    <span className={`badge ${
                      order.status === 'pending' ? 'bg-warning' :
                      order.status === 'processing' ? 'bg-primary' :
                      order.status === 'shipped' ? 'bg-info' :
                      'bg-success'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="align-middle text-muted">
                    {order.createdAt?.toDate()?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="align-middle">
                    <select
                      className="form-select form-select-sm"
                      value={order.status || 'pending'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ minWidth: '120px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0">
        <h5 className="card-title mb-0">
          <i className="fas fa-users text-success me-2"></i>
          User Management
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0 fw-semibold">User ID</th>
                <th className="border-0 fw-semibold">Name</th>
                <th className="border-0 fw-semibold">Email</th>
                <th className="border-0 fw-semibold">Address</th>
                <th className="border-0 fw-semibold">Orders</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const userOrders = orders.filter(order => order.userId === user.id);
                return (
                  <tr
                    key={user.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                    className={selectedUser?.id === user.id ? 'table-active' : ''}
                  >
                    <td className="align-middle">
                      <code className="text-muted">{user.id.slice(-8)}</code>
                    </td>
                    <td className="align-middle fw-semibold">{getUserName(user.id)}</td>
                    <td className="align-middle">{user.email || 'N/A'}</td>
                    <td className="align-middle">
                      <small className="text-muted">{getUserAddress(user.id)}</small>
                    </td>
                    <td className="align-middle">
                      <span className="badge bg-primary">{userOrders.length}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0">
        <h5 className="card-title mb-0">
          <i className="fas fa-crown text-warning me-2"></i>
          Service Subscriptions
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0 fw-semibold">ID</th>
                <th className="border-0 fw-semibold">Plan</th>
                <th className="border-0 fw-semibold">Customer</th>
                <th className="border-0 fw-semibold">Email</th>
                <th className="border-0 fw-semibold">Price</th>
                <th className="border-0 fw-semibold">Start Date</th>
                <th className="border-0 fw-semibold">End Date</th>
                <th className="border-0 fw-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {serviceSubscriptions.map(subscription => (
                <tr key={subscription.id}>
                  <td className="align-middle">
                    <code className="text-muted">{subscription.id.slice(-8)}</code>
                  </td>
                  <td className="align-middle">
                    <span className="badge bg-light text-dark fw-semibold">{subscription.planName}</span>
                  </td>
                  <td className="align-middle fw-semibold">
                    {subscription.billingDetails ? `${subscription.billingDetails.firstName} ${subscription.billingDetails.lastName}` : 'N/A'}
                  </td>
                  <td className="align-middle">{subscription.billingDetails?.email || 'N/A'}</td>
                  <td className="align-middle fw-semibold text-success">₹{subscription.planPrice}</td>
                  <td className="align-middle text-muted">
                    {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="align-middle text-muted">
                    {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="align-middle">
                    <span className={`badge ${subscription.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                      {subscription.status || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1 text-dark">Admin Dashboard</h1>
                <p className="text-muted mb-0">Manage your e-commerce platform efficiently</p>
              </div>
              <div className="text-end">
                <small className="text-muted">Last updated: {new Date().toLocaleString()}</small>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="row mb-4">
              <div className="col-12">
                <nav>
                  <div className="nav nav-tabs border-0" id="nav-tab" role="tablist">
                    <button
                      className={`nav-link border-0 me-1 ${activeTab === 'overview' ? 'active bg-white shadow-sm' : 'text-muted'}`}
                      onClick={() => setActiveTab('overview')}
                      style={{ borderRadius: '0.375rem 0.375rem 0 0' }}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Overview
                    </button>
                    <button
                      className={`nav-link border-0 me-1 ${activeTab === 'orders' ? 'active bg-white shadow-sm' : 'text-muted'}`}
                      onClick={() => setActiveTab('orders')}
                      style={{ borderRadius: '0.375rem 0.375rem 0 0' }}
                    >
                      <i className="fas fa-shopping-bag me-2"></i>
                      Orders
                    </button>
                    <button
                      className={`nav-link border-0 me-1 ${activeTab === 'users' ? 'active bg-white shadow-sm' : 'text-muted'}`}
                      onClick={() => setActiveTab('users')}
                      style={{ borderRadius: '0.375rem 0.375rem 0 0' }}
                    >
                      <i className="fas fa-users me-2"></i>
                      Users
                    </button>
                    <button
                      className={`nav-link border-0 ${activeTab === 'subscriptions' ? 'active bg-white shadow-sm' : 'text-muted'}`}
                      onClick={() => setActiveTab('subscriptions')}
                      style={{ borderRadius: '0.375rem 0.375rem 0 0' }}
                    >
                      <i className="fas fa-crown me-2"></i>
                      Subscriptions
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="row">
              <div className="col-12">
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'orders' && renderOrdersTab()}
                {activeTab === 'users' && renderUsersTab()}
                {activeTab === 'subscriptions' && renderSubscriptionsTab()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
