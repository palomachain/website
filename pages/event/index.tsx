import React, { useEffect, useState } from "react";
import { fetchEvents } from "utils/storyblok";

import { UpcomingEvent, PastEvent } from "components/Event";
import RotatedHeader from "components/RotatedHeader";

import { convertUTCtoLocalTime, parseDate } from "utils/date";

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEvents();

      const upcomingEvents = [];
      const pastEvents = [];

      for (let i = 0; i < data.length; i++) {
        const event = data[i];

        const currentTime = new Date().getTime();
        const eventTime = convertUTCtoLocalTime(
          parseDate(event.content.EventTime).getTime()
        );

        if (eventTime >= currentTime) {
          upcomingEvents.push(event);
        } else {
          pastEvents.push(event);
        }
      }

      upcomingEvents.sort((a, b) => {
        const aEventTime = parseDate(a.content.EventTime).getTime();
        const bEventTime = parseDate(b.content.EventTime).getTime();

        return aEventTime > bEventTime ? 1 : -1;
      });

      pastEvents.sort((a, b) => {
        const aEventTime = parseDate(a.content.EventTime).getTime();
        const bEventTime = parseDate(b.content.EventTime).getTime();

        return aEventTime > bEventTime ? -1 : 1;
      });

      setUpcomingEvents(upcomingEvents);
      setPastEvents(pastEvents);
    };

    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="event-page-container">
        {upcomingEvents.length > 0 && (
          <div className="event-page-container">
            <RotatedHeader title="Upcoming Events" theme="dark" />
            <div className="event-list-wrapper">
              {upcomingEvents.map((event) => (
                <UpcomingEvent data={event} key={event.uuid} />
              ))}
            </div>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div className="event-page-container">
            <RotatedHeader title="Past Events" theme="dark" />
            <div className="event-list-wrapper">
              {pastEvents.map((event) => (
                <PastEvent data={event} key={event.uuid} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
