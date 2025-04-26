import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import Icon from '../Icons/Icon';
import * as styles from './AdjustItemForCart.module.css';
import { isAuth } from '../../helpers/general';

const AdjustItemForCart = ({ isTransparent, quantity, productCode, color, size, setCartItems, setLoading }) => {
  const [qty, setQty] = useState(1);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER;

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
      return;
    }

    setQty(parseInt(quantity));
  }, [quantity]);

  const updateCart = async (newQty) => {
    setLoading(true);
    try {
      const email = JSON.parse(localStorage.getItem('velvet_login_key'))?.email;

      if (!email) {
        navigate('/login');
        return;
      }

      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          updateType: {
            cartItems: {
              productCode,
              color,
              size,
              qty: newQty,
            },
          },
        }),
      });

      const data = await response.json();
      const updatedCartItems = data.cartItems || [];
      let totalCartItems = 0
      data.cartItems.map((item) => {
        totalCartItems += item.qty;
        return totalCartItems
      });
      const existingLoginKey = JSON.parse(localStorage.getItem('velvet_login_key')) || {};
      const updatedLoginKey = {
        ...existingLoginKey,
        totalCartItems: totalCartItems
      };
      localStorage.setItem('velvet_login_key', JSON.stringify(updatedLoginKey));
      setCartItems(updatedCartItems);
      window.dispatchEvent(new Event('cart-updated'));

    } catch (error) {
      console.error('Error updating cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);
    updateCart(newQty);
  };

  const handleOnChange = (e) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num >= 1) {
      handleQtyChange(num);
    }
  };

  const handleDecrement = () => {
    const newQty = qty - 1;
    if (newQty >= 1) {
      handleQtyChange(newQty);
    } else {
      handleQtyChange(0);
    }
  };

  const handleIncrement = () => {
    handleQtyChange(qty + 1);
  };

  return (
    <div
      className={`${styles.root} ${
        isTransparent === true ? styles.transparent : ''
      }`}
    >
      <div
        className={styles.iconContainer}
        role="presentation"
        onClick={handleDecrement}
      >
        <Icon symbol="minus" />
      </div>
      <div className={styles.inputContainer}>
        <input
          className={isTransparent === true ? styles.transparentInput : ''}
          onChange={handleOnChange}
          type="number"
          value={qty}
          min={1}
        />
      </div>
      <div
        role="presentation"
        onClick={handleIncrement}
        className={styles.iconContainer}
      >
        <Icon symbol="plus" />
      </div>
    </div>
  );
};

export default AdjustItemForCart;