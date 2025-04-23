import React, { useEffect, useState } from 'react';
import { Link, navigate } from 'gatsby';

import Button from '../Button';
import CurrencyFormatter from '../CurrencyFormatter';
import MiniCartItem from '../MiniCartItem';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import { isAuth } from '../../helpers/general';

import * as styles from './MiniCart.module.css';

const MiniCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_SHOPPING_HISTORY_FOR_USER;

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
      return;
    }

    const fetchCartItems = async () => {
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
            requestType: 'cartItems',
          }),
        });
        console.log("Response in Minicart: ", response)

        const data = await response.json();
        setCartItems(data.cartItems || []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [LAMBDA_ENDPOINT]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      return acc + (parseFloat(item.price) || 0) * (parseInt(item.qty) || 1);
    }, 0);
  };

  if (loading) return <LuxuryLoader />;

  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <h4>My Bag</h4>
      </div>
      {loading && <LuxuryLoader />}
      <div className={styles.cartItemsContainer}>
        {cartItems.map((item, index) => (
          <MiniCartItem key={index} setCartItems={setCartItems} setLoading={setLoading} {...item} />
        ))}
      </div>
      <div className={styles.summaryContainer}>
        <div className={styles.blurredBackground}>
          <div className={styles.summaryContent}>
            <div className={styles.totalContainer}>
              <span>Total (USD)</span>
              <span>
                <CurrencyFormatter amount={calculateTotal()} appendZero />
              </span>
            </div>
            <span className={styles.taxNotes}>
              Taxes and shipping will be calculated at checkout
            </span>
            <Button onClick={() => navigate('/cart')} level={'primary'} fullWidth>
              checkout
            </Button>
            <div className={styles.linkContainer}>
              <Link to="/">continue shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;