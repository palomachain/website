import React from "react";
import Link from 'next/link';

import { convertDateString2 } from "utils/date";

const BlogLatestItem = ({ blog }) => (
  <div className="blog-latest-item">
    <div className="blog-latest-image">
      {" "}
      <img src={`https:${blog.content.image}`} />
    </div>
    <Link href={`/${blog.full_slug}`}>
      <h3 className="blog-latest-title">{blog.content.title}</h3>
    </Link>
    <div className="blog-latest-summary">
      {blog.tag_list.map((tag, index) => (
        <div
          className="blog-latest-summary-category"
          key={`blog-latest-${blog.content.uuid}-tag-${index}`}
        >
          {tag}
        </div>
      ))}
      <div className="blog-latest-summary-pubtime">{`Published ${convertDateString2(blog.first_published_at)}`}</div>
    </div>
  </div>
);

export default BlogLatestItem;
