// src/components/Profile/index.js

import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { updateEmail, updatePassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            // If there is no user, redirect to login or home page
            navigate('/'); // Redirects to the home page, adjust as needed
          } else {
            setEmail(user.email); // Sets email only if user is logged in
          }
        });
    
        return () => unsubscribe(); // Cleanup subscription
      }, [navigate]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
          alert('New passwords do not match!');
          return;
        }
    
        try {
          if (email !== auth.currentUser?.email) {
            await updateEmail(auth.currentUser, email);
            alert('Email updated successfully!');
          }
    
          if (newPassword) {  
            await updatePassword(auth.currentUser, newPassword);
            alert('Password updated successfully!');
          }
    
          // Reset password fields after update
          setPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
        } catch (error) {
          console.error('Error updating profile:', error.message);
          alert('Error updating profile: ' + error.message);
        }
      };

  return (
    <div className="profile-container">
      <h2>Profile Settings</h2>
      <form onSubmit={handleSaveProfile}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Current Password (if changing password)</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Current Password" />

        <label>New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />

        <label>Re-enter New Password</label>
        <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Re-enter New Password" />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}