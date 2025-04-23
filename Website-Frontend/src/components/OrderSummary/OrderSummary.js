import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';

import Button from '../Button';
import FormInputField from '../FormInputField/FormInputField';
import CurrencyFormatter from '../CurrencyFormatter';

import * as styles from './OrderSummary.module.css';

const OrderSummary = ({ cartItems }) => {
  const [coupon, setCoupon] = useState('UI Purposes Only!');
  const [giftCard, setGiftCard] = useState('UI Purposes Only!');

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.price * item.qty);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = 0; // Can later calculate based on region
  const shipping = 0; // Set or calculate as needed
  const total = subtotal + tax + shipping;

  return (
    <div className={styles.root}>
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
        <Button
          onClick={() => navigate('/orderConfirm')}
          fullWidth
          level={'primary'}
        >
          checkout
        </Button>
        <div className={styles.linkContainer}>
          <Link to={'/'}>CONTINUE SHOPPING</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;