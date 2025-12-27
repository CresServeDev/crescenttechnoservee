import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#131921',
      color: '#ddd',
      padding: '40px 0 20px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="row">
          {/* Back to top */}
          <div className="col-12 mb-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                backgroundColor: '#37475a',
                color: 'white',
                border: 'none',
                padding: '12px',
                width: '100%',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              Back to top
            </button>
          </div>
        </div>

        <div className="row">
          {/* Get to Know Us */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>
              Get to Know Us
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/about" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  About Crescent TechnoServe
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/careers" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Careers
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/press" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Press Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>
              Make Money with Us
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/sell" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Sell products on Crescent
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/affiliate" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Become an Affiliate
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/advertise" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Advertise Your Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Crescent Payment Products */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>
              Crescent Payment Products
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/business" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Shop with Points
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/reload" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Reload Your Balance
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/currency" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Crescent Currency Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>
              Let Us Help You
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/account" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Crescent Account
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/orders" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Your Orders
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/shipping" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Shipping Rates & Policies
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/returns" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Returns & Replacements
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/help" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                  Help
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: '#37475a', margin: '30px 0' }} />

        {/* Logo and Copyright */}
        <div className="row align-items-center">
          <div className="col-md-6 mb-3">
            <Link to="/shop" style={{ textDecoration: 'none', color: 'white' }}>
              <img
                src="/assets/img/logo/whitelogo.png"
                alt="Crescent TechnoServe"
                style={{
                  height: '30px',
                  marginRight: '10px',
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Crescent TechnoServe</span>
            </Link>
          </div>

          <div className="col-md-6 mb-3 text-md-end">
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
              <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                <i className="fas fa-globe" style={{ marginRight: '5px' }}></i>
                English
              </a>
              <a href="#" style={{ color: '#ddd', textDecoration: 'none', fontSize: '14px' }}>
                <i className="fas fa-rupee-sign" style={{ marginRight: '5px' }}></i>
                INR - Indian Rupee
              </a>
            </div>
          </div>
        </div>

        {/* Service Links */}
        <div className="row">
          <div className="col-12">
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Link to="/conditions" style={{ color: '#ddd', textDecoration: 'none', fontSize: '12px' }}>
                Conditions of Use & Sale
              </Link>
              <Link to="/privacy" style={{ color: '#ddd', textDecoration: 'none', fontSize: '12px' }}>
                Privacy Notice
              </Link>
              <Link to="/interest-ads" style={{ color: '#ddd', textDecoration: 'none', fontSize: '12px' }}>
                Interest-Based Ads
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p style={{ color: '#999', margin: 0, fontSize: '12px' }}>
              © {new Date().getFullYear()} Crescent TechnoServe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
