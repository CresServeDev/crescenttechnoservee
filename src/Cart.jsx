import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginIcon from "./LoginIcon";

const assetPath = (path) => `${process.env.PUBLIC_URL || ""}/${path}`;

const INITIAL_ITEMS = [
  {
    id: 1,
    title: "Brand New Women Red",
    price: 13,
    qty: 1,
    image: "assets/img/shop/shop_img01.png",
  },
  {
    id: 2,
    title: "100% Casual Full Sleeve",
    price: 19,
    qty: 1,
    image: "assets/img/shop/shop_img02.png",
  },
];

const Cart = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offCanvasOpen, setOffCanvasOpen] = useState(false);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    document.title = "Cart";
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadCartFromFirestore(currentUser.uid);
      } else {
        setItems(INITIAL_ITEMS); // Fallback for non-logged-in users
      }
    });
    return unsubscribe;
  }, []);

  const loadCartFromFirestore = async (userId) => {
    try {
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItems(docSnap.data().items || []);
      } else {
        setItems(INITIAL_ITEMS);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setItems(INITIAL_ITEMS);
    }
  };

  const saveCartToFirestore = async (cartItems) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "carts", user.uid), { items: cartItems });
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return { subtotal, total: subtotal };
  }, [items]);

  const updateQty = (id, delta) => {
    setItems((prev) => {
      const updated = prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((item) => item.qty > 0);
      saveCartToFirestore(updated);
      return updated;
    });
  };

  const removeItem = (id) => setItems((prev) => {
    const updated = prev.filter((i) => i.id !== id);
    saveCartToFirestore(updated);
    return updated;
  });

  return (
    <div className="cart-page">
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
                  <h2 className="title">Cart</h2>
                  <nav className="breadcrumb">
                    <span>
                      <a href="index.html">Home</a>
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span>Cart</span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="cart__area section-py-120">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="cart-items-cards">
                  {items.map((item) => (
                    <div key={item.id} className="cart-item-card" style={{
                      background: 'white',
                      borderRadius: '15px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      padding: '20px',
                      marginBottom: '20px',
                      border: '1px solid #f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      <div className="cart-item-image" style={{ flexShrink: 0 }}>
                        <Link to="/shop-details">
                          <img
                            src={assetPath(item.image)}
                            alt={item.title}
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        </Link>
                      </div>
                      <div className="cart-item-details" style={{ flex: 1 }}>
                        <h4 className="cart-item-title" style={{
                          margin: '0 0 10px 0',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          <Link to="/shop-details" style={{
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#667eea'}
                          onMouseLeave={(e) => e.target.style.color = '#333'}>
                            {item.title}
                          </Link>
                        </h4>
                        <div className="cart-item-price" style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: '#007bff',
                          marginBottom: '10px'
                        }}>
                          ₹{(item.price * 83).toFixed(2)}
                        </div>
                        <div className="cart-item-quantity" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px'
                        }}>
                          <div className="quantity-controls" style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              aria-label="Decrease quantity"
                              style={{
                                background: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: '#666',
                                transition: 'background 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.qty}
                              readOnly
                              style={{
                                width: '50px',
                                textAlign: 'center',
                                border: 'none',
                                padding: '8px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                background: 'white'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              aria-label="Increase quantity"
                              style={{
                                background: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: '#666',
                                transition: 'background 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                              +
                            </button>
                          </div>
                          <div className="cart-item-subtotal" style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>
                            Subtotal: ₹{((item.price * item.qty) * 83).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="cart-item-remove" style={{ flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          style={{
                            background: '#dc3545',
                            border: 'none',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            transition: 'background 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#c82333'}
                          onMouseLeave={(e) => e.target.style.background = '#dc3545'}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {!items.length && (
                    <div className="empty-cart-message" style={{
                      textAlign: 'center',
                      padding: '40px',
                      background: 'white',
                      borderRadius: '15px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      border: '1px solid #f8f9fa'
                    }}>
                      <h3 style={{ color: '#666', margin: '0' }}>Your cart is empty.</h3>
                    </div>
                  )}
                  {items.length > 0 && (
                    <div className="cart-actions-card" style={{
                      background: 'white',
                      borderRadius: '15px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      padding: '20px',
                      marginTop: '20px',
                      border: '1px solid #f8f9fa',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '15px'
                    }}>
                      <form className="coupon-form" onSubmit={(e) => e.preventDefault()} style={{
                        display: 'flex',
                        gap: '10px',
                        flex: 1,
                        maxWidth: '400px'
                      }}>
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none'
                          }}
                        />
                        <button type="submit" className="tg-btn" style={{
                          padding: '12px 20px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#218838'}
                        onMouseLeave={(e) => e.target.style.background = '#28a745'}>
                          Apply coupon
                        </button>
                      </form>
                      <button
                        type="button"
                        className="tg-btn update-cart-btn"
                        onClick={() => setItems([...items])}
                        style={{
                          padding: '12px 20px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.background = '#007bff'}
                      >
                        Update cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="cart__collaterals-wrap">
                  <h2 className="title">Cart totals</h2>
                  <ul className="list-wrap">
                    <li>
                      Subtotal <span>₹{(totals.subtotal * 83).toFixed(2)}</span>
                    </li>
                    <li>
                      Total <span className="amount">₹{(totals.total * 83).toFixed(2)}</span>
                    </li>
                  </ul>
                  <Link to="/checkout" className="tg-btn">
                    Proceed to checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;

