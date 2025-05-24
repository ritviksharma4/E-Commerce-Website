import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './404.module.css';

const NotFoundPage = () => {
  const [search, setSearch] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ensures client-side rendering
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
  };

  if (!isClient) return null; // prevent SSR crash

  // Dynamically import components only on client
  const Button = require('../components/Button').default;
  const Container = require('../components/Container').default;
  const FormInputField = require('../components/FormInputField/FormInputField').default;
  const Layout = require('../components/Layout').default;

  return (
    <Layout disablePaddingBottom>
      <Container size={'medium'}>
        <div className={styles.root}>
          <h1>404 Error</h1>
          <h2>Page not found</h2>
          <p>
            Uh oh, looks like the page you are looking for has moved or no longer exists.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.searchContainer}>
              <FormInputField
                id={'name'}
                value={search}
                handleChange={(_, e) => setSearch(e)}
                type={'text'}
              />
              <Button type={'submit'} level={'primary'}>
                search
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;