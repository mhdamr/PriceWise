//   Code for \PriceWise\src\components\Products\ProductDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

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
    return (
      <main className="spinner-container">
        <div className='spinner-box'>
          <div className='spinner'></div>
        </div>
        </main>
    );
  }

  // Function to render nutritional info
  const renderNutritionalInfo = (nutritionalInfo) => {
    const headers = Object.keys(nutritionalInfo).reduce((acc, key) => {
      const values = nutritionalInfo[key];
      Object.keys(values).forEach((header) => {
        if (!acc.includes(header)) {
          acc.push(header);
        }
      });
      return acc;
    }, []);
  
    return (
      <table className="nutritional-table">
        <thead>
          <tr>
            <th>Typical Values</th>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(nutritionalInfo).map(([key, values]) => (
            <tr key={key}>
              <td>{key}</td>
              {headers.map((header) => (
                <td key={header}>{values[header] || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  
return (
  <main className="product-details-content">
    <div className="product-details-top">
      <div className='image-container'>
        <img src={productInfo.image} alt={productInfo.title} />
      </div>
      <div className='details-container'>
        <h1>{productInfo.name}</h1>
        <div className="price">{productInfo.price}</div>
        <div className="unit">{productInfo.unit}</div>
      </div>
    </div>
    <div className="nutritional-details">
      {productInfo.nutritional_info && renderNutritionalInfo(productInfo.nutritional_info)}
    </div>
  </main>
);
};

export default ProductDetails;

