import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import LoginIcon from "./LoginIcon";

const assetPath = (path) => `${process.env.PUBLIC_URL || ""}/${path}`;

const CATEGORIES = [
  "Mouse",
  "Keyboard",
  "RAM",
  "SSD",
  "HDD",
  "SMPS",
  "CPU Fan",
];



const RATINGS = [5, 4, 3, 2, 1];

const COLORS = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Green",
  "Gray",
  "Silver",
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  const [selectedRatings, setSelectedRatings] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState(new Set());
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offCanvasOpen, setOffCanvasOpen] = useState(false);

  const pageSize = 9;

  useEffect(() => {
    document.title = "Shop";
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // If no products in DB, use mock data
        if (productsData.length === 0) {
          const mockProducts = [
            {
              id: "1",
              title: "Wireless Optical Mouse",
              tag: "Electronics",
              category: "Mouse",
              color: "Black",
              rating: 4,
              reviews: 150,
              price: 20.99,
              image: "assets/img/shop/wireless gaming mouse rgb.jfif",
              salePercent: 10,
              isNew: true,
              compareAt: 23.32,
            },
            {
              id: "2",
              title: "Gaming Mechanical Keyboard",
              tag: "Electronics",
              category: "Keyboard",
              color: "Black",
              rating: 5,
              reviews: 203,
              price: 90.99,
              image: "assets/img/shop/gaming mechanical keyboard.jpg",
              salePercent: 0,
              isNew: true,
              compareAt: null,
            },
            {
              id: "3",
              title: "Wireless Bluetooth Keyboard",
              tag: "Electronics",
              category: "Keyboard",
              color: "White",
              rating: 4,
              reviews: 89,
              price: 55.99,
              image: "assets/img/shop/wireless keyboard-mouse.jpg",
              salePercent: 15,
              isNew: false,
              compareAt: 65.79,
            },
            {
              id: "4",
              title: "8GB DDR4 Laptop RAM",
              tag: "Electronics",
              category: "RAM",
              color: "Green",
              rating: 4,
              reviews: 67,
              price: 34.99,
              image: "assets/img/shop/laptop ram.jpg",
              salePercent: 0,
              isNew: false,
              compareAt: null,
            },
            {
              id: "5",
              title: "16GB DDR4 Desktop RAM",
              tag: "Electronics",
              category: "RAM",
              color: "Blue",
              rating: 5,
              reviews: 112,
              price: 62.99,
              image: "assets/img/shop/desktop ram.jpg",
              salePercent: 10,
              isNew: true,
              compareAt: 69.99,
            },
            {
              id: "6",
              title: "256GB NVMe SSD for Laptop",
              tag: "Electronics",
              category: "SSD",
              color: "Silver",
              rating: 5,
              reviews: 178,
              price: 48.99,
              image: "assets/img/shop/256gb nvme ssd for laptop.jfif",
              images: [
                "assets/img/shop/256gb nvme ssd for laptop.jfif",
                "assets/img/shop/shop_details-img01.jpg",
                "assets/img/shop/shop_details-img02.jpg",
                "assets/img/shop/shop_details-img03.jpg"
              ],
              salePercent: 0,
              isNew: true,
              compareAt: null,
            },
            {
              id: "7",
              title: "512GB SATA SSD for Desktop",
              tag: "Electronics",
              category: "SSD",
              color: "Black",
              rating: 4,
              reviews: 92,
              price: 55.99,
              image: "assets/img/shop/512gb sata ssd for desktop.jpg",
              salePercent: 0,
              isNew: false,
              compareAt: null,
            },
            {
              id: "8",
              title: "1TB HDD",
              tag: "Electronics",
              category: "HDD",
              color: "Gray",
              rating: 4,
              reviews: 78,
              price: 41.99,
              image: "assets/img/shop/1TB hdd.jfif",
              salePercent: 0,
              isNew: false,
              compareAt: null,
            },
            {
              id: "9",
              title: "4TB HDD",
              tag: "Electronics",
              category: "HDD",
              color: "Black",
              rating: 5,
              reviews: 145,
              price: 69.99,
              image: "assets/img/shop/4TB hdd.jfif",
              salePercent: 20,
              isNew: true,
              compareAt: 87.49,
            },
            {
              id: "10",
              title: "500W SMPS Power Supply",
              tag: "Electronics",
              category: "SMPS",
              color: "Black",
              rating: 4,
              reviews: 56,
              price: 34.99,
              image: "assets/img/shop/smps power supply.jpg",
              salePercent: 0,
              isNew: false,
              compareAt: null,
            },
            {
              id: "11",
              title: "650W SMPS Power Supply",
              tag: "Electronics",
              category: "SMPS",
              color: "Black",
              rating: 5,
              reviews: 134,
              price: 48.99,
              image: "assets/img/shop/smps power supply.jpg",
              salePercent: 10,
              isNew: false,
              compareAt: 54.44,
            },
            {
              id: "12",
              title: "CPU Cooler Fan",
              tag: "Electronics",
              category: "CPU Fan",
              color: "Black",
              rating: 4,
              reviews: 67,
              price: 27.99,
              image: "assets/img/shop/cpu cooler fan.jfif",
              salePercent: 0,
              isNew: false,
              compareAt: null,
            },
            {
              id: "13",
              title: "RGB CPU Fan",
              tag: "Electronics",
              category: "CPU Fan",
              color: "Blue",
              rating: 5,
              reviews: 203,
              price: 41.99,
              image: "assets/img/shop/cpu cooler fan.jfif",
              salePercent: 0,
              isNew: true,
              compareAt: null,
            },
            {
              id: "14",
              title: "Ergonomic Wireless Mouse",
              tag: "Electronics",
              category: "Mouse",
              color: "Gray",
              rating: 4,
              reviews: 89,
              price: 27.99,
              image: "assets/img/shop/Ergonomic wireless mouse.jpg",
              salePercent: 0,
              isNew: false,
              compareAt: null,
            },
            {
              id: "15",
              title: "Compact Wired Keyboard",
              tag: "Electronics",
              category: "Keyboard",
              color: "White",
              rating: 4,
              reviews: 45,
              price: 34.99,
              image: "assets/img/shop/wired keyboard-mouse.jpg",
              salePercent: 0,
              isNew: false,
              compareAt: null,
            },
            {
              id: "16",
              title: "32GB DDR4 Desktop RAM",
              tag: "Electronics",
              category: "RAM",
              color: "Red",
              rating: 5,
              reviews: 124,
              price: 104.99,
              image: "assets/img/shop/desktop ram.jpg",
              salePercent: 15,
              isNew: true,
              compareAt: 123.53,
            },
            {
              id: "17",
              title: "1TB NVMe SSD",
              tag: "Electronics",
              category: "SSD",
              color: "Black",
              rating: 5,
              reviews: 156,
              price: 90.99,
              image: "assets/img/shop/1TB nvme ssd.jpg",
              salePercent: 0,
              isNew: true,
              compareAt: null,
            },
            {
              id: "18",
              title: "4TB HDD",
              tag: "Electronics",
              category: "HDD",
              color: "Gray",
              rating: 4,
              reviews: 78,
              price: 104.99,
              image: "assets/img/shop/4TB hdd.jfif",
              salePercent: 0,
              isNew: false,
              compareAt: null
            },
            {
              id: "19",
              title: "256GB NVMe SSD for Laptop",
              tag: "Electronics",
              category: "SSD",
              color: "Silver",
              rating: 5,
              reviews: 145,
              price: 42.99,
              image: "assets/img/shop/256gb nvme ssd for laptop.jfif",
              images: [
                "assets/img/shop/256gb nvme ssd for laptop.jfif",
                "assets/img/shop/shop_details-img01.jpg",
                "assets/img/shop/shop_details-img02.jpg",
                "assets/img/shop/shop_details-img03.jpg"
              ],
              salePercent: 0,
              isNew: true,
              compareAt: null
            }
          ];
          const filteredMockProducts = mockProducts.filter(product => product.tag === "Electronics");
          setProducts(filteredMockProducts);
        } else {
          const filteredProductsData = productsData.filter(product => product.tag === "Electronics");
          setProducts(filteredProductsData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Firebase error:", err);
        // Use mock data even if Firebase fails
        const mockProducts = [
          {
            id: "1",
            title: "Smart Watch Pro",
            tag: "Electronics",
            category: "Smart Watch",
            color: "Black",
            rating: 5,
            reviews: 10,
            price: 99.99,
            image: "assets/img/shop/shop_img01.png",
            salePercent: 0,
            isNew: true,
            compareAt: null,
          },
          {
            id: "2",
            title: "Casual T-Shirt",
            tag: "Fashion",
            category: "Clothing",
            color: "Blue",
            rating: 4,
            reviews: 8,
            price: 49.99,
            image: "assets/img/shop/shop_img02.png",
            salePercent: 10,
            isNew: false,
            compareAt: 55.99,
          },
          {
            id: "3",
            title: "Modern Sofa",
            tag: "Home",
            category: "Furniture",
            color: "Gray",
            rating: 3,
            reviews: 5,
            price: 199.99,
            image: "assets/img/shop/shop_img03.png",
            salePercent: 0,
            isNew: false,
            compareAt: null,
          },
          {
            id: "4",
            title: "Wireless Headphones",
            tag: "Electronics",
            category: "Accessories",
            color: "White",
            rating: 4,
            reviews: 15,
            price: 79.99,
            image: "assets/img/shop/shop_img04.png",
            salePercent: 0,
            isNew: false,
            compareAt: null,
          },
          {
            id: "5",
            title: "Running Shoes",
            tag: "Fashion",
            category: "Shoes",
            color: "Red",
            rating: 5,
            reviews: 20,
            price: 129.99,
            image: "assets/img/shop/shop_img05.png",
            salePercent: 15,
            isNew: true,
            compareAt: 152.99,
          },
          {
            id: "6",
            title: "Backpack",
            tag: "Fashion",
            category: "Bag Pack",
            color: "Green",
            rating: 4,
            reviews: 12,
            price: 39.99,
            image: "assets/img/shop/shop_img06.png",
            salePercent: 0,
            isNew: false,
            compareAt: null,
          },
          {
            id: "7",
            title: "Smartphone Case",
            tag: "Electronics",
            category: "Phone",
            color: "Black",
            rating: 3,
            reviews: 7,
            price: 19.99,
            image: "assets/img/shop/shop_img07.png",
            salePercent: 0,
            isNew: false,
            compareAt: null,
          },
          {
            id: "8",
            title: "Leather Wallet",
            tag: "Fashion",
            category: "Accessories",
            color: "Brown",
            rating: 4,
            reviews: 9,
            price: 29.99,
            image: "assets/img/shop/shop_img08.png",
            salePercent: 0,
            isNew: false,
            compareAt: null,
          },
          {
            id: "9",
            title: "Desk Lamp",
            tag: "Home",
            category: "Furniture",
            color: "Yellow",
            rating: 5,
            reviews: 18,
            price: 59.99,
            image: "assets/img/shop/shop_img09.png",
            salePercent: 0,
            isNew: true,
            compareAt: null
          }
        ];
        setProducts(mockProducts);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleSet = (setValue, value) => {
    const next = new Set(setValue);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    return next;
  };

  const filtered = useMemo(() => {
    const min = Number(priceRange.min) || 0;
    const max = Number(priceRange.max) || Infinity;
    const searchTerm = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm) ||
        p.tag.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.id.toString().toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategories.size || selectedCategories.has(p.category);
      const matchesRating = !selectedRatings.size || [...selectedRatings].some((r) => p.rating >= r);
      const matchesColor = !selectedColors.size || selectedColors.has(p.color);
      const matchesPrice = p.price >= min && p.price <= max;
      return matchesSearch && matchesCategory && matchesRating && matchesColor && matchesPrice;
    }).sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.reviews - a.reviews;
        case "rating":
          return b.rating - a.rating;
        case "latest":
          return b.id.localeCompare(a.id);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [products, search, selectedCategories, selectedRatings, selectedColors, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  const onCategoryToggle = (value) => {
    setSelectedCategories((prev) => toggleSet(prev, value));
    setPage(1);
  };
  const onColorToggle = (value) => {
    setSelectedColors((prev) => toggleSet(prev, value));
    setPage(1);
  };
  const onRatingToggle = (value) => {
    setSelectedRatings((prev) => toggleSet(prev, value));
    setPage(1);
  };

  return (
    <div className="shop-page">
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
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
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
                    <a href="cart.html">Cart</a>
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
                            onChange={(e) => {
                              setSearch(e.target.value);
                              setPage(1);
                            }}
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
                  <h2 className="title">Shop</h2>
                  <nav className="breadcrumb">
                    <span>
                      <a href="index.html">Home</a>
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span>Shop</span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shop__area section-py-140">
          <div className="container">
            {/* Hero Section */}
            <div className="shop-hero" style={{
              background: 'rgb(0, 74, 87)',
              borderRadius: '15px',
              padding: '40px 30px',
              marginBottom: '50px',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
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
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '15px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                zIndex: 2,
                position: 'relative',
                color: 'white'
              }}>Discover Amazing Products</h1>
              <p style={{
                fontSize: '1.2rem',
                marginBottom: '0',
                opacity: '0.9',
                zIndex: 2,
                position: 'relative'
              }}>Find the perfect items for your lifestyle with our curated collection</p>
            </div>

            <div className="row">
              <div className="col-xl-9 col-lg-8 order-0 order-lg-2">
                <div className="shop__top-wrap" style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  marginBottom: '30px',
                  border: '1px solid #f0f0f0'
                }}>
                  <div className="row align-items-center">
                    <div className="col-md-6 col-sm-7">
                      <div className="shop__top-left">
                        <p style={{
                          margin: '0',
                          fontSize: '1.1rem',
                          color: '#666',
                          fontWeight: '500'
                        }}>
                          <span style={{color: '#007bff', fontWeight: 'bold'}}>
                            {pageItems.length ? (pageSafe - 1) * pageSize + 1 : 0}-{(pageSafe - 1) * pageSize + pageItems.length}
                          </span> of{" "}
                          <span style={{color: '#333', fontWeight: 'bold'}}>{filtered.length}</span> results
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-5">
                      <div className="shop__top-right">
                        <select
                          name="orderby"
                          className="orderby"
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setPage(1);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#007bff'}
                          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        >
                          <option value="default">Default Sorting</option>
                          <option value="popularity">Sort by popularity</option>
                          <option value="rating">Sort by average rating</option>
                          <option value="latest">Sort by latest</option>
                          <option value="price-asc">Sort by price: low to high</option>
                          <option value="price-desc">Sort by price: high to low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shop-item-wrap">
                  <div className="row gy-4">
                    {pageItems.map((product) => (
                      <div className="col-xl-4 col-sm-6" key={product.id}>
                        <div className="shop__item" style={{
                          background: 'white',
                          borderRadius: '15px',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          border: '1px solid #f8f9fa',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                        }}>
                          <div className="shop__thumb" style={{position: 'relative', overflow: 'hidden'}}>
                            <Link to="/shop-details" state={{ product }} style={{display: 'block'}}>
                              <img
                                src={assetPath(product.image)}
                                alt={product.title}
                                style={{
                                  width: '100%',
                                  height: '250px',
                                  objectFit: 'contain',
                                  transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                              />
                            </Link>
                            {product.salePercent > 0 && (
                              <span className="flash-sale" style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                zIndex: 2
                              }}>
                                -{product.salePercent}%
                              </span>
                            )}
                            {product.isNew && (
                              <span className="flash-sale new" style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'linear-gradient(45deg, #00d2d3, #54a0ff)',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                zIndex: 2
                              }}>
                                New
                              </span>
                            )}
                            <ul className="list-wrap shop__action" style={{
                              position: 'absolute',
                              top: '50%',
                              right: '-60px',
                              transform: 'translateY(-50%)',
                              transition: 'right 0.3s ease',
                              zIndex: 3
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.right = '10px'}
                            onMouseLeave={(e) => e.currentTarget.style.right = '-60px'}>
                              <li style={{marginBottom: '10px'}}>
                                <Link to="/shop-details" state={{ product }} aria-label="Wishlist" style={{
                                  display: 'block',
                                  width: '40px',
                                  height: '40px',
                                  background: 'white',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                  transition: 'all 0.3s ease',
                                  color: '#666'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = '#ff6b6b';
                                  e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'white';
                                  e.target.style.color = '#666';
                                }}>
                                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M9 2.37402C10.7257 0.841168 12.6581 0.625738 14.2295 1.34766C15.8973 2.11395 17.0498 3.89219 17.0498 5.93945C17.0497 7.94873 16.2161 9.48103 15.127 10.7139C14.2555 11.7001 13.1894 12.5254 12.252 13.251C12.0394 13.4155 11.8335 13.5753 11.6377 13.7305C11.257 14.0321 10.8449 14.3559 10.4268 14.6016C10.0087 14.8471 9.52654 15.0498 9 15.0498C8.47346 15.0498 7.99131 14.8471 7.57324 14.6016C7.15506 14.3559 6.74305 14.0313 6.3623 13.7295C6.16657 13.5744 5.96052 13.4154 5.74805 13.251C4.81059 12.5254 3.74448 11.7001 2.87305 10.7139C1.78386 9.48103 0.950284 7.94873 0.950195 5.93945C0.950195 3.89219 2.10273 2.11395 3.77051 1.34766C5.34185 0.625752 7.27434 0.841176 9 2.37402Z"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="0.1"
                                    />
                                  </svg>
                                </Link>
                              </li>
                              <li style={{marginBottom: '10px'}}>
                                <Link to="/shop-details" state={{ product }} aria-label="Add to cart" style={{
                                  display: 'block',
                                  width: '40px',
                                  height: '40px',
                                  background: 'white',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                  transition: 'all 0.3s ease',
                                  color: '#666'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = '#4ecdc4';
                                  e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'white';
                                  e.target.style.color = '#666';
                                }}>
                                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M2 2H4.66667L6.45333 10.9267C6.5143 11.2336 6.68127 11.5093 6.92503 11.7055C7.16879 11.9018 7.4738 12.006 7.78667 12H14.2667C14.5795 12.006 14.8845 11.9018 15.1283 11.7055C15.3721 11.5093 15.539 11.2336 15.6 10.9267L16.6667 5.33333H5.33333M8 15.3333C8 15.7015 7.70152 16 7.33333 16C6.96514 16 6.66667 15.7015 6.66667 15.3333C6.66667 14.9651 6.96514 14.6667 7.33333 14.6667C7.70152 14.6667 8 14.9651 8 15.3333ZM15.3333 15.3333C15.3333 15.7015 15.0349 16 14.6667 16C14.2985 16 14 15.7015 14 15.3333C14 14.9651 14.2985 14.6667 14.6667 14.6667C15.0349 14.6667 15.3333 14.9651 15.3333 15.3333Z"
                                      stroke="currentColor"
                                      strokeWidth="1.3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </Link>
                              </li>
                              <li>
                                <Link to="/shop-details" state={{ product }} aria-label="Quick view" style={{
                                  display: 'block',
                                  width: '40px',
                                  height: '40px',
                                  background: 'white',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                  transition: 'all 0.3s ease',
                                  color: '#666'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = '#a8e6cf';
                                  e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'white';
                                  e.target.style.color = '#666';
                                }}>
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
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="shop__content" style={{padding: '20px'}}>
                            <h3 className="title" style={{marginBottom: '10px'}}>
                              <Link to="/shop-details" state={{ product }} style={{
                                color: '#333',
                                textDecoration: 'none',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                transition: 'color 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.color = '#667eea'}
                              onMouseLeave={(e) => e.target.style.color = '#333'}>
                                {product.title}
                              </Link>
                            </h3>
                            <div className="rating__wrap" style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '10px'
                            }}>
                              <div className="rating" style={{display: 'flex', marginRight: '8px'}}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg key={i} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M8.20504 0.5L10.6419 5.43691L16.0915 6.23344L12.1483 10.0741L13.0789 15.5L8.20504 12.9369L3.33122 15.5L4.26182 10.0741L0.318604 6.23344L5.76813 5.43691L8.20504 0.5Z"
                                      fill={i < product.rating ? '#ffc107' : '#e9ecef'}
                                      stroke={i < product.rating ? '#ffc107' : '#e9ecef'}
                                      strokeWidth="0.5"
                                    />
                                  </svg>
                                ))}
                              </div>
                              <span style={{fontSize: '0.85rem', color: '#666'}}>
                                ({product.reviews.toString().padStart(2, "0")})
                              </span>
                            </div>
                            <h4 className="price" style={{
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              color: '#333',
                              margin: '0'
                            }}>
                              ₹{(product.price * 53).toFixed(2)}
                              {product.compareAt && (
                                <del style={{
                                  color: '#999',
                                  fontSize: '0.9rem',
                                  fontWeight: 'normal',
                                  marginLeft: '8px'
                                }}>
                                  ₹{(product.compareAt * 53).toFixed(2)}
                                </del>
                              )}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!pageItems.length && (
                      <div className="col-12">
                        <p>No products match your filters.</p>
                      </div>
                    )}
                  </div>
                  <nav className="pagination__wrap mt-40">
                    <ul className="list-wrap">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <li key={i} className={pageSafe === i + 1 ? "active" : undefined}>
                          <button type="button" onClick={() => setPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4">
                <aside className="shop__sidebar">
                  <div className="sidebar__widget">
                    <h4 className="widget__title">Search</h4>
                    <form className="blog__search" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                      />
                      <button type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path
                            d="M17 17L13.5247 13.5247M15.681 8.3405C15.681 12.3945 12.3945 15.681 8.3405 15.681C4.28645 15.681 1 12.3945 1 8.3405C1 4.28645 4.28645 1 8.3405 1C12.3945 1 15.681 4.28645 15.681 8.3405Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </form>
                  </div>

                  <div className="sidebar__widget">
                    <h4 className="widget__title">Filter By Categories</h4>
                    <div className="shop__cat-list">
                      <ul className="list-wrap">
                        {CATEGORIES.map((cat) => (
                          <li key={cat}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`cat_${cat}`}
                                checked={selectedCategories.has(cat)}
                                onChange={() => onCategoryToggle(cat)}
                              />
                              <label className="form-check-label" htmlFor={`cat_${cat}`}>
                                {cat}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="sidebar__widget">
                    <h4 className="widget__title">Price Range</h4>
                    <div className="shop__price-wrap">
                      <div className="min-price">
                        <span>Min</span>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => {
                            setPriceRange((prev) => ({ ...prev, min: e.target.value }));
                            setPage(1);
                          }}
                        />
                      </div>
                      <span className="divider">To</span>
                      <div className="max-price">
                        <span>Max</span>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => {
                            setPriceRange((prev) => ({ ...prev, max: e.target.value }));
                            setPage(1);
                          }}
                        />
                      </div>
                    </div>
                    <button type="button" className="tg-btn tg-btn-three shop__price-btn" onClick={() => setPage(1)}>
                      Filter Now
                    </button>
                  </div>

                  <div className="sidebar__widget">
                    <h4 className="widget__title">Shop by Color</h4>
                    <div className="shop__cat-list">
                      <ul className="list-wrap">
                        {COLORS.map((color) => (
                          <li key={color}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`color_${color}`}
                                checked={selectedColors.has(color)}
                                onChange={() => onColorToggle(color)}
                              />
                              <label className="form-check-label" htmlFor={`color_${color}`}>
                                {color}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {selectedColors.size > 0 && (
                      <button
                        type="button"
                        className="tg-btn tg-btn-three shop__price-btn"
                        onClick={() => setSelectedColors(new Set())}
                        style={{ marginTop: '10px' }}
                      >
                        Clear All Colors
                      </button>
                    )}
                  </div>

                  <div className="sidebar__widget">
                    <h4 className="widget__title">Filter By Ratings</h4>
                    <div className="shop__cat-list shop__rating-list">
                      <ul className="list-wrap">
                        {RATINGS.map((rating) => (
                          <li key={rating}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`rating_${rating}`}
                                checked={selectedRatings.has(rating)}
                                onChange={() => onRatingToggle(rating)}
                              />
                              <label className="form-check-label" htmlFor={`rating_${rating}`}>
                                <div className="rating__wrap">
                                  <div className="rating">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <svg
                                        key={i}
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8.20504 0.5L10.6419 5.43691L16.0915 6.23344L12.1483 10.0741L13.0789 15.5L8.20504 12.9369L3.33122 15.5L4.26182 10.0741L0.318604 6.23344L5.76813 5.43691L8.20504 0.5Z"
                                          fill="currentColor"
                                          opacity={i < rating ? 1 : 0.25}
                                        />
                                      </svg>
                                    ))}
                                  </div>
                                  <span>({rating}★ & up)</span>
                                </div>
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Shop;

