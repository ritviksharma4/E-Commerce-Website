import React, { useEffect, useState } from 'react';
import { navigate, Link } from 'gatsby';

import Brand from '../components/Brand';
import CartItem from '../components/CartItem';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Icon from '../components/Icons/Icon';
import OrderSummary from '../components/OrderSummary';
import Button from '../components/Button';
import { isAuth } from '../helpers/general';
import LuxuryLoader from '../components/Loading/LuxuriousLoader';

import * as styles from './cart.module.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);

  const GET_LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_SHOPPING_HISTORY_FOR_USER;
  const UPDATE_LAMBDA_ENDPOINT = process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER;

  // Get email safely on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUser = localStorage.getItem('velvet_login_key');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userEmail = user?.email || null;
    setEmail(userEmail);

    if (!isAuth()) {
      navigate('/login');
      return;
    }
  }, []);

  // Fetch cart items once email is available
  useEffect(() => {
    if (!email) return;

    const fetchCartItems = async () => {
      try {
        const response = await fetch(GET_LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            requestType: 'cartItems',
          }),
        });

        const data = await response.json();
        setCartItems(data.cartItems || []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [GET_LAMBDA_ENDPOINT, email]);

  const handleUpdateQty = async (productCode, color, size, newQty) => {
    if (!email) return;

    try {
      const response = await fetch(UPDATE_LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          updateType: {
            cartItems: {
              productCode,
              color,
              size,
              qty: parseInt(newQty),
            },
          },
        }),
      });

      const data = await response.json();
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const isCartEmpty = cartItems.length === 0;

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <div>
      <div className={styles.contentContainer}>
        <Container size={'large'} spacing={'min'}>
          {/* Header */}
          <div className={styles.headerContainer}>
            <div className={styles.shoppingContainer}>
              <Link className={styles.shopLink} to={'/'}>
                <Icon symbol={'arrow'} />
                <span className={styles.continueShopping}>Continue Shopping</span>
              </Link>
            </div>
            <Brand />
            <div className={styles.loginContainer}>
              <Link to={isAuth() ? '/account/orders/' : '/login'}>Your Account</Link>
            </div>
          </div>

          {/* Cart summary */}
          <div className={styles.summaryContainer}>
            <h3>My Bag</h3>
            <div className={styles.cartContainer}>
              <div className={styles.cartItemsContainer}>
                {isCartEmpty ? (
                  <div className={styles.emptyCartWrapper}>
                    <div className={styles.emptyCartPlaceholder}>
                      <p>
                        It appears your bag is empty — discover timeless pieces crafted just for you.
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/')}
                      level={'primary'}
                      fullWidth
                      className={styles.discoverBtn}
                    >
                      Discover Collection
                    </Button>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <CartItem
                      key={index}
                      image={item.image}
                      alt={item.name}
                      name={item.name}
                      price={item.price}
                      color={item.color}
                      size={item.size}
                      qty={item.qty}
                      productCode={item.productCode}
                      setCartItems={setCartItems}
                      setLoading={setLoading}
                      onUpdateQty={(newQty) =>
                        handleUpdateQty(item.productCode, item.color, item.size, newQty)
                      }
                    />
                  ))
                )}
              </div>
              <OrderSummary cartItems={cartItems} setLoading={setLoading} disableCheckout={isCartEmpty} />
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;