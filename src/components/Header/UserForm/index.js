//   Code for \PriceWise\src\components\Header\UserForm\index.js

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../../../firebase.js'; // Ensure this path matches your Firebase config file's location
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';

export default function UserForm(props) {
  const { active } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from submitting normally
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to homepage on successful login
    } catch (error) {
      console.error('Error signing in:', error.message);
      // Set a custom error message
      setLoginError("Incorrect Email or Password");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };


  if (user) {
    return (
      <div className={`user-form ${active ? 'active' : ''}`}>
        <h3>{user.email}</h3>
        <button className="profile btn" onClick={() => navigate('/profile')}>Profile</button>
        <button className="logout btn" onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className={`user-form ${active ? 'active' : ''}`}>
      <h3>Welcome!</h3>
      <div className="box">
        <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="box">
        <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn">
        Login now
      </button>
      {loginError && <p className="error-message">{loginError}</p>}
      <p>
        Don't have an account{' '}
        <a href="/register">create now</a>.
      </p>
    </form>
  );
}


UserForm.propTypes = {
  active: PropTypes.bool,
}.isRequired;

