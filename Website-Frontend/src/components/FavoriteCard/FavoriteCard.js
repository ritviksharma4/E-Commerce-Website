import React from 'react';
import { navigate } from 'gatsby';
import * as styles from './FavoriteCard.module.css';

import Icon from '../Icons/Icon';
import CurrencyFormatter from '../CurrencyFormatter';
import { toOptimizedImage } from '../../helpers/general';

const FavoriteCard = (props) => {
  const {
    image,
    imageAlt,
    name,
    price,
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

  return (
    <div className={styles.root}>
      <div className={styles.imageContainer} role="presentation">
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
      </div>

      <div className={styles.detailsContainer}>
      <div className={styles.nameAndRemoveRow}>
        <span className={styles.productName}>
          {name ? (name.length > 27 ? `${name.substring(0, 27)}...` : name) : ''}
        </span>
        <span
          className={styles.removeText}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (props.handleRemoveClick) {
              props.handleRemoveClick(productCode);
            }
          }}
        >
          Remove
        </span>
      </div>
        <div className={styles.prices}>
          <span>
            <CurrencyFormatter amount={price} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;