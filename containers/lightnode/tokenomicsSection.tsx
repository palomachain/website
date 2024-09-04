import Purchase from 'components/Button/purchase';
import { useEffect, useState } from 'react';
import { useLazyGetTotalSupplyQuery } from 'services/api/nodeGuru';
import { abbreviateNumberSI } from 'utils/number';

const tokenomicsSection = () => {
  const [fetchTotalSupply] = useLazyGetTotalSupplyQuery();
  const [totalSupply, setTotalSupply] = useState<string>('0');

  useEffect(() => {
    const getTotalSupply = async () => {
      const supply = await fetchTotalSupply({});
      if (supply.isSuccess) {
        setTotalSupply(supply.data['supply'][0]['amount'].toString() ?? '0');
      }
    };

    getTotalSupply();
  }, []);

  return (
    <section className="tokenomics-section">
      <div className="tokenomics">
        <h1>Paloma Tokenomics</h1>
        <p>
          Paloma’s tokens were distributed at mainnet TGE which ocurred on February 2, 2023. Paloma GRAINs for this
          LightNode Sale are from the Paloma Foundation’s Community Pool and ecosystem fund. The objective of this fund
          is to attract community members to build and expand the Paloma community.
        </p>
        <Purchase className="mt-40" />
      </div>
      <div className="tokenomics-photo">
        <img src="/assets/home/tokenomics.svg" alt="tokenomics" />
        <div className="tokenomics-grains">
          <h3>Supply</h3>
          <h1>{abbreviateNumberSI(totalSupply, 2, 2)}</h1>
          <h1>GRAIN</h1>
          {/* <h2>Billion Grains</h2> */}
          <p>
            Cosmos Inflation Rate 3%
            <br />
            (With Full Staking)
          </p>
        </div>
      </div>
    </section>
  );
};

export default tokenomicsSection;
