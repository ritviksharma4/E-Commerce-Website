import React, { useEffect, useState } from 'react';
import Container from '../Container';
import Checkbox from '../Checkbox';
import * as styles from './CardController.module.css';
import Button from '../Button';
import Drawer from '../Drawer';
import Icon from '../Icons/Icon';

const CardController = (props) => {
  const { filters, visible, closeFilter, categoryKey, subcategoryKey, onFilterChange } = props;
  const [category, setCategory] = useState();
  const [filterState, setFilterState] = useState([]);

  // Utility to safely access localStorage only on client side
  const isBrowser = typeof window !== 'undefined';

  const syncFiltersFromLocalStorage = () => {
    if (!isBrowser) return;

    const storageKey = 'velvet_login_key.filters' + '.' + categoryKey + '.' + subcategoryKey;
    let savedFilters = {};
    try {
      savedFilters = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      savedFilters = {};
    }
  
    const syncedFilters = filters.map((filterCategory) => {
      const categoryName = filterCategory.category.toLowerCase(); // "color" or "size"
      const selectedNames = savedFilters[categoryName + 's'] || []; // e.g., savedFilters.colors
  
      return {
        ...filterCategory,
        items: filterCategory.items.map((item) => ({
          ...item,
          value: selectedNames.includes(item.name)
        }))
      };
    });
  
    setFilterState(syncedFilters);
  };

  useEffect(() => {
    if (visible || props.filtersVersion) {
      syncFiltersFromLocalStorage();
    }
  }, [visible, props.filtersVersion]);

  const updateLocalStorage = (updatedFilters) => {
    if (!isBrowser) return;

    let userObj = {};
    try {
      userObj = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
    } catch {
      userObj = {};
    }
    if (!userObj.filters) userObj.filters = {};
    if (!userObj.filters[categoryKey]) userObj.filters[categoryKey] = {};
    userObj.filters[categoryKey][subcategoryKey] = updatedFilters;
    localStorage.setItem('velvet_login_key', JSON.stringify(userObj));
  };

  const updateFilterValue = (categoryIndex, itemIndex, checked) => {
    const newFilters = [...filterState];
    newFilters[categoryIndex].items[itemIndex].value = checked;
    setFilterState(newFilters);
    updateLocalStorage(newFilters);
  };

  const resetFilters = () => {
    const refreshed = filterState.map((filter) => ({
      ...filter,
      items: filter.items.map(item => ({
        ...item,
        value: false
      }))
    }));
    setFilterState(refreshed);

    if (!isBrowser) return;

    let userObj = {};
    try {
      userObj = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
    } catch {
      userObj = {};
    }
    if (!userObj.filters) userObj.filters = {};
    if (!userObj.filters[categoryKey]) userObj.filters[categoryKey] = {};
    userObj.filters[categoryKey][subcategoryKey] = refreshed;
    localStorage.setItem('velvet_login_key', JSON.stringify(userObj));

    const filtersObj = {
      colors: [],
      sizes: [],
      genders: []
    };
    if (typeof onFilterChange === 'function') {
      onFilterChange(filtersObj);
    }
  };

  const saveAndTrigger = () => {
    updateLocalStorage(filterState);

    const filtersObj = {};

    filterState.forEach((filterCategory) => {
      const key = filterCategory.category.toLowerCase() + 's';
      filtersObj[key] = filterCategory.items
        .filter((item) => item.value)
        .map((item) => item.name);
    });

    if (typeof onFilterChange === 'function') {
      onFilterChange(filtersObj);
    }
  };

  const filterTick = (e, categoryIndex, itemIndex) => {
    updateFilterValue(categoryIndex, itemIndex, e.target.checked);
  };

  return (
    <div>
      {/* Web View */}
      <div className={`${styles.webRoot} ${visible ? styles.show : styles.hide}`}>
        <div
          className={styles.clearFilterContainer}
          role="presentation"
          onClick={resetFilters}
        >
          <span className={styles.clearFilter}>clear filters</span>
        </div>
        <Container>
          <div className={styles.filterContainer} style={{ gridTemplateColumns: `repeat(${filterState.length}, 1fr)` }}>
            {filterState.map((filter, categoryIndex) => {
              const isColorCategory = filter.category.toLowerCase() === 'color' || filter.category.toLowerCase() === 'colors';
              const colNum = isColorCategory ? 4 : filter.items.length >= 4 ? 2 : 1;

              return (
                <div key={`category-${categoryIndex}`}>
                  <span className={styles.category}>{filter.category}</span>
                  <div
                    className={styles.nameContainers}
                    style={{ gridTemplateColumns: `repeat(${colNum}, 1fr)` }}
                  >
                    {filter.items.map((item, itemIndex) => (
                      <Checkbox
                        key={itemIndex}
                        action={(e) => filterTick(e, categoryIndex, itemIndex)}
                        label={item.name}
                        value={item.value}
                        id={item.name}
                        name={item.name}
                        isChecked={item.value}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>

        <div className={styles.actionContainer}>
          <Button
            onClick={() => {
              saveAndTrigger();
              closeFilter();
              window.scrollTo(0, 0);
            }}
            className={styles.customButtonStyling}
            level="primary"
          >
            view items
          </Button>
          <Button
            onClick={closeFilter}
            className={styles.customButtonStyling}
            level="secondary"
          >
            close
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className={styles.mobileRoot}>
        <Drawer visible={visible} close={closeFilter}>
          <div className={styles.mobileFilterContainer}>
            <h2 className={styles.mobileFilterTitle}>Filters</h2>

            {category === undefined ? (
              <div className={styles.mobileFilters}>
                {filterState.map((filterItem, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className={styles.filterItemContainer}
                    role="presentation"
                    onClick={() => setCategory({ ...filterItem, categoryIndex })}
                  >
                    <span className={styles.filterName}>{filterItem.category}</span>
                    <Icon symbol="arrow" />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.mobileCategoryContainer}>
                <div
                  className={styles.mobileHeader}
                  role="presentation"
                  onClick={() => setCategory(undefined)}
                >
                  <Icon symbol="arrow" />
                  <span className={styles.mobileCategory}>{category.category}</span>
                </div>
                
                {filterState[category.categoryIndex]?.items?.map((item, itemIndex) => (
                  <Checkbox
                    key={itemIndex}
                    action={(e) => filterTick(e, category.categoryIndex, itemIndex)}
                    label={item.name}
                    value={item.value}
                    id={item.name}
                    name={item.name}
                    isChecked={item.value}
                  />
                ))}
              </div>
            )}

            <div className={styles.mobileButtonContainer}>
              {category === undefined ? (
                <Button
                  fullWidth
                  level="primary"
                  onClick={() => {
                    saveAndTrigger();
                    closeFilter();
                  }}
                >
                  show results
                </Button>
              ) : (
                <div>
                  <Button
                    onClick={() => {
                      saveAndTrigger();
                      closeFilter();
                    }}
                    fullWidth
                    level="primary"
                  >
                    Apply
                  </Button>
                  <div
                    className={styles.clearFilterContainer}
                    role="presentation"
                    onClick={resetFilters}
                  >
                    <span className={styles.clearFilter}>clear filters</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default CardController;