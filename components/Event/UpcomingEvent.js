import React, {useEffect, useMemo} from "react";

import { convertDateStringWithWeekDay } from "utils/date";

// import mixpanel from "mixpanel-browser";
// mixpanel.init(process.env.MIXPANEL_API_KEY)

const UpcomingEvent = ({ data }) => {
  let regClicked = false;
  useEffect(() => {
    window.$ = window.jQuery = require('jquery');
    $("#event-register").click(function() {
      if(!regClicked) {
        regClicked = true;
        mixpanel.track('REGISTER_EVENT', {
          title: data.content.Title,
          url: data.content.RegistrationLink.url,
          slug: data.slug,
        });
        window.location = eventLink.register;
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
    <div className="event-item-container">
      <img src={`https:${data.content.Image}`} className="event-image" />
      <div className="event-section">
        <div className="event-date">
          {convertDateStringWithWeekDay(data.content.EventTime, true)}
        </div>
        <div className="event-title">{data.content.Title}</div>
        <div className="event-spacer"></div>
        <div className="event-location">
          <img src="/assets/events/placeholder.png" />
          <span>{data.content.Location}</span>
        </div>
        <div className="event-description">{data.content.Description}</div>
        <div className="event-buttons">
          {eventLink.register !== "" && (
            <a
                id="event-register"
                className="event-register"
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
