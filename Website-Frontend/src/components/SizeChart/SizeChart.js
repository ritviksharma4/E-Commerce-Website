import React, { useState, useEffect, useCallback } from 'react';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import * as styles from './SizeChart.module.css';

const REGION = process.env.GATSBY_APP_AWS_REGION;
const S3_BUCKET = process.env.GATSBY_APP_S3_BUCKET_NAME;

const SizeChart = ({ close, category, subCategory }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [unit, setUnit] = useState('cm');

  const fetchSizeChartDetails = useCallback(async () => {
    setLoading(true);
    try {
      // const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/sizeCharts/${category}/${subCategory}/chart.json`;
      // const response = await fetch(url);
      // if (!response.ok) throw new Error('Could not fetch chart.json');
      // const data = await response.json();
      const data = {
        "unit": "cm",
        "columns": ["To Fit Bust", "To Fit Waist", "Front Length"],
        "rows": {
          "XS": [76, 58, 85],
          "S": [81, 63, 87],
          "M": [86, 68, 89],
          "L": [91, 73, 91],
          "XL": [96, 78, 93]
        }
      }
      
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

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'cm' ? 'in' : 'cm'));
  };

  const convertValue = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return unit === 'cm' ? num : (num / 2.54).toFixed(1);
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
                {col}
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
        <button onClick={close} style={{ position: 'absolute', right: 32, top: 32, fontSize: 20 }}>
          ✕
        </button>
      </div>

      <div className={styles.contentContainer}>
        {loading ? (
          <LuxuryLoader />
        ) : chartData ? (
          <div className={styles.productContainer}>
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <button onClick={toggleUnit} style={{ padding: '6px 12px', fontSize: '14px' }}>
                Show in {unit === 'cm' ? 'inches' : 'cm'}
              </button>
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