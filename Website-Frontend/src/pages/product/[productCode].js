import React from 'react';
import ProductPage from '../product/ProductPage';

const DynamicProductRoute = ({ params }) => {
  return <ProductPage params={params} />;
};

export default DynamicProductRoute;