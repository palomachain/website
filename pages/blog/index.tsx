import React, { useEffect, useState } from "react";
import Link from "next/link";

import { BlogLatestItem } from "components/Blog";

import { fetchBlogs } from "utils/storyblok";
import { convertDateString2 } from "utils/date";

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlog] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs();
      if (data.length > 0) {
        setBlog(data[0]);
      }

      if (data.length > 1) {
        const blogs = [];
        for (let i = 1; i < data.length; i++) {
          blogs.push(data[i]);
        }
        setLatestBlog(blogs);
      }
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      {blog !== null && (
        <div className="blog-page-container">
          <div className="blog-content">
            <div className="blog-featured-image">
              <img src={`https:${blog.content.image}`} />
            </div>
            <h1 className="blog-title">{blog.content.title}</h1>
            <div className="blog-summary">
              {blog.tag_list.map((tag, index) => (
                <div className="blog-summary-category" key={`blog-main-tage-${index}`}>{tag}</div>
              ))}
              <div className="blog-summary-pubtime">Published {convertDateString2(blog.first_published_at)}</div>
            </div>
            <div className="blog-intro">
              {blog.content.intro}
            </div>
            <Link href={`/${blog.full_slug}`}>
              <div className="blog-readmore">Read More</div>
            </Link>
          </div>
          <div className="blog-divider"></div>
          <div className="blog-latest-container">
            <h2>Latest Articles</h2>
            <div className="blog-latest-list">
              {latestBlogs.map((blog, index) => <BlogLatestItem key={`latest-blog-${index}`} blog={blog} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
