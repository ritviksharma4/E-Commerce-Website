import React, { useState, useEffect, useContext } from 'react';
import { navigate } from 'gatsby';
import * as styles from './productpage.module.css';

import Accordion from '../components/Accordion';
import AdjustItem from '../components/AdjustItem';
import Button from '../components/Button';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from '../components/Container';
import CurrencyFormatter from '../components/CurrencyFormatter';
import Gallery from '../components/Gallery';
import SizeList from '../components/SizeList';
import Split from '../components/Split';
import SwatchList from '../components/SwatchList';
import Layout from '../components/Layout/Layout';
import Icon from '../components/Icons/Icon';
import ProductCardGrid from '../components/ProductCardGrid';

import AddItemNotificationContext from '../context/AddItemNotificationProvider';

import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ProductPage = ({ params }) => {
  const { productCode } = params;
  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotification = ctxAddItemNotification.showNotification;

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const REGION = process.env.GATSBY_APP_AWS_REGION;
  const IDENTITY_POOL_ID = process.env.GATSBY_APP_COGNITO_IDENTITY_POOL_ID;
  const S3_BUCKET = process.env.GATSBY_APP_S3_BUCKET_NAME;
  const TABLE_NAME = process.env.GATSBY_APP_DYNAMODB_TABLE;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const credentials = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: REGION }),
          identityPoolId: IDENTITY_POOL_ID,
        });

        const client = new DynamoDBClient({
          region: REGION,
          credentials,
        });

        const command = new GetItemCommand({
          TableName: TABLE_NAME,
          Key: {
            productCode: { S: productCode },
          },
        });

        const response = await client.send(command);
        if (!response.Item) {
          console.error('Product not found');
          return;
        }

        const productData = unmarshall(response.Item);
        productData.imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${productData.category}/${productData.subCategory}/${productData.productCode}/display.jpg`;

        setProduct(productData);
        setActiveSwatch(productData.colorOptions?.[0]);
        setActiveSize(productData.sizeOptions?.[0]);

        fetchSuggestions(productData.category, productData.subCategory, productData.productCode);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchSuggestions = async (category, subCategory, currentProductCode) => {
      try {
        const credentials = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: REGION }),
          identityPoolId: IDENTITY_POOL_ID,
        });

        const client = new DynamoDBClient({
          region: REGION,
          credentials,
        });

        const scan = new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: '#cat = :cat AND #sub = :sub AND #code <> :code',
          ExpressionAttributeNames: {
            '#cat': 'category',
            '#sub': 'subCategory',
            '#code': 'productCode',
          },
          ExpressionAttributeValues: {
            ':cat': { S: category },
            ':sub': { S: subCategory },
            ':code': { S: currentProductCode },
          },
          Limit: 10,
        });

        const res = await client.send(scan);
        const data = res.Items.map(unmarshall).slice(0, 4);
        setSuggestions(data);
      } catch (e) {
        console.error('Suggestions fetch failed:', e);
      }
    };

    fetchProduct();
  }, [productCode]);

  if (!product) return <div>Loading product...</div>;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size="large" spacing="min">
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Home' },
              { label: product.category, link: `/shop/${product.category}` },
              { label: product.subCategory, link: `/shop/${product.category}/${product.subCategory}` },
              { label: product.name },
            ]}
          />

          <div className={styles.content}>
            <div className={styles.gallery}>
              <Gallery images={product.gallery} />
            </div>

            <div className={styles.details}>
              <h1>{product.name}</h1>
              <span className={styles.vendor}>by {product.vendor}</span>

              <div className={styles.priceContainer}>
                <CurrencyFormatter appendZero amount={product.price} />
              </div>

              <SwatchList
                swatchList={product.colorOptions}
                activeSwatch={activeSwatch}
                setActiveSwatch={setActiveSwatch}
              />

              <div className={styles.sizeContainer}>
                <SizeList
                  sizeList={product.sizeOptions}
                  activeSize={activeSize}
                  setActiveSize={setActiveSize}
                />
              </div>

              <div className={styles.quantityContainer}>
                <span>Quantity</span>
                <AdjustItem qty={qty} setQty={setQty} />
              </div>

              <div className={styles.actionContainer}>
                <div className={styles.addToButtonContainer}>
                  <Button onClick={() => showNotification()} fullWidth level="primary">
                    Add to Bag
                  </Button>
                </div>
                <div
                  className={styles.wishlistActionContainer}
                  role="presentation"
                  onClick={() => setIsWishlist(!isWishlist)}
                >
                  <Icon symbol="heart" />
                  <div
                    className={`${styles.heartFillContainer} ${isWishlist ? styles.show : styles.hide}`}
                  >
                    <Icon symbol="heartFill" />
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <p>{product.description}</p>
                <span>Product code: {product.productCode}</span>
              </div>

              <div className={styles.informationContainer}>
                <Accordion type="plus" customStyle={styles} title="composition & care">
                  <p className={styles.information}>{product.description}</p>
                </Accordion>
                <Accordion type="plus" customStyle={styles} title="delivery & returns">
                  <p className={styles.information}>{product.description}</p>
                </Accordion>
                <Accordion type="plus" customStyle={styles} title="help">
                  <p className={styles.information}>{product.description}</p>
                </Accordion>
              </div>
            </div>
          </div>

          <div className={styles.suggestionContainer}>
            <h2>You may also like</h2>
            <ProductCardGrid
              spacing
              showSlider
              height={400}
              columns={4}
              data={suggestions}
            />
          </div>
        </Container>

        <div className={styles.attributeContainer}>
          <Split
            image="/cloth.png"
            alt="attribute description"
            title="Sustainability"
            description="We design our products to look good and to be used on a daily basis. Quality over quantity is a cornerstone of our ethos."
            ctaText="learn more"
            cta={() => navigate('/blog')}
            bgColor="var(--standard-light-grey)"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;