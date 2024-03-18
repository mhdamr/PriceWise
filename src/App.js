//   Code for \PriceWise\src\App.js

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Products from './components/Products';
import ProductDetails from './components/Products/ProductDetails';
import RegistrationForm from './components/Header/RegistrationForm';
import Profile from './components/Profile';
import { useTheme } from './ThemeContext';
import GroceryList from './components/GroceryList';

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`app ${theme}-mode`}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:store/:searchTerm" element={<Products />} />
          <Route path="/product-details/:productLink" element={<ProductDetails />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/grocery-list" element={<GroceryList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


