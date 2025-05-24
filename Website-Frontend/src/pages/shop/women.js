import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import * as styles from './women.module.css';

import Banner from '../../components/Banner';
import Breadcrumbs from '../../components/Breadcrumbs';
import CardController from '../../components/CardController';
import Container from '../../components/Container';
import Chip from '../../components/Chip';
import Icon from '../../components/Icons/Icon';
import Layout from '../../components/Layout';
import ProductCardGrid from '../../components/ProductCardGrid';
import Button from '../../components/Button';
import Config from '../../config.json';
import ColorMappings from '../../../static/color_mappings.json';
import { isAuth } from '../../helpers/general';
import { navigate } from 'gatsby';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';

const ITEMS_PER_PAGE = 6;

const AllClothingsWomenPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [ready, setReady] = useState(false);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedFilters, setSavedFilters] = useState({});
  const [filtering, setFiltering] = useState(false);
  const [filterVersion, setFilterVersion] = useState(0);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const sortRef = useRef(null);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_PRODUCT_DETAILS_FOR_USER;
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);

  // On mount, read localStorage and sessionStorage safely
  useEffect(() => {
    setIsClient(true); // ensures client-side rendering
    if (typeof window !== 'undefined') {
      const storageKey = "velvet_login_key.filters.women.allClothings";
      try {
        const storedFilters = JSON.parse(localStorage.getItem(storageKey)) || {};
        setSavedFilters(storedFilters);
      } catch {
        setSavedFilters({});
      }

      const savedSortOption = sessionStorage.getItem(`${window.location.pathname}_sortOption`) || '';
      setSortOption(savedSortOption);
    }
  }, []);

  const getLoadedItemCount = () => {
    return parseInt(sessionStorage.getItem('all_women_loadedItemCount')) || ITEMS_PER_PAGE;
  };

  const fetchProducts = useCallback(async () => {
    const savedIndex = getLoadedItemCount();

    try {
      const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
      const email = user.email || null;

      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, category: 'women' }),
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
      setAllFilteredProducts([]); // Start empty
      setVisibleProducts([]);     // Start empty
      setReady(true);             // Mark ready, but products show after filters
      setFilterVersion(prev => prev + 1); 
    } catch (error) {
      console.error('Error fetching women’s products from Lambda:', error);
    } finally {
      setLoading(false);
    }
  }, [LAMBDA_ENDPOINT]);

  useEffect(() => {
    if (loadMoreClicked) {
      setLoadMoreClicked(false); // ✅ Reset after skipping restore once
    }
  }, [loadMoreClicked]);

  // ✅ Restore scroll position per page
  useLayoutEffect(() => {
    if (ready && visibleProducts.length > 0 && !loadMoreClicked) {
      const storageKey = `${window.location.pathname}_scrollY`;
      const savedScrollY = sessionStorage.getItem(storageKey);
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [ready, visibleProducts.length]);

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
    return () => {
      window.removeEventListener('keydown', escapeHandler);
    };
  }, [fetchProducts]);

  const escapeHandler = (e) => {
    if (e?.keyCode === 27) setShowFilter(false);
  };

  const handleLoadMore = () => {
    setLoadMoreClicked(true);
    const newCount = visibleProducts.length + ITEMS_PER_PAGE;
    const updated = allFilteredProducts.slice(0, newCount);
    setVisibleProducts(updated);
    sessionStorage.setItem('all_women_loadedItemCount', newCount);
  };

  const handleSortChange = (option) => {
    setLoadMoreClicked(true);
    sessionStorage.setItem(`${window.location.pathname}_scrollY`, "0");
    window.scrollTo(0, 0);
    setSortOption(option);
    setShowSortOptions(false);
    sessionStorage.setItem(`${window.location.pathname}_sortOption`, option); // Store sort option in sessionStorage

    setFiltering(true);

    setTimeout(() => {
      let sorted = [...allFilteredProducts];

      if (option === 'lowToHigh') {
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (option === 'highToLow') {
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (option === 'reset') {
        applyFilters();
        setFiltering(false);
        return; 
      }

      const loadedCount = getLoadedItemCount();
      setAllFilteredProducts(sorted);
      setVisibleProducts(sorted.slice(0, loadedCount));
      setTotalCount(sorted.length);
      setFiltering(false);
      setReady(true);
    }, 300);
  };

  const applySort = useCallback((productsToSort) => {
    let sorted = [...productsToSort];
    const option = sessionStorage.getItem(`${window.location.pathname}_sortOption`) || '';

    if (option === 'lowToHigh') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (option === 'highToLow') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      return productsToSort; // No sort applied
    }

    return sorted;
  }, []);

  const applyFilters = useCallback(() => {
    setFiltering(true);
    setTimeout(() => {
      let activeColors = savedFilters?.colors || [];
      let activeSizes = savedFilters?.sizes || [];
      let activeGenders = savedFilters?.genders || [];

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

        const matchesGender = (() => {
          if (activeGenders.length === 0) return true;

          let productGender = (product.gender || product.category || '').toLowerCase();

          return activeGenders.some(
            (selectedGender) => selectedGender.toLowerCase() === productGender
          );
        })();

        return matchesColor && matchesSize && matchesGender;
      });

      const savedIndex = getLoadedItemCount();
      const sortedFiltered = applySort(filtered);
      setAllFilteredProducts(sortedFiltered);
      setVisibleProducts(sortedFiltered.slice(0, savedIndex));
      setTotalCount(sortedFiltered.length);
      setFiltering(false);
    }, 500);
  }, [allProducts, savedFilters]);

  useEffect(() => {
    const savedSort = sessionStorage.getItem(`${window.location.pathname}_sortOption`) || '';
    setSortOption(savedSort);
    applyFilters();
  }, [allProducts, applyFilters, filterVersion]);

  const handleFilterChange = (newFilters) => {
    setLoadMoreClicked(true);
    sessionStorage.setItem(`${window.location.pathname}_scrollY`, "0");
    if (!newFilters || typeof newFilters !== 'object') {
      console.error("Invalid filters provided:", newFilters);
      return;
    }

    const storageKey = "velvet_login_key.filters.women.allClothings";
    localStorage.setItem(storageKey, JSON.stringify(newFilters));
    setSavedFilters(newFilters);
    setFilterVersion((prev) => prev + 1);
  };

  const handleRemoveFilter = (filterCategory, filterName) => {  
    const storageKeySimple = "velvet_login_key.filters.women.allClothings";
    let updatedFilters = { ...savedFilters };

    const categoryMap = {
      color: "colors",
      size: "sizes",
      gender: "genders"
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
    const detailedFilters = userObj.filters?.women?.allClothings || [];

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
    userObj.filters.women.allClothings = detailedFilters;

    localStorage.setItem('velvet_login_key', JSON.stringify(userObj));
  };

  return (
    <Layout>
      <div className={styles.root}>
        {!ready || !isClient ? (
          <LuxuryLoader />
        ) : (
          <>
            <Container size={'large'} spacing={'min'}>
              <div className={styles.breadcrumbContainer}>
                <Breadcrumbs
                  crumbs={[{ link: '/', label: 'Home' }, { link: '/shop/women', label: 'Women' }, { label: 'All Clothings' }]}
                />
              </div>
            </Container>
            <Banner
              maxWidth={'650px'}
              name={`Women's Clothings`}
              subtitle={
                "Elevate your wardrobe with our curated collection of women’s clothing—featuring stylish dresses, cozy sweaters, chic cardigans, sleek blazers, and standout jackets designed to blend comfort with sophistication."
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
                      <div
                        className={styles.sortOption}
                        role="presentation"
                        onClick={() => handleSortChange('reset')}
                      >
                        Reset
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                subcategoryKey="allClothings"
              />
              <div className={styles.productContainer}>
                <span className={styles.mobileItemCount}>
                  {visibleProducts.length}/{totalCount} items
                </span>
                <ProductCardGrid data={visibleProducts} scrollKey={`${window.location.pathname}_scrollY`}/>
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

export default AllClothingsWomenPage;