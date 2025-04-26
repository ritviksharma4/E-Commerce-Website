import React from 'react';
import { isNumeric } from '../../helpers/general';

const CurrencyFormatter = ({
  amount,
  currency = 'USD',
  appendZero = false,
  useDollar = false,
}) => {
  let displayAmount =
    (typeof amount !== 'number' && parseFloat(amount?.replace('$', ''))) ||
    amount;
  const languageCode =
    typeof window !== 'undefined'
      ? window.navigator.language || 'en-AU'
      : 'en-AU';

  const formatObject = new Intl.NumberFormat(languageCode, {
    style: 'currency',
    currency,
  });
  let symbol = '$';
  let formattedPrice = formatObject.format(displayAmount);
  if ('formatToParts' in formatObject) {
    const formattedPriceParts = formatObject.formatToParts(displayAmount);
    if (useDollar === false) symbol = formattedPriceParts[0].value;
    const currencyValue = formattedPriceParts.find(
      (obj) => obj.type === 'currency'
    );
    const decimalValue = formattedPriceParts.find(
      (obj) => obj.type === 'fraction'
    );
    formattedPrice = formattedPrice.replace(currencyValue.value, '');
    if (decimalValue && decimalValue.value === '00' && !appendZero) {
      formattedPrice = formattedPrice.replace(`.${decimalValue.value}`, '');
    }
  } else {
    formattedPrice = amount;
  }

  const priceComponent = (
    <>
      <span>{symbol}</span>
      <span>{formattedPrice}</span>
    </>
  );

  return isNumeric(amount) ? priceComponent : 'No price available';
};

export default CurrencyFormatter;
