import React, { useEffect, useState } from "react";
import { formatNumber } from "utils/number";

const volumesSection = () => {
  const [data, setData] = useState({
    bots_total: "200", // default value
    volume_total: 0, // default value
  });

  useEffect(() => {
    // Fetch data from the URL when the component mounts
    fetch("https://service.palomabot.ai/stats")
      .then(async (response) => response.json())
      .then((bot) => {
        // Update the state with the new data
        setData({
          bots_total: bot.bots_total,
          volume_total: Math.ceil(bot.volume_total),
        });
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []); // Empty dependency array means this effect runs once on mount

  const [cagrPercent, setCagrPercent] = useState(70);

  return (
    <section className="volumes-section">
      <div className="flex-col volumes-number">
        <h1>${formatNumber(data.volume_total, 0, 0)}</h1>
        <h2>Paloma Relay Volumes</h2>
      </div>
      <div className="bots">
        <div className="active-bots">
          <h1 className="h-pink">{data.bots_total}</h1>
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
