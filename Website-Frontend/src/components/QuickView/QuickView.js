import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  DynamoDBClient,
  QueryCommand
} from '@aws-sdk/client-dynamodb';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

import Button from '../Button';
import CurrencyFormatter from '../CurrencyFormatter';
import SizeList from '../SizeList';
import SwatchList from '../SwatchList';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader'; // ✅ Added here

import AddItemNotificationContext from '../../context/AddItemNotificationProvider';
import * as styles from './QuickView.module.css';
import { toOptimizedImage } from '../../helpers/general';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { isAuth } from '../../helpers/general';

const REGION = process.env.GATSBY_APP_AWS_REGION;
const IDENTITY_POOL_ID = process.env.GATSBY_APP_COGNITO_IDENTITY_POOL_ID;
const TABLE_NAME = process.env.GATSBY_APP_DYNAMODB_TABLE;
const S3_BUCKET = process.env.GATSBY_APP_S3_BUCKET_NAME;

const client = new DynamoDBClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: IDENTITY_POOL_ID,
  }),
});

const QuickView = ({ close, buttonTitle = 'Add to Bag', product: initialProduct }) => {
  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotification = ctxAddItemNotification.showNotification;
  const UPDATE_USER_SHOPPING_HISTORY = process.env.GATSBY_APP_UPDATE_SHOPPING_HISTORY_FOR_USER

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(() =>
    initialProduct?.colorOptions?.find((c) => c.productCode === initialProduct?.productCode) ||
    initialProduct?.colorOptions?.[0]
  );
  const [activeSize, setActiveSize] = useState(initialProduct?.sizeOptions?.[0]);

  useEffect(() => {
    if (!initialProduct) return;

    setProduct(initialProduct);

    const defaultSwatch =
      initialProduct.colorOptions?.find((c) => c.productCode === initialProduct.productCode) ||
      initialProduct.colorOptions?.[0];

    setActiveSwatch(defaultSwatch);
    setActiveSize(initialProduct.sizeOptions?.[0]);
  }, [initialProduct]);

  const fetchProductDetails = useCallback(async (productCode) => {
    setLoading(true);
    try {
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'productCode = :productCode',
        ExpressionAttributeValues: {
          ':productCode': { S: productCode },
        },
      });

      const response = await client.send(command);
      if (response.Items && response.Items.length > 0) {
        const newProduct = unmarshall(response.Items[0]);
        newProduct.imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${newProduct.category}/${newProduct.subCategory}/${newProduct.productCode}/display.jpg`;
        setProduct(newProduct);

        const newDefaultSwatch =
          newProduct.colorOptions?.find((c) => c.productCode === newProduct.productCode) ||
          newProduct.colorOptions?.[0];

        setActiveSwatch(newDefaultSwatch);
        setActiveSize(newProduct.sizeOptions?.[0]);
      } else {
        console.warn('No item found for productCode:', productCode);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToBag = async () => {
    const user = JSON.parse(localStorage.getItem('velvet_login_key') || '{}');
    const email = user.email || null;

    const updateUserCartItems = await fetch(UPDATE_USER_SHOPPING_HISTORY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        "updateType": {
          "cartItems": {
            "productCode": product.productCode,
            "color": activeSwatch?.title,
            "size": activeSize,
            "qty": 1,
            "action": "add"
          }
        }   
      }),
    });
    console.log("Response for Adding to Cart: ", updateUserCartItems)
    const existingLoginKey = JSON.parse(localStorage.getItem('velvet_login_key')) || {};
    const updatedLoginKey = {
      ...existingLoginKey,
      totalCartItems: existingLoginKey.totalCartItems + 1
    };
    localStorage.setItem('velvet_login_key', JSON.stringify(updatedLoginKey));
    window.dispatchEvent(new Event('cart-updated'));
    close();
    product.color = activeSwatch?.title;
    product.size = activeSize;
    showNotification(product);
  };

  const handleColorChange = (swatch) => {
    if (swatch.productCode !== product?.productCode) {
      setActiveSwatch(swatch);
      fetchProductDetails(swatch.productCode);
    }
  };

  if (!product) return null;

  const name = product?.name;
  const price = product?.price;
  const image = product?.image;
  const alt = product?.gallery;
  const colorOptions = product?.colorOptions || [];
  const sizeOptions = product?.sizeOptions || [];

  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <h4>Select Options</h4>
      </div>
      <div className={styles.contentContainer}>
        {loading ? (
          <LuxuryLoader /> // ✅ Replaced "Loading..." with luxury loader
        ) : (
          <>
            <div className={styles.productContainer}>
              <span className={styles.productName}>{name}</span>
              <div className={styles.price}>
                <CurrencyFormatter amount={price} />
              </div>
              <div className={styles.productImageContainer}>
                <img alt={alt} src={toOptimizedImage(image)} />
              </div>
            </div>

            <div className={styles.sectionContainer}>
              <SwatchList
                swatchList={colorOptions}
                activeSwatch={activeSwatch}
                setActiveSwatch={handleColorChange}
              />
            </div>

            <div className={styles.sectionContainer}>
            <SizeList
              sizeList={product.sizeOptions}
              activeSize={activeSize}
              setActiveSize={setActiveSize}
              category={product.category}
              subCategory={product.subCategory}
            />
            </div>

            <Button
              onClick={() => {
                if (isAuth()) {
                  handleAddToBag();
                } else {
                  window.location.href = '/login';
                }
              }}
              fullWidth
              level={'primary'}
            >
              {buttonTitle}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickView;