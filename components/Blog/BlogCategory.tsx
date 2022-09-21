import React from "react";
import Link from "next/link";

import cn from "classnames";

const blogSubMenus = [
  {
    image: "/assets/blog/announcement.png",
    imageHovered: "/assets/blog/announcement-selected.png",
    title: (
      <span>
        News and <br />
        Announcements
      </span>
    ),
    link: "/blog/announcements",
    size: "",
  },
  {
    image: "/assets/blog/project-updates.png",
    imageHovered: "/assets/blog/project-updates-selected.png",
    title: (
      <span>
        Project
        <br />
        Developments
      </span>
    ),
    link: "/blog/project-updates",
    size: "small",
  },
  {
    image: "/assets/blog/ama.png",
    imageHovered: "/assets/blog/ama-selected.png",
    title: (
      <span>
        Event
        <br />
        Recaps
      </span>
    ),
    link: "/blog/events",
    size: "",
  },
];

const BlogCategory = () => (
  <div className="blog-page-images">
    {blogSubMenus.map((menu, index) => (
      <Link href={menu.link} key={`blog-submenu-${index}`}>
        <div className="blog-page-image">
          <img className={cn("normal", menu.size)} src={menu.image} />
          <img className={cn("hovered", menu.size)} src={menu.imageHovered} />
          <span>{menu.title}</span>
        </div>
      </Link>
    ))}
  </div>
);

export default BlogCategory;
