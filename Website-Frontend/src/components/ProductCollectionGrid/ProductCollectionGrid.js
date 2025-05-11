import React from 'react';
import * as styles from './ProductCollectionGrid.module.css';

import ProductCollection from '../ProductCollection';

const ProductCollectionGrid = (props) => {
  return (
    <div className={styles.root}>
      <ProductCollection
        image={'/collections/collection1.png'}
        title={'Men'}
        text={'SHOP NOW'}
        link={'/shop/men'}
      />
      <ProductCollection
        image={'/collections/collection2.png'}
        title={'Women'}
        text={'SHOP NOW'}
        link={'/shop/women'}
      />
      <ProductCollection
        image={'/collections/collection3.png'}
        title={'Accessories'}
        text={'SHOP NOW'}
        link={'/shop/accessories'}
      />
      <ProductCollection
        image={'/collections/collection4.png'}
        title={'Footwear'}
        text={'SHOP NOW'}
        link={'/shop/footwear'}
      />
    </div>
  );
};

export default ProductCollectionGrid;
