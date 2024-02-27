//   Code for \PriceWise\src\App.js

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Offers from './components/Offers';
import Products from './components/Products';
import ProductDetails from './components/Products/ProductDetails';
import { useTheme } from './ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`app ${theme}-mode`}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:searchTerm" element={<Products />} />
          <Route path="/product-details/:productLink" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


