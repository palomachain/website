import React from 'react';

import RotatedHeader from 'components/RotatedHeader';
import { BlogCategory } from 'components/Blog';

const BlogPageWrapper = ({ title, children }) => (
  <React.Fragment>
    <BlogCategory />
    <RotatedHeader title={title} theme="dark" />
    {children}
  </React.Fragment>
);

export default BlogPageWrapper;
