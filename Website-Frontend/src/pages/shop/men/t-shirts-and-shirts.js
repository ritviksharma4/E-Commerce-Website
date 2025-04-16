import React, { useState, useEffect, useCallback } from 'react';
import * as styles from './t-shirts-and-shirts.module.css';

import Banner from '../../../components/Banner';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CardController from '../../../components/CardController';
import Container from '../../../components/Container';
import Chip from '../../../components/Chip';
import Icon from '../../../components/Icons/Icon';
import Layout from '../../../components/Layout';
import LayoutOption from '../../../components/LayoutOption';
import ProductCardGrid from '../../../components/ProductCardGrid';
import Button from '../../../components/Button';
import Config from '../../../config.json';

import {
  CognitoIdentityClient
} from '@aws-sdk/client-cognito-identity';
import {
  fromCognitoIdentityPool
} from '@aws-sdk/credential-provider-cognito-identity';
import {
  DynamoDBClient,
  ScanCommand
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ITEMS_PER_PAGE = 6;

const TShirtsShirtsMenPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const REGION = process.env.GATSBY_APP_AWS_REGION;
  const IDENTITY_POOL_ID = process.env.GATSBY_APP_COGNITO_IDENTITY_POOL_ID;
  const S3_BUCKET = process.env.GATSBY_APP_S3_BUCKET_NAME;
  const TABLE_NAME = process.env.GATSBY_APP_DYNAMODB_TABLE;

  // Function to restore scroll position
  const restoreScroll = () => {
    const scrollY = sessionStorage.getItem('tShirtsShirtsMen_scrollY');
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY));
    }
  };

  // Fetch products from DynamoDB and save them to state
  const fetchProducts = useCallback(async () => {
    try {
      const credentials = fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL_ID,
      });

      const client = new DynamoDBClient({
        region: REGION,
        credentials,
      });

      const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(productCode, :prefix1) OR begins_with(productCode, :prefix2)',
        ExpressionAttributeValues: {
          ':prefix1': { S: 'M-SHRT-' },
          ':prefix2': { S: 'M-TSHRT-' },
        },
      });

      const response = await client.send(command);

      if (!response.Items || response.Items.length === 0) {
        console.error('No items found in DynamoDB.');
        return;
      }

      const items = response.Items.map((item) => {
        const data = unmarshall(item);
        data.imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/Men/t-shirts-and-shirts/${data.productCode}/display.jpg`;
        return data;
      });

      setAllProducts(items);
      setTotalCount(items.length);

      // Get the number of loaded items from sessionStorage
      const savedIndex = parseInt(sessionStorage.getItem('tShirtsShirtsMen_loadedItemCount')) || ITEMS_PER_PAGE;
      setVisibleProducts(items.slice(0, savedIndex));

      setTimeout(restoreScroll, 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [REGION, IDENTITY_POOL_ID, TABLE_NAME, S3_BUCKET]);

  useEffect(() => {
    window.addEventListener('keydown', escapeHandler);
    fetchProducts();
    return () => window.removeEventListener('keydown', escapeHandler);
  }, [fetchProducts]);

  const escapeHandler = (e) => {
    if (e?.keyCode === 27) setShowFilter(false);
  };

  const handleLoadMore = () => {
    const newCount = visibleProducts.length + ITEMS_PER_PAGE;
    const updated = allProducts.slice(0, newCount);
    setVisibleProducts(updated);
    sessionStorage.setItem('tShirtsShirtsMen_loadedItemCount', newCount);
  };

  useEffect(() => {
    const storeScroll = () => {
      sessionStorage.setItem('tShirtsShirtsMen_scrollY', window.scrollY.toString());
    };
    window.addEventListener('scroll', storeScroll);
    return () => window.removeEventListener('scroll', storeScroll);
  }, []);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs
              crumbs={[
                { link: '/', label: 'Home' },
                { link: '/shop/men', label: 'Men' },
                { label: 'T-Shirts & Shirts' },
              ]}
            />
          </div>
        </Container>
        <Banner
          maxWidth={'650px'}
          name={`Men's T-Shirts & Shirts`}
          subtitle={
            'Look to our men’s T-Shirts & Shirts for modern takes on one-and-done dressing. From midis in bold prints to dramatic floor-sweeping styles and easy all-in-ones, our edit covers every mood.'
          }
        />
        <Container size={'large'} spacing={'min'}>
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>
              {visibleProducts.length}/{totalCount} items
            </span>
            <div className={styles.controllerContainer}>
              <div
                className={styles.iconContainer}
                role={'presentation'}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Icon symbol={'filter'} />
                <span>Filters</span>
              </div>
              <div className={`${styles.iconContainer} ${styles.sortContainer}`}>
                <span>Sort by</span>
                <Icon symbol={'caret'} />
              </div>
            </div>
          </div>
          <CardController
            closeFilter={() => setShowFilter(false)}
            visible={showFilter}
            filters={Config.filters}
          />
          <div className={styles.chipsContainer}>
            <Chip name={'XS'} />
            <Chip name={'S'} />
          </div>
          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>
              {visibleProducts.length}/{totalCount} items
            </span>
            <ProductCardGrid data={visibleProducts} />
          </div>
          {visibleProducts.length < totalCount && (
            <div className={styles.loadMoreContainer}>
              <span>{visibleProducts.length}/{totalCount} shown</span>
              <Button fullWidth level={'secondary'} onClick={handleLoadMore}>
                LOAD MORE
              </Button>
            </div>
          )}
        </Container>
      </div>
      <LayoutOption />
    </Layout>
  );
};

export default TShirtsShirtsMenPage;