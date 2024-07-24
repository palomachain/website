import React, { useState } from "react";
import { formatNumber } from "utils/number";

const volumesSection = () => {
  const [volume, setVolume] = useState(29370221);
  const [activeBotCount, setActiveBotCount] = useState(549);
  const [cagrPercent, setCagrPercent] = useState(70);

  return (
    <section className="volumes-section">
      <div className="flex-col volumes-number">
        <h1>${formatNumber(volume, 0, 0)}</h1>
        <h2>Paloma Relay Volumes</h2>
      </div>
      <div className="bots">
        <div className="active-bots">
          <h1 className="h-pink">{activeBotCount}</h1>
          <h2 className="h-white">Active bots</h2>
        </div>
        <div className="bots-center-div" />
        <div className="active-cagr">
          <h1 className="h-white">{cagrPercent}%</h1>
          <h2 className="h-pink">Cagr</h2>
        </div>
      </div>
    </section>
  );
};
export default volumesSection;
