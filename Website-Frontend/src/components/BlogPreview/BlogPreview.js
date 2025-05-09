import React from 'react';
import { navigate } from 'gatsby';
import * as styles from './BlogPreview.module.css';
import { toOptimizedImage } from '../../helpers/general';

const BlogPreview = (props) => {
  const { 
    image, 
    altImage, 
    title, 
    link, 
    category, 
    showExcerpt, 
    excerpt,
    onClick 
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(link);
    }
  };

  return (
    <div className={styles.root} onClick={handleClick} style={{ cursor: 'pointer' }}>
      
      <div className={styles.imageWrapper}>
        <img
          className={styles.blogPreviewImage}
          alt={altImage}
          src={toOptimizedImage(image)}
          role={'figure'}
        />
      </div>

      <span className={styles.category}>{category}</span>

      <h4 className={styles.title}>{title}</h4>

      {showExcerpt && <p className={styles.excerpt}>{excerpt}</p>}
    </div>
  );
};

export default BlogPreview;