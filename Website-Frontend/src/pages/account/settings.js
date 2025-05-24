import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './settings.module.css';

import AccountLayout from '../../components/AccountLayout';
import Button from '../../components/Button';
import Breadcrumbs from '../../components/Breadcrumbs';
import FormInputField from '../../components/FormInputField';
import Layout from '../../components/Layout/Layout';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';

import { validateStrongPassword, isAuth } from '../../helpers/general';

const SettingsPage = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const errorState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [updateForm, setUpdateForm] = useState(initialState);
  const [error, setError] = useState(errorState);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isAuth()) {
        navigate('/login');
        return;
      }

      const loginData = JSON.parse(localStorage.getItem('velvet_login_key'));
      if (loginData) {
        setUpdateForm((prev) => ({
          ...prev,
          firstName: loginData.firstName || '',
          lastName: loginData.lastName || '',
          email: loginData.email || '',
        }));
      }

      setIsClient(true);
    }
  }, []);

  const handleChange = (id, e) => {
    const tempForm = { ...updateForm, [id]: e };
    setUpdateForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorState };

    if (updateForm.password !== '') {
      if (!validateStrongPassword(updateForm.password)) {
        validForm = false;
        tempError.password =
          'Password must have at least 8 characters, 1 lowercase, 1 uppercase and 1 numeric character.';
      }

      if (updateForm.password !== updateForm.confirmPassword) {
        validForm = false;
        tempError.confirmPassword = 'Confirm password not the same.';
      }
    }

    if (validForm === true) {
      setError(errorState);
      setUpdateForm((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } else {
      setError(tempError);
    }
  };

  return (
    <Layout>
      {!isClient ? (
        <LuxuryLoader />
      ) : (
        <AccountLayout>
          <Breadcrumbs
            crumbs={[
              { link: '/', label: 'Home' },
              { link: '/account', label: 'Account' },
              { link: '/account/settings', label: 'Settings' },
            ]}
          />
          <h1>Settings (UI Purposes Only!)</h1>
          <div>
            <form onSubmit={(e) => handleSubmit(e)} noValidate>
              <div className={styles.nameSection}>
                <FormInputField
                  id={'firstName'}
                  value={updateForm.firstName}
                  handleChange={(id, e) => handleChange(id, e)}
                  type={'input'}
                  labelName={'First Name'}
                  readOnly
                />
                <FormInputField
                  id={'lastName'}
                  value={updateForm.lastName}
                  handleChange={(id, e) => handleChange(id, e)}
                  type={'input'}
                  labelName={'Last Name'}
                  readOnly
                />
                <FormInputField
                  id={'email'}
                  value={updateForm.email}
                  handleChange={(id, e) => handleChange(id, e)}
                  type={'email'}
                  labelName={'Email'}
                  error={error.email}
                  readOnly
                />
              </div>
              <div className={styles.passwordContainer}>
                <h2>Change Password</h2>
                <div className={styles.passwordSection}>
                  <FormInputField
                    id={'password'}
                    value={updateForm.password}
                    handleChange={(id, e) => handleChange(id, e)}
                    type={'password'}
                    labelName={'New Password'}
                    error={error.password}
                  />
                  <FormInputField
                    id={'confirmPassword'}
                    value={updateForm.confirmPassword}
                    handleChange={(id, e) => handleChange(id, e)}
                    type={'password'}
                    labelName={'Confirm Password'}
                    error={error.confirmPassword}
                  />
                  <Button level={'primary'} type={'submit'}>
                    update
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </AccountLayout>
      )}
    </Layout>
  );
};

export default SettingsPage;
