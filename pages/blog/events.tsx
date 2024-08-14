import React, { useEffect, useState } from 'react';

import { BlogList, BlogPageWrapper } from 'components/Blog';

import { fetchBlogs } from 'utils/storyblok';

const BlogEvents = ({ router }) => {
  const [latestBlogs, setLatestBlog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs({ Category: 'events' });
      setLatestBlog(data);
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="blog-page-container">
        <BlogPageWrapper title="Event Recaps">
          <div className="blog-latest-wrapper">
            <BlogList data={latestBlogs} />
          </div>
        </BlogPageWrapper>
      </div>
    </div>
  );
};

export default BlogEvents;
