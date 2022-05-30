import React, { useEffect, useState } from "react";

import RotatedHeader from "components/RotatedHeader";
import { BlogList } from "components/Blog";

import { fetchBlogs, filterBlogs } from "utils/storyblok";

const BlogAmas = ({ router }) => {
  const [latestBlogs, setLatestBlog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs();
      setLatestBlog(filterBlogs(data, "amas"));
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
          title="AMAS"
          rightImage="/assets/blog/ama.png"
          theme="dark"
        />

        <div className="blog-latest-wrapper">
          <BlogList data={latestBlogs} />
        </div>
      </div>
    </div>
  );
};

export default BlogAmas;
