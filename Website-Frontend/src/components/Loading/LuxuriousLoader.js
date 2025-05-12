import React, { useEffect } from 'react';
import * as styles from './LuxuryLoader.module.css';

const LuxuryLoader = (props) => {
  useEffect(() => {
    if (props.type !== "quickview") {
      window.scrollTo(0, 0); // Always scroll to top when loader shows
    }
  }, []);
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logo}>Loading...</div>

      <div className={styles.content}>
        <div className={styles.cube}></div>
      </div>

      <div className={styles.tagline}>Curated Elegance, Coming Right Up...</div>
    </div>
  );
};

export default LuxuryLoader;
