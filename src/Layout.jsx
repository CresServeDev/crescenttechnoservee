import React from 'react';
import Header from './Header.jsx';
import Footer from './FooterNew.jsx';

const Layout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#eaeded'
    }}>
      <Header />
      <main style={{
        flex: 1,
        backgroundColor: '#eaeded',
        padding: '20px 0',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
