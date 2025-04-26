import React from "react";
import * as styles from "./BoxOption.module.css";

const BoxOption = (props) => {
  const { data, setActive, isActive, isAvailable } = props;

  return (
    <div
      className={`${styles.root} ${isActive === true ? styles.isActive : ''} ${!isAvailable ? styles.isUnavailable : ''}`}
      onClick={() => isAvailable && setActive(data)}
      role={'presentation'}
    >
      <span className={styles.option}>{data}</span>
    </div>
  );
};

export default BoxOption;