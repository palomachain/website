import React, { useEffect, useState } from "react";

import RotatedHeader from "components/RotatedHeader";
import Button from "components/Button";

import { getWalletAddressEllipsis } from "utils/common";
import {
  parseDate,
  getHourOffsetLocalTimezone,
  GetRemainDays,
} from "utils/date";

const eggs = [];

for (let i = 1; i <= 35; i++) {
  // if (i % 5 === 1) {
  //   eggs.push({
  //     status: true,
  //     id: i,
  //     img: "/assets/eggs/egg.png",
  //     address: "paloma1f2d2qf3ahv6xpcw8g3ea9kysc0u9609qa6mmwn",
  //   });
  // } else {
    eggs.push({
      status: false,
      id: i,
    });
  // }
}

const EggNFT = ({ egg }) => {
  return (
    <div className="egg-container">
      {egg.status && (
        <>
          <div className="egg-wrapper egg-normal">
            <img className="egg-nft-img" src={egg.img} />
          </div>
          <div className="egg-wrapper egg-hovered">
            <span className="egg-nft-id">{`#${egg.id}`}</span>
            <div className="egg-nft-address">
              {getWalletAddressEllipsis(egg.address, 12, 21)}
            </div>
            <Button className="egg-nft-opensea">See it At OpenSea</Button>
          </div>
        </>
      )}
      {!egg.status && (
        <div className="egg-wrapper egg-empty">
          <span className="egg-nft-id">{`#${egg.id}`}</span>
        </div>
      )}
    </div>
  );
};

const ReleaseCountDownBanner = () => {
  const [remainDays, setRemainDays] = useState({
    day: 0,
    hour: 0,
    minute: 0,
  });

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      const hourOffset = getHourOffsetLocalTimezone();

      const firstReleaseDateStr = process.env.FIRST_RELEASE_DATE;
      const firstReleaseDate = parseDate(firstReleaseDateStr);
      const firstReleaseDateInLocal = new Date(
        firstReleaseDate.getTime() - hourOffset * 3600 * 1000
      );

      const curDate = new Date();

      const { day, hour, minute } = GetRemainDays(
        curDate.getTime(),
        firstReleaseDateInLocal.getTime()
      );

      if (hour === 0 && day === 0 && minute === 0) {
        clearInterval(interval);
      } else {
        setRemainDays({
          day,
          hour,
          minute,
        });
      }

      return () => {
        clearInterval(interval);
      };
    }, 1000);
  }, []);

  return (
    <div className="release-countdown-banner-container">
      <img src="/assets/eggs/egg.gif" />
      <div className="release-countdown-text">
        <div className="text1">First release in:</div>
        <div className="text2">{`${remainDays.day} days ${remainDays.hour} hr ${remainDays.minute} min`}</div>
      </div>
      <img src="/assets/eggs/egg.gif" />
    </div>
  );
};

export default function PalomaEggsPage({ state, router }) {
  return (
    <div className="page-container">
      <div className="egg-page-container">
        <RotatedHeader
          title="Paloma Eggs"
          rightImage="/assets/eggs/egg.png"
          theme="light"
        />
        <ReleaseCountDownBanner />
        <div className="egg-list-container">
          {eggs.map((egg) => (
            <EggNFT egg={egg} key={`egg-nft-${egg.id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
