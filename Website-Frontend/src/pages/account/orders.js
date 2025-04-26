import React, { useEffect, useState } from 'react';
import * as styles from './orders.module.css';

import AccountLayout from '../../components/AccountLayout/AccountLayout';
import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout/Layout';
import OrderItem from '../../components/OrderItem/OrderItem';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import { isAuth } from '../../helpers/general';
import { navigate } from 'gatsby';

const OrderPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_SHOPPING_HISTORY_FOR_USER

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const email = JSON.parse(localStorage.getItem('velvet_login_key'))?.email;

        const response = await fetch(LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            requestType: 'orderHistory',
          }),
        });

        const data = await response.json();
        
        const formattedOrders = data.orderHistory.map((order) => ({
          ...order,
          orderPlaced: formatDate(order.orderPlacedDate),
          lastUpdate: formatDate(order.orderPlacedDate),
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Failed to fetch order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [LAMBDA_ENDPOINT]);

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Home' },
            { link: '/account', label: 'Account' },
            { link: '/account/orders/', label: 'Orders' },
          ]}
        />
        <h1>Orders</h1>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <>
            <div className={`${styles.tableHeaderContainer} ${styles.gridStyle}`}>
              <span className={styles.tableHeader}>Order #</span>
              <span className={styles.tableHeader}>Order Placed</span>
              <span className={styles.tableHeader}>Last Update</span>
              <span className={styles.tableHeader}>Status</span>
            </div>

            {orders.map((order, index) => (
              <OrderItem key={order.orderId || index} order={order} headerStyling={styles.gridStyle} />
            ))}
          </>
        )}
      </AccountLayout>
    </Layout>
  );
};

export default OrderPage;