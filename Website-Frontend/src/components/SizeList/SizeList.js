import React from "react";
import BoxOption from "../BoxOption";
import * as styles from "./SizeList.module.css";

const SizeList = (props) => {
  const { setActiveSize, activeSize, sizeList } = props;

  // Pre-defined list of valid sizes
  const validSizes = ["xs", "s", "m", "l", "xl"];

  return (
    <div className={styles.root}>
      <div className={styles.sizeLabelContainer}>
        <span className={styles.label}>Size</span>
        <span className={`${styles.label} ${styles.guide}`}>Size Guide</span>
      </div>
      <div className={styles.sizeSelection}>
        {validSizes.map((sizeOption, index) => {
          // Check if the size is available
          const isAvailable = sizeList.includes(sizeOption);

          return (
            <BoxOption
              key={index}
              data={sizeOption}
              setActive={isAvailable ? setActiveSize : null}  // Disable if not available
              isActive={activeSize === sizeOption}
              isAvailable={isAvailable}  // Pass availability status
            />
          );
        })}
      </div>
    </div>
  );
};

export default SizeList;