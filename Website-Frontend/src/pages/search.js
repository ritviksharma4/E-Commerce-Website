import React from 'react';
import { parse } from 'query-string';
import SearchPage from '../components/SearchPage';

const Search = ({ location }) => {
  const params = parse(location.search);
  const searchQuery = params.q || '';

  return <SearchPage searchQuery={searchQuery} />;
};

export default Search;
