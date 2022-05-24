import React, { useMemo } from "react";

import { convertDateStringWithWeekDay } from "utils/date";

const UpcomingEvent = ({ data }) => {
  const eventLink = useMemo(() => {
    const link = {
      register: "",
      learnMore: "",
    };

    if ("RegistrationLink" in data.content) {
      link.register = data.content.RegistrationLink.url;
    }

    if ("LearnMore" in data.content) {
      link.learnMore = data.content.LearnMore.url;
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
              href={eventLink.register}
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
              Register
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
