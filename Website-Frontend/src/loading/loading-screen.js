import React from 'react';
import * as styles from './loading-screen.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <div className={styles.loaderText}>Loading...</div>
    </div>
  );
};

export default LoadingScreen;