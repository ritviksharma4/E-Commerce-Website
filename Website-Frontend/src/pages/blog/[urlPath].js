import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Container from '../../components/Container';
import Blog from '../../components/Blog';
import LuxuryLoader from '../../components/Loading/LuxuriousLoader';
import * as styles from './dynamic.module.css';

const DynamicBlogPage = ({ params }) => {
  const { urlPath } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await fetch(process.env.GATSBY_APP_GET_BLOG_CONTENT, {
          method: 'POST',
          body: JSON.stringify({ articleName: urlPath }),
        });

        if (!res.ok) {
          console.error('Failed to fetch article:', res.statusText);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
          console.error('Empty or invalid JSON response:', data);
          setLoading(false);
          return;
        }

        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [urlPath]);

  if (loading) return <LuxuryLoader />;
  if (!article) return <div>Error loading article.</div>;

  return (
    <Layout>
      <div className={styles.root}>
        <Container>
          <div className={styles.blogContainer}>
            <Blog
              category={article.category}
              title={article.title}
              image={article.image}
              alt={article.alt}
            >
              <div className={styles.content}>
                {article.content.map((block, idx) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p key={idx} className={styles.blogParagraph}>
                        {block.text}
                      </p>
                    );
                  } else if (block.type === 'subheader') {
                    return (
                      <h2 key={idx} className={styles.blogSubHeader}>
                        {block.text}
                      </h2>
                    );
                  } else if (block.type === 'image') {
                    return (
                      <div key={idx} className={styles.imageContainer}>
                        <img src={block.src} alt={block.alt} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </Blog>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default DynamicBlogPage;