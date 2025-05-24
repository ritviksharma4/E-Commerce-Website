import React, { useEffect, useRef } from 'react';

import Container from '../components/Container';
import Hero from '../components/Hero';
import ThemeLink from '../components/ThemeLink';
import Layout from '../components/Layout/Layout';

import * as styles from './about.module.css';
import { toOptimizedImage } from '../helpers/general';

const AboutPage = () => {
  const historyRef = useRef(null);
  const valuesRef = useRef(null);
  const sustainabilityRef = useRef(null);

  const handleScroll = (ref) => {
    if (ref?.current) {
      const offset = window.innerWidth <= 900 ? 0 : -250;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + offset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  };

  const useScrollToHash = (sectionsMap, desktopOffset = 0) => {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        const ref = sectionsMap[hash];

        if (ref?.current) {
          const isMobile = window.innerWidth <= 900;
          const offset = isMobile ? 0 : desktopOffset;

          const y = ref.current.getBoundingClientRect().top + window.pageYOffset + offset;

          // Delay ensures elements are painted
          setTimeout(() => {
            window.scrollTo({ top: y, behavior: 'smooth' });
          }, 200);
        }
      }
    }, [sectionsMap, desktopOffset]);
  };

  useScrollToHash(
    {
      history: historyRef,
      values: valuesRef,
      sustainability: sustainabilityRef,
    },
    -250
  );

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <Hero
          maxWidth={'900px'}
          image={'/about.png'}
          title={`Velvét \n An India brand since 1860`}
        />

        <div className={styles.navContainer}>
          <ThemeLink onClick={() => handleScroll(historyRef)} to={'#history'}>
            History
          </ThemeLink>
          <ThemeLink onClick={() => handleScroll(valuesRef)} to={'#values'}>
            Values
          </ThemeLink>
          <ThemeLink onClick={() => handleScroll(sustainabilityRef)} to={'#sustainability'}>
            Sustainability
          </ThemeLink>
        </div>

        <Container size={'large'} spacing={'min'}>
          <div className={styles.detailContainer} ref={historyRef}>
            <div className={styles.historyImageContainer}>
              <img alt={'our heritage'} src={toOptimizedImage('/RitvikSharma.JPG')} />
            </div>
            <div className={styles.historyTextContainer}>
              <p>
                Founded in 1860 by Ritvik Sharma, Velvét is an innovative Indian brand with a
                contemporary edge. We make timeless everyday luxury clothing.
              </p>
              <br />
              <br />
              <p>
                We created some of the world's first T-shirts and spent decades perfecting the feel
                of the cotton. Today we are the only brand that makes T-shirts in its own factory in
                India. And we do this in the same factory we have occupied since 1937.
              </p>
            </div>
          </div>
        </Container>

        <div className={styles.imageContainer}>
          <img alt={'shirt brand'} src={toOptimizedImage('/about1.png')} />
        </div>

        <Container size={'large'} spacing={'min'}>
          <div className={styles.content}>
            <h3>Our Values</h3>
            <div ref={valuesRef}>
              <p>
                Velvét produced some of the world's earliest T-shirts. In the late 1800s the
                business made luxury tunics and undershirts from lightweight Sea Island cotton for
                export to the Far East and other warm climates. While these garments initially had
                silk buttoned plackets, these were removed in the early 1900s and replaced with
                simple bound necks to reduce manufacturing costs - creating the T-shirt. We've
                supplied the world as the T-shirt has evolved from underwear to outerwear, from
                symbol of youthful rebellion to everyday wardrobe staple, and we've spent decades
                refining its every last aspect.
              </p>
              <ol>
                <li>Be an ecowear</li>
                <li>Sophisticated and not mass-produced</li>
                <li>Only natural materials</li>
              </ol>
              <img alt={'founder'} src={toOptimizedImage('/about2.png')} />
            </div>

            <h3>Sustainability</h3>
            <div id="sustainability" ref={sustainabilityRef}>
              <p>
                Our founder, Ritvik Sharma, had both an eye for quality and a desire to innovate. As
                well as using the finest fibres such as Sea Island cotton, cashmere and silk, he
                invented his own fabrics. Velvét continues this commitment to innovation today and
                our unique fabrics include: Q100 Sea Island cotton, Q82 Supima cotton, Q75 warp knit
                mesh cotton and Q14 warp knit cellular cotton. The technology behind these fabrics
                remains unchanged today and all Velvét products use the finest cottons, wools and
                fibres.
              </p>
              <p>
                Made in Ahmedabad, India and crafted from our luxurious long staple Supima cotton
                for unparalleled softness, comfort and durability, the Velvét T-shirt has a classic
                fit and only the most essential details.
              </p>
              <p>
                With over 100 years spent perfecting fabric, fit and style, the Velvét Classic
                T-shirt is recognised as the finest in the world.
              </p>
            </div>
          </div>
        </Container>

        <div className={styles.imageContainer}>
          <img alt={'shirt backwards'} src={toOptimizedImage('/about3.png')} />
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;