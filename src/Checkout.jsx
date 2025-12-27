import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginIcon from "./LoginIcon";
import Header from "./Header";

const assetPath = (path) => `${process.env.PUBLIC_URL || ""}/${path}`;

const Checkout = () => {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offCanvasOpen, setOffCanvasOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "India",
    street1: "",
    street2: "",
    town: "",
    zip: "",
    phone: "",
    email: "",
    note: "",
  });
  const [saveBillingDetails, setSaveBillingDetails] = useState(false);
  const [savedBillingDetails, setSavedBillingDetails] = useState(null);

  useEffect(() => {
    document.title = "Checkout";
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadCartFromFirestore(currentUser.uid);
        loadSavedBillingDetails(currentUser.uid);
      }
    });
    return unsubscribe;
  }, []);

  const loadCartFromFirestore = async (userId) => {
    try {
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrderItems(docSnap.data().items || []);
      } else {
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setOrderItems([]);
    }
  };

  const loadSavedBillingDetails = async (userId) => {
    try {
      const docRef = doc(db, "billingDetails", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSavedBillingDetails(docSnap.data());
      } else {
        setSavedBillingDetails(null);
      }
    } catch (error) {
      console.error("Error loading billing details:", error);
      setSavedBillingDetails(null);
    }
  };

  const saveBillingDetailsToFirestore = async (userId, billingDetails) => {
    try {
      await setDoc(doc(db, "billingDetails", userId), billingDetails);
    } catch (error) {
      console.error("Error saving billing details:", error);
    }
  };

  const totals = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty * 53), 0);
    return { subtotal, total: subtotal };
  }, [orderItems]);

  const handleInput = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    // Simulate coupon validation
    setTimeout(() => {
      if (coupon.trim()) {
        setStatus({ type: "success", message: `Coupon "${coupon}" applied successfully! 10% discount added.` });
      } else {
        setStatus({ type: "error", message: "Please enter a valid coupon code." });
      }
      setLoading(false);
    }, 1000);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    if (!user) {
      setStatus({ type: "error", message: "Authentication Error: You must be logged in to place an order. Please log in and try again." });
      setLoading(false);
      return;
    }

    const required = ["firstName", "lastName", "street1", "town", "zip", "phone", "email"];
    const missing = required.filter((key) => !form[key].toString().trim());
    if (missing.length) {
      const fieldNames = {
        firstName: "First Name",
        lastName: "Last Name",
        street1: "Street Address",
        town: "Town/City",
        zip: "ZIP Code",
        phone: "Phone",
        email: "Email Address"
      };
      setStatus({ type: "error", message: "Kindly fill the form." });
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus({ type: "error", message: "Validation Error: Please enter a valid email address." });
      setLoading(false);
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(form.phone.replace(/[\s\-\(\)]/g, ''))) {
      setStatus({ type: "error", message: "Validation Error: Please enter a valid phone number." });
      setLoading(false);
      return;
    }

    if (orderItems.length === 0) {
      setStatus({ type: "error", message: "Cart Error: Your cart is empty. Please add items to your cart before checkout." });
      setLoading(false);
      return;
    }

    try {
      setStatus({ type: "info", message: "Processing your order..." });

      const orderData = {
        userId: user.uid,
        items: orderItems,
        billingDetails: form,
        total: totals.total,
        status: "pending",
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      const orderId = docRef.id;

      // Save billing details if checkbox is checked
      if (saveBillingDetails) {
        await saveBillingDetailsToFirestore(user.uid, form);
      }

      // Clear cart after order
      await setDoc(doc(db, "carts", user.uid), { items: [] });
      setOrderItems([]);
      setForm({
        firstName: "",
        lastName: "",
        company: "",
        country: "India",
        street1: "",
        street2: "",
        town: "",
        zip: "",
        phone: "",
        email: "",
        note: "",
      });

      setStatus({ type: "success", message: `Order placed successfully! Your Order ID is: ${orderId}. Thank you for your purchase. You will receive a confirmation email shortly. You can track your order at /order-tracking.` });
    } catch (error) {
      console.error("Error placing order:", error);
      let errorMessage = "Failed to place order. Please try again.";
      if (error.code === 'permission-denied') {
        errorMessage = "Permission Error: You don't have permission to place orders. Please contact support.";
      } else if (error.code === 'unavailable') {
        errorMessage = "Network Error: Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error.code === 'deadline-exceeded') {
        errorMessage = "Timeout Error: The request timed out. Please try again.";
      }
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
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



      {mobileMenuOpen && (
        <>
          <div className="tgmobile__menu">
            <nav className="tgmobile__menu-box">
              <div className="close-btn">
                <button onClick={() => setMobileMenuOpen(false)} className="tg-flaticon-close-1" aria-label="Close menu" />
              </div>
              <div className="nav-logo">
                <a href="index.html">
                  <img src={assetPath("assets/img/logo/logo.svg")} alt="Logo" />
                </a>
              </div>
              <div className="tgmobile__search">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Search here..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  <button type="button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.6666 22.6667L18.0329 18.033M20.9079 11.1207C20.9079 16.5261 16.526 20.908 11.1206 20.908C5.71519 20.908 1.33325 16.5261 1.33325 11.1207C1.33325 5.71528 5.71519 1.33334 11.1206 1.33334C16.526 1.33334 20.9079 5.71528 20.9079 11.1207Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </form>
              </div>
              <div className="tgmobile__menu-outer">
                <ul className="navigation">
                  <li>
                    <a href="index.html">Home</a>
                  </li>
                  <li>
                    <a href="shop.html">Shop</a>
                  </li>
                  <li>
                    <a href="contact.html">Contact</a>
                  </li>
                </ul>
              </div>
              <div className="social-links">
                <ul className="list-wrap">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/" target="_blank" rel="noreferrer">
                      X
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">
                      Pinterest
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="tgmobile__menu-backdrop" onClick={() => setMobileMenuOpen(false)} />
        </>
      )}

      {searchOpen && (
        <>
          <div className="search__popup">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="search__wrapper">
                    <div className="search__close">
                      <button type="button" className="search-close-btn" onClick={() => setSearchOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1 1L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                    <div className="search__form">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="search__input">
                          <input
                            className="search-input-field"
                            type="text"
                            placeholder="Type keywords here"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                          <span className="search-focus-border"></span>
                          <button type="button">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M9.55 18.1C14.272 18.1 18.1 14.272 18.1 9.55C18.1 4.82797 14.272 1 9.55 1C4.82797 1 1 4.82797 1 9.55C1 14.272 4.82797 18.1 9.55 18.1Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path d="M19.0002 19.0002L17.2002 17.2002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="search-popup-overlay" onClick={() => setSearchOpen(false)} />
        </>
      )}

      {offCanvasOpen && (
        <>
          <div className="offCanvas__info">
            <div className="offCanvas__close-icon menu-close">
              <button onClick={() => setOffCanvasOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="offCanvas__logo mb-30">
              <a href="index.html">
                <img src={assetPath("assets/img/logo/logo.svg")} alt="Logo" />
              </a>
            </div>
            <div className="offCanvas__content">
              <p>Techzo is the most enticing, creative and modern template suitable for any business.</p>
            </div>
            <div className="offCanvas__info-wrap mb-30">
              <h2 className="offCanvas__title">Contact Details</h2>
              <div className="offCanvas__info-list">
                <div className="offCanvas__info-list-item">
                  <p>Sydney Harbour Circular City of Sydney, Australia.</p>
                </div>
                <div className="offCanvas__info-list-item">
                  <a href="tel:0123456789">+ 123 888 9900</a>
                </div>
                <div className="offCanvas__info-list-item">
                  <a href="mailto:info@example.com">info@example.com</a>
                </div>
              </div>
            </div>
            <div className="offCanvas__social-wrap">
              <h2 className="offCanvas__title">Follow us</h2>
              <ul className="list-wrap">
                <li>
                  <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://x.com/" target="_blank" rel="noreferrer">
                    X
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="offCanvas__overly" onClick={() => setOffCanvasOpen(false)} />
        </>
      )}

      <main className="main-area fix">
        <section className="breadcrumb__area breadcrumb__bg fix" style={{ backgroundImage: `url(${assetPath("assets/img/bg/breadcrumb_bg.jpg")})` }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb__content">
                  <h2 className="title">Checkout</h2>
                  <nav className="breadcrumb">
                    <span>
                      <a href="index.html">Home</a>
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span>Checkout</span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="checkout__area section-py-120">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="coupon__code-wrap">
                  <div className="coupon__code-info">
                    <span> Have a coupon?</span>
                    <button type="button" id="coupon-element" onClick={() => setCouponOpen((v) => !v)}>
                      Click here to enter your code
                    </button>
                  </div>
                  {couponOpen && (
                    <form className="coupon__code-form" onSubmit={handleCoupon}>
                      <p>If you have a coupon code, please apply it below.</p>
                      <input type="text" placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                      <button type="submit" className="tg-btn" disabled={loading}>
                        {loading ? "Applying..." : "Apply coupon"}
                      </button>
                      {status.type !== "idle" && status.type !== "info" && (
                        <p className={status.type === "error" ? "text-danger" : "text-success"}>{status.message}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
              <div className="col-lg-7">
                <form className="customer__form-wrap" onSubmit={handleSubmit}>
                  <span className="title">Billing Details</span>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-grp">
                        <label htmlFor="first-name">First name *</label>
                        <input type="text" id="first-name" value={form.firstName} onChange={handleInput("firstName")} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-grp">
                        <label htmlFor="last-name">Last name *</label>
                        <input type="text" id="last-name" value={form.lastName} onChange={handleInput("lastName")} />
                      </div>
                    </div>
                  </div>
                  <div className="form-grp">
                    <label htmlFor="company-name">Company name (optional)</label>
                    <input type="text" id="company-name" value={form.company} onChange={handleInput("company")} />
                  </div>
                  <div className="form-grp select-grp">
                    <label htmlFor="country-name">Country / Region *</label>
                    <select id="country-name" name="country-name" className="country-name" value={form.country} onChange={handleInput("country")}>
                      <option value="India">India</option>
                      <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                      <option value="United States (US)">United States (US)</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Portugal">Portugal</option>
                    </select>
                  </div>
                  <div className="form-grp">
                    <label htmlFor="street-address">Street address *</label>
                    <input
                      type="text"
                      id="street-address"
                      placeholder="House number and street name"
                      value={form.street1}
                      onChange={handleInput("street1")}
                    />
                  </div>
                  <div className="form-grp">
                    <input
                      type="text"
                      id="street-address-two"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      value={form.street2}
                      onChange={handleInput("street2")}
                    />
                  </div>
                  <div className="form-grp">
                    <label htmlFor="town-name">Town / City *</label>
                    <input type="text" id="town-name" value={form.town} onChange={handleInput("town")} />
                  </div>

                  <div className="form-grp">
                    <label htmlFor="zip-code">ZIP Code *</label>
                    <input type="text" id="zip-code" value={form.zip} onChange={handleInput("zip")} />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-grp">
                        <label htmlFor="phone">Phone *</label>
                        <input type="tel" id="phone" value={form.phone} onChange={handleInput("phone")} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-grp">
                        <label htmlFor="email">Email address *</label>
                        <input type="email" id="email" value={form.email} onChange={handleInput("email")} />
                      </div>
                    </div>
                  </div>
                  <span className="title title-two">Additional Information</span>
                  <div className="form-grp">
                    <label htmlFor="note">Order notes (optional)</label>
                    <textarea
                      id="note"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      value={form.note}
                      onChange={handleInput("note")}
                    ></textarea>
                  </div>
                  <div className="form-grp">
                    <label>
                      <input
                        type="checkbox"
                        checked={saveBillingDetails}
                        onChange={(e) => setSaveBillingDetails(e.target.checked)}
                      />
                      Save billing details for future orders
                    </label>
                  </div>
                </form>
              </div>
              <div className="col-lg-5">
                <div className="order__info-wrap">
                  <h2 className="title">Your Order</h2>
                  <ul className="list-wrap">
                    <li className="title">
                      Product <span>Subtotal</span>
                    </li>
                    {orderItems.map((item) => (
                      <li key={item.id}>
                        {item.title} × {item.qty} <span>₹{((item.price * item.qty) * 83).toFixed(2)}</span>
                      </li>
                    ))}
                    <li>
                      Subtotal <span>₹{totals.subtotal.toFixed(2)}</span>
                    </li>
                    <li>
                      Total <span>₹{totals.total.toFixed(2)}</span>
                    </li>
                  </ul>
                  <p>
                    Sorry, it seems that there are no available payment methods for your state. Please contact us if you require assistance or wish to make
                    alternate arrangements.
                  </p>
                  <p>
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described
                    in our <a href="#">privacy policy.</a>
                  </p>
                  <button className="tg-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Placing order..." : "Place order"}
                  </button>
                  {status.type !== "idle" && (
                    <p className={status.type === "error" ? "text-danger" : "text-success"}>{status.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

