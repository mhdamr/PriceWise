//   Code for \PriceWise\src\components\Header\index.js

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBasket,
  faBars,
  faSearch,
  faUser,
  faMoon, 
  faSun 
} from '@fortawesome/free-solid-svg-icons';
import SearchForm from './SearchForm';
import UserForm from './UserForm';
import './Header.css';
import Navbar from './Navbar';
import { useTheme } from '../../ThemeContext.js';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [activeUserForm, setActiveUserForm] = useState(false);
  const { theme, toggleTheme } = useTheme();
  window.onscroll = () => {
    setActiveUserForm(false);
    setActiveSearch(false);
    setActiveMenu(false);
  };
  const handleMenuButton = () => {
    setActiveMenu(!activeMenu);
    setActiveSearch(false);
    setActiveUserForm(false);
  };
  const handleSearchButton = () => {
    setActiveSearch(!activeSearch);
    setActiveUserForm(false);
    setActiveMenu(false);
  };
  const handleUserFormButton = () => {
    setActiveUserForm(!activeUserForm);
    setActiveSearch(false);
    setActiveMenu(false);
  };
  return (
    <header className="header">
      <NavLink to="/" className="logo">
        <i>
          <FontAwesomeIcon icon={faShoppingBasket} />
        </i>
        PriceWise
        </NavLink>
      <Navbar active={activeMenu} />
      <div className="icons">
        <button type="button" id="menu-btn" onClick={handleMenuButton}>
          <FontAwesomeIcon className="fa-icon" icon={faBars} />
        </button>
        <button type="button" onClick={toggleTheme} id="theme-btn">
        <FontAwesomeIcon className="fa-icon" icon={theme === 'dark' ? faSun : faMoon} />
      </button>
        <button type="button" id="search-btn" onClick={handleSearchButton}>
          <FontAwesomeIcon className="fa-icon" icon={faSearch} />
        </button>
        <button type="button" id="user-btn" onClick={handleUserFormButton}>
          <FontAwesomeIcon className="fa-icon" icon={faUser} />
        </button>
      </div>
      <SearchForm active={activeSearch} />
      <UserForm active={activeUserForm} />
    </header>
  );
}
