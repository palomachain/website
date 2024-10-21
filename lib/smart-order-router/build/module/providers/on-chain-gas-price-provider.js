import { ChainId } from '@uniswap/sdk-core';
import { opStackChains } from '../util/l2FeeChains';
import { IGasPriceProvider } from './gas-price-provider';
const DEFAULT_EIP_1559_SUPPORTED_CHAINS = [
    ChainId.MAINNET,
    ChainId.GOERLI,
    ChainId.POLYGON_MUMBAI,
    ChainId.ARBITRUM_ONE,
    ...opStackChains,
];
/**
 * Gets gas prices on chain. If the chain supports EIP-1559 and has the feeHistory API,
 * uses the EIP1559 provider. Otherwise it will use a legacy provider that uses eth_gasPrice
 *
 * @export
 * @class OnChainGasPriceProvider
 */
export class OnChainGasPriceProvider extends IGasPriceProvider {
    constructor(chainId, eip1559GasPriceProvider, legacyGasPriceProvider, eipChains = DEFAULT_EIP_1559_SUPPORTED_CHAINS) {
        super();
        this.chainId = chainId;
        this.eip1559GasPriceProvider = eip1559GasPriceProvider;
        this.legacyGasPriceProvider = legacyGasPriceProvider;
        this.eipChains = eipChains;
    }
    async getGasPrice(latestBlockNumber, requestBlockNumber) {
        if (this.eipChains.includes(this.chainId)) {
            return this.eip1559GasPriceProvider.getGasPrice(latestBlockNumber, requestBlockNumber);
        }
        return this.legacyGasPriceProvider.getGasPrice(latestBlockNumber, requestBlockNumber);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib24tY2hhaW4tZ2FzLXByaWNlLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9vbi1jaGFpbi1nYXMtcHJpY2UtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTVDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVwRCxPQUFPLEVBQVksaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUduRSxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLE9BQU8sQ0FBQyxPQUFPO0lBQ2YsT0FBTyxDQUFDLE1BQU07SUFDZCxPQUFPLENBQUMsY0FBYztJQUN0QixPQUFPLENBQUMsWUFBWTtJQUNwQixHQUFHLGFBQWE7Q0FDakIsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxpQkFBaUI7SUFDNUQsWUFDWSxPQUFnQixFQUNoQix1QkFBZ0QsRUFDaEQsc0JBQThDLEVBQzlDLFlBQXVCLGlDQUFpQztRQUVsRSxLQUFLLEVBQUUsQ0FBQztRQUxFLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLGNBQVMsR0FBVCxTQUFTLENBQStDO0lBR3BFLENBQUM7SUFFZSxLQUFLLENBQUMsV0FBVyxDQUMvQixpQkFBeUIsRUFDekIsa0JBQTJCO1FBRTNCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsQ0FDN0MsaUJBQWlCLEVBQ2pCLGtCQUFrQixDQUNuQixDQUFDO1NBQ0g7UUFFRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQzVDLGlCQUFpQixFQUNqQixrQkFBa0IsQ0FDbkIsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9