import React from "react";

import { convertDateStringWithWeekDay } from "utils/date";

const PastEvent = ({ data }) => (
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
    </div>
  </div>
);

export default PastEvent;
