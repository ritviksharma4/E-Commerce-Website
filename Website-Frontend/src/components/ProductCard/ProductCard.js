import React, { useState } from 'react';
import { navigate } from 'gatsby';
import * as styles from './ProductCard.module.css';

import Icon from '../Icons/Icon';
import CurrencyFormatter from '../CurrencyFormatter';
import { toOptimizedImage } from '../../helpers/general';

const ProductCard = (props) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const {
    image,
    imageAlt,
    name,
    price,
    originalPrice,
    meta,
    showQuickView,
    height = 580,
    productCode,
  } = props;

  const handleRouteToProduct = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Just in case
    navigate(`/product/${productCode}`);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showQuickView(props);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  return (
    <div className={styles.root}>
      <div className={styles.imageContainer} role="presentation">
        {/* ✅ Only the image itself routes */}
        <img
          style={{ height: `${height}px` }}
          src={toOptimizedImage(image)}
          alt={imageAlt}
          onClick={handleRouteToProduct}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleRouteToProduct();
            }
          }}
          aria-label={imageAlt || 'Product Image'}  // Ensure there's an accessible label
        />


        {/* ✅ Quick View Icon */}
        <div
          tabIndex={0}
          className={styles.bagContainer}
          role="button"
          onClick={handleQuickView}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleQuickView();  // Trigger click when Enter or Space is pressed
            }
          }}
        >
          <Icon symbol="bagPlus" />
        </div>

        {/* ✅ Favorite Icon */}
        <div
          className={styles.heartContainer}
          role="button"
          onClick={handleFavorite}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleFavorite();  // Trigger click when Enter or Space is pressed
            }
          }}
          tabIndex={0}
          
        >
          <Icon symbol="heart" />
          <div
            className={`${styles.heartFillContainer} ${
              isWishlist ? styles.show : styles.hide
            }`}
          >
            <Icon symbol="heartFill" />
          </div>
        </div>
      </div>

      <div className={styles.detailsContainer}>
        <span className={styles.productName}>{name}</span>
        <div className={styles.prices}>
          <span
            className={originalPrice !== undefined ? styles.salePrice : ''}
          >
            <CurrencyFormatter amount={price} />
          </span>
          {originalPrice && (
            <span className={styles.originalPrice}>
              <CurrencyFormatter amount={originalPrice} />
            </span>
          )}
        </div>
        <span className={styles.meta}>{meta}</span>
      </div>
    </div>
  );
};

export default ProductCard;