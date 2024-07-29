import RangeSlider from "components/RangeSlider";
import { useEffect, useMemo, useState } from "react";
import {
  ChangeR,
  CommunityFee,
  Exponent,
  GrainsPerNode,
  Increment,
  Inflation,
  NodeSlot1,
  NSlots,
  StartingPrice,
  TotalGrains,
  ValidatorFee,
} from "utils/constants";
import { formatNumber } from "utils/number";

const rewardCalculatorSection = () => {
  const [nodeNumber, setNodeNumber] = useState(250);
  const [grainPrice, setGrainPrice] = useState(0.0784);
  const [nodePurchasePrice, setNodePurchasePrice] = useState(25000);

  const [staking, setStaking] = useState();

  // (NSlots *
  //   nodePurchasePrice *
  //   (TotalGrains * Inflation -
  //     TotalGrains * Inflation * CommunityFee -
  //     TotalGrains * Inflation * ValidatorFee)) /
  //   (nodeNumber * nodePurchasePrice + 1596008000);

  useEffect(() => {
    
  }, [nodeNumber, nodePurchasePrice, grainPrice])
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
            C8 * C20 * (100 - C22 - C24) / 100
            <td className="table-gray-bg">
              {/* {nodeNumber *
                GrainsPerNode *
                (TotalGrains * Inflation * (100 - CommunityFee - ValidatorFee) / 100 / 100) / (1596008000 + )} */}
            </td>
            <td className="table-gray-bg"></td>
            <td className="table-gray-bg"></td>
          </tr>
          <tr className="table-body">
            <td>Relay Fee</td>
            <td className="table-gray-bg"></td>
            <td className="table-gray-bg"></td>
            <td className="table-gray-bg"></td>
          </tr>
          <tr className="table-body">
            <td>APY</td>
            <td className="table-pink-bg"></td>
            <td className="table-black-bg"></td>
            <td className="table-black-bg"></td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
export default rewardCalculatorSection;
