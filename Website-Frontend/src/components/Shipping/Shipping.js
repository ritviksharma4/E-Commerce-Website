import React from 'react';
import * as styles from './Shipping.module.css';

const Shipping = () => {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h3>1. Free Worldwide Shipping</h3>
        <p>
          At Velvét, we are proud to offer free worldwide shipping on all orders, no matter where you are located.
        </p>
        <p>
          Once you place your order, our dedicated team will ensure it is processed and shipped within 24 hours. 
          Our mission is to get your luxury essentials to you as quickly and safely as possible.
        </p>
        <p>
          Please note that delivery times may vary depending on your location, but tracking information will be provided for every shipment.
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Customer Support</h3>
        <p>
          If you have any questions about your shipment or need assistance, please reach out to our Customer Service team.
        </p>
        <p>Email: customerservice@velvet.com</p>
        <p>Phone: +44 (0)115 111 1111</p>
        <p>
          Our support hours are Monday to Friday, 9:00 AM – 6:00 PM (IST).
        </p>
      </div>
    </div>
  );
};

export default Shipping;