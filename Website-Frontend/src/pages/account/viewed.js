import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

import Layout from '../../components/Layout';
import AccountLayout from '../../components/AccountLayout';
import Breadcrumbs from '../../components/Breadcrumbs';
import ProductCardGrid from '../../components/ProductCardGrid';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import { isAuth } from '../../helpers/general';

import * as styles from './viewed.module.css';

const Viewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_SHOPPING_HISTORY_FOR_USER;

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('velvet_login_key'));
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    const fetchRecentlyViewed = async () => {
      try {
        const response = await fetch(LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            requestType: 'recentlyViewed',
          }),
        });
        const result = await response.json();
        let data = JSON.stringify(result);
        data = JSON.parse(data)

        if (data?.recentlyViewed) {
          setRecentlyViewed(data.recentlyViewed);
        }
      } catch (err) {
        console.error('Failed to fetch recently viewed items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [LAMBDA_ENDPOINT]);

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Home' },
            { link: '/account', label: 'Account' },
            { link: '/account/viewed', label: 'Recently Viewed' },
          ]}
        />
        <div className={styles.root}>
          <h1>Recently Viewed</h1>

          {isLoading ? (
            <LuxuryLoader />
          ) : recentlyViewed.length === 0 ? (
            <p>You haven't viewed any items yet.</p>
          ) : (
            <div className={styles.gridContainer}>
              <ProductCardGrid
                spacing={true}
                height={480}
                columns={3}
                data={recentlyViewed}
              />
            </div>
          )}
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default Viewed;