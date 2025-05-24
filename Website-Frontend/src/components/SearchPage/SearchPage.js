import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

import Layout from '../../components/Layout';
import Container from '../Container';
import Breadcrumbs from '../Breadcrumbs';
import ProductCardGrid from '../ProductCardGrid';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import { isAuth } from '../../helpers/general';

import * as styles from './SearchPage.module.css';

const SearchPage = (props) => {
  const location = useLocation();
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const LAMBDA_ENDPOINT = process.env.GATSBY_APP_GET_SEARCH_QUERY_PRODUCTS_FOR_USER;

  // 1. Extract searchQuery from URL and set state
  useEffect(() => {
    if (!isAuth()) {
      navigate('/login');
      return;
    }
  }, []);

  useEffect(() => {
    const params = parse(location.search);
    setSearchQuery(params.q || '');
  }, [location.search]);

  // 2. Fetch search results when searchQuery state updates
  useEffect(() => {
    if (!searchQuery) {
      setIsLoading(false);
      return;
    }

    const fetchSearchQueryProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(LAMBDA_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: searchQuery }),
        });

        const result = await response.json();
        console.log(`Result: ${JSON.stringify(result)}`)
        if (result) {
          setSearchData(result);
        }
      } catch (err) {
        console.error('Failed to fetch search results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchQueryProducts();
  }, [searchQuery]);

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Home' },
              { label: `Search results for '${searchQuery}'` },
            ]}
          />
          {isLoading ? (
            <LuxuryLoader />
          ) : (
            <>
              <div className={styles.searchLabels}>
                <h4>Search results for '{searchQuery}'</h4>
                <span>{searchData.length} results</span>
              </div>
              <ProductCardGrid
                data={searchData}
              />
            </>
          )}
        </Container>
      </div>
    </Layout>
  );
};

export default SearchPage;