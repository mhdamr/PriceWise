//   Code for \PriceWise\src\components\Header\index.js

import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBasket,
  faBars,
  faSearch,
  faUser,
  faMoon, 
  faSun, 
  faShoppingCart
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

  const [user, setUser] = useState(null); // State to hold user info
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Clean up subscription
  }, []);

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
        {user && ( // Conditionally render if user is not null
          <button
            type="button"
            id="grocery-list-btn"
            onClick={() => navigate('/grocery-list')}
          >
            <FontAwesomeIcon className="fa-icon" icon={faShoppingCart} />
          </button>
        )}
        <button type="button" id="user-btn" onClick={handleUserFormButton}>
          <FontAwesomeIcon className="fa-icon" icon={faUser} />
        </button>
      </div>
      <SearchForm active={activeSearch} />
      <UserForm active={activeUserForm} />
    </header>
  );
}

