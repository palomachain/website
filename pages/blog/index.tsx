import React, { useEffect, useState } from "react";
import Link from "next/link";

import RotatedHeader from "components/RotatedHeader";
import { BlogList } from "components/Blog";

import { fetchBlogs, filterBlogs } from "utils/storyblok";
import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.MIXPANEL_API_KEY);

const blogSubMenus = [
  
  {
    image: "/assets/blog/announcement.png",
    imageHovered: "/assets/blog/announcement-selected.png",
    title: <span>News and <br/>Announcements</span>,
    link: "/blog/announcements",
  },
  {
    image: "/assets/blog/project-updates.png",
    imageHovered: "/assets/blog/project-updates-selected.png",
    title: <span>Project<br/>Developments</span>,
    link: "/blog/project-updates",
  },
  {
    image: "/assets/blog/ama.png",
    imageHovered: "/assets/blog/ama-selected.png",
    title: <span>Events<br/>Recaps</span>,
    link: "/blog/events",
  },
];

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
        <div className="blog-page-images">
          {blogSubMenus.map((menu, index) => (
            <Link href={menu.link} key={`blog-submenu-${index}`}>
              <div className="blog-page-image">
                <img className="normal" src={menu.image} />
                <img className="hovered" src={menu.imageHovered} />
                <span>{menu.title}</span>
              </div>
            </Link>
          ))}
        </div>

        <RotatedHeader title="The Latest" theme="dark" />

        <div className="blog-latest-wrapper">
          <BlogList data={latestBlogs} />
        </div>
      </div>
    </div>
  );
};

export default Blog;
