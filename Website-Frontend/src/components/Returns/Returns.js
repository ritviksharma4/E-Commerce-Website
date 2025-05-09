import React from 'react';
import * as styles from './Returns.module.css';

const Returns = () => {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h3>1. Easy Returns</h3>
        <p>
          We want you to love every piece from Velvét. If you are not completely satisfied with your purchase, you may return your item within 30 days of receiving it.
        </p>
        <p>
          Please ensure that items are returned in their original condition, unworn, and with all tags attached.
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Return Shipping Address</h3>
        <p>
          Please ship your return to the following address:
        </p>
        <p>
          Velvét Returns Center<br />
          205, Rosewood Industrial Estate<br />
          Sarkhej-Gandhinagar Highway<br />
          Ahmedabad, Gujarat 382210<br />
          India
        </p>
      </div>

      <div className={styles.section}>
        <h3>3. Get Assistance</h3>
        <p>
          To initiate a return, please file an incident with our Customer Service team.
        </p>
        <p>Email: customerservice@velvet.com</p>
        <p>Phone: +44 (0)115 111 1111</p>
        <p>
          Our representatives will guide you through the process and help with any queries.
        </p>
      </div>
    </div>
  );
};

export default Returns;