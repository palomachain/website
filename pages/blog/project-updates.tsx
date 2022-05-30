import React, { useEffect, useState } from "react";

import RotatedHeader from "components/RotatedHeader";
import { BlogList } from "components/Blog";

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
        <div
          className="sub-nav-bar"
          onClick={(e) => {
            router.back();
          }}
        >
          <div className="link-back-to">
            <img src="/assets/arrows/arrow-left.png" />
            <span>Blog</span>
          </div>
        </div>
        <RotatedHeader
          title="Project Updates"
          rightImage="/assets/blog/project-updates.png"
          theme="dark"
        />

        <div className="blog-latest-wrapper">
          <BlogList data={latestBlogs} />
        </div>
      </div>
    </div>
  );
};

export default BlogProjectUpdates;
