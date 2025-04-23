import React from 'react';
import Icon from '../Icons/Icon';
import * as styles from './AdjustItem.module.css';

const AdjustItem = (props) => {
  const { isTransparent, qty, setQty } = props;

  const handleOnChange = (e) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num > 0) {
      setQty(num);
    }
  };

  return (
    <div
      className={`${styles.root} ${isTransparent === true ? styles.transparent : ''}`}
    >
      <div
        className={styles.iconContainer}
        role={'presentation'}
        onClick={() => {
          if (qty <= 1) return;
          setQty(qty - 1);
        }}
      >
        <Icon symbol={'minus'} />
      </div>
      <div className={styles.inputContainer}>
        <input
          className={`${isTransparent === true ? styles.transparentInput : ''}`}
          onChange={handleOnChange}
          type="number"
          value={qty}
        />
      </div>
      <div
        role={'presentation'}
        onClick={() => setQty(qty + 1)}
        className={styles.iconContainer}
      >
        <Icon symbol={'plus'} />
      </div>
    </div>
  );
};

export default AdjustItem;