import React, { useState } from 'react';
import { navigate } from 'gatsby';
import {
  validateEmail,
  validateStrongPassword,
  isEmpty,
} from '../helpers/general';
import * as styles from './signup.module.css';

import AttributeGrid from '../components/AttributeGrid/AttributeGrid';
import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';

const SignupPage = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const errorState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const [signupForm, setSignupForm] = useState(initialState);
  const [errorForm, setErrorForm] = useState(errorState);

  const handleChange = (id, e) => {
    setSignupForm(prev => ({ ...prev, [id]: e }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorState };

    if (isEmpty(signupForm.firstName)) {
      tempError.firstName = 'Field required';
      validForm = false;
    }

    if (isEmpty(signupForm.lastName)) {
      tempError.lastName = 'Field required';
      validForm = false;
    }

    if (!validateEmail(signupForm.email)) {
      tempError.email =
        'Please use a valid email address, such as user@example.com.';
      validForm = false;
    }

    if (!validateStrongPassword(signupForm.password)) {
      tempError.password =
        'Password must have at least 8 characters, 1 lowercase, 1 uppercase and 1 numeric character.';
      validForm = false;
    }

    if (validForm) {
      setErrorForm(errorState);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('key', 'sampleToken');
      }
      navigate('/accountSuccess');
    } else {
      setErrorForm(tempError);
    }
  };

  return (
    <Layout disablePaddingBottom={true}>
      <div className={styles.root}>
        <div className={styles.signupFormContainer}>
          <h1 className={styles.title}>Create Account</h1>
          <span className={styles.subtitle}>
            Please enter your the information below:
          </span>
          <form
            noValidate
            className={styles.signupForm}
            onSubmit={handleSubmit}
          >
            <FormInputField
              id="firstName"
              value={signupForm.firstName}
              handleChange={handleChange}
              type="input"
              labelName="First Name"
              error={errorForm.firstName}
            />

            <FormInputField
              id="lastName"
              value={signupForm.lastName}
              handleChange={handleChange}
              type="input"
              labelName="Last Name"
              error={errorForm.lastName}
            />

            <FormInputField
              id="email"
              value={signupForm.email}
              handleChange={handleChange}
              type="email"
              labelName="Email"
              error={errorForm.email}
            />

            <FormInputField
              id="password"
              value={signupForm.password}
              handleChange={handleChange}
              type="password"
              labelName="Password"
              error={errorForm.password}
            />

            <Button fullWidth type="submit" level="primary">
              create account
            </Button>
            <span className={styles.reminder}>Have an account?</span>
            <Button
              type="button"
              onClick={() => navigate('/login')}
              fullWidth
              level="secondary"
            >
              log in
            </Button>
          </form>
        </div>

        <div className={styles.attributeGridContainer}>
          <AttributeGrid />
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;