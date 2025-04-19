import { Link, navigate } from 'gatsby';
import React from 'react';
import * as styles from './AccountNav.module.css';

const AccountNav = (props) => {
  const handleLogout = () => {
    window.localStorage.removeItem('velvet_login_key');

    sessionStorage.removeItem('all_men_products');
    sessionStorage.removeItem('all_men_totalCount');
    sessionStorage.removeItem('all_men_loadedItemCount');
    sessionStorage.removeItem('all_men_scrollY');

    sessionStorage.removeItem('all_women_products');
    sessionStorage.removeItem('all_women_totalCount');
    sessionStorage.removeItem('all_women_loadedItemCount');
    sessionStorage.removeItem('all_women_scrollY');

    sessionStorage.removeItem('all_accessories_products');
    sessionStorage.removeItem('all_accessories_totalCount');
    sessionStorage.removeItem('all_accessories_loadedItemCount');
    sessionStorage.removeItem('all_accessories_scrollY');

    sessionStorage.removeItem('dresses_products');
    sessionStorage.removeItem('dresses_totalCount');
    sessionStorage.removeItem('dresses_loadedItemCount');
    sessionStorage.removeItem('dresses_scrollY');

    sessionStorage.removeItem('jacketsBlazers_products');
    sessionStorage.removeItem('jacketsBlazers_totalCount');
    sessionStorage.removeItem('jacketsBlazers_loadedItemCount');
    sessionStorage.removeItem('jacketsBlazers_scrollY');

    sessionStorage.removeItem('sweatersCardigans_products');
    sessionStorage.removeItem('sweatersCardigans_totalCount');
    sessionStorage.removeItem('sweatersCardigans_loadedItemCount');
    sessionStorage.removeItem('sweatersCardigans_scrollY');

    sessionStorage.removeItem('jacketsMen_products');
    sessionStorage.removeItem('jacketsMen_totalCount');
    sessionStorage.removeItem('jacketsMen_loadedItemCount');
    sessionStorage.removeItem('jacketsMen_scrollY');

    sessionStorage.removeItem('sweatshirtsHoodiesMen_products');
    sessionStorage.removeItem('sweatshirtsHoodiesMen_totalCount');
    sessionStorage.removeItem('sweatshirtsHoodiesMen_loadedItemCount');
    sessionStorage.removeItem('sweatshirtsHoodiesMen_scrollY');

    sessionStorage.removeItem('tShirtsShirtsMen_products');
    sessionStorage.removeItem('tShirtsShirtsMen_totalCount');
    sessionStorage.removeItem('tShirtsShirtsMen_loadedItemCount');
    sessionStorage.removeItem('tShirtsShirtsMen_scrollY');

    sessionStorage.removeItem('trousersMen_products');
    sessionStorage.removeItem('trousersMen_totalCount');
    sessionStorage.removeItem('trousersMen_loadedItemCount');
    sessionStorage.removeItem('trousersMen_scrollY');

    sessionStorage.removeItem('bagsAccessories_products');
    sessionStorage.removeItem('bagsAccessories_totalCount');
    sessionStorage.removeItem('bagsAccessories_loadedItemCount');
    sessionStorage.removeItem('bagsAccessories_scrollY');

    sessionStorage.removeItem('capsScarves_products');
    sessionStorage.removeItem('capsScarves_totalCount');
    sessionStorage.removeItem('capsScarves_loadedItemCount');
    sessionStorage.removeItem('capsScarves_scrollY');

    sessionStorage.removeItem('earRingsBracelets_products');
    sessionStorage.removeItem('earRingsBracelets_totalCount');
    sessionStorage.removeItem('earRingsBracelets_loadedItemCount');
    sessionStorage.removeItem('earRingsBracelets_scrollY');

    navigate('/');
  };

  return (
    <div className={styles.root}>
      <div className={styles.webRoot}>
        <Link
          activeClassName={styles.activeLink}
          to={'/account/orders/'}
          className={styles.webLink}
        >
          Orders
        </Link>
        <Link
          activeClassName={styles.activeLink}
          to={'/account/address/'}
          className={styles.webLink}
        >
          Addresses
        </Link>
        <Link
          activeClassName={styles.activeLink}
          to={'/account/settings/'}
          className={styles.webLink}
        >
          Settings
        </Link>
        <Link
          activeClassName={styles.activeLink}
          to={'/account/viewed/'}
          className={styles.webLink}
        >
          Recently Viewed
        </Link>
        <span
          role={'presentation'}
          onClick={handleLogout}
          className={styles.webLink}
        >
          Logout
        </span>
      </div>
    </div>
  );
};

export default AccountNav;
