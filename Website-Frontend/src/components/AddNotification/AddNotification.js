import { Link } from 'gatsby';
import React, { useContext } from 'react';

import AddItemNotificationContext from '../../context/AddItemNotificationProvider';

import Button from '../Button';
import Icon from '../Icons/Icon';
import { isAuth } from '../../helpers/general';

import * as styles from './AddNotification.module.css';
import { toOptimizedImage } from '../../helpers/general';

const AddNotification = (props) => {

  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotif = ctxAddItemNotification.state?.open;
  const product = ctxAddItemNotification.state?.product;
  const user = isAuth() ? JSON.parse(localStorage.getItem("velvet_login_key")) : "" 
  const currentTotalCartItems = user.totalCartItems
  console.log("Notification Product: ", product);
  if (!product) return null;

  return (
    <div
      className={`${styles.root} ${
        showNotif === true ? styles.show : styles.hide
      }`}
    >
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Icon symbol={'check'} />
        </div>
        <span>Item added to bag</span>
      </div>

      <div className={styles.newItemContainer}>
        <div className={styles.imageContainer}>
          <img
            alt={product.alt || ''}
            src={toOptimizedImage(product.image)}
          />
        </div>
        <div className={styles.detailContainer}>
          <span className={styles.name}>{product.name}</span>
          <span className={styles.meta}>Color: {product.color}</span>
          <span className={styles.meta}>Size: {product.size.toUpperCase()}</span>
        </div>
      </div>

      <div className={styles.actionContainer}>
        <Button onClick={props.openCart} level={'secondary'}>
          View My Bag ({currentTotalCartItems})
        </Button>
        <Button level="primary" href="/cart">
          Checkout
        </Button>
        <div className={styles.linkContainer}>
          <Link to={'/'}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;