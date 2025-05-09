import React from 'react';
import * as styles from './BlogPreviewGrid.module.css';

import BlogPreview from '../BlogPreview';

const BlogPreviewGrid = (props) => {
  const { data, hideReadMoreOnWeb, showExcerpt, ctaAction, onClick } = props;
  const clickHandler = ctaAction || onClick;
  return (
    <div className={styles.root}>
      {data &&
        data.map((blog, index) => {
          return (
            <BlogPreview
              key={index}
              image={blog.image}
              altImage={blog.alt}
              title={blog.title}
              link={blog.urlPath}
              category={blog.category}
              excerpt={blog.excerpt}
              hideReadMoreOnWeb={hideReadMoreOnWeb}
              showExcerpt={showExcerpt}
              onClick={() => clickHandler && clickHandler(blog)}
            />
          );
        })}
    </div>
  );
};

export default BlogPreviewGrid;
