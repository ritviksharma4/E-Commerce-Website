import React, { useState, useRef } from "react";
import BoxOption from "../BoxOption";
import SizeChart from "../SizeChart";
import * as styles from "./SizeList.module.css";

const SizeList = (props) => {
  const { setActiveSize, activeSize, sizeList, category, subCategory, productCode } = props;

  const [showChart, setShowChart] = useState(false);
  const currentScrollPosRef = useRef(0); // Ref to store the current scroll position

  const standardSizes = ["xxs", "xs", "s", "m", "l", "xl", "xxl"];
  const hasOneSize = sizeList.includes("onesize");
  const hasStandardSizes = sizeList.some(size => standardSizes.includes(size));

  // Decide which sizes to show
  let sizesToRender = [];
  if (hasOneSize && !hasStandardSizes) {
    sizesToRender = ["onesize"];
  } else {
    sizesToRender = standardSizes;
  }

  const handleSizeGuideClick = () => {
    // Store the current scroll position before opening the size chart
    currentScrollPosRef.current = window.scrollY;
    setShowChart(true);
  };

  const handleCloseSizeChart = () => {
    // Restore the scroll position when closing the size chart
    window.scrollTo(0, currentScrollPosRef.current);
    setShowChart(false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.sizeLabelContainer}>
        <span className={styles.label}>Size</span>
        <span
          className={`${styles.label} ${styles.guide}`}
          onClick={handleSizeGuideClick}
          style={{ cursor: 'pointer' }}
        >
          Size Guide
        </span>
      </div>

      <div className={styles.sizeSelection}>
        {sizesToRender.map((sizeOption, index) => {
          const isAvailable = sizeList.includes(sizeOption);
          return (
            <BoxOption
              key={index}
              data={sizeOption}
              setActive={isAvailable ? setActiveSize : null}
              isActive={activeSize === sizeOption}
              isAvailable={isAvailable}
            />
          );
        })}
      </div>

      {showChart && (
        <div className={styles.chartModal}>
          <SizeChart
            category={category}
            subCategory={subCategory}
            productCode={productCode}
            close={handleCloseSizeChart}
            type={props.type} // Close function that restores scroll
          />
        </div>
      )}
    </div>
  );
};

export default SizeList;