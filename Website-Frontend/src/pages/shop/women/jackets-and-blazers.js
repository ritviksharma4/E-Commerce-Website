import React, { useState, useEffect, useCallback } from 'react';
import * as styles from './jackets-and-blazers.module.css';

import Banner from '../../../components/Banner';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CardController from '../../../components/CardController';
import Container from '../../../components/Container';
import Chip from '../../../components/Chip';
import Icon from '../../../components/Icons/Icon';
import Layout from '../../../components/Layout';
import ProductCardGrid from '../../../components/ProductCardGrid';
import Button from '../../../components/Button';
import Config from '../../../config.json';
import { isAuth } from '../../../helpers/general';
import { navigate } from 'gatsby';
import LuxuryLoader from '../../../components/Loading/LuxuriousLoader';

const ITEMS_PER_PAGE = 6;

const JacketsBlazersWomenPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_PRODUCT_DETAILS_FOR_USER;
  const [loading, setLoading] = useState(true);

  const restoreScroll = () => {
    const scrollY = sessionStorage.getItem('jacketsBlazers_scrollY');
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY));
    }
  };

  const fetchProducts = useCallback(async () => {
    const savedProducts = sessionStorage.getItem('jacketsBlazers_products');
    const savedTotalCount = sessionStorage.getItem('jacketsBlazers_totalCount');
    const savedIndex = parseInt(sessionStorage.getItem('jacketsBlazers_loadedItemCount')) || ITEMS_PER_PAGE;

    if (savedProducts && savedTotalCount) {
      const parsed = JSON.parse(savedProducts);
      setAllProducts(parsed);
      setTotalCount(parseInt(savedTotalCount));
      setVisibleProducts(parsed.slice(0, savedIndex));
      setTimeout(restoreScroll, 0);
      setLoading(false);  // End loading
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
      const email = user.email || null;

      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          category: 'women',
          subCategory: 'jackets-and-blazers',  // Added subCategory parameter
        }),
      });

      const text = await response.text();
      let lambdaResponse;
      let items = [];

      try {
        lambdaResponse = JSON.parse(text);
      } catch (err) {
        console.error("Error parsing Lambda response text:", err);
        lambdaResponse = {};
      }

      if (Array.isArray(lambdaResponse)) {
        items = lambdaResponse;
      } else if (typeof lambdaResponse.body === 'string') {
        try {
          const parsedBody = JSON.parse(lambdaResponse.body);
          items = parsedBody.products || [];
        } catch (err) {
          console.error("Error parsing Lambda body:", err);
        }
      } else if (lambdaResponse.products) {
        items = lambdaResponse.products;
      }

      // Set products and also cache to sessionStorage
      setAllProducts(items);
      setTotalCount(items.length);
      sessionStorage.setItem('jacketsBlazers_products', JSON.stringify(items));
      sessionStorage.setItem('jacketsBlazers_totalCount', items.length.toString());

      const loadedItems = items.slice(0, savedIndex);
      setVisibleProducts(loadedItems);
      setTimeout(restoreScroll, 0);
    } catch (error) {
      console.error('Error fetching women’s jackets & blazers from Lambda:', error);
    } finally {
      setLoading(false);  // End loading after fetch
    }
  }, [LAMBDA_ENDPOINT]);

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
      return;
    }
    window.addEventListener('keydown', escapeHandler);
    fetchProducts();
    return () => window.removeEventListener('keydown', escapeHandler);
  }, [fetchProducts]);

  const escapeHandler = (e) => {
    if (e?.keyCode === 27) setShowFilter(false);
  };

  const handleLoadMore = () => {
    const newCount = visibleProducts.length + ITEMS_PER_PAGE;
    const updated = allProducts.slice(0, newCount);
    setVisibleProducts(updated);
    sessionStorage.setItem('jacketsBlazers_loadedItemCount', newCount);
  };

  useEffect(() => {
    const storeScroll = () => {
      sessionStorage.setItem('jacketsBlazers_scrollY', window.scrollY.toString());
    };
    window.addEventListener('scroll', storeScroll);
    return () => window.removeEventListener('scroll', storeScroll);
  }, []);

  return (
    <Layout>
      <div className={styles.root}>
        {loading ? (
          <LuxuryLoader />  /* Show luxury loader while waiting */
        ) : (
          <>
            <Container size={'large'} spacing={'min'}>
              <div className={styles.breadcrumbContainer}>
                <Breadcrumbs
                  crumbs={[
                    { link: '/', label: 'Home' },
                    { link: '/shop/women', label: 'Women' },
                    { label: 'Jackets & Blazers' },
                  ]}
                />
              </div>
            </Container>
            <Banner
              maxWidth={'650px'}
              name={`Women's Jackets & Blazers`}
              subtitle={
                'Look to our women’s Jackets & Blazers for modern takes on one-and-done dressing. From midis in bold prints to dramatic floor-sweeping styles and easy all-in-ones, our edit covers every mood.'
              }
            />
            <Container size={'large'} spacing={'min'}>
              <div className={styles.metaContainer}>
                <span className={styles.itemCount}>
                  {visibleProducts.length}/{totalCount} items
                </span>
                <div className={styles.controllerContainer}>
                  <div
                    className={styles.iconContainer}
                    role={'presentation'}
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <Icon symbol={'filter'} />
                    <span>Filters</span>
                  </div>
                  <div className={`${styles.iconContainer} ${styles.sortContainer}`}>
                    <span>Sort by</span>
                    <Icon symbol={'caret'} />
                  </div>
                </div>
              </div>
              <CardController
                closeFilter={() => setShowFilter(false)}
                visible={showFilter}
                filters={Config.filters}
              />
              <div className={styles.chipsContainer}>
                <Chip name={'XS'} />
                <Chip name={'S'} />
              </div>
              <div className={styles.productContainer}>
                <span className={styles.mobileItemCount}>
                  {visibleProducts.length}/{totalCount} items
                </span>
                <ProductCardGrid data={visibleProducts} />
              </div>
              {visibleProducts.length < totalCount && (
                <div className={styles.loadMoreContainer}>
                  <span>{visibleProducts.length}/{totalCount} shown</span>
                  <Button fullWidth level={'secondary'} onClick={handleLoadMore}>
                    LOAD MORE
                  </Button>
                </div>
              )}
            </Container>
          </>
        )}
      </div>
    </Layout>
  );
};

export default JacketsBlazersWomenPage;