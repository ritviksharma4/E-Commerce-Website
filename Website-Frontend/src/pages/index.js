import * as React from 'react';
import { useEffect, useState } from 'react';
import AttributeGrid from '../components/AttributeGrid';
import Container from '../components/Container';
import Hero from '../components/Hero';
import BlogPreviewGrid from '../components/BlogPreviewGrid';
import Highlight from '../components/Highlight';
import Layout from '../components/Layout/Layout';
import ProductCollectionGrid from '../components/ProductCollectionGrid';
import LuxuryLoader from '../components/Loading/LuxuriousLoader';
import Quote from '../components/Quote';
import Title from '../components/Title';

import * as styles from './index.module.css';
import { Link, navigate } from 'gatsby';
import { toOptimizedImage } from '../helpers/general';

const currentYear = new Date().getFullYear();

const IndexPage = () => {

  const [blogData, setBlogData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  

  useEffect(() => {
      const fetchBlogs = async () => {
        try {
          setLoading(true);
          const res = await fetch(process.env.GATSBY_APP_GET_BLOG_CONTENT);
          const data = await res.json();
  
          const shuffled = data.sort(() => Math.random() - 0.5);
  
          setBlogData(shuffled.slice(0, 3));
        } catch (error) {
          console.error('Error fetching blogs:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchBlogs();
    }, []);

    const goToSustainability = () => {
    navigate('/about/#sustainability');
  };

  const handleArticleClick = (blog) => {
      console.log("111111111111")
      setLoading(true);
      console.log("In handle Article Click for main page: ", blog)
      navigate(`/blog/${blog.urlPath}/`);
  };

  return (
    <Layout disablePaddingBottom>
      {loading ? (
        <LuxuryLoader />
      ) : (
        <div className={styles.root}>
          {/* Hero Container */}
          <Hero
            maxWidth={'500px'}
            image={'/banner1.png'}
            title={'Timeless Style, Every Season'}
            subtitle={`Discover a New You for ${currentYear} here at Velvét`}
          />

          {/* Message Container */}
          <div className={styles.messageContainer}>
            <p>
              This E-Commerce Website is a work of{' '}
              <span className={styles.gold}>Ritvk Sharma.</span>
            </p>
            <p>
              wear by <span className={styles.gold}>Velvét</span> and{' '}
              <span className={styles.gold}>scotch&soda</span>
            </p>
          </div>

          {/* Collection Container */}
          <div className={styles.collectionContainer}>
            <Container size={'large'}>
              <Title name={'New Collection'} />
              <ProductCollectionGrid />
            </Container>
          </div>

          {/* New Arrivals */}
          {/* <div className={styles.newArrivalsContainer}>
            <Container>
              <Title name={'New Arrivals'} link={'/'} textLink={'view all'} />
              <ProductCardGrid
                spacing={true}
                showSlider
                height={480}
                columns={3}
                data={newArrivals}
              />
            </Container>
          </div> */}

          {/* Highlight  */}
          <div className={styles.highlightContainer}>
            <Container size={'large'} fullMobile>
              <Highlight
                image={'/highlight.png'}
                altImage={'highlight image'}
                miniImage={'/highlightmin.png'}
                miniImageAlt={'mini highlight image'}
                title={'Luxury Knitwear'}
                description={`This soft lambswool jumper is knitted in Scotland, using yarn from one of the world's oldest spinners based in Fife`}
                textLink={'shop now'}
                link={'/shop/men/sweatshirts-and-hoodies'}
              />
            </Container>
          </div>

          {/* Promotion */}
          <div className={styles.promotionContainer}>
            <Hero image={toOptimizedImage('/banner2.png')} title={`-50% off \n All Accessories`} />
            <div className={styles.linkContainers}>
              <Link to={'/shop/accessories'}>WOMEN</Link>
              <Link to={'/shop/accessories'}>MEN</Link>
            </div>
          </div>

          {/* Quote */}
          <Quote
            bgColor={'var(--standard-light-grey)'}
            title={'about Velvét'}
            quote={
              '“We believe in two things: the pursuit of quality in everything we do, and looking after one another. Everything else should take care of itself.”'
            }
          />

          {/* Blog Grid */}
          <div className={styles.blogsContainer}>
            <Container size={'large'}>
              <Title name={'Journal'} subtitle={'Notes on life and style'} />
              <BlogPreviewGrid
                data={blogData}
                hideReadMoreOnWeb
                showExcerpt
                onClick={handleArticleClick}
              />
            </Container>
          </div>

          {/* Promotion */}
          <div className={styles.sustainableContainer}>
            <Hero
              image={toOptimizedImage('/banner3.png')}
              title={'We are Sustainable'}
              subtitle={
                'From caring for our land to supporting our people, discover the steps we’re taking to do more for the world around us.'
              }
              ctaText={'read more'}
              maxWidth={'660px'}
              ctaStyle={styles.ctaCustomButton}
              ctaAction={goToSustainability}
            />
          </div>

          {/* Social Media */}
          <div className={styles.socialContainer}>
            <Title
              name={'Styled by You'}
              subtitle={'Tag @velvét to be featured.'}
            />
            <div className={styles.socialContentGrid}>
              <img src={toOptimizedImage(`/social/socialMedia1.png`)} alt={'social media 1'} />
              <img src={toOptimizedImage(`/social/socialMedia2.png`)} alt={'social media 2'} />
              <img src={toOptimizedImage(`/social/socialMedia3.png`)} alt={'social media 3'} />
              <img src={toOptimizedImage(`/social/socialMedia4.png`)} alt={'social media 4'} />
            </div>
          </div>
          <AttributeGrid />
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;