import React, { useState, useEffect, useContext } from 'react';
import { navigate } from 'gatsby';
import * as styles from './ProductPage.module.css';
import { isAuth } from '../../helpers/general';
import Accordion from '../../components/Accordion';
import AdjustItem from '../../components/AdjustItem';
import Button from '../../components/Button';
import Breadcrumbs from '../../components/Breadcrumbs';
import Container from '../../components/Container';
import CurrencyFormatter from '../../components/CurrencyFormatter';
import Gallery from '../../components/Gallery';
import SizeList from '../../components/SizeList';
import Split from '../../components/Split';
import SwatchList from '../../components/SwatchList';
import Layout from '../../components/Layout/Layout';
import Icon from '../../components/Icons/Icon';
import ProductCardGrid from '../../components/ProductCardGrid';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';

import AddItemNotificationContext from '../../context/AddItemNotificationProvider';

import {
  CognitoIdentityClient
} from '@aws-sdk/client-cognito-identity';
import {
  fromCognitoIdentityPool
} from '@aws-sdk/credential-provider-cognito-identity';
import {
  DynamoDBClient,
  QueryCommand,
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
  const TABLE_NAME = process.env.GATSBY_APP_DYNAMODB_TABLE;

  const formatBreadcrumbLabel = (str) => {
    if (!str) return '';
    return str
      .split(/[\s-_]+/)
      .map(word => {
        if (word.toLowerCase() === 'and' || word.toLowerCase() === 'n') return '&';
        if (word.toLowerCase() === 'tshirts' || word.toLowerCase() === 'tshirt') return 'T-Shirts';
        if (word.toLowerCase() === 'shirts') return 'Shirts';
        if (word.toLowerCase() === 'hoodies') return 'Hoodies';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const credentials = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: REGION }),
          identityPoolId: IDENTITY_POOL_ID,
        });

        const client = new DynamoDBClient({ region: REGION, credentials });

        const command = new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "productCode = :pcode",
          ExpressionAttributeValues: {
            ":pcode": { S: productCode },
          },
        });

        const response = await client.send(command);
        if (!response.Items || response.Items.length === 0) {
          console.error('Product not found');
          return;
        }

        const productData = unmarshall(response.Items[0]);

        // Setting the product data
        setProduct(productData);

        // Find the color that matches the current productCode
        const initialSwatch = productData.colorOptions?.find(swatch => swatch.productCode === productCode);
        setActiveSwatch(initialSwatch || productData.colorOptions?.[0]); // Fallback to the first color if no match found

        // Set active size (fallback to first size option if none available)
        setActiveSize(productData.sizeOptions?.[0]);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productCode, IDENTITY_POOL_ID, REGION, TABLE_NAME]);

  useEffect(() => {
    if (!product) return;

    const fetchSuggestions = async () => {
      try {
        const credentials = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: REGION }),
          identityPoolId: IDENTITY_POOL_ID,
        });

        const client = new DynamoDBClient({ region: REGION, credentials });

        const scanCommand = new ScanCommand({ TableName: TABLE_NAME });
        const res = await client.send(scanCommand);
        let items = res.Items.map(unmarshall).filter(p => p.productCode !== product.productCode);

        let subCategoryMatches = shuffleArray(items.filter(p => p.subCategory === product.subCategory));
        let categoryMatches = shuffleArray(items.filter(
          p => p.category === product.category && p.subCategory !== product.subCategory
        ));

        const combined = [...subCategoryMatches, ...categoryMatches].slice(0, 4);
        setSuggestions(combined);
      } catch (e) {
        console.error('Suggestions fetch failed:', e);
      }
    };

    fetchSuggestions();
  }, [product, IDENTITY_POOL_ID, REGION, TABLE_NAME]);

  const handleSwatchClick = (swatch) => {
    if (!swatch || !swatch.productCode) return;
    if (swatch.productCode === product.productCode) return;
  
    // Set the activeSwatch immediately and navigate to the product page
    setActiveSwatch(swatch);  // Update the active swatch state here
    navigate(`/product/${swatch.productCode}`);
  };

  if (!product) return <LuxuryLoader />;

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Home' },
              { label: formatBreadcrumbLabel(product.category), link: `/shop/${product.category}` },
              {
                label: formatBreadcrumbLabel(product.subCategory),
                link: `/shop/${product.category}/${product.subCategory}`,
              },
              { label: formatBreadcrumbLabel(product.name) },
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
                {product.originalPrice ? (
                  <>
                    <span className={styles.discountedPrice}>
                      <CurrencyFormatter appendZero amount={product.price} />
                    </span>
                    <span className={styles.originalPrice}>
                      <CurrencyFormatter appendZero amount={product.originalPrice} />
                    </span>
                  </>
                ) : (
                  <CurrencyFormatter appendZero amount={product.price} />
                )}
              </div>

              <SwatchList
                swatchList={product.colorOptions}
                activeSwatch={activeSwatch}
                setActiveSwatch={setActiveSwatch}
                onSwatchClick={handleSwatchClick}
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
                <Button
                  onClick={() => {
                    if (isAuth()) {
                      showNotification();
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                  fullWidth
                  level={'primary'}
                >
                  Add to Bag
                </Button>
                </div>
                <div
                  className={styles.wishlistActionContainer}
                  role={'presentation'}
                  onClick={() => setIsWishlist(!isWishlist)}
                >
                  <Icon symbol={'heart'} />
                  <div
                    className={`${styles.heartFillContainer} ${
                      isWishlist ? styles.show : styles.hide
                    }`}
                  >
                    <Icon symbol={'heartFill'} />
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <p>{product.description}</p>
                <span>Product code: {product.productCode}</span>
              </div>

              <div className={styles.informationContainer}>
                <Accordion type="plus" customStyle={styles} title="composition & care">
                  <p className={styles.information}>{product.compositionAndCare}</p>
                </Accordion>
                <Accordion type="plus" customStyle={styles} title="delivery & returns">
                  <p className={styles.information}>{product.deliveryAndReturns}</p>
                </Accordion>
                <Accordion type="plus" customStyle={styles} title="help">
                  <p className={styles.information}>{product.help}</p>
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
            image={'/cloth.png'}
            alt={'attribute description'}
            title={'Sustainability'}
            description={
              'We design our products to look good and to be used on a daily basis. Quality over quantity is a cornerstone of our ethos.'
            }
            ctaText={'learn more'}
            cta={() => navigate('/blog')}
            bgColor={'var(--standard-light-grey)'}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

export const config = {
  matchPath: "/product/:productCode",
};