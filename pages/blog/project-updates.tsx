import React, { useEffect, useState } from "react";

import { BlogList, BlogPageWrapper } from "components/Blog";

import { fetchBlogs, filterBlogs } from "utils/storyblok";

const BlogProjectUpdates = ({ router }) => {
  const [latestBlogs, setLatestBlog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs();
      setLatestBlog(filterBlogs(data, "project_updates"));
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="blog-page-container">
        <BlogPageWrapper title="Project Developments">
          <div className="blog-latest-wrapper">
            <BlogList data={latestBlogs} />
          </div>
        </BlogPageWrapper>
      </div>
    </div>
  );
};

export default BlogProjectUpdates;
