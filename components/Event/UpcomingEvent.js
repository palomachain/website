import React, { useState, useEffect, useMemo } from "react";

import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer";

import {
  convertDateStringWithWeekDay,
  convertTimeString,
  GetRemainDays,
  convertUTCtoLocalTime,
  parseDate
} from "utils/date";

const UpcomingEvent = ({ data }) => {
  const [remainTime, setRemainTime] = useState(" ");

  useEffect(() => {
    if (data.content.EventTime) {
      let interval = null;

      interval = setInterval(() => {
        const {
          day: d,
          hour: h,
          minute: m,
        } = GetRemainDays(
          new Date().getTime(),
          convertUTCtoLocalTime(parseDate(data.content.EventTime).getTime())
        );
        let str = "";

        if (d > 0) {
          str = `${d}D `;
        }

        str = `${str}${h} HR ${m} M`;

        setRemainTime(str);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [data.content.EventTime]);

  const registerLink = useMemo(() => {
    if (!("RegistrationLink" in data.content)) {
      return "";
    }
    const registrationLink = data.content.RegistrationLink;

    if (registrationLink !== null) {
      return registrationLink.url;
    }

    return "";
  }, [data]);

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
          <a
            href="https://t.me/kallistofinance"
            className="event-join-community"
            target="_blank"
          >
            Join Our Community
          </a>
        </div>
        <div className="event-timer">
          <span>Join us in</span>
          <div className="event-countdown">{remainTime}</div>
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${data.content.EventTime}&location=${data.content.Location}&text=${data.content.Title}`}
            className="event-add-calendar"
            target="_blank"
          >
            Add to Calendar
          </a>
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
          {registerLink !== "" && (
            <a href={registerLink} className="event-register" target="_blank">
              Register
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
