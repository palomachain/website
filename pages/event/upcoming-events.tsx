import React, { useEffect, useState, useMemo } from "react";
import { fetchEvents } from "utils/storyblok";

import { UpcomingEvent, NoEvents } from "components/Event";
import { convertUTCtoLocalTime, parseDate } from "utils/date";
import RotatedHeader from "components/RotatedHeader";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };

    getData();
  }, []);

  const filteredEvents = useMemo(() => {
    const tempEvents = events.filter((event) => {
      const currentTime = new Date().getTime();
      const eventTime = convertUTCtoLocalTime(
        parseDate(event.content.EventTime).getTime()
      );

      if (eventTime >= currentTime) {
        return true;
      }

      return false;
    });

    tempEvents.sort((a, b) => {
      const aEventTime = parseDate(a.content.EventTime).getTime();
      const bEventTime = parseDate(b.content.EventTime).getTime();

      return aEventTime > bEventTime ? 1 : -1;
    });

    return tempEvents;
  }, [events]);

  return (
    <div className="page-container">
      <div className="event-page-container">
        <RotatedHeader title="Upcoming Events" theme="dark" />

        {filteredEvents.length > 0 && (
          <div className="event-list-wrapper">
            {filteredEvents.map((event) => (
              <UpcomingEvent data={event} key={event.uuid} />
            ))}
          </div>
        )}
        {filteredEvents.length === 0 && <NoEvents />}
      </div>
    </div>
  );
};

export default UpcomingEvents;
