import React, { useState, useEffect, useCallback } from 'react';
import * as styles from './ear-rings-and-bracelets.module.css';

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

const EarRingsBraceletsAccessoriesPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);

  const REGION = process.env.GATSBY_APP_AWS_REGION;
  const IDENTITY_POOL_ID = process.env.GATSBY_APP_COGNITO_IDENTITY_POOL_ID;
  const S3_BUCKET = process.env.GATSBY_APP_S3_BUCKET_NAME;
  const TABLE_NAME = process.env.GATSBY_APP_DYNAMODB_TABLE;

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
          ':prefix1': { S: 'AC-BRCLT-' },
          ':prefix2': { S: 'AC-ERRNG-' },
        },
      });

      const response = await client.send(command);

      if (!response.Items || response.Items.length === 0) {
        console.error('No items found in DynamoDB.');
        return;
      }

      const items = response.Items.map((item) => {
        const data = unmarshall(item);
        data.imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/Accessories/ear-rings-and-bracelets/${data.productCode}/display.jpg`;
        return data;
      });

      setProducts(items);
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

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs
              crumbs={[
                { link: '/', label: 'Home' },
                { link: '/shop/accessories', label: 'Accessories' },
                { label: 'Ear-Rings & Bracelets' },
              ]}
            />
          </div>
        </Container>
        <Banner
          maxWidth={'650px'}
          name={`Ear Rings & Bracelets`}
          subtitle={
            'Look to our Ear Rings & Bracelets for modern takes on one-and-done dressing. From midis in bold prints to dramatic floor-sweeping styles and easy all-in-ones, our edit covers every mood.'
          }
        />
        <Container size={'large'} spacing={'min'}>
          <div className={styles.metaContainer}>
            <span className={styles.itemCount}>{products.length} items</span>
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
              {products.length} items
            </span>
            <ProductCardGrid data={products} />
          </div>
          <div className={styles.loadMoreContainer}>
            <span>{products.length} shown</span>
            <Button fullWidth level={'secondary'}>
              LOAD MORE
            </Button>
          </div>
        </Container>
      </div>

      <LayoutOption />
    </Layout>
  );
};

export default EarRingsBraceletsAccessoriesPage;