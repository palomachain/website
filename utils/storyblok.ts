import StoryblokClient from "storyblok-js-client";

import { LATEST_BLOG_SHOW_CNT } from "./constants";

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
});

export const fetchBlogs = async () => {
  const blogs = [];
  var response = await Storyblok.get("cdn/stories/", {
    starts_with: "blog/",
  });

  for (const story of response.data.stories) {
    if (story.published_at != null) {
      if (
        story.full_slug.startsWith("blog/") &&
        !story.full_slug.endsWith("blog/")
      ) {
        blogs.push(story);
      }
    }
  }

  blogs.sort((a, b) => {
    const aTimestamp = Date.parse(a.first_published_at);
    const bTimestamp = Date.parse(b.first_published_at);

    return aTimestamp > bTimestamp ? -1 : 1;
  });

  return blogs;
};

export const fetchEvents = async () => {
  const events = [];
  var response = await Storyblok.get("cdn/stories/", {
    starts_with: "events/",
  });

  for (const story of response.data.stories) {
    if (story.published_at != null) {
      if (
        story.full_slug.startsWith("events/") &&
        !story.full_slug.endsWith("events/")
      ) {
        events.push(story);
      }
    }
  }

  return events;
};

export const filterBlogs = (eventList, category = "") => {
  const blogs = eventList.filter((event) => {
    if (category === "") {
      return true;
    }

    if ("Category" in event.content) {
      return event.content.Category === category;
    }

    return false;
  });

  blogs.sort((a, b) => {
    const aTime = Date.parse(a.first_published_at);
    const bTime = Date.parse(b.first_published_at);

    return aTime > bTime ? -1 : 1;
  });

  return blogs.slice(0, LATEST_BLOG_SHOW_CNT);
};
