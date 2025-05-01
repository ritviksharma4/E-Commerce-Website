import React, { useState, useEffect, useCallback } from 'react';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import * as styles from './SizeChart.module.css';

const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_PRODUCT_DETAILS_FOR_USER;

const SizeChart = ({ close, category, subCategory }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [unit, setUnit] = useState('cm');

  const fetchSizeChartDetails = useCallback(async () => {
    setLoading(true);
    try {

      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "requestType": "sizeChart",
          category,
          subCategory
        }),
      });
      const data = await response.json();
      setChartData(data);
      setUnit(data.unit || 'cm');
    } catch (error) {
      console.error('Error fetching Size Chart:', error);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [category, subCategory]);

  useEffect(() => {
    fetchSizeChartDetails();
  }, [fetchSizeChartDetails]);

  const convertValue = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return unit === 'cm' ? num.toFixed(1) : (num / 2.54).toFixed(1);
  };

  const renderTable = () => {
    const { columns, rows } = chartData;

    return (
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', minWidth: '60%' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 12px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Size</th>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: '8px 12px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                {col} ({unit})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(rows).map(([size, values]) => (
            <tr key={size}>
              <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{size}</td>
              {values.map((val, i) => (
                <td key={i} style={{ padding: '8px 12px' }}>{convertValue(val)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <h4>Size Chart</h4>
        <button
          onClick={close}
          style={{
            position: 'absolute',
            right: 32,
            top: 32,
            fontSize: 20,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>

      <div className={styles.contentContainer}>
        {loading ? (
          <LuxuryLoader />
        ) : chartData ? (
          <div className={styles.productContainer}>
            <div className={styles.toggleWrapper}>

              <input
                type="checkbox"
                className={styles.toggleCheckbox}
                checked={unit === 'in'}
                onChange={(e) => setUnit(e.target.checked ? 'in' : 'cm')}
              />
              <div className={styles.toggleContainer}>
                <div className={styles.toggleButton}>
                  <span className={styles.unitLabel}>{unit}</span>
                </div>
              </div>
            </div>

            {renderTable()}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: 32 }}>No size chart available.</div>
        )}
      </div>
    </div>
  );
};

export default SizeChart;