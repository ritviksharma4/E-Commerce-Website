import React, { useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';
import { Link } from 'gatsby';

const ProductCardGrid = (props) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // New state

  const { height, columns = 3, data, spacing, showSlider = false } = props;

  const columnCount = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const handleQuickViewClick = (product) => {
    console.log("Product Deets: ", product)
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const renderCards = () => {
    return data.map((product, index) => {
      const productLink = `/product/${product.productCode}`;

      return (
        <div className={styles.cardWrapper} key={index}>
          <Link to={productLink} className={styles.cardLink}>
            <ProductCard
              key={index}
              productCode={product.productCode}
              height={height}
              price={product.price}
              imageAlt={product.image}
              name={product.name}
              image={product.image}
              meta={product.meta}
              originalPrice={product.originalPrice}
              showQuickView={(e) => {
                handleQuickViewClick(product);
              }}
            />
          </Link>
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

      {showSlider === true && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{data && renderCards()}</Slider>
        </div>
      )}

      {/* Updated Drawer: pass selected product to QuickView */}
      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        {selectedProduct && (
          <QuickView product={selectedProduct} close={() => setShowQuickView(false)} />
        )}
      </Drawer>
    </div>
  );
};

export default ProductCardGrid;