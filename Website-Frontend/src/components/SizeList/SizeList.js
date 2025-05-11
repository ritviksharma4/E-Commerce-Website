import React, { useState } from "react";
import BoxOption from "../BoxOption";
import SizeChart from "../SizeChart";
import * as styles from "./SizeList.module.css";

const SizeList = (props) => {
  const { setActiveSize, activeSize, sizeList, category, subCategory, productCode } = props;

  const [showChart, setShowChart] = useState(false);

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

  return (
    <div className={styles.root}>
      <div className={styles.sizeLabelContainer}>
        <span className={styles.label}>Size</span>
        <span
          className={`${styles.label} ${styles.guide}`}
          onClick={() => setShowChart(true)}
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
            close={() => setShowChart(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SizeList;