import React from 'react';
import * as styles from './LuxuryLoader.module.css';

const LuxuryLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logo}>Velvèt</div>

      <div className={styles.content}>
        <div className={styles.cube}></div>
      </div>

      <div className={styles.tagline}>Curated Elegance, Coming Right Up...</div>
    </div>
  );
};

export default LuxuryLoader;
