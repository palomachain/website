import React from "react";
import Link from "next/link";

import { convertDateString2 } from "utils/date";
import { truncate } from "utils/string";

const BlogList = ({ data }) => (
  <>
    {data.map((blog, index) => (
      <Link href={`/${blog.full_slug}`}>
        <div className="blog-latest-item" key={`blog-latest-${index}`}>
          <div className="blog-latest-image">
            <img src={`https:${blog.content.image}`} />
          </div>
          <div className="blog-latest-content">
            <div className="blog-latest-date">
              {convertDateString2(blog.content.published_date)}
            </div>
            <h3 className="blog-latest-title">{blog.content.title}</h3>
            <p className="blog-latest-intro">
              {truncate(blog.content.intro, 190)}
            </p>
            <div className="blog-latest-read">Read More...</div>
          </div>
        </div>
      </Link>
    ))}
  </>
);

export default BlogList;
