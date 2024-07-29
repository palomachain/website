import RangeSlider from "components/RangeSlider";
import { useEffect, useState } from "react";
import {
  CommunityFee,
  GrainsPerNode,
  Inflation,
  PigeonGasFee,
  RelayRewardFee,
  TotalGrains,
  ValidatorFee,
} from "utils/constants";
import { formatNumber } from "utils/number";

const rewardCalculatorSection = () => {
  const [nodeNumber, setNodeNumber] = useState(250);
  const [grainPrice, setGrainPrice] = useState(0.0784);
  const [nodePurchasePrice, setNodePurchasePrice] = useState(25000);

  const [staking, setStaking] = useState<number>(); // Year
  const [stakingPrice, setStakingPrice] = useState<number>(); // Year
  const [relayFeeReward, setRelayFeeReward] = useState<number>(); // Year
  const [relayFeeRewardPrice, setRelayFeeRewardPrice] = useState<number>(); // Year

  const grainsStaked = 1596008000;
  const nodesSold = 5000;
  const gasPrice = 16; // Gwei
  const txCost = 1000000; // Gas
  const ethPrice = 3500; // $3500

  useEffect(() => {
    {
      (nodeNumber *
        GrainsPerNode *
        ((TotalGrains * Inflation * (100 - CommunityFee - ValidatorFee)) / 100 / 100)) /
        (1596008000 + GrainsPerNode * 5000);
    }
    const netStakeFlation =
      (TotalGrains * Inflation * (100 - CommunityFee - ValidatorFee)) / 100 / 100;
    const totalStaked = grainsStaked + nodesSold * GrainsPerNode;

    const stakingAmount = (nodeNumber * GrainsPerNode * netStakeFlation) / totalStaked;
    setStaking(stakingAmount);
    setStakingPrice(stakingAmount * grainPrice);

    const pigeonFees = ((gasPrice * txCost * ethPrice) / 1000000000) * (PigeonGasFee / 100);
    const txPerYear = nodePurchasePrice * 365;
    const feeCut = ((txPerYear * pigeonFees * (RelayRewardFee / 100)) / nodesSold) * nodeNumber;
    setRelayFeeRewardPrice(feeCut);
    setRelayFeeReward(feeCut / grainPrice);
  }, [nodeNumber, nodePurchasePrice, grainPrice]);

  return (
    <section className="reward-calculator-section flex-col">
      <h1>
        paloma lightnode
        <br />
        reward calculator
      </h1>
      <div className="reward-calculator-diagrams">
        <RangeSlider
          title="Number of Nodes"
          describe="This is the number of registered nodes that you own."
          min={1}
          max={500}
          mid={250}
          step={1}
          value={nodeNumber}
          setValue={setNodeNumber}
        />
        <RangeSlider
          title="GRAIN Price"
          describe="This number represents the price per GRAIN."
          min={0.0069}
          max={0.15}
          mid={0.0784}
          step={0.0001}
          prefix="$"
          value={grainPrice}
          setValue={setGrainPrice}
        />
        <RangeSlider
          title="Node Purchase Price"
          describe="This number represents the price per node purchased."
          min={50}
          max={50000}
          mid={25000}
          step={10}
          prefix="$"
          value={nodePurchasePrice}
          setValue={setNodePurchasePrice}
        />
      </div>
      <table className="reward-calculator-table">
        <thead>
          <tr className="table-head">
            <th></th>
            <th>Annual</th>
            <th>Monthly</th>
            <th>Daily</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-body">
            <td>Staking</td>
            <td className="value-td">
              {formatNumber(staking, 0, 0)} GRAINS
              <span>(${formatNumber(stakingPrice, 0, 0)})</span>
            </td>
            <td className="value-td">
              {formatNumber(staking / 12, 0, 0)} GRAINS
              <span>
                ($
                {formatNumber(
                  stakingPrice / 12,
                  stakingPrice > 100 ? 0 : 2,
                  stakingPrice > 100 ? 0 : 2
                )}
                )
              </span>
            </td>
            <td className="value-td">
              {formatNumber(staking / 365, 0, 0)} GRAINS
              <span>
                ($
                {formatNumber(
                  stakingPrice / 365,
                  stakingPrice > 100 ? 0 : 2,
                  stakingPrice > 100 ? 0 : 2
                )}
                )
              </span>
            </td>
          </tr>
          <tr className="table-body">
            <td>Relay Fee</td>
            <td className="value-td">
              {formatNumber(relayFeeReward, 0, 0)} GRAINS
              <span>(${formatNumber(relayFeeRewardPrice, 0, 0)})</span>
            </td>
            <td className="value-td">
              {formatNumber(relayFeeReward / 12, 0, 0)} GRAINS
              <span>
                ($
                {formatNumber(
                  relayFeeRewardPrice / 12,
                  relayFeeRewardPrice > 100 ? 0 : 2,
                  relayFeeRewardPrice > 100 ? 0 : 2
                )}
                )
              </span>
            </td>
            <td className="value-td">
              {formatNumber(relayFeeReward / 365, 0, 0)} GRAINS
              <span>
                ($
                {formatNumber(
                  relayFeeRewardPrice / 365,
                  relayFeeRewardPrice > 100 ? 0 : 2,
                  relayFeeRewardPrice > 100 ? 0 : 2
                )}
                )
              </span>
            </td>
          </tr>
          <tr className="table-body">
            <td>APY</td>
            <td className="value-td table-pink-bg">
              {formatNumber(
                ((stakingPrice + relayFeeRewardPrice) / (nodePurchasePrice * nodeNumber)) * 100,
                2,
                2
              )}
              %
            </td>
            <td className="table-black-bg"></td>
            <td className="table-black-bg"></td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default rewardCalculatorSection;
