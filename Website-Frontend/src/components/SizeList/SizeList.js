import React, { useState } from "react";
import BoxOption from "../BoxOption";
import SizeChart from "../SizeChart"; // ✅ Import SizeChart
import * as styles from "./SizeList.module.css";

const SizeList = (props) => {
  const { setActiveSize, activeSize, sizeList, category, subCategory } = props;

  const [showChart, setShowChart] = useState(false); // ✅ Local toggle state

  const validSizes = ["xs", "s", "m", "l", "xl"];

  return (
    <div className={styles.root}>
      <div className={styles.sizeLabelContainer}>
        <span className={styles.label}>Size</span>
        <span
          className={`${styles.label} ${styles.guide}`}
          onClick={() => setShowChart(true)} // ✅ Toggle open
          style={{ cursor: 'pointer' }}
        >
          Size Guide
        </span>
      </div>

      <div className={styles.sizeSelection}>
        {validSizes.map((sizeOption, index) => {
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
            close={() => setShowChart(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SizeList;