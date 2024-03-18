// src/components/Header/RegistrationForm/index.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.js';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import './RegistrationForm.css';

export default function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, redirect them to the homepage or another page
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [navigate]);
  
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      navigate('/'); // Redirect to homepage on successful registration
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={registerUser} className="registration-form">
        <h3>Sign Up</h3>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn">
          Register
        </button>
      </form>
    </div>
  );
}

