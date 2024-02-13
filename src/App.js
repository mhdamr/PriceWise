//   Code for \PriceWise\src\App.js

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Offers from './components/Offers';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
