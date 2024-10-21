"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainGasPriceProvider = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const l2FeeChains_1 = require("../util/l2FeeChains");
const gas_price_provider_1 = require("./gas-price-provider");
const DEFAULT_EIP_1559_SUPPORTED_CHAINS = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    ...l2FeeChains_1.opStackChains,
];
/**
 * Gets gas prices on chain. If the chain supports EIP-1559 and has the feeHistory API,
 * uses the EIP1559 provider. Otherwise it will use a legacy provider that uses eth_gasPrice
 *
 * @export
 * @class OnChainGasPriceProvider
 */
class OnChainGasPriceProvider extends gas_price_provider_1.IGasPriceProvider {
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
exports.OnChainGasPriceProvider = OnChainGasPriceProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib24tY2hhaW4tZ2FzLXByaWNlLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9vbi1jaGFpbi1nYXMtcHJpY2UtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBQTRDO0FBRTVDLHFEQUFvRDtBQUVwRCw2REFBbUU7QUFHbkUsTUFBTSxpQ0FBaUMsR0FBRztJQUN4QyxrQkFBTyxDQUFDLE9BQU87SUFDZixrQkFBTyxDQUFDLE1BQU07SUFDZCxrQkFBTyxDQUFDLGNBQWM7SUFDdEIsa0JBQU8sQ0FBQyxZQUFZO0lBQ3BCLEdBQUcsMkJBQWE7Q0FDakIsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUNILE1BQWEsdUJBQXdCLFNBQVEsc0NBQWlCO0lBQzVELFlBQ1ksT0FBZ0IsRUFDaEIsdUJBQWdELEVBQ2hELHNCQUE4QyxFQUM5QyxZQUF1QixpQ0FBaUM7UUFFbEUsS0FBSyxFQUFFLENBQUM7UUFMRSxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBeUI7UUFDaEQsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUM5QyxjQUFTLEdBQVQsU0FBUyxDQUErQztJQUdwRSxDQUFDO0lBRWUsS0FBSyxDQUFDLFdBQVcsQ0FDL0IsaUJBQXlCLEVBQ3pCLGtCQUEyQjtRQUUzQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN6QyxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQzdDLGlCQUFpQixFQUNqQixrQkFBa0IsQ0FDbkIsQ0FBQztTQUNIO1FBRUQsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUM1QyxpQkFBaUIsRUFDakIsa0JBQWtCLENBQ25CLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUExQkQsMERBMEJDIn0=