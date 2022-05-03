import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const faPropIcon = faChevronDown as IconProp;

const EventType = [
  {
    key: "upcoming",
    value: "Upcoming Events",
  },
  { key: "past", value: "Past Events" },
];

const getEventType = (key) => {
  const findIndex = EventType.findIndex((item) => item.key === key);
  return EventType[findIndex].value
}

const EventSearchBar = ({ eventType, onSelect }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="event-searchbar-container">
      <div className="event-selected" onClick={(e) => setClicked(!clicked)}>
        <div className="event-selected-text">{getEventType(eventType)}</div>
        <FontAwesomeIcon icon={faPropIcon} />
      </div>
      {
        clicked && (
          <>
            {EventType.map((item) => {
              if (item.key === eventType) {
                return null;
              }
              return (
                <div
                  className="event-searchbar-selector"
                  onClick={(e) => {
                    onSelect(item.key);
                    setClicked(false);
                  }}
                  key={`eventtype-item-${item.key}`}
                >
                  {item.value}
                </div>
              )
            })}
          </>
        )
      }
    </div>
  );
};

export default EventSearchBar;
