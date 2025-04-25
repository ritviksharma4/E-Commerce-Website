import React, { useState } from 'react';
import { navigate } from 'gatsby';

import CurrencyFormatter from '../CurrencyFormatter';
import Icon from '../Icons/Icon';
import * as styles from './OrderItem.module.css';
import { toOptimizedImage } from '../../helpers/general';
import { format } from 'date-fns';

const OrderItem = (props) => {
  const { headerStyling, order } = props;
  const [collapsed, setCollapsed] = useState(false);

  // Convert to number safely and compute total
  let computedTotal = 0;
  for (let x = 0; x < order.items.length; x++) {
    const price = parseFloat(order.items[x].price || 0);
    const qty = parseInt(order.items[x].qty || 0);
    computedTotal += price * qty;
  }

  const pad = (str, max) => {
    str = str ? str.toString() : '00000';
    return str.length < max ? pad('0' + str, max) : str;
  };

  const formattedDate = order.orderPlacedDate
    ? format(new Date(order.orderPlacedDate), 'MMM dd, yyyy')
    : '';

  return (
    <div className={`${styles.root} ${collapsed ? styles.paddingBottom : ''}`}>
      <div
        className={`${headerStyling} ${styles.orderHeader}`}
        role="presentation"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className={styles.orderMeta}>
          <span className={styles.orderId}>Order #{pad(order.orderId, 5)}</span>
          <span className={styles.orderTotalMeta}>
            {`${order.items.length} products totaling `}
          </span>
          <span className={styles.total}>
            <CurrencyFormatter amount={computedTotal} />
          </span>
        </div>
        <div className={styles.od}>
          <span className={styles.mobileLabel}>Order Date</span>
          <span className={styles.orderDate}>{formattedDate}</span>
        </div>
        <span className={styles.lastUpdate}>{formattedDate}</span>
        <div className={styles.st}>
          <span className={styles.mobileLabel}>Status</span>
          <span className={styles.status}>{order.orderStatus}</span>
        </div>
        <div
          className={`${styles.toggleContainer} ${
            collapsed ? styles.rotate : ''
          }`}
        >
          <Icon symbol="caret" />
        </div>
      </div>

      <div
        className={`${styles.detailsContainer} ${
          !collapsed ? styles.hide : styles.show
        }`}
      >
        <div className={styles.addressDetailContainer}>
          <div className={styles.addressContainer}>
            <span className={styles.addressMeta}>Ship to</span>
            <span className={styles.address}>{order.shippingAddress?.name}</span>
            <span className={styles.address}>{order.shippingAddress?.address}</span>
            <span className={styles.address}>
              {`${order.shippingAddress?.state} ${order.shippingAddress?.postal}`}
            </span>
            <span className={styles.address}>
              {order.shippingAddress?.country}
            </span>
          </div>
          <div className={styles.addressContainer}>
            <span className={styles.addressMeta}>Bill to</span>
            <span className={styles.address}>{order.billingAddress?.name}</span>
            <span className={styles.address}>{order.billingAddress?.address}</span>
            <span className={styles.address}>
              {`${order.billingAddress?.state} ${order.billingAddress?.postal}`}
            </span>
            <span className={styles.address}>
              {order.billingAddress?.country}
            </span>
          </div>
        </div>

        <div className={styles.itemList}>
          {order.items.map((item, index) => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.qty || 0);

            return (
              <div className={styles.itemContainer} key={index}>
                <div
                  role="presentation"
                  onClick={() => navigate(`/product/${item.productCode}`)}
                  className={styles.imageContainer}
                >
                  <img
                    alt={`Image of ${item.image}`}
                    src={toOptimizedImage(
                      `${item.image}`
                    )}
                  />
                </div>
                <div>
                  <span className={styles.itemName}>{item.productCode}</span>
                  <div className={styles.orderItemMeta}>
                    <span className={styles.itemQuantity}>Qty: {qty}</span>
                    <span className={styles.itemQuantity}>Size: {item.size.toUpperCase()}</span>
                    <div className={styles.itemTotalMobile}>
                      <CurrencyFormatter amount={price * qty} />
                    </div>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  <CurrencyFormatter amount={price * qty} />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.transactionDetails}>
          <div className={styles.transactionalGrid}>
            <span>Subtotal:</span>
            <span>
              <CurrencyFormatter amount={computedTotal} />
            </span>
            <span>GST:</span>
            <span>
              <CurrencyFormatter amount={0} />
            </span>
            <span className={styles.bold}>Grand Total:</span>
            <span className={styles.grandTotal}>
              <CurrencyFormatter amount={computedTotal} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;