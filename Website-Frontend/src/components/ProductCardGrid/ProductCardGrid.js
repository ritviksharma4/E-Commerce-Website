import React, { useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';
import { Link } from 'gatsby'; // Import Link for navigation

const ProductCardGrid = (props) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { height, columns = 3, data, spacing, showSlider = false } = props;
  const columnCount = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const renderCards = () => {
    return data.map((product, index) => {
      // Construct the link to the product page using productCode
      const productLink = `/product/${product.productCode}`;

      return (
        <div className={styles.cardWrapper} key={index}>
          {/* Wrap the ProductCard in a Link to dynamically route to the product page */}
          <Link to={productLink} className={styles.cardLink}>
            <ProductCard
              productCode={product.productCode}
              height={height}
              price={product.price}
              imageAlt={product.alt}
              name={product.name}
              image={product.image}
              meta={product.meta}
              originalPrice={product.originalPrice}
            />
          </Link>
          
          {/* Quick View button */}
          <div 
            onClick={() => setShowQuickView(true)} 
            className={styles.quickViewBtn}
          >
            Quick View
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.root} style={columnCount}>
      <div
        className={`${styles.cardGrid} ${showSlider === false ? styles.show : ''}`}
        style={columnCount}
      >
        {data && renderCards()}
      </div>

      {/* Mobile slider for showing the product cards */}
      {showSlider === true && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{data && renderCards()}</Slider>
        </div>
      )}

      {/* QuickView Drawer for showing more details */}
      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        <QuickView close={() => setShowQuickView(false)} />
      </Drawer>
    </div>
  );
};

export default ProductCardGrid;