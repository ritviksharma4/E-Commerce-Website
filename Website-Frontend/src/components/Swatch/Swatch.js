import React from 'react';
import * as styles from './Swatch.module.css';

const Swatch = (props) => {
  const { data, isActive, onClick } = props;

  return (
    <button
      className={`${styles.root} ${isActive ? styles.isActive : ''}`}
      onClick={() => onClick && onClick(data)}
      aria-label="Swatch"
    >
      <div
        style={{ backgroundColor: data.color }}
        className={styles.circle}
      ></div>
    </button>
  );
};

export default Swatch;