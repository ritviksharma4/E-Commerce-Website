import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import * as styles from './favorites.module.css';

import Layout from '../../components/Layout/Layout';
import Breadcrumbs from '../../components/Breadcrumbs';
import Container from '../../components/Container';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import Banner from '../../components/Banner';
import FavoriteCardGrid from '../../components/FavoriteCardGrid/FavoriteCardGrid';
import { isAuth } from '../../helpers/general';
import Button from '../../components/Button'; // ✅ Import Button

const FavoritesPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_SHOPPING_HISTORY_FOR_USER;

  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem('velvet_login_key'));
        const email = localUser?.email;

        if (!email) {
          throw new Error('User email not found in localStorage');
        }

        const response = await fetch(LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            requestType: 'wishlistItems',
          }),
        });

        const result = await response.json();
        setWishlistItems(result.wishlistItems || []);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [LAMBDA_ENDPOINT]);

  if (loading) {
    return <LuxuryLoader />;
  }

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs
              crumbs={[
                { link: '/', label: 'Home' },
                { label: 'Favorites' },
              ]}
            />
          </div>
        </Container>

        <Banner
          maxWidth={'650px'}
          name={`Your Wishlist`}
          subtitle={
            'Your wishlist is a private gallery of refined desire — where elegance meets exclusivity, and every piece tells a story of distinction.'
          }
        />

        <Container size={'large'} spacing={'min'}>
          <div className={styles.metaContainer}></div>

          {wishlistItems.length > 0 ? (
            <div className={styles.productContainer}>
              <FavoriteCardGrid data={wishlistItems} setData={setWishlistItems} />
            </div>
          ) : (
            <div className={styles.emptyContainer}>
              <p className={styles.emptyText}>
                Your wishlist is feeling a little lonely. Discover treasures waiting to be adored.
              </p>
              <Button
                onClick={() => navigate('/')}
                level={'secondary'}
                className={styles.discoverButton}
                style={{ width: '50%', minWidth: '200px', maxWidth: '300px', marginTop: '20px' }}
              >
                Discover Collection
              </Button>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default FavoritesPage;