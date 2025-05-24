import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

import BlogPreviewGrid from '../../components/BlogPreviewGrid';
import Container from '../../components/Container';
import Hero from '../../components/Hero';
import Layout from '../../components/Layout/Layout';
import ThemeLink from '../../components/ThemeLink';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import * as styles from './index.module.css';
import { toOptimizedImage } from '../../helpers/general';

const BlogPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]); 
  const [filteredBlogs, setFilteredBlogs] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('all'); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    setIsClient(true); // ensures client-side rendering
    const fetchBlogs = async () => {
      try {
        setLoading(true); // Start loading
        const res = await fetch(process.env.GATSBY_APP_GET_BLOG_CONTENT);
        const data = await res.json();

        const shuffled = data.sort(() => Math.random() - 0.5);

        setAllBlogs(shuffled);
        setFilteredBlogs(shuffled);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleFilter = (category) => {
    setLoading(true);
  
    setActiveCategory(category);
  
    if (category === 'all') {
      setFilteredBlogs(allBlogs);
    } else {
      const filtered = allBlogs.filter(
        (blog) => blog.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredBlogs(filtered);
    }
  
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  

  const handleArticleClick = (blog) => {
    setLoading(true);
    navigate(`/blog/${blog.urlPath}/`);
  };

  return (
    <Layout disablePaddingBottom>
      {loading || !isClient ? (
        <LuxuryLoader />
      ) : (   
        <div className={styles.root}>
          <Hero
            maxWidth={'400px'}
            image={toOptimizedImage('/blogCover.png')}
            title={`The new standard of Clothing...`}
          />

          <div className={styles.navContainer}>
            <ThemeLink
              as="button"
              onClick={() => handleFilter('all')}
              className={activeCategory === 'all' ? styles.active : ''}
            >
              All Posts
            </ThemeLink>
            <ThemeLink
              as="button"
              onClick={() => handleFilter('design')}
              className={activeCategory === 'design' ? styles.active : ''}
            >
              Design
            </ThemeLink>
            <ThemeLink
              as="button"
              onClick={() => handleFilter('collaboration')}
              className={activeCategory === 'collaboration' ? styles.active : ''}
            >
              Collaboration
            </ThemeLink>
            <ThemeLink
              as="button"
              onClick={() => handleFilter('interview')}
              className={activeCategory === 'interview' ? styles.active : ''}
            >
              Interview
            </ThemeLink>
            <ThemeLink
              as="button"
              onClick={() => handleFilter('news')}
              className={activeCategory === 'news' ? styles.active : ''}
            >
              News
            </ThemeLink>
          </div>

          <div className={styles.blogsContainer}>
            <Container size={'large'}>
              <BlogPreviewGrid
                data={filteredBlogs}
                hideReadMoreOnWeb
                showExcerpt
                onClick={handleArticleClick}
              />
            </Container>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BlogPage;