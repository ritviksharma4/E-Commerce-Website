import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { validateEmail, isEmpty } from '../helpers/general';
import * as styles from './login.module.css';
import AttributeGrid from '../components/AttributeGrid/AttributeGrid';
import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';
import { useCountdown } from '../hooks/useCountdown';

const LoginPage = () => {
  const initialState = { email: '', password: '' };
  const errorState = { email: '', password: '' };

  const [loginForm, setLoginForm] = useState(initialState);
  const [errorForm, setErrorForm] = useState(errorState);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGuestLoginLoading, setIsGuestLoginLoading] = useState(false);
  const [waitTime, setWaitTime] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [hasUsedGuestLogin, setHasUsedGuestLogin] = useState(false);

  const { timeLeft, startCountdown, stopCountdown } = useCountdown(waitTime);

const handleChange = (id, e) => {
  setLoginForm({ ...loginForm, [id]: e });
};

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

  const handleSubmit = (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorForm };

    if (!validateEmail(loginForm.email)) {
      tempError.email = 'Please use a valid email address, such as user@example.com.';
      validForm = false;
    } else tempError.email = '';

    if (isEmpty(loginForm.password)) {
      tempError.password = 'Field required';
      validForm = false;
    } else tempError.password = '';

    if (validForm) {
      setErrorForm(errorState);

      // Mock login
      if (loginForm.email !== 'error@example.com') {
        navigate('/account');
        window.localStorage.setItem('key', 'sampleToken');
      } else {
        window.scrollTo(0, 0);
        setErrorMessage('There is no such account associated with this email address');
      }
    } else {
      setErrorMessage('');
      setErrorForm(tempError);
    }
  };

  const getGuestLogin = async () => {
    setIsGuestLoginLoading(true);
    try {
      const lambdaUrl = process.env.GATSBY_APP_GET_GUEST_LOGIN_ENDPOINT;
      const response = await fetch(lambdaUrl);
      const data = await response.json();

      if (data.email) {
        setLoginForm({ email: data.email, password: data.password });
        setHasUsedGuestLogin(true); // Disable the button
      } else if (data.waitTime) {
        setWaitTime(data.waitTime);
        setIsWaiting(true);
        startCountdown();
      }
    } catch (error) {
      console.error('Error fetching guest login:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsGuestLoginLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      stopCountdown();
      setIsWaiting(false);
      setWaitTime(null);
    }
  }, [timeLeft, stopCountdown]);

  return (
    <Layout disablePaddingBottom={true}>
      <div className={`${styles.errorContainer} ${errorMessage !== '' ? styles.show : ''}`}>
        <span className={styles.errorMessage}>{errorMessage}</span>
      </div>

      <div className={styles.root}>
        <div className={styles.loginFormContainer}>
          <h1 className={styles.loginTitle}>Login</h1>
          <span className={styles.subtitle}>Please enter your e-mail and password</span>

          {/* Guest Wait Timer Popup */}
          {isWaiting && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupContent}>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    stopCountdown();
                    setIsWaiting(false);
                  }}
                >
                  ×
                </button>
                <div className={styles.countdownClock}>⏳</div>
                <div className={styles.timerText}>
                  All guest accounts are currently in use.
                  <br />
                  Please wait {formatTime(timeLeft)} to try again.
                </div>
              </div>
            </div>
          )}

          <form noValidate className={styles.loginForm} onSubmit={handleSubmit}>
            <FormInputField
              id="email"
              value={loginForm.email}
              handleChange={handleChange}
              type="email"
              labelName="Email"
              error={errorForm.email}
              disabled={isWaiting}
            />

            <FormInputField
              id="password"
              value={loginForm.password}
              handleChange={handleChange}
              type="password"
              labelName="Password"
              error={errorForm.password}
              disabled={isWaiting}
              readOnly={false}
              onFocus={(e) => e.target.select()}
              onCopy={(e) => e.preventDefault()}
            />

            <Button fullWidth type="submit" level="primary" disabled={isWaiting}>
              LOG IN
            </Button>

            <Button
              type="button"
              onClick={getGuestLogin}
              fullWidth
              level="secondary"
              disabled={isWaiting || isGuestLoginLoading || hasUsedGuestLogin}
            >
              Get Guest Login
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

export default LoginPage;