import React, { useState } from 'react';

import AdjustItemForCart from '../AdjustItemForCart';
import CurrencyFormatter from '../CurrencyFormatter';
import Drawer from '../Drawer';
import RemoveItem from '../RemoveItem';
import QuickView from '../QuickView';

import * as styles from './CartItem.module.css';
import { navigate } from 'gatsby';
import { toOptimizedImage } from '../../helpers/general';

const CartItem = (props) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { image, alt, color, name, size, price, productCode, qty, setCartItems, setLoading } = props;
  
  
  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        role={'presentation'}
        onClick={() => navigate(`/product/${productCode}`)}
      >
        <img src={toOptimizedImage(image)} alt={alt}></img>
      </div>
      <div className={styles.itemContainer}>
        <span className={styles.name}>{name}</span>
        <div className={styles.metaContainer}>
          <span>Color: {color}</span>
          <span>Size: {size.toUpperCase()}</span>
        </div>
      </div>
      <div className={styles.adjustItemForCartContainer}>
        <AdjustItemForCart
            productCode={productCode}
            color={color}
            size={size}
            quantity={qty}
            setCartItems={setCartItems}
            setLoading={setLoading}
          />
      </div>
      <div className={styles.priceContainer}>
        <CurrencyFormatter amount={price * qty} appendZero />
      </div>
      <div className={styles.removeContainer}>
      <RemoveItem 
          productCode={productCode}
          color={color}
          size={size}
          quantity={qty}
          setCartItems={setCartItems}
          setLoading={setLoading}
        />
      </div>
      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        <QuickView close={() =>  setShowQuickView(false)} />
      </Drawer>
    </div>
  );
};

export default CartItem;
