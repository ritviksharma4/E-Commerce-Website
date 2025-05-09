import React from 'react';
import * as styles from './Policy.module.css';

const Policy = (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h3>1. Privacy Policy</h3>
        <p>
          India limited company (The Velvét) collects personal
          information that you voluntarily provide when applying or registering
          for an account.
        </p>
        <p>
          This Privacy Policy (Privacy Policy) outlines how your information is
          collected, used and disclosed when you access or use our Services as
          defined in our Terms. This information is collected, used and
          disclosed in accordance with the Privacy Act 1988 (Cth) (Privacy Act).{' '}
        </p>
        <p>
          This Privacy Policy is incorporated by reference into our Terms. Any
          capitalized terms not defined in this Policy are defined in the Terms.
          You agree to comply with all Terms when accessing or using our
          Services, including this Privacy Policy.
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Your Information is Secure</h3>
        <p>
          Our Services, including but not limited to the registration of an
          account with us or placing of an order, is not intended to be used by
          children under the age of 13. When a visitor indicates an age under
          13, the registration process for The Upside website cannot be
          completed, and no personally identifying information is collected in
          conjunction with that attempted submission except that we retain
          e-mail addresses of such persons (and record of access attempts) for
          purposes of denying registration. Otherwise, we do not knowingly
          collect personally identifiable information from visitors under the
          age of 13.
        </p>
        <p>
          If you are under 18, any use of our Services must be with the
          involvement of a parent or guardian. By accessing or using our
          Website, you warrant and represent to us that you are over the age of
          18 years and you have the right, authority and legal capacity to enter
          into a legally binding agreement and to abide by this Privacy Policy.{' '}
        </p>
        <p>
          The Velvét collects, uses and discloses information regarding users
          aged 13-18 in the same manner as it does for adults.{' '}
        </p>
      </div>
    </div>
  );
};

export default Policy;
