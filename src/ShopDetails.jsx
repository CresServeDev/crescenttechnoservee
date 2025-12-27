import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginIcon from "./LoginIcon";

const assetPath = (path) => `${process.env.PUBLIC_URL || ""}/${path}`;

const PRODUCT = {
  title: "Wireless Gaming Mouse RGB",
  sku: "#WM001",
  availability: "In Stock",
  price: 65,
  compareAt: 80,
  salePercent: 19,
  tag: "Electronics",
  category: "Electronics",
  tags: ["Mouse", "Wireless", "Gaming"],
  rating: 5,
  reviews: 0,
  colors: ["Black", "White", "Red"],
  description:
    "High-precision wireless gaming mouse with RGB lighting, ergonomic design, and customizable DPI settings. Perfect for gamers and professionals seeking comfort and performance.",
  features:
    "Advanced optical sensor, rechargeable battery, programmable buttons, and multi-device connectivity. Compatible with Windows, macOS, and Linux.",
  specs: ["DPI: Up to 16000", "Battery Life: 70 hours", "Connectivity: 2.4GHz Wireless", "Weight: 85g"],
  images: [
    "assets/img/shop/wireless gaming mouse rgb.jfif",
    "assets/img/shop/shop_details-img02.jpg",
    "assets/img/shop/shop_details-img03.jpg",
    "assets/img/shop/shop_details-img04.jpg",
  ],
};

const RELATED = [
  {
    id: 1,
    title: "Wireless Gaming Mouse RGB",
    tag: "Electronics",
    price: 65,
    compareAt: 80,
    salePercent: 19,
    image: "assets/img/shop/wireless gaming mouse rgb.jfif",
    rating: 4,
    reviews: 15,
    badge: "sale",
  },
  {
    id: 2,
    title: "Wired Mechanical Keyboard",
    tag: "Electronics",
    price: 120,
    compareAt: 150,
    salePercent: 20,
    image: "assets/img/shop/Wired Mechanical Keyboard.jpg",
    rating: 5,
    reviews: 25,
    badge: "new",
  },
  {
    id: 3,
    title: "Keyboard-Mouse Combo Wireless",
    tag: "Electronics",
    price: 180,
    compareAt: 220,
    salePercent: 18,
    image: "assets/img/shop/wireless keyboard-mouse.jpg",
    rating: 5,
    reviews: 12,
    badge: "sale",
  },
  {
    id: 4,
    title: "PC RAM 16GB DDR4",
    tag: "Electronics",
    price: 85,
    compareAt: 100,
    salePercent: 15,
    image: "assets/img/shop/PC RAM 16GB DDR4.jpg",
    rating: 5,
    reviews: 20,
    badge: "sale",
  },
  {
    id: 5,
    title: "Laptop RAM 8GB DDR4",
    tag: "Electronics",
    price: 55,
    compareAt: 70,
    salePercent: 21,
    image: "assets/img/shop/laptop ram.jpg",
    rating: 4,
    reviews: 16,
    badge: "sale",
  },
  {
    id: 6,
    title: "SMPS Power Supply 650W",
    tag: "Electronics",
    price: 75,
    compareAt: 90,
    salePercent: 17,
    image: "assets/img/shop/smps power supply.jpg",
    rating: 4,
    reviews: 28,
    badge: "sale",
  },
  {
    id: 7,
    title: "SSD 1TB for Laptop",
    tag: "Electronics",
    price: 120,
    compareAt: null,
    salePercent: 0,
    image: "assets/img/shop/SSD 1TB for Laptop.jpg",
    rating: 5,
    reviews: 35,
    badge: "new",
  },
  {
    id: 8,
    title: "SSD 2TB for Desktop",
    tag: "Electronics",
    price: 200,
    compareAt: 250,
    salePercent: 20,
    image: "assets/img/shop/512GB sata ssd for desktop.jpg",
    rating: 5,
    reviews: 18,
    badge: "sale",
  },
  {
    id: 9,
    title: "HDD 2TB External",
    tag: "Electronics",
    price: 90,
    compareAt: 110,
    salePercent: 18,
    image: "assets/img/shop/4TB hdd.jfif",
    rating: 4,
    reviews: 22,
    badge: "sale",
  },
  {
    id: 10,
    title: "Bluetooth Speaker Portable",
    tag: "Electronics",
    price: 45,
    compareAt: null,
    salePercent: 0,
    image: "assets/img/shop/cpu cooler fan.jfif",
    rating: 4,
    reviews: 30,
    badge: "new",
  },
  {
    id: 11,
    title: "Wireless Earbuds with Mic",
    tag: "Electronics",
    price: 150,
    compareAt: 200,
    salePercent: 25,
    image: "assets/img/shop/Ergonomic wireless mouse.jpg",
    rating: 5,
    reviews: 50,
    badge: "sale",
  },
  {
    id: 12,
    title: "USB-C Hub for Laptop",
    tag: "Electronics",
    price: 35,
    compareAt: null,
    salePercent: 0,
    image: "assets/img/shop/desktop ram.jpg",
    rating: 5,
    reviews: 40,
    badge: "new",
  },
];

const ShopDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
const product = location.state?.product ? {
  ...location.state.product,
  sku: location.state.product.id ? `#${location.state.product.id}` : PRODUCT.sku,
  availability: 'In Stock',
  colors: [location.state.product.color || 'Black'],
  description: `This is a high-quality ${location.state.product.category} product: ${location.state.product.title}. ${PRODUCT.description}`,
  features: `Key features for ${location.state.product.category} products. ${PRODUCT.features}`,
  specs: PRODUCT.specs,
  images: location.state.product.images || [location.state.product.image, "assets/img/shop/shop_details-img01.jpg", "assets/img/shop/shop_details-img02.jpg", "assets/img/shop/shop_details-img03.jpg"],
  tags: [location.state.product.tag]
} : PRODUCT;
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offCanvasOpen, setOffCanvasOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    document.title = "Shop Details";
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const priceDisplay = useMemo(
    () => ({
      current: `₹${(product.price * 0.7 * 83).toFixed(2)}`,
      compare: product.compareAt ? `₹${(product.compareAt * 0.7 * 83).toFixed(2)}` : null,
    }),
    [product]
  );

  const adjustQty = (delta) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const docRef = doc(db, "carts", user.uid);
      const docSnap = await getDoc(docRef);
      let cartItems = docSnap.exists() ? docSnap.data().items || [] : [];
      const existingItem = cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.qty += qty;
        existingItem.price = product.price; // Update price to current
        existingItem.title = product.title; // Update title if needed
        existingItem.image = product.images[0]; // Update image if needed
      } else {
        cartItems.push({
          id: product.id || `product_${Date.now()}`,
          title: product.title || 'Unknown Product',
          price: product.price || 0,
          qty: qty || 1,
          image: product.images?.[0] || '/assets/img/default-product.png',
          sku: product.sku || '',
          color: selectedColor || 'Default',
        });
      }
      await setDoc(docRef, { items: cartItems });
      alert('Product added to cart!');
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(`Failed to add to cart: ${error.message}`);
    }
  };

  return (
    <div className="shop-details-page">
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
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
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
                    <Link to="/cart">Cart</Link>
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
                  <a href="mailto:info@example.com">support@crescenttechnoserve.com</a>
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
        <section
          className="breadcrumb__area breadcrumb__bg fix"
          style={{ backgroundImage: `url(${assetPath("assets/img/bg/breadcrumb_bg.jpg")})` }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb__content">
                  <h2 className="title">Shop Details</h2>
                  <nav className="breadcrumb">
                    <span>
                      <a href="index.html">Home</a>
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span>Shop Details</span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shop__details-area section-py-140">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-9">
                <div className="shop__details-images-wrap">
                  <div className="tab-content">
                    <div className="tab-pane show active">
                      {product.salePercent > 0 && <span className="flash-sale">-{product.salePercent}%</span>}
                      <img src={assetPath(product.images[selectedImage])} alt={product.title} />
                    </div>
                  </div>
                  <ul className="nav nav-tabs" role="tablist">
                    {product.images.map((img, idx) => (
                      <li className="nav-item" role="presentation" key={img}>
                        <button
                          className={`nav-link ${selectedImage === idx ? "active" : ""}`}
                          type="button"
                          onClick={() => setSelectedImage(idx)}
                          aria-selected={selectedImage === idx}
                        >
                          <img src={assetPath(img)} alt={`thumb-${idx}`} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="shop__details-content">
                  <h2 className="title">{product.title}</h2>
                  <ul className="shop__details-review-wrap list-wrap">
                    <li>
                      <div className="product-review">
                        <div className="rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.20504 0.5L10.6419 5.43691L16.0915 6.23344L12.1483 10.0741L13.0789 15.5L8.20504 12.9369L3.33122 15.5L4.26182 10.0741L0.318604 6.23344L5.76813 5.43691L8.20504 0.5Z"
                                fill="currentColor"
                              />
                            </svg>
                          ))}
                        </div>
                        <span>( Reviews {product.rating.toFixed(1)} )</span>
                      </div>
                    </li>
                    <li className="product-sku">
                      SKU: <span>{product.sku}</span>
                    </li>
                    <li className="product-availability">
                      Availability: <span>{product.availability}</span>
                    </li>
                  </ul>

                  <h3 className="price">
                    {priceDisplay.current} {priceDisplay.compare && <del>{priceDisplay.compare}</del>}
                  </h3>
                  <div className="shop__details-content-inner">
                    <p>{product.description}</p>
                    <ul className="list-wrap">
                      {product.specs.map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="shop__details-color">
                    <span className="title">
                      Color: <strong>{selectedColor}</strong>
                    </span>
                    <ul className="list-wrap">
                      {product.colors.map((color) => (
                        <li key={color} className={color === selectedColor ? "active" : ""} onClick={() => setSelectedColor(color)}>
                          <span title={color}></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="shop__details-qty">
                    <div className="cart-plus-minus">
                      <button type="button" onClick={() => adjustQty(-1)} aria-label="Decrease quantity">
                        -
                      </button>
                      <input type="text" value={qty} readOnly />
                      <button type="button" onClick={() => adjustQty(1)} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                    <button type="button" onClick={addToCart} className="tg-btn tg-btn-three cart-btn">
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3.16602 2.6665H6.72157L9.10379 14.5687C9.18508 14.978 9.40771 15.3456 9.73272 15.6072C10.0577 15.8688 10.4644 16.0078 10.8816 15.9998H19.5216C19.9387 16.0078 20.3454 15.8688 20.6704 15.6072C20.9954 15.3456 21.2181 14.978 21.2993 14.5687L22.7216 7.11095H7.61046M11.166 20.4443C11.166 20.9352 10.768 21.3332 10.2771 21.3332C9.78621 21.3332 9.38824 20.9352 9.38824 20.4443C9.38824 19.9534 9.78621 19.5554 10.2771 19.5554C10.768 19.5554 11.166 19.9534 11.166 20.4443ZM20.9438 20.4443C20.9438 20.9352 20.5458 21.3332 20.0549 21.3332C19.564 21.3332 19.166 20.9352 19.166 20.4443C19.166 19.9534 19.564 19.5554 20.0549 19.5554C20.5458 19.5554 20.9438 19.9534 20.9438 20.4443Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Add To Cart
                    </button>
                  </div>

                  <div className="shop__details-wishlist-wrap">
                    <a href="shop-details.html">
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 2.37402C10.7257 0.841168 12.6581 0.625738 14.2295 1.34766C15.8973 2.11395 17.0498 3.89219 17.0498 5.93945C17.0497 7.94873 16.2161 9.48103 15.127 10.7139C14.2555 11.7001 13.1894 12.5254 12.252 13.251C12.0394 13.4155 11.8335 13.5753 11.6377 13.7305C11.257 14.0321 10.8449 14.3559 10.4268 14.6016C10.0087 14.8471 9.52654 15.0498 9 15.0498C8.47346 15.0498 7.99131 14.8471 7.57324 14.6016C7.15506 14.3559 6.74305 14.0313 6.3623 13.7295C6.16657 13.5744 5.96052 13.4154 5.74805 13.251C4.81059 12.5254 3.74448 11.7001 2.87305 10.7139C1.78386 9.48103 0.950284 7.94873 0.950195 5.93945C0.950195 3.89219 2.10273 2.11395 3.77051 1.34766C5.34185 0.625752 7.27434 0.841176 9 2.37402ZM13.7236 2.45898C12.546 1.918 10.957 2.05672 9.43848 3.64258C9.32385 3.76227 9.16542 3.83008 9 3.83008C8.83458 3.83008 8.67615 3.76227 8.56152 3.64258C7.04296 2.05673 5.45396 1.91802 4.27637 2.45898C3.06037 3.01769 2.16602 4.34911 2.16602 5.93945C2.1661 7.56749 2.82859 8.82297 3.78223 9.90234C4.56923 10.7932 5.52295 11.532 6.45703 12.2559C6.67855 12.4275 6.89862 12.5988 7.11523 12.7705C7.50719 13.081 7.85441 13.3512 8.1875 13.5469C8.52058 13.7425 8.78245 13.8281 9 13.8281C9.21755 13.8281 9.47942 13.7425 9.8125 13.5469C10.1456 13.3512 10.4928 13.081 10.8848 12.7705C11.1014 12.5988 11.3215 12.4275 11.543 12.2559C12.4771 11.532 13.4308 10.7932 14.2178 9.90234C15.1714 8.82297 15.8339 7.56749 15.834 5.93945C15.834 4.34911 14.9396 3.01769 13.7236 2.45898Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="0.1"
                        />
                      </svg>
                      Add to Wishlist
                    </a>
                    <a href="shop-details.html">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1 2.77608V7.44398M1 7.44398H5.36364M1 7.44398L4.37454 4.05203C5.15618 3.21548 6.12318 2.60437 7.18531 2.27572C8.24745 1.94708 9.3701 1.91161 10.4485 2.17263C11.5269 2.43365 12.526 2.98264 13.3524 3.76839C14.1788 4.55414 14.8057 5.55104 15.1745 6.66605M17 15.224V10.5561M17 10.5561H12.6364M17 10.5561L13.6255 13.948C12.8438 14.7845 11.8768 15.3956 10.8147 15.7243C9.75255 16.0529 8.6299 16.0884 7.55148 15.8274C6.47306 15.5664 5.47404 15.0174 4.64761 14.2316C3.82119 13.4459 3.1943 12.449 2.82545 11.3339"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Add to Compare
                    </a>
                  </div>

                  <div className="shop__details-bottom">
                    <ul className="list-wrap">
                      <li className="sd-category">
                        <span className="title">Categories:</span>
                        <a href="shop-details.html">{product.category}</a>
                      </li>
                      <li className="sd-tag">
                        <span className="title">Tags:</span>
                        {product.tags.map((tag) => (
                          <a key={tag} href="shop-details.html">
                            {tag}
                          </a>
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="product-desc-wrap">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${tab === "description" ? "active" : ""}`}
                        type="button"
                        onClick={() => setTab("description")}
                        aria-selected={tab === "description"}
                      >
                        Product Description
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${tab === "reviews" ? "active" : ""}`}
                        type="button"
                        onClick={() => setTab("reviews")}
                        aria-selected={tab === "reviews"}
                      >
                        Reviews
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {tab === "description" && (
                      <div className="tab-pane fade show active">
                        <div className="product-desc-description">
                          <p>{product.description}</p>
                          <h5 className="title">Key Features</h5>
                          <p>{product.features}</p>
                        </div>
                      </div>
                    )}
                    {tab === "reviews" && (
                      <div className="tab-pane fade show active">
                        <div className="product-desc-review">
                          <div className="product-desc-review-title mb-15">
                            <h5 className="title">Customer Reviews ({product.reviews})</h5>
                          </div>
                          <div className="left-rc">
                            <p>No reviews yet</p>
                          </div>
                          <div className="right-rc">
                            <a href="#">Write a review</a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="related__product-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="related__product-title">
                  <h2 className="title">Related Products</h2>
                </div>
              </div>
            </div>
            <div className="row gy-4 mt-3">
              {RELATED.map((product) => (
                <div className="col-xl-3 col-md-6" key={product.id}>
                  <div className="shop__item">
                    <div className="shop__thumb">
                      <a href="shop-details.html">
                        <img src={assetPath(product.image)} alt={product.title} />
                      </a>
                      {product.salePercent > 0 && <span className="flash-sale">-{product.salePercent}%</span>}
                      {product.badge === "new" && <span className="flash-sale new">New</span>}
                      <ul className="list-wrap shop__action">
                        <li>
                          <a href="shop-details.html" aria-label="Wishlist">
                            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M9 2.37402C10.7257 0.841168 12.6581 0.625738 14.2295 1.34766C15.8973 2.11395 17.0498 3.89219 17.0498 5.93945C17.0497 7.94873 16.2161 9.48103 15.127 10.7139C14.2555 11.7001 13.1894 12.5254 12.252 13.251C12.0394 13.4155 11.8335 13.5753 11.6377 13.7305C11.257 14.0321 10.8449 14.3559 10.4268 14.6016C10.0087 14.8471 9.52654 15.0498 9 15.0498C8.47346 15.0498 7.99131 14.8471 7.57324 14.6016C7.15506 14.3559 6.74305 14.0313 6.3623 13.7295C6.16657 13.5744 5.96052 13.4154 5.74805 13.251C4.81059 12.5254 3.74448 11.7001 2.87305 10.7139C1.78386 9.48103 0.950284 7.94873 0.950195 5.93945C0.950195 3.89219 2.10273 2.11395 3.77051 1.34766C5.34185 0.625752 7.27434 0.841176 9 2.37402Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.1"
                              />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="shop-details.html" aria-label="Add to cart">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M2 2H4.66667L6.45333 10.9267C6.5143 11.2336 6.68127 11.5093 6.92503 11.7055C7.16879 11.9018 7.4738 12.006 7.78667 12H14.2667C14.5795 12.006 14.8845 11.9018 15.1283 11.7055C15.3721 11.5093 15.539 11.2336 15.6 10.9267L16.6667 5.33333H5.33333M8 15.3333C8 15.7015 7.70152 16 7.33333 16C6.96514 16 6.66667 15.7015 6.66667 15.3333C6.66667 14.9651 6.96514 14.6667 7.33333 14.6667C7.70152 14.6667 8 14.9651 8 15.3333ZM15.3333 15.3333C15.3333 15.7015 15.0349 16 14.6667 16C14.2985 16 14 15.7015 14 15.3333C14 14.9651 14.2985 14.6667 14.6667 14.6667C15.0349 14.6667 15.3333 14.9651 15.3333 15.3333Z"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="shop-details.html" aria-label="Quick view">
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M1 7C1 7 3.90909 1 9 1C14.0909 1 17 7 17 7C17 7 14.0909 13 9 13C3.90909 13 1 7 1 7Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 9.25007C10.205 9.25007 11.1818 8.24271 11.1818 7.00007C11.1818 5.75743 10.205 4.75007 9 4.75007C7.79502 4.75007 6.81819 5.75743 6.81819 7.00007C6.81819 8.24271 7.79502 9.25007 9 9.25007Z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="shop__content">
                      <a href="shop.html" className="tag">
                        {product.tag}
                      </a>
                      <h3 className="title">
                        <a href="shop-details.html">{product.title}</a>
                      </h3>
                      <div className="rating__wrap">
                        <div className="rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8.20504 0.5L10.6419 5.43691L16.0915 6.23344L12.1483 10.0741L13.0789 15.5L8.20504 12.9369L3.33122 15.5L4.26182 10.0741L0.318604 6.23344L5.76813 5.43691L8.20504 0.5Z"
                                fill="currentColor"
                                opacity={i < product.rating ? 1 : 0.25}
                              />
                            </svg>
                          ))}
                        </div>
                        <span>({product.reviews.toString().padStart(2, "0")})</span>
                      </div>
                      <h4 className="price">
                        ₹{(product.price * 0.7 * 83).toFixed(2)}
                        {product.compareAt && <del>₹{(product.compareAt * 0.7 * 83).toFixed(2)}</del>}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShopDetails;

