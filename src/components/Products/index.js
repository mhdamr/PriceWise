//   Code for \PriceWise\src\components\Products\index.js


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Products.css';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { searchTerm } = useParams(); 
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState('relevance');

  useEffect(() => {
    if (searchTerm) {
      setLoading(true); // Start loading before fetching data
      // Fetch data from Tesco
      fetch(`http://127.0.0.1:5000/search-products/tesco/${searchTerm}`)
        .then(response => response.json())
        .then(tescoData => {
          // Fetch data from Sainsbury's
          fetch(`http://127.0.0.1:5000/search-products/sainsburys/${searchTerm}`)
            .then(response => response.json())
            .then(sainsburysData => {
              // Combine the data from both Tesco and Sainsbury's
              setProducts([...tescoData, ...sainsburysData]);
              setLoading(false); // Stop loading after data is received
            })
            .catch(error => {
              console.log(error);
              setLoading(false); // Stop loading if an error occurs
            });
        })
        .catch(error => {
          console.log(error);
          setLoading(false); // Stop loading if an error occurs
        });
    }
  }, [searchTerm]);

  useEffect(() => {
    
    if (sortType === 'lowToHigh') {
      const sortedProducts = [...products].sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[£]/g, ''));
      const priceB = parseFloat(b.price.replace(/[£]/g, ''));
      return priceA - priceB; // Ascending order
      });
      setProducts(sortedProducts);
    }
    
    else if (sortType === 'highToLow') {
        const sortedProducts = [...products].sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[£]/g, ''));
        const priceB = parseFloat(b.price.replace(/[£]/g, ''));
        return priceB - priceA; // Descending order
        });
      setProducts(sortedProducts);
    }

  }, [sortType, products]); // Make sure to add products to the dependency array

  if (!searchTerm) {
    return (
        <div className="products">
          <h1>Products</h1>
          <p>Please enter a product name in the search bar above.</p>
        </div>
    );
  }

  if (loading) {
    return (
      <main className="spinner-container">
        <div className='spinner-box'>
          <div className='spinner'></div>
        </div>
      </main>
    );
  }

  return (
    <main className="products-content">
      {/* Conditionally render sort container if there are products */}
      {products.length > 0 && (
        <div className="sort-container">
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      )}
      <div className="products-grid">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          products.map((product, index) => (
            <div key={index} className="product-box">
              <img src={product.image} alt={product.title} className="product-image" />
              <h3>
                <Link to={`/product-details/${encodeURIComponent(product.product_link)}`}>
                  {product.title}
                </Link>
              </h3>
              <div className="price-and-unit">
                <p className="price">{product.price}</p>
                <p className="unit">{product.unit}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Products;

