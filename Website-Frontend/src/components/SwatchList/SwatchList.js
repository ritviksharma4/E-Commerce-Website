import React from 'react';
import Swatch from '../Swatch';
import * as styles from './SwatchList.module.css';

const SwatchList = (props) => {
  const { swatchList, activeSwatch, setActiveSwatch, onSwatchClick } = props;

  const handleSwatchClick = (swatch) => {
    // First update the active swatch
    if (setActiveSwatch) {
      setActiveSwatch(swatch);
    }
    
    // Trigger onSwatchClick if passed, but only with the swatch (no event object needed)
    if (onSwatchClick) {
      onSwatchClick(swatch);
    }
  };

  return (
    <div className={styles.root}>
      <span className={styles.label}>
        Select Color: {activeSwatch?.title}
      </span>
      <div className={styles.swatchSelection}>
        {swatchList?.map((colorChoice, index) => (
          <Swatch
            key={index}
            data={colorChoice}
            isActive={activeSwatch?.productCode === colorChoice.productCode} // Compare by productCode for more accuracy
            onClick={() => handleSwatchClick(colorChoice)} // Trigger click with only swatch data
          />
        ))}
      </div>
    </div>
  );
};

export default SwatchList;