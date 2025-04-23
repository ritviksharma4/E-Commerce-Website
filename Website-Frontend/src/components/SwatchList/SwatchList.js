import React from 'react';

import Swatch from '../Swatch';
import * as styles from './SwatchList.module.css';

const SwatchList = (props) => {
  const { swatchList, activeSwatch, setActiveSwatch, onSwatchClick } = props;

  const handleSwatchClick = (swatch) => {
    if (setActiveSwatch) {
      setActiveSwatch(swatch);
    }
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
            isActive={activeSwatch === colorChoice}
            onClick={() => handleSwatchClick(colorChoice)}
          />
        ))}
      </div>
    </div>
  );
};

export default SwatchList;