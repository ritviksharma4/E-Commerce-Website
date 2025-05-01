import React, { useState, useEffect } from 'react';
import Container from '../Container';
import Checkbox from '../Checkbox';
import * as styles from './CardController.module.css';
import Button from '../Button';
import Drawer from '../Drawer';
import Icon from '../Icons/Icon';
import { useFilterState } from './useFilterState';

const CardController = (props) => {
  const { filters, visible, closeFilter } = props;
  const [category, setCategory] = useState();
  const { filterState, updateFilterValue, resetFilters, saveAndTrigger, syncFromLocalStorage } = useFilterState({
    categoryKey: 'men',
    subcategoryKey: 'allClothings',
    defaultFilters: filters
  });

  // Trigger filter state sync every time the filter panel is opened
  useEffect(() => {
    if (visible) {
      syncFromLocalStorage(); // Always sync from localStorage when filter panel is opened
    }
  }, [visible, syncFromLocalStorage]);

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
              saveAndTrigger(props.onFilterChange);
              closeFilter();
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
                    onClick={() =>
                      setCategory({ ...filterItem, categoryIndex })
                    }
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
                {category.items.map((item, itemIndex) => (
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
                    saveAndTrigger(props.onFilterChange);
                    closeFilter();
                  }}
                >
                  show results
                </Button>
              ) : (
                <div>
                  <Button
                    onClick={() => {
                      saveAndTrigger(props.onFilterChange);
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