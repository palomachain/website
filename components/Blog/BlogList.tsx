import React from "react";
import Link from "next/link";

import { convertDateString2 } from "utils/date";

const BlogList = ({ data }) => (
  <>
    {data.map((blog, index) => (
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
  </>
);

export default BlogList;
