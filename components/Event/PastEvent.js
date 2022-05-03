import React from "react";

import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer";

import {
  convertDateStringWithWeekDay,
  convertTimeString,
} from "utils/date";

const PastEvent = ({ data }) => {
  return (
    <div className="event-item-container">
      <div className="event-title">{data.content.Title}</div>
      <div className="event-section">
        <div className="event-basics">
          <div className="event-row">
            <div className="event-row-title">Event Date:</div>
            <div className="event-row-value">
              {convertDateStringWithWeekDay(data.content.EventTime, true)}
            </div>
          </div>
          <div className="event-row">
            <div className="event-row-title">Event Time:</div>
            <div className="event-row-value">
              {convertTimeString(data.content.EventTime, true)}
            </div>
          </div>
          <div className="event-row">
            <div className="event-row-title">Location:</div>
            <div className="event-row-value">{data.content.Location}</div>
          </div>
        </div>
      </div>
      <div className="event-section">
        <div className="event-image">
          <img src={`https:${data.content.Image}`} />
        </div>
        <div className="event-about">
          <div className="event-about-title">About the event</div>
          {render(data.content.Description, {
            nodeResolvers: {
              [NODE_IMAGE]: (children, props) => (
                <img
                  {...props}
                  style={{ borderRadius: "0px", width: "100%" }}
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
          <a
            href="https://t.me/kallistofinance"
            className="event-join-community"
            target="_blank"
          >
            Join Our Community
          </a>
        </div>
      </div>
    </div>
  );
};

export default PastEvent;
