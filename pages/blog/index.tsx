import React, { useEffect, useState } from "react";

import { BlogList, BlogPageWrapper } from "components/Blog";

import { fetchBlogs, filterBlogs } from "utils/storyblok";
import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.MIXPANEL_API_KEY);

const Blog = () => {
  const [latestBlogs, setLatestBlog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs();
      setLatestBlog(filterBlogs(data));
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="blog-page-container">
        <BlogPageWrapper title="The Latest">
          <div className="blog-latest-wrapper">
            <BlogList data={latestBlogs} />
          </div>
        </BlogPageWrapper>
      </div>
    </div>
  );
};

export default Blog;
