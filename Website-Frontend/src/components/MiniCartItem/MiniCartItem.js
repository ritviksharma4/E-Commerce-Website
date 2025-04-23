import React from 'react';

import { navigate } from 'gatsby';
import AdjustItemForCart from '../AdjustItemForCart/AdjustItemForCart';
import CurrencyFormatter from '../CurrencyFormatter';
import RemoveItem from '../RemoveItem';

import * as styles from './MiniCartItem.module.css';
import { toOptimizedImage } from '../../helpers/general';

const MiniCartItem = (props) => {
  const { image, alt, name, price, color, size, productCode, qty, setCartItems, setLoading} = props;
  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        role={'presentation'}
        onClick={() => navigate(`/product/${productCode}`)}
      >
        <img src={toOptimizedImage(image)} alt={alt} />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.metaContainer}>
          <span className={styles.name}>{name}</span>
          <div className={styles.priceContainer}>
            <CurrencyFormatter amount={price} />
          </div>
          <span className={styles.meta}>Color: {color}</span>
          <span className={styles.meta}>
            Size:
            <span className={styles.size}>{size}</span>
          </span>
        </div>
        <div className={styles.AdjustItemForCartContainer}>
        <AdjustItemForCart
          productCode={productCode}
          color={color}
          size={size}
          quantity={qty}
          setCartItems={setCartItems}
          setLoading={setLoading}
        />
        </div>
      </div>
      <div className={styles.closeContainer}>
        <RemoveItem 
          productCode={productCode}
          color={color}
          size={size}
          quantity={qty}
          setCartItems={setCartItems}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default MiniCartItem;
