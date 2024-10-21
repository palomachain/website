import { GasDataArbitrum__factory } from '../../types/other/factories/GasDataArbitrum__factory';
import { ARB_GASINFO_ADDRESS } from '../../util';
export class ArbitrumGasDataProvider {
    constructor(chainId, provider, gasDataAddress) {
        this.chainId = chainId;
        this.provider = provider;
        this.gasFeesAddress = gasDataAddress ? gasDataAddress : ARB_GASINFO_ADDRESS;
    }
    async getGasData(providerConfig) {
        const gasDataContract = GasDataArbitrum__factory.connect(this.gasFeesAddress, this.provider);
        const gasData = await gasDataContract.getPricesInWei({
            blockTag: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber,
        });
        const perL1CalldataByte = gasData[1];
        return {
            perL2TxFee: gasData[0],
            perL1CalldataFee: perL1CalldataByte.div(16),
            perArbGasTotal: gasData[5],
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLWRhdGEtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YzL2dhcy1kYXRhLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFlBQVksQ0FBQztBQTRCakQsTUFBTSxPQUFPLHVCQUF1QjtJQU1sQyxZQUNZLE9BQWdCLEVBQ2hCLFFBQXNCLEVBQ2hDLGNBQXVCO1FBRmIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFjO1FBR2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDO0lBQzlFLENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQStCO1FBQ3JELE1BQU0sZUFBZSxHQUFHLHdCQUF3QixDQUFDLE9BQU8sQ0FDdEQsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDO1lBQ25ELFFBQVEsRUFBRSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsV0FBVztTQUN0QyxDQUFDLENBQUM7UUFDSCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxPQUFPO1lBQ0wsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdEIsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUMzQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMzQixDQUFDO0lBQ0osQ0FBQztDQUNGIn0=