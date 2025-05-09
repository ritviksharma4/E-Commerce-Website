import React from 'react';
import * as styles from './PaymentsAndSecurity.module.css';

const PaymentsAndSecurity = () => {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h3>1. Accepted Payment Methods</h3>
        <p>
          We accept the following forms of payment for your convenience:
        </p>
        <p>
          • Credit and Debit Cards (Visa, MasterCard, American Express)<br />
          • International cards from the above networks<br />
          • Secure checkout via SSL encryption
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Safe & Secure Transactions</h3>
        <p>
          Your privacy and security are our top priorities. All transactions on velvet.com are protected with industry-standard SSL encryption to ensure that your payment details are secure.
        </p>
        <p>
          We never store your card information on our servers.
        </p>
      </div>

      <div className={styles.section}>
        <h3>3. Need Help?</h3>
        <p>
          If you experience any issues with payment or checkout, please get in touch with our Customer Service team.
        </p>
        <p>Email: customerservice@velvet.com</p>
        <p>Phone: +44 (0)115 111 1111</p>
        <p>
          We are here to assist you with any billing or security concerns.
        </p>
      </div>
    </div>
  );
};

export default PaymentsAndSecurity;