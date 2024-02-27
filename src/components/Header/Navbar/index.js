//   Code for \PriceWise\src\components\Header\Navbar\index.js

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar(props) {
  const { active } = props;
  return (
    <nav className={`navbar ${active ? 'active' : ''}`}>
      <NavLink to="/" className={({ isActive }) => (isActive ? 'activeLink' : '')}>Home</NavLink>
      <NavLink to="/offers" className={({ isActive }) => (isActive ? 'activeLink' : '')}>Offers</NavLink>
      <NavLink to="/products" className={({ isActive }) => (isActive ? 'activeLink' : '')}>Products</NavLink>
    </nav>
  );
}

Navbar.propTypes = {
  active: PropTypes.bool,
};

