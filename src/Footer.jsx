import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgb(0, 74, 87)',
      color: 'white',
      padding: '40px 0 20px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 style={{ color: '#3498db', marginBottom: '20px', fontWeight: 'bold' }}>
              Crescent TechnoServe
            </h5>
            <p style={{ color: '#bdc3c7', lineHeight: '1.6', marginBottom: '20px' }}>
              Your trusted partner in technology solutions. We provide cutting-edge products
              and exceptional service to meet all your tech needs.
            </p>
            <div style={{ marginBottom: '15px' }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#3498db', marginRight: '10px' }}></i>
              <span style={{ color: '#bdc3c7' }}>256 Avenue, Newyork City</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <i className="fas fa-phone" style={{ color: '#3498db', marginRight: '10px' }}></i>
              <span style={{ color: '#bdc3c7' }}>987-0980-9809</span>
            </div>
            <div>
              <i className="fas fa-envelope" style={{ color: '#3498db', marginRight: '10px' }}></i>
              <span style={{ color: '#bdc3c7' }}>support@crescenttechnoserve.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 style={{ color: '#ecf0f1', marginBottom: '20px', fontWeight: 'bold' }}>
              Quick Links
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <a href="/shop" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = '#3498db'}
                   onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  Shop
                </a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="/cart" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = '#3498db'}
                   onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  Cart
                </a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="/profile" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = '#3498db'}
                   onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  Profile
                </a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="/order-tracking" style={{ color: '#bdc3c7', textDecoration: 'none', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = '#3498db'}
                   onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 style={{ color: '#ecf0f1', marginBottom: '20px', fontWeight: 'bold' }}>
              Services
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <span style={{ color: '#bdc3c7' }}>Tech Support</span>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <span style={{ color: '#bdc3c7' }}>Product Consultation</span>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <span style={{ color: '#bdc3c7' }}>Custom Solutions</span>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <span style={{ color: '#bdc3c7' }}>Warranty Services</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 style={{ color: '#ecf0f1', marginBottom: '20px', fontWeight: 'bold' }}>
              Newsletter
            </h6>
            <p style={{ color: '#bdc3c7', marginBottom: '20px' }}>
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid #bdc3c7',
                  color: 'white',
                  borderRadius: '25px 0 0 25px'
                }}
              />
              <button
                className="btn"
                type="button"
                style={{
                  backgroundColor: '#3498db',
                  border: '1px solid #3498db',
                  color: 'white',
                  borderRadius: '0 25px 25px 0',
                  padding: '0 20px'
                }}
              >
                Subscribe
              </button>
            </div>

            {/* Social Media */}
            <div>
              <h6 style={{ color: '#ecf0f1', marginBottom: '15px', fontWeight: 'bold' }}>
                Follow Us
              </h6>
              <div style={{ display: 'flex', gap: '15px' }}>
                <a href="#" style={{
                  color: '#bdc3c7',
                  fontSize: '20px',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#3498db'}
                onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" style={{
                  color: '#bdc3c7',
                  fontSize: '20px',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#3498db'}
                onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" style={{
                  color: '#bdc3c7',
                  fontSize: '20px',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#3498db'}
                onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" style={{
                  color: '#bdc3c7',
                  fontSize: '20px',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#3498db'}
                onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '30px 0' }} />
        <div className="row">
          <div className="col-12 text-center">
            <p style={{ color: '#95a5a6', margin: 0, fontSize: '14px' }}>
              © {new Date().getFullYear()} Crescent TechnoServe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
