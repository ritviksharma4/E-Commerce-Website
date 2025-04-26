import React from 'react';

import Icon from '../Icons/Icon';
import { navigate } from 'gatsby';
import * as styles from './RemoveItem.module.css';
import { isAuth } from '../../helpers/general';

const RemoveItem = (props) => {
  const { productCode, color, size, setCartItems, setLoading} = props
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER;

  const deleteFromCart = async () => {
    setLoading(true);
    if (!isAuth()) {
      navigate('/login');
      return;
    }
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
              qty: 0,
            },
          },
        }),
      });

      const data = await response.json();
      const updatedCartItems = data.cartItems || [];
      let totalCartItems = 0
      data.cartItems?.map((item) => {
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
  
  return (
    <div className={styles.root}
      onClick={deleteFromCart}
    >
      <Icon symbol={'cross'} />
    </div>
  );
};

export default RemoveItem;
