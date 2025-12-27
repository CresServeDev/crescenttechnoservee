import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase';

const LoginIcon = () => {
  const [userInitial, setUserInitial] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        const email = user.email;
        const firstChar = email.charAt(0).toUpperCase();
        setUserInitial(firstChar);
      } else {
        setUserInitial('');
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userInitial) {
    return null; // Don't show if not logged in
  }

  return (
    <Link to="/profile" aria-label="Profile">
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#667eea',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        marginLeft: '10px',
        cursor: 'pointer',
        textDecoration: 'none'
      }}>
        {userInitial}
      </div>
    </Link>
  );
};

export default LoginIcon;
