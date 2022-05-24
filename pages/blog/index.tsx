import React, { useEffect, useState } from "react";
import Link from "next/link";

import RotatedHeader from "components/RotatedHeader";

import { fetchBlogs } from "utils/storyblok";
import { convertDateString2 } from "utils/date";

const LATEST_BLOG_SHOW_CNT = 3;

const Blog = () => {
  const [latestBlogs, setLatestBlog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs();

      if (data.length > 1) {
        const blogs = [];

        const length =
          data.length <= LATEST_BLOG_SHOW_CNT
            ? data.length
            : LATEST_BLOG_SHOW_CNT;

        for (let i = 1; i < length; i++) {
          blogs.push(data[i]);
        }
        setLatestBlog(blogs);
      }
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="blog-page-container">
        <RotatedHeader title="Blog" rightImage="/assets/blog/blog.png" theme="light" />

        <div className="blog-page-images">
          <div className="blog-page-image">
            <img src="/assets/blog/project-updates.png" />
            <span>
              PROJECT
              <br />
              UPDATES
            </span>
          </div>
          <div className="blog-page-image">
            <img src="/assets/blog/ama.png" />
            <span>AMAS</span>
          </div>
          <div className="blog-page-image">
            <img src="/assets/blog/blockchain-culture.png" />
            <span>
              BLOCKCHAIN
              <br />
              CULTURE
            </span>
          </div>
        </div>

        <RotatedHeader title="The Latest" leftImage="/assets/blog/latest.png" theme="light" />

        <div className="blog-latest-wrapper">
          {latestBlogs.map((blog, index) => (
            <div className="blog-latest-item" key={`blog-latest-${index}`}>
              <div className="blog-latest-date">
                {convertDateString2(blog.first_published_at)}
              </div>
              <img
                className="blog-latest-image"
                src={`https:${blog.content.image}`}
              />
              <Link href={`/${blog.full_slug}`}>
                <h3 className="blog-latest-title">{blog.content.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
