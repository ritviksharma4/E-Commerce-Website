import React from 'react';
import * as styles from './LuxuryLoader.module.css';

const LuxuryLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logo}>Velvet</div>
      <div className={styles.spinner}></div>
      <div className={styles.tagline}>Curated Elegance, Coming Right Up...</div>
    </div>
  );
};

export default LuxuryLoader;