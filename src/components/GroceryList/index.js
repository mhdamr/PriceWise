// Code: src/components/GroceryList/index.js

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './GroceryList.css';

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Set up an observer on the Auth object
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchGroceryList();
      } else {
        // User is signed out or not available immediately after a refresh
        setGroceryList([]);
        setTotalPrice(0);
      }
    });

    // Clean up the observer to avoid memory leaks
    return () => unsubscribe();
  }, []);

  const fetchGroceryList = async () => {
    const q = query(collection(db, "users", auth.currentUser.uid, "grocery_list"));
    const querySnapshot = await getDocs(q);
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const total = list.reduce((acc, item) => {
      const price = parseFloat(item.price.replace(/[£]/g, ''));
      return acc + (price * item.quantity);
    }, 0);

    setGroceryList(list);
    setTotalPrice(total.toFixed(2));
  };

  const removeItem = async (itemId) => {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "grocery_list", itemId));
    fetchGroceryList();
  };

  return (
    <div className="grocery-list">
      <h1>Your Grocery List - {groceryList.length} items</h1>
      <p className="total-price">Total Price: £{totalPrice}</p> {/* Display total price */}
      <div className="grocery-items">
        {groceryList.map((item) => (
          <div key={item.id} className="grocery-item">
            <img src={item.image} alt={item.title} />
            <div className="item-details">
              <h2>{item.title}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.price}</p>
              <div className="item-actions">
                <a href={item.product_link} target="_blank" rel="noopener noreferrer">View</a>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryList;