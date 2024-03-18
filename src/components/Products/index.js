//   Code for \PriceWise\src\components\Products\index.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Products.css';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { addDoc } from 'firebase/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';


const Products = () => {
  const { store, searchTerm } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState('relevance');
  const [productFound, setProductFound] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const brands = ['all', 'tesco', 'iceland', 'sainsbury\'s', 'creamfields', 'cadbury', 'fridge raiders', 'stamford', 'deli express', 'arla', 'lactofree', 'cravendale', 'yeo valley'];
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableBrands, setAvailableBrands] = useState(['all']);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const brandDropdownRef = useRef(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null); 
  const [initialProducts, setInitialProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [availableSizes, setAvailableSizes] = useState(['all']);
  const [showSizesDropdown, setShowSizesDropdown] = useState(false);
  const sizeDropdownRef = useRef(null);
  const [selectedDietaryOptions, setSelectedDietaryOptions] = useState([]);
  const dietaryKeywords = {
    "Halal": ['Halal', 'Tariq', 'Humza', 'Tahira', 'Azeem', 'Jahan', 'Najma', 'Quorn'],
    "No lactose": ['Lactofree', 'Lactose Free', 'Soya Drink', 'Dairy Alternative', 'Milk Alternative'],
    "Organic": ['Organic'],
    "Suitable for Vegans": ['Vegan'],
    "Gluten Free": ['Gluten Free'],
    "Kosher": ['Kosher'],
    "Suitable for Coeliacs": ['Coeliacs']
  };
  const [showDietaryDropdown, setShowDietaryDropdown] = useState(false);
  const dietaryDropdownRef = useRef(null);
  const [applicableDietaryOptions, setApplicableDietaryOptions] = useState([]);
  const [quantities, setQuantities] = useState({});

  

  const fetchProducts = async () => {
    setLoading(true);
    setProductFound(false);
  
    const fetchAllFromRetailer = async (retailer) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-products/${retailer}/all`);
        const data = await response.json();
        return { retailer, products: data.length > 0 ? data : [] };
      } catch (error) {
        console.error(`Failed to fetch products from ${retailer}:`, error);
        return { retailer, products: [] };
      }
    };
  
    const selectedStores = store === 'all' ? ['tesco', 'sainsburys', 'iceland'] : [store];
    const promises = selectedStores.map(retailer => fetchAllFromRetailer(retailer));

    const extractSizes = (products) => {
      const sizeRegex = /(\d+(\.\d+)?)(\s)?(pints?|litres?|L|ml|g)\b/i;
      const sizes = products.map(product => {
        const match = product.title.match(sizeRegex);
        return match ? match[0] : null;
      }).filter(size => size !== null);
    
      // Remove duplicates and sort sizes
      return [...new Set(sizes)].sort((a, b) => parseFloat(a) - parseFloat(b));
    };

  
    Promise.all(promises).then((results) => {
      let combinedData = [];
      
      if (sortType === 'relevance') {
        // Implement round-robin distribution for fairness across stores
        const maxLen = Math.max(...results.map(result => result.products.length));
        for (let i = 0; i < maxLen; i++) {
          results.forEach(result => {
            if (i < result.products.length) combinedData.push(result.products[i]);
          });
        }
      } else {
        // If only one store is selected or sort type is not relevance
        combinedData = [].concat(...results.map(result => result.products));
      }

      
      let filteredAndPrioritizedProducts = combinedData;
    
      // If there's a search term, filter and prioritize the products
      if (searchTerm) {
        const searchTerms = searchTerm.toLowerCase().split(' ');
      
        filteredAndPrioritizedProducts = combinedData.filter(product => {
          return searchTerms.every(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'i'); 
            return regex.test(product.title.toLowerCase());
          });
        }).sort((a, b) => {
          const aMatches = searchTerms.reduce((acc, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return acc + regex.test(a.title.toLowerCase());
          }, 0);
          const bMatches = searchTerms.reduce((acc, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return acc + regex.test(b.title.toLowerCase());
          }, 0);
          return bMatches - aMatches;
        });
      } 
    
      setInitialProducts(filteredAndPrioritizedProducts);
      setProducts(filteredAndPrioritizedProducts);
      setProductFound(filteredAndPrioritizedProducts.length > 0);

      const sizes = extractSizes(filteredAndPrioritizedProducts);
      setAvailableSizes(['all', ...sizes]);
    
      const presentBrands = filteredAndPrioritizedProducts.reduce((acc, product) => {
        brands.forEach(brand => {
          if (product.title.toLowerCase().includes(brand.toLowerCase()) && !acc.includes(brand)) {
            acc.push(brand);
          }
        });
        return acc;
      }, []);
    
      setAvailableBrands(['all', ...presentBrands]);
      setLoading(false);
    });
  };

  useEffect(() => {
  // Reset selected filters when a new search is initiated
  setSelectedBrands([]);
  setSelectedSizes([]);

  // Then fetch new products based on the updated searchTerm and store
  fetchProducts();
}, [searchTerm, store]); 

useEffect(() => {
  // Filter products based on selected brands, sizes, and dietary options
  const filtered = initialProducts.filter(product => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.some(brand => product.title.toLowerCase().includes(brand.toLowerCase()));
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.title.includes(size));
    const dietaryMatch = selectedDietaryOptions.length === 0 || selectedDietaryOptions.some(dietaryOption => {
      return dietaryKeywords[dietaryOption].some(keyword => product.title.toLowerCase().includes(keyword.toLowerCase()));
    });

    return brandMatch && sizeMatch && dietaryMatch;
  });

  // Now, apply sorting to the filtered products
  let sortedProducts = [...filtered]; // Make a copy of the filtered products

  if (sortType === 'lowToHigh') {
    sortedProducts.sort((a, b) => parseFloat(a.price.replace(/[£]/g, '')) - parseFloat(b.price.replace(/[£]/g, '')));
  } else if (sortType === 'highToLow') {
    sortedProducts.sort((a, b) => parseFloat(b.price.replace(/[£]/g, '')) - parseFloat(a.price.replace(/[£]/g, '')));
  } else if (sortType === 'reviewsHighToLow') {
    sortedProducts.sort((a, b) => {
      const reviewsA = parseInt(a.reviews) || 0;
      const reviewsB = parseInt(b.reviews) || 0;
      return reviewsB - reviewsA;
    });
  }
  // No need for an else case for 'relevance' because filtered products are already in the initial order

  setFilteredProducts(sortedProducts); // Update state with sorted and filtered products
}, [initialProducts, selectedBrands, selectedSizes, selectedDietaryOptions, sortType]);

  useEffect(() => {
    const filtered = products.filter(product => {
      if (selectedBrands.length === 0) return true; // Show all products if no brand is selected
      return selectedBrands.some(brand => product.title.toLowerCase().includes(brand.toLowerCase()));
    });
    setFilteredProducts(filtered);
  }, [products, selectedBrands]); // Update dependencies to selectedBrands

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    if (e.target.checked) {
      setSelectedBrands(current => [...current, brand]);
    } else {
      setSelectedBrands(current => current.filter(b => b !== brand));
    }
  };

  // Function to close the dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
      setShowBrandsDropdown(false);
    }
  };


  const handleClickOutsideSort = (event) => {
    if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
      setShowSortDropdown(false);
    }
  };

  useEffect(() => {
    if (showBrandsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBrandsDropdown]);
  
  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    setShowSortDropdown(false); // Close dropdown after selection
  };


  useEffect(() => {
    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutsideSort);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideSort);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSort);
    };
  }, [showSortDropdown]);

  const handleSizeChange = (e) => {
    const size = e.target.value;
    if (e.target.checked) {
      setSelectedSizes(currentSizes => [...currentSizes, size]);
    } else {
      setSelectedSizes(currentSizes => currentSizes.filter(s => s !== size));
    }
  };

  useEffect(() => {
    const handleClickOutsideSize = (event) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target)) {
        setShowSizesDropdown(false);
      }
    };
  
    if (showSizesDropdown) {
      document.addEventListener('mousedown', handleClickOutsideSize);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideSize);
    }
  
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSize);
    };
  }, [showSizesDropdown]);

  useEffect(() => {
    const filtered = initialProducts.filter(product => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.some(brand => product.title.toLowerCase().includes(brand.toLowerCase()));
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.title.includes(size));
      return brandMatch && sizeMatch;
    });
    setFilteredProducts(filtered);
  }, [initialProducts, selectedBrands, selectedSizes]);


  const handleDietaryChange = (e) => {
    const option = e.target.value;
    setSelectedDietaryOptions(currentOptions => {
      if (e.target.checked) {
        return [...currentOptions, option];
      } else {
        return currentOptions.filter(d => d !== option);
      }
    });
  };

  useEffect(() => {
    const filtered = initialProducts.filter(product => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.some(brand => product.title.toLowerCase().includes(brand.toLowerCase()));
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.title.includes(size));
      const dietaryMatch = selectedDietaryOptions.length === 0 || selectedDietaryOptions.every(dietaryOption => {
        return dietaryKeywords[dietaryOption].some(keyword => product.title.toLowerCase().includes(keyword.toLowerCase()));
      });
  
      return brandMatch && sizeMatch && dietaryMatch;
    });
    setFilteredProducts(filtered);
  }, [initialProducts, selectedBrands, selectedSizes, selectedDietaryOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dietaryDropdownRef.current && !dietaryDropdownRef.current.contains(event.target)) {
        setShowDietaryDropdown(false);
      }
    };
  
    // Attach the listener
    if (showDietaryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDietaryDropdown]);

  useEffect(() => {
    const updateApplicableDietaryOptions = () => {
      const applicableOptions = Object.keys(dietaryKeywords).filter(option =>
        initialProducts.some(product =>
          dietaryKeywords[option].some(keyword => 
            product.title.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      );
      setApplicableDietaryOptions(applicableOptions);
    };
  
    updateApplicableDietaryOptions();
  }, [initialProducts]);
  

  const handleAddToCart = async (productData, quantity) => {
    if (!auth.currentUser) {
      console.error("No user logged in");
      return;
    }
  
    // Convert string quantity to a number to ensure correct data type
    const numericQuantity = parseInt(quantity, 10);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      console.error("Quantity must be a positive number");
      return;
    }
  
    const productToAdd = {
      ...productData,
      quantity: numericQuantity // Ensure this is a number
    };
  
    try {
      const groceryListRef = collection(db, "users", auth.currentUser.uid, "grocery_list");
      // Let Firebase generate the ID for you
      const docRef = await addDoc(groceryListRef, productToAdd);
      console.log("Product added to grocery list with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding product to grocery list: ", error);
    }
  };

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
  } else if (!productFound) {
    return (
      <div className="no-products-found">
        <h2>No products found for "{searchTerm}". Please try a different search term.</h2>
      </div>
    );
  }

  return (
    <main className="products-content">
      {products.length > 0 && (
        <div className="filter-container">


          <div className="sort-filter">
            <button
              type="button"
              className={`sort-select-button ${showSortDropdown ? 'active' : ''}`}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              Sort
            </button>
            {showSortDropdown && (
              <div className="sort-select-dropdown" ref={sortDropdownRef}>
                <div className="sort-option" onClick={() => handleSortChange('relevance')}>Relevance</div>
                <div className="sort-option" onClick={() => handleSortChange('lowToHigh')}>Price: Low to High</div>
                <div className="sort-option" onClick={() => handleSortChange('highToLow')}>Price: High to Low</div>
                <div className="sort-option" onClick={() => handleSortChange('reviewsHighToLow')}>Reviews: High to Low</div>
              </div>
            )}
          </div>


          <div className="brand-filter">
            <button
              type="button"
              className={`brand-select-button ${showBrandsDropdown ? 'active' : ''}`}
              onClick={() => setShowBrandsDropdown(!showBrandsDropdown)}
            >
              Brand
            </button>
            {showBrandsDropdown && (
              <div className="brand-select-dropdown" ref={brandDropdownRef}>
                {availableBrands.filter(brand => brand !== 'all').map((brand, index) => (
                  <div key={index} className="brand-checkbox">
                    <label htmlFor={`brand-${index}`}>{brand.charAt(0).toUpperCase() + brand.slice(1)}</label>
                    <input
                      type="checkbox"
                      id={`brand-${index}`}
                      name="brand"
                      value={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={handleBrandChange}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="size-filter">
            <button
              type="button"
              className={`size-select-button ${showSizesDropdown ? 'active' : ''}`}
              onClick={() => setShowSizesDropdown(!showSizesDropdown)}
            >
              Size
            </button>
            {showSizesDropdown && (
              <div className="size-select-dropdown" ref={sizeDropdownRef}>
                {availableSizes.filter(size => size !== 'all').map((size, index) => (
                  <div key={index} className="size-checkbox">
                    <label htmlFor={`size-${index}`}>{size}</label>
                    <input
                      type="checkbox"
                      id={`size-${index}`}
                      name="size"
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={handleSizeChange}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="dietary-filter">
            <button
              type="button"
              className={`dietary-select-button ${showDietaryDropdown ? 'active' : ''}`}
              onClick={() => setShowDietaryDropdown(!showDietaryDropdown)}
            >
              Dietary
            </button>
            {showDietaryDropdown && (
              <div className="dietary-select-dropdown" ref={dietaryDropdownRef}>
              {Object.keys(dietaryKeywords).map((option, index) => {
                if (!applicableDietaryOptions.includes(option)) {
                  return null; // Skip rendering this option if it's not applicable
                }
                return (
                  <div key={index} className="dietary-checkbox">
                    <label htmlFor={`dietary-${option}`}>{option}</label>
                    <input
                      type="checkbox"
                      id={`dietary-${option}`}
                      name="dietary"
                      value={option}
                      checked={selectedDietaryOptions.includes(option)}
                      onChange={handleDietaryChange}
                    />
                  </div>
                );
              })}
            </div>
            )}
          </div>


        </div>
      )}


      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductBox key={product.id} product={product} handleAddToCart={handleAddToCart} />
        ))}
      </div>


    </main>

  );


  function ProductBox({ product, handleAddToCart }) {
    const [quantity, setQuantity] = useState("");
  
    return (
      <div className="product-box">
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="product-title-container">
          <h3><Link to={`/product-details/${encodeURIComponent(product.product_link)}`}>{product.title}</Link></h3>
        </div>
        <div className="product-footer">
          {/* Display rating and reviews if they exist */}
          {product.rating && (
            <div className="rating-and-reviews">
              {"★".repeat(Math.round(parseFloat(product.rating)))}
              {"☆".repeat(5 - Math.round(parseFloat(product.rating)))}
              <span className="reviews-count"> ({product.reviews})</span>
            </div>
          )}
          <div className="price-and-unit">
            <p className="price">{product.price}</p>
            <p className="unit">{product.unit}</p>
          </div>
          <div className="product-add">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
        />
        <button onClick={() => handleAddToCart(product, quantity)}>Add</button>
      </div>
        </div>
      </div>
    );
  }
};

export default Products;