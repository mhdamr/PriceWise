//   Code for \PriceWise\src\components\Header\SearchForm\index.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchForm.css';

export default function SearchForm(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Check if searchTerm is not empty, then only navigate
    if (searchTerm.trim()) {
      navigate(`/products/${searchTerm}`);
    } else {
      // Optionally, alert the user or handle the empty search term case appropriately
      console.log('Please enter a product name to search.');
    }
  };

  return (
    <form onSubmit={handleSearch} className={`search-form ${props.active ? 'active' : ''}`}>
      <label htmlFor="search-box">
        <input
          type="search"
          placeholder="search here..."
          id="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Set the searchTerm state to the input value
        />
        <button type="submit">
          <FontAwesomeIcon className="search-icon" icon={faSearch} />
        </button>
      </label>
    </form>
  );
}

SearchForm.propTypes = {
  active: PropTypes.bool,
}.isRequired;

