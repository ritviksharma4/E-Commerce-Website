import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as styles from './sweaters-and-cardigans.module.css';

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
import ColorMappings from '../../../../static/color_mappings.json';
import { isAuth } from '../../../helpers/general';
import { navigate } from 'gatsby';
import LuxuryLoader from '../../../components/Loading/LuxuriousLoader';

const ITEMS_PER_PAGE = 6;

const SweatersCardigansWomenPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedFilters, setSavedFilters] = useState(() => {
    const storageKey = "velvet_login_key.filters.women.sweatersAndCardigans";
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  });
  const [filtering, setFiltering] = useState(false);
  const [filterVersion, setFilterVersion] = useState(0);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const sortRef = useRef(null);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_PRODUCT_DETAILS_FOR_USER;

  const restoreScroll = () => {
    const scrollY = sessionStorage.getItem('sweatersCardigans_scrollY');
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY));
    }
  };

  const fetchProducts = useCallback(async () => {

    const savedIndex = parseInt(sessionStorage.getItem('sweatersCardigans_loadedItemCount')) || ITEMS_PER_PAGE;

    try {
      const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
      const email = user.email || null;

      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          category: 'women',
          subCategory: 'sweaters-and-cardigans',
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

      setAllProducts(items);
      setTotalCount(items.length);
      setAllFilteredProducts(items);

      const loadedItems = items.slice(0, savedIndex);
      setVisibleProducts(loadedItems);
      setTimeout(restoreScroll, 0);
    } catch (error) {
      console.error('Error fetching sweaters & cardigans products from Lambda:', error);
    } finally {
      setLoading(false);
    }
  }, [LAMBDA_ENDPOINT]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    };

    if (showSortOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortOptions]);

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
    const updated = allFilteredProducts.slice(0, newCount);
    setVisibleProducts(updated);
    sessionStorage.setItem('sweatersCardigans_loadedItemCount', newCount);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortOptions(false);
    setFiltering(true);
  
    setTimeout(() => {
      let sorted = [...allFilteredProducts];
  
      if (option === 'lowToHigh') {
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (option === 'highToLow') {
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      }
  
      setAllFilteredProducts(sorted);
      setVisibleProducts(sorted.slice(0, ITEMS_PER_PAGE));
      setTotalCount(sorted.length);
      setFiltering(false);
    }, 300);
  };

  useEffect(() => {
    const storeScroll = () => {
      sessionStorage.setItem('sweatersCardigans_scrollY', window.scrollY.toString());
    };
    window.addEventListener('scroll', storeScroll);
    return () => window.removeEventListener('scroll', storeScroll);
  }, []);

  const applyFilters = useCallback(() => {
    setFiltering(true);
  
    setTimeout(() => {
      let activeColors = savedFilters?.colors || [];
      let activeSizes = savedFilters?.sizes || [];
  
      const filtered = allProducts.filter((product) => {
        const selectedColorTitle = product.colorOptions.find(opt => opt.productCode === product.productCode)?.title;
  
        const matchesColor = (() => {
          if (activeColors.length === 0) return true;
  
          return activeColors.some((selectedColor) => {
            const mappedTitles = ColorMappings[selectedColor] || [];
            return mappedTitles.includes(selectedColorTitle);
          });
        })();
  
        const matchesSize = (() => {
          if (activeSizes.length === 0) return true;
  
          return product.sizeOptions.some((size) =>
            activeSizes.some(
              (selectedSize) => selectedSize.toLowerCase() === size.toLowerCase()
            )
          );
        })();
  
        return matchesColor && matchesSize;
      });
  
      setAllFilteredProducts(filtered);
      setVisibleProducts(filtered.slice(0, ITEMS_PER_PAGE));
      setTotalCount(filtered.length);
      setFiltering(false);
    }, 500);
  }, [allProducts, savedFilters]);

  useEffect(() => {
      applyFilters();
    }, [allProducts, applyFilters, filterVersion]);
  
  const handleFilterChange = (newFilters) => {
    if (!newFilters || typeof newFilters !== 'object') {
      console.error("Invalid filters provided:", newFilters);
      return;
    }
  
    const storageKey = "velvet_login_key.filters.women.sweatersAndCardigans";
    localStorage.setItem(storageKey, JSON.stringify(newFilters));
    setSavedFilters(newFilters);
    setFilterVersion((prev) => prev + 1);
  };

  const handleRemoveFilter = (filterCategory, filterName) => {  
    const storageKeySimple = "velvet_login_key.filters.women.sweatersAndCardigans";
    let updatedFilters = { ...savedFilters };
  
    const categoryMap = {
      color: "colors",
      size: "sizes"
    };
  
    const savedKey = categoryMap[filterCategory];
  
    if (savedKey && updatedFilters[savedKey]) {
      updatedFilters[savedKey] = updatedFilters[savedKey].filter(
        item => item.toLowerCase() !== filterName.toLowerCase()
      );
    }
  
    localStorage.setItem(storageKeySimple, JSON.stringify(updatedFilters));
  
    setSavedFilters(updatedFilters);
    setFilterVersion(prev => prev + 1);
  
    const userObj = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
    const detailedFilters = userObj.filters?.women?.sweatersAndCardigans || [];
  
    detailedFilters.forEach((filterCategoryObj) => {
      if (filterCategoryObj.category.toLowerCase().includes(filterCategory.toLowerCase())) {
        filterCategoryObj.items.forEach((item) => {
          if (item.name.toLowerCase() === filterName.toLowerCase()) {
            item.value = false; 
          }
        });
      }
    });
  
    if (!userObj.filters) userObj.filters = {};
    if (!userObj.filters.women) userObj.filters.women = {};
    userObj.filters.women.sweatersAndCardigans = detailedFilters;
  
    localStorage.setItem('velvet_login_key', JSON.stringify(userObj));
  };

  return (
    <Layout>
      <div className={styles.root}>
        {loading || filtering ? (
          <LuxuryLoader />
        ) : (
          <>
            <Container size={'large'} spacing={'min'}>
              <div className={styles.breadcrumbContainer}>
                <Breadcrumbs
                  crumbs={[
                    { link: '/', label: 'Home' },
                    { link: '/shop/women', label: 'Women' },
                    { label: 'Sweaters & Cardigans' },
                  ]}
                />
              </div>
            </Container>
            <Banner
              maxWidth={'650px'}
              name={`Women's Sweaters & Cardigans`}
              subtitle={
                'Wrap yourself in warmth and elegance with cozy knits, chic crops, and timeless pullovers—where every sweater and cardigan is a perfect blend of comfort, texture, and modern sophistication.'
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
                  <div ref={sortRef}>
                    <div
                      className={`${styles.iconContainer} ${styles.sortContainer}`}
                      role="presentation"
                      onClick={() => setShowSortOptions(!showSortOptions)}
                    >
                      <span>Sort by</span>
                      <Icon
                        symbol={'caret'}
                        className={showSortOptions ? styles.rotateCaret : ''}
                      />
                    </div>
                    <div
                      className={`${styles.sortOptions} ${showSortOptions ? styles.show : ''}`}
                    >
                      <div
                        className={styles.sortOption}
                        role="presentation"
                        onClick={() => handleSortChange('lowToHigh')}
                      >
                        Price: Low → High
                      </div>
                      <div
                        className={styles.sortOption}
                        role="presentation"
                        onClick={() => handleSortChange('highToLow')}
                      >
                        Price: High → Low
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Displaying the chips for active filters */}
              <div className={styles.chipsContainer}>
                {['colors', 'sizes', 'genders'].map((categoryKey) => 
                  (savedFilters[categoryKey] || []).map((filterName) => (
                    <Chip
                      key={`${categoryKey}-${filterName}`}
                      name={filterName}
                      onClick={() => handleRemoveFilter(
                        categoryKey === 'colors' ? 'color' : categoryKey === 'sizes' ? 'size' : 'gender',
                        filterName
                      )}
                      close={() => handleRemoveFilter(
                        categoryKey === 'colors' ? 'color' : categoryKey === 'sizes' ? 'size' : 'gender',
                        filterName
                      )}
                    />
                  ))
                )}
              </div>

              <CardController
                closeFilter={() => setShowFilter(false)}
                visible={showFilter}
                filters={Config.filters}
                onFilterChange={handleFilterChange}
                activeFilters={savedFilters} 
                filterVersion={filterVersion} 
                categoryKey="women"
                subcategoryKey="sweatersAndCardigans"
              />
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

export default SweatersCardigansWomenPage;