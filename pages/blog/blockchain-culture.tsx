import React, { useEffect, useState } from "react";

import RotatedHeader from "components/RotatedHeader";
import { BlogList } from "components/Blog";

import { fetchBlogs, filterBlogs } from "utils/storyblok";

const BlogBlockchainCulture = () => {
  const [latestBlogs, setLatestBlog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs();
      setLatestBlog(filterBlogs(data, "blockchain_culture"));
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="blog-page-container">
        <RotatedHeader
          title="Blockchain Culture"
          rightImage="/assets/blog/blockchain-culture.png"
          theme="dark"
        />

        <div className="blog-latest-wrapper">
          <BlogList data={latestBlogs} />
        </div>
      </div>
    </div>
  );
};

export default BlogBlockchainCulture;
