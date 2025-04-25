import React, { useState, useEffect, useContext } from 'react';
import { navigate } from 'gatsby';
import * as styles from './ProductPage.module.css';
import { isAuth } from '../../helpers/general';
import Accordion from '../../components/Accordion';
import AdjustItem from '../../components/AdjustItem';
import Button from '../../components/Button';
import Breadcrumbs from '../../components/Breadcrumbs';
import Container from '../../components/Container';
import CurrencyFormatter from '../../components/CurrencyFormatter';
import Gallery from '../../components/Gallery';
import SizeList from '../../components/SizeList';
import Split from '../../components/Split';
import SwatchList from '../../components/SwatchList';
import Layout from '../../components/Layout/Layout';
import Icon from '../../components/Icons/Icon';
import ProductCardGrid from '../../components/ProductCardGrid';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';

import AddItemNotificationContext from '../../context/AddItemNotificationProvider';

const ProductPage = ({ params }) => {
  const { productCode } = params;
  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotification = ctxAddItemNotification.showNotification;

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_PRODUCT_DETAILS_FOR_USER;
  const UPDATE_USER_SHOPPING_HISTORY = process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER

  const formatBreadcrumbLabel = (str) => {
    if (!str) return '';
    return str
      .split(/[\s-_]+/)
      .map(word => {
        if (word.toLowerCase() === 'and' || word.toLowerCase() === 'n') return '&';
        if (word.toLowerCase() === 'tshirts' || word.toLowerCase() === 'tshirt') return 'T-Shirts';
        if (word.toLowerCase() === 'shirts') return 'Shirts';
        if (word.toLowerCase() === 'hoodies') return 'Hoodies';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const handleAddToBag = async () => {
    const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
    const email = user.email || null;

    await fetch(UPDATE_USER_SHOPPING_HISTORY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        "updateType": {
          "cartItems": {
            productCode,
            "color": activeSwatch?.title,
            "size": activeSize,
            "qty": qty,
            "action": "add"
          }
        }   
      }),
    });
    const existingLoginKey = JSON.parse(localStorage.getItem('velvet_login_key')) || {};
    const updatedLoginKey = {
      ...existingLoginKey,
      totalCartItems: existingLoginKey.totalCartItems + qty
    };
    localStorage.setItem('velvet_login_key', JSON.stringify(updatedLoginKey));
    window.dispatchEvent(new Event('cart-updated'));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!isAuth()) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
        const email = user.email || null;

        await fetch(UPDATE_USER_SHOPPING_HISTORY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            "updateType": {
              "recentlyViewed": productCode
            },
           }),
        });

        const response = await fetch(LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, productCode }),
        });

        const data = await response.json();

        if (!data.product) {
          console.error('Product not found');
          return;
        }

        const productData = data.product;

        setProduct(productData);
        setIsWishlist(productData.isInWishlist);

        const initialSwatch = productData.colorOptions?.find(
          swatch => swatch.productCode === productCode
        );
        setActiveSwatch(initialSwatch || productData.colorOptions?.[0]);
        setActiveSize(productData.sizeOptions?.[0]);
      } catch (err) {
        console.error('Error loading product:', err);
      }
    };

    fetchProduct();
  }, [productCode, LAMBDA_ENDPOINT, UPDATE_USER_SHOPPING_HISTORY]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (!product || !product.category || !product.subCategory) return;

        const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
        const email = user.email || null;

        const refetch = await fetch(LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            productCode,
            category: product.category,
            subCategory: product.subCategory,
          }),
        });

        const newData = await refetch.json();
        setSuggestions(newData.suggestions || []);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    fetchSuggestions();
  }, [product?.category, product?.subCategory, LAMBDA_ENDPOINT, product, productCode]);

  const handleSwatchClick = (swatch) => {
    if (!swatch?.productCode || swatch.productCode === product?.productCode) return;
    setActiveSwatch(swatch);
    navigate(`/product/${swatch.productCode}`);
  };

  const handleHeartIconClick = async () => {
    const nextWishlistState = !isWishlist;
    setIsWishlist(nextWishlistState);
  
    const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
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

  if (!product) return <LuxuryLoader />;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Home' },
              { label: formatBreadcrumbLabel(product.category), link: `/shop/${product.category}` },
              {
                label: formatBreadcrumbLabel(product.subCategory),
                link: `/shop/${product.category}/${product.subCategory}`,
              },
              { label: formatBreadcrumbLabel(product.name) },
            ]}
          />

          <div className={styles.content}>
            <div className={styles.gallery}>
              <Gallery images={product.gallery} />
            </div>

            <div className={styles.details}>
              <h1>{product.name}</h1>
              <span className={styles.vendor}>by {product.vendor}</span>

              <div className={styles.priceContainer}>
                {product.originalPrice ? (
                  <>
                    <span className={styles.discountedPrice}>
                      <CurrencyFormatter appendZero amount={product.price} />
                    </span>
                    <span className={styles.originalPrice}>
                      <CurrencyFormatter appendZero amount={product.originalPrice} />
                    </span>
                  </>
                ) : (
                  <CurrencyFormatter appendZero amount={product.price} />
                )}
              </div>

              <SwatchList
                swatchList={product.colorOptions}
                activeSwatch={activeSwatch}
                setActiveSwatch={setActiveSwatch}
                onSwatchClick={handleSwatchClick}
              />

              <div className={styles.sizeContainer}>
              <SizeList
                sizeList={product.sizeOptions}
                activeSize={activeSize}
                setActiveSize={setActiveSize}
                category={product.category}
                subCategory={product.subCategory}
              />
              </div>

              <div className={styles.quantityContainer}>
                <span>Quantity</span>
                <AdjustItem qty={qty} setQty={setQty} />
              </div>

              <div className={styles.actionContainer}>
                <div className={styles.addToButtonContainer}>
                  <Button
                    onClick={() => {
                      if (isAuth()) {
                        handleAddToBag();
                        showNotification({
                          ...product,
                          color: activeSwatch?.title,
                          size: activeSize
                        });
                      } else {
                        window.location.href = '/login';
                      }
                    }}
                    fullWidth
                    level={'primary'}
                  >
                    Add to Bag
                  </Button>
                </div>
                <div
                  className={styles.wishlistActionContainer}
                  role={'presentation'}
                  onClick={handleHeartIconClick}
                >
                  <Icon symbol={'heart'} />
                  <div
                    className={`${styles.heartFillContainer} ${isWishlist ? styles.show : styles.hide}`}
                  >
                    <Icon symbol={'heartFill'} />
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <p>{product.description}</p>
                <span>Product code: {product.productCode}</span>
              </div>

              <div className={styles.informationContainer}>
                <Accordion type="plus" customStyle={styles} title="composition & care">
                  <p className={styles.information}>{product.compositionAndCare}</p>
                </Accordion>
                <Accordion type="plus" customStyle={styles} title="delivery & returns">
                  <p className={styles.information}>{product.deliveryAndReturns}</p>
                </Accordion>
                <Accordion type="plus" customStyle={styles} title="help">
                  <p className={styles.information}>{product.help}</p>
                </Accordion>
              </div>
            </div>
          </div>

          <div className={styles.suggestionContainer}>
            <h2>You may also like</h2>
            <ProductCardGrid
              spacing
              showSlider
              height={400}
              columns={4}
              data={suggestions}
            />
          </div>
        </Container>

        <div className={styles.attributeContainer}>
          <Split
            image={'/cloth.png'}
            alt={'attribute description'}
            title={'Sustainability'}
            description={
              'We design our products to look good and to be used on a daily basis. Quality over quantity is a cornerstone of our ethos.'
            }
            ctaText={'learn more'}
            cta={() => navigate('/blog')}
            bgColor={'var(--standard-light-grey)'}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

export const config = {
  matchPath: "/product/:productCode",
};