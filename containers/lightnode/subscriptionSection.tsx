import Purchase from 'components/Button/purchase';
import { useEffect, useState } from 'react';
import {
  ChangeR,
  Exponent,
  GrainsPerNode,
  Increment,
  NodeSlot1,
  NSlots,
  StartingPrice,
  TotalGrains,
} from 'utils/constants';
import { formatNumber } from 'utils/number';

interface INodeSaleData {
  totalNodeSale: number;
  nodePrice: number;
  fdv: number;
  grainsSold: number;
  cumeGrainsSold: number;
  networkPercent: number;
}

const subscriptionSection = () => {
  const [nodeSaleData, setNodeSaleData] = useState<INodeSaleData[]>();

  useEffect(() => {
    let tempNodeSale: INodeSaleData[] = Array(NSlots);
    for (let index = 0; index < NSlots; index++) {
      const totalNodeSale = Math.round(NodeSlot1 * ChangeR ** index);
      const nodePrice = Math.round(StartingPrice + Increment * index ** Exponent);
      const fdv = (nodePrice * TotalGrains) / GrainsPerNode;
      const grainsSold = totalNodeSale * GrainsPerNode;
      const prevCumeGrainsSold = index > 0 ? tempNodeSale[index - 1].cumeGrainsSold : 0;
      const cumeGrainsSold = prevCumeGrainsSold + grainsSold;
      const networkPercent = (cumeGrainsSold / TotalGrains) * 100;

      tempNodeSale[index] = {
        totalNodeSale,
        nodePrice,
        fdv,
        grainsSold,
        cumeGrainsSold,
        networkPercent,
      };
    }

    setNodeSaleData([...tempNodeSale]);
  }, []);

  return (
    <section className="subscription-section flex-col">
      <h1>
        Paloma LightNode
        <br />
        Subscription Pricing
      </h1>
      <p>
        Paloma secures an increasing number of trading applications, ensuring reliable and efficient performance as the
        platform continues to grow.
      </p>
      <Purchase className="purchase-button-white mt-40" />
      <table className="subscription-table">
        <thead>
          <tr className="table-head">
            <th>Slot</th>
            <th>Total Nodes for Sale</th>
            <th>Node Price</th>
            <th>Implied FDV</th>
            <th>Grains Minted</th>
            <th>% of Network</th>
          </tr>
        </thead>
        <tbody>
          {nodeSaleData &&
            [...Array(NSlots)].map(
              (e, index) =>
                index > 3 && (
                  <tr
                    className={`subscription-table-row ${index % 2 > 0 ? 'subscription-table-row2' : undefined} `}
                    key={index}
                  >
                    <td>{index + 1}</td>
                    <td>{formatNumber(nodeSaleData[index].totalNodeSale, 0, 0)}</td>
                    <td>${nodeSaleData[index].nodePrice}</td>
                    <td>${formatNumber(nodeSaleData[index].fdv, 0, 0)}</td>
                    <td>{formatNumber(nodeSaleData[index].grainsSold, 0, 0)}</td>
                    <td>{formatNumber(nodeSaleData[index].networkPercent, 1, 1)}%</td>
                  </tr>
                ),
            )}
        </tbody>
      </table>
    </section>
  );
};
export default subscriptionSection;
