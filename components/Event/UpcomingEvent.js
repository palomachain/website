import React, { useEffect, useMemo } from "react";
import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer";

import { convertDateStringWithWeekDay } from "utils/date";
import {getCookie} from "cookies-next";

// import mixpanel from "mixpanel-browser";
// mixpanel.init(process.env.MIXPANEL_API_KEY)

const UpcomingEvent = ({ data }) => {
  let regClicked = false;

  useEffect(() => {
    window.$ = window.jQuery = require('jquery');
    $("#event-register").click(function() {
      if(!regClicked) {
        regClicked = true;
        const ignore = getCookie('ignore');

        if(!ignore) {
          mixpanel.track('REGISTER_EVENT', {
            title: $(this).attr('title'),
            url: $(this).attr('href'),
            slug: $(this).attr('slug'),
          });
        }
        window.location = $(this).attr('href');
      }
    });
  })

  const eventLink = useMemo(() => {
    const link = {
      register: "",
      register_info: null,
      learnMore: "",
      learnMore_info: null,
    };

    if ("RegistrationLink" in data.content) {
      link.register = data.content.RegistrationLink.url;
      link.register_info = data.content.RegistrationLink;
    }

    if ("LearnMore" in data.content) {
      link.learnMore = data.content.LearnMore.url;
      link.learnMore_info = data.content.LearnMore;
    }

    return link;
  }, [data]);

  return (
    <div className="event-item-container upcoming">
      <img src={`https:${data.content.Image}`} className="event-image" />
      <div className="event-section">
        <div className="event-date">
          {convertDateStringWithWeekDay(data.content.EventTime, true)}
        </div>
        {/* <div className="event-title">{data.content.Title}</div> */}
        <div className="event-location">
          <img src="/assets/events/placeholder.png" />
          <span>{data.content.Location}</span>
        </div>

        <div className="event-description">
          {render(data.content.Description, {
            nodeResolvers: {
              [NODE_IMAGE]: (children, props) => (
                <img
                  {...props}
                  style={{ borderRadius: "0px", maxWidth: "100%" }}
                />
              ),
            },
            blokResolvers: {
              ["YouTube-blogpost"]: (props) => (
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe
                    className="embed-responsive-item"
                    src={
                      "https://www.youtube.com/embed/" +
                      props.YouTube_id.replace("https://youtu.be/", "")
                    }
                  ></iframe>
                </div>
              ),
            },
          })}
        </div>
        <div className="event-spacer"></div>
        <div className="event-buttons">
          {eventLink.register !== "" && (
            <a
              href={eventLink.register}
              id="event-register"
              className="event-register"
              title={data.content.Title}
              slug={data.slug}
              target="_blank"
            >
              Register
            </a>
          )}
          {eventLink.learnMore !== "" && (
            <a
              href={eventLink.learnMore}
              className="event-register"
              target="_blank"
            >
              Learn More
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
