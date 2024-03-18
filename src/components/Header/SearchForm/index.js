//   Code for \PriceWise\src\components\Header\SearchForm\index.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchForm.css';

export default function SearchForm(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [store, setStore] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Check if searchTerm is not empty, then only navigate
    if (searchTerm.trim()) {
      navigate(`/products/${store}/${searchTerm}`); 
    } else {
      // Optionally, alert the user or handle the empty search term case appropriately
      console.log('Please enter a product name to search.');
    }
  };

  return (
    <div className={`search-and-store ${props.active ? 'active' : ''}`}>
      <div className="store-select">
  <select value={store} onChange={(e) => setStore(e.target.value)}>
    <option value="all">All Stores</option>
    <option value="tesco">Tesco</option>
    <option value="sainsburys">Sainsbury's</option>
    <option value="iceland">Iceland</option>
  </select>
  </div>
  <form onSubmit={handleSearch} className="search-form">
    <input
      type="search"
      placeholder="search here..."
      id="search-box"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button type="submit" className="search-button">
      <FontAwesomeIcon icon={faSearch} />
    </button>
  </form>
</div>
  );
}

SearchForm.propTypes = {
  active: PropTypes.bool,
}.isRequired;

