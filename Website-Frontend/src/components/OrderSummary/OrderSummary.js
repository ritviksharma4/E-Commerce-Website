import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';

import Button from '../Button';
import FormInputField from '../FormInputField/FormInputField';
import CurrencyFormatter from '../CurrencyFormatter';

import { isAuth } from '../../helpers/general';

import * as styles from './OrderSummary.module.css';

const OrderSummary = ({ cartItems, setLoading }) => {
  const [coupon, setCoupon] = useState('UI Purposes Only!');
  const [giftCard, setGiftCard] = useState('UI Purposes Only!');

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = 0;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    if (!isAuth()) {
      return navigate('/login');
    }

    try {
      setLoading(true);

      const velvetUser = JSON.parse(localStorage.getItem('velvet_login_key'));
      const email = velvetUser.email;
      const addresses = velvetUser.addresses || [];

      if (!email || addresses.length === 0) {
        alert('Missing email or address details!');
        return;
      }

      const address =
        addresses[Math.floor(Math.random() * addresses.length)];

      const formattedItems = cartItems.map(item => ({
        productCode: item.productCode,
        image: item.image,
        qty: item.qty.toFixed(2),
        size: item.size,
        price: (item.price * item.qty).toFixed(2),
      }));

      const orderPayload = {
        email,
        updateType: {
          orderHistory: {
            billingAddress: address,
            shippingAddress: address,
            items: formattedItems,
            orderId: `${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${Math.floor(100 + Math.random() * 900)}`,
            orderPlacedDate: new Date().toISOString(),
            orderStatus: 'Pending',
            orderTotal: total.toFixed(2)
          },
        },
      };

      const res = await fetch(
        process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER,
        {
          method: 'POST',
          body: JSON.stringify(orderPayload),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await res.json();

      let totalCartItems = 0
      const existingLoginKey = JSON.parse(localStorage.getItem('velvet_login_key')) || {};
      const updatedLoginKey = {
        ...existingLoginKey,
        totalCartItems: totalCartItems
      };
      localStorage.setItem('velvet_login_key', JSON.stringify(updatedLoginKey));
      window.dispatchEvent(new Event('cart-updated'));

      console.log('Order submitted:', result);

      navigate('/orderConfirm');
    } catch (err) {
      console.error('Checkout Error:', err);
      alert('There was a problem processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
        <>
          <div className={styles.orderSummary}>
            <span className={styles.title}>order summary</span>
            <div className={styles.calculationContainer}>
              <div className={styles.labelContainer}>
                <span>Subtotal</span>
                <span>
                  <CurrencyFormatter amount={subtotal} appendZero />
                </span>
              </div>
              <div className={styles.labelContainer}>
                <span>Shipping</span>
                <span>---</span>
              </div>
              <div className={styles.labelContainer}>
                <span>Tax</span>
                <span>
                  <CurrencyFormatter amount={tax} appendZero />
                </span>
              </div>
            </div>
            <div className={styles.couponContainer}>
              <span>Coupon Code</span>
              <FormInputField
                value={coupon}
                handleChange={(_, coupon) => setCoupon(coupon)}
                id={'couponInput'}
                icon={'arrow'}
              />
              <span>Gift Card</span>
              <FormInputField
                value={giftCard}
                handleChange={(_, giftCard) => setGiftCard(giftCard)}
                id={'giftCardInput'}
                icon={'arrow'}
              />
            </div>
            <div className={styles.totalContainer}>
              <span>Total: </span>
              <span>
                <CurrencyFormatter amount={total} appendZero />
              </span>
            </div>
          </div>
          <div className={styles.actionContainer}>
            <Button onClick={handleCheckout} fullWidth level={'primary'}>
              checkout
            </Button>
            <div className={styles.linkContainer}>
              <Link to={'/'}>CONTINUE SHOPPING</Link>
            </div>
          </div>
        </>
      
    </div>
  );
};

export default OrderSummary;