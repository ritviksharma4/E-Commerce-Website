import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './address.module.css';

import AccountLayout from '../../components/AccountLayout';
import AddressCard from '../../components/AddressCard';
import AddressForm from '../../components/AddressForm';
import Breadcrumbs from '../../components/Breadcrumbs';
import Icon from '../../components/Icons/Icon';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal';

import { isAuth } from '../../helpers/general';
import Button from '../../components/Button';

const AddressPage = () => {
  const [addressList, setAddressList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (isAuth() === false) {
      navigate('/login');
      return;
    }

    // Load addresses from localStorage velvet_login_key
    const loginData = JSON.parse(localStorage.getItem('velvet_login_key'));
    if (loginData && Array.isArray(loginData.addresses)) {
      setAddressList(loginData.addresses);
    } else {
      setAddressList([]); // fallback
    }
  }, []);

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Home' },
            { link: '/account', label: 'Account' },
            { link: '/account/address', label: 'Addresses' },
          ]}
        />
        <h1>Addresses (UI Purposes Only!)</h1>

        {showForm === false && (
          <div className={styles.addressListContainer}>
            {addressList.length > 0 ? (
              addressList.map((address, index) => (
                <AddressCard
                  key={index}
                  showForm={() => setShowForm(true)}
                  showDeleteForm={() => setShowDelete(true)}
                  {...address}
                />
              ))
            ) : (
              <p className={styles.noAddress}>No addresses found.</p>
            )}

            <div
              className={styles.addCard}
              role={'presentation'}
              onClick={() => setShowForm(true)}
            >
              <Icon symbol={'plus'} />
              <span>new address</span>
            </div>
          </div>
        )}

        {showForm === true && (
          <AddressForm closeForm={() => setShowForm(false)} />
        )}
      </AccountLayout>

      <Modal visible={showDelete} close={() => setShowDelete(false)}>
        <div className={styles.confirmDeleteContainer}>
          <h4>Delete Address?</h4>
          <p>
            Are you sure you want to delete this address? You cannot undo this
            action once you press <strong>'Delete'</strong>.
          </p>
          <div className={styles.actionContainer}>
            <Button onClick={() => setShowDelete(false)} level={'primary'}>
              Delete
            </Button>
            <Button onClick={() => setShowDelete(false)} level={'secondary'}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default AddressPage;