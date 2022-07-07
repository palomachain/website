import React, { useEffect, useState } from "react";
import Link from "next/link";

import RotatedHeader from "components/RotatedHeader";
import { BlogList } from "components/Blog";

import { fetchBlogs, filterBlogs } from "utils/storyblok";
import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.MIXPANEL_API_KEY)

const blogSubMenus = [
  {
    image: "/assets/blog/project-updates.png",
    title: (
      <span>
        PROJECT
        <br />
        UPDATES
      </span>
    ),
    link: "/blog/project-updates",
  },
  {
    image: "/assets/blog/ama.png",
    title: <span>AMAS</span>,
    link: "/blog/amas",
  },
  {
    image: "/assets/blog/blockchain-culture.png",
    title: (
      <span>
        BLOCKCHAIN
        <br />
        CULTURE
      </span>
    ),
    link: "/blog/blockchain-culture",
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
        <RotatedHeader
          title="Blog"
          rightImage="/assets/blog/blog.png"
          theme="light"
        />

        <div className="blog-page-images">
          {blogSubMenus.map((menu, index) => (
            <Link href={menu.link} key={`blog-submenu-${index}`}>
              <div className="blog-page-image">
                <img src={menu.image} />
                {menu.title}
              </div>
            </Link>
          ))}
        </div>

        <RotatedHeader
          title="The Latest"
          leftImage="/assets/blog/latest.png"
          theme="light"
        />

        <div className="blog-latest-wrapper">
          <BlogList data={latestBlogs} />
        </div>
      </div>
    </div>
  );
};

export default Blog;
