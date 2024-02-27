//   Code for \PriceWise\src\components\Products\ProductDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Products.css';

const ProductDetails = () => {
  const { productLink } = useParams();
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const decodedProductLink = decodeURIComponent(productLink);
    fetch(`http://127.0.0.1:5000/product-details?url=${decodedProductLink}`)
      .then(response => response.json())
      .then(data => {
        setProductInfo(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [productLink]);

  if (!productInfo) {
    return <div className='spinner-container'>
      <div className="spinner"></div>
    </div>;
  }
  
  return (
    <div className='product-details'>
    <div>
      
      <h1>{productInfo.name}</h1>
      {/* Render additional product details as needed */}
    </div>
    </div>
  );
};

export default ProductDetails;

