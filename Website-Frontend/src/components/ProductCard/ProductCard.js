import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './ProductCard.module.css';

import Icon from '../Icons/Icon';
import CurrencyFormatter from '../CurrencyFormatter';
import { toOptimizedImage } from '../../helpers/general';

const ProductCard = (props) => {
  const { isInWishlist: initialIsInWishlist } = props;

  // To avoid hydration mismatch, initialize as false and sync later if on client
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsWishlist(initialIsInWishlist);
    }
  }, [initialIsInWishlist]);

  const UPDATE_USER_SHOPPING_HISTORY = process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER;

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
    e.stopPropagation();
    navigate(`/product/${productCode}`);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showQuickView(props);
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nextWishlistState = !isWishlist;
    setIsWishlist(nextWishlistState);

    if (typeof window === 'undefined') {
      // No localStorage on server - skip updating
      return;
    }

    let user = {};
    try {
      user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
    } catch {
      user = {};
    }
    const email = user.email || null;

    const action = nextWishlistState ? "add" : "remove";

    await fetch(UPDATE_USER_SHOPPING_HISTORY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        updateType: {
          wishlistItems: {
            productCode: productCode,
            action: action,
          },
        },
      }),
    });
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
          aria-label={imageAlt || 'Product Image'}
        />

        <div
          tabIndex={0}
          className={styles.bagContainer}
          role="button"
          onClick={handleQuickView}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleQuickView();
            }
          }}
        >
          <Icon symbol="bagPlus" />
        </div>

        <div
          className={styles.heartContainer}
          role="button"
          onClick={handleFavorite}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleFavorite();
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
          <span className={originalPrice !== undefined ? styles.salePrice : ''}>
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