import React from "react";

import { TELEGRAM_LINK, TWITTER_LINK } from "utils/constants";

const NoEvents = () => (
  <div className="no-events-container">
    <img src="/assets/events/no-events.png" />
    <p>
      No upcoming paloma events.
      <br />
      join our Community and Stay updated on upcoming events.
    </p>
    <div className="no-events-buttons">
      <a href={TWITTER_LINK} target="_blank">
        Twitter
      </a>
      <a href={TELEGRAM_LINK} target="_blank">
        Telegram
      </a>
    </div>
  </div>
);

export default NoEvents;
