import React, { useState } from 'react';
import * as styles from './FavoriteCardGrid.module.css';

import Drawer from '../Drawer';
import FavoriteCard from '../FavoriteCard';
import QuickView from '../QuickView';
import Slider from '../Slider';
import { Link } from 'gatsby';
import Modal from '../../components/Modal'
import Button from '../Button';
import LuxuryLoader from '../Loading/LuxuriousLoader';

const FavoriteCardGrid = (props) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER
  const [loading, setLoading] = useState(false);
    
  const { height, columns = 3, data = [], spacing, showSlider = false } = props;

  const handleQuickViewClick = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleRemoveClick = (productCode) => {
    setSelectedToDelete(productCode);
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedToDelete) {
      try {
        const localUser = JSON.parse(localStorage.getItem('velvet_login_key'));
        const email = localUser?.email;

        if (!email) {
          throw new Error('User email not found in localStorage');
        }

        const response = await fetch(LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            updateType: {
              "wishlistItems": {
                "productCode": selectedToDelete,
                "action": "remove"
              }
            },
          }),
        });

        const result = await response.json();
        if (result && result.wishlistItems) {
          setShowDelete(false);
          setSelectedToDelete(null);
          props.setData(result.wishlistItems);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        
      } finally {
        setLoading(false);
      }
      setShowDelete(false);
      setSelectedToDelete(null);
    }
  };

  const renderCards = () => {
    return data.map((product, index) => {
      const productLink = `/product/${product.productCode}`;

      return (
        <div className={styles.cardWrapper} key={index}>
          <Link to={productLink} className={styles.cardLink}>
            <FavoriteCard
              key={index}
              productCode={product.productCode}
              height={height}
              price={product.price}
              imageAlt={product.image}
              name={product.name}
              image={product.image}
              showQuickView={() => handleQuickViewClick(product)}
              handleRemoveClick={() => handleRemoveClick(product.productCode)}
            />
          </Link>
        </div>
      );
    });
  };

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <div className={styles.root}>
      {/* 🧱 GRID */}
      <div
        className={`${styles.cardGrid} ${!showSlider ? styles.show : ''}`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {data && data.length > 0 && renderCards()}
      </div>

      {/* 📱 Slider for Mobile */}
      {showSlider && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{renderCards()}</Slider>
        </div>
      )}

      {/* 👁 Quick View Drawer */}
      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        {selectedProduct && (
          <QuickView product={selectedProduct} close={() => setShowQuickView(false)} />
        )}
      </Drawer>
      <Modal visible={showDelete} close={() => setShowDelete(false)}>
        <div className={styles.confirmDeleteContainer}>
          <h4>Remove from Favorites?</h4>
          <p>
            Are you sure you want to remove this from your favorites? You cannot
            undo this action once you press <strong>'Delete'</strong>
          </p>
          <div className={styles.actionContainer}>
            <Button onClick={handleConfirmDelete} level={'primary'}>
              Delete
            </Button>
            <Button onClick={() => setShowDelete(false)} level={'secondary'}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FavoriteCardGrid;