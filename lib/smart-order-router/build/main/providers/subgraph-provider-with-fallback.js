"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubgraphProviderWithFallBacks = void 0;
const util_1 = require("../util");
class SubgraphProviderWithFallBacks {
    constructor(fallbacks, protocol) {
        this.fallbacks = fallbacks;
        this.protocol = protocol;
    }
    async getPools(currencyIn, currencyOut, providerConfig) {
        for (let i = 0; i < this.fallbacks.length; i++) {
            const provider = this.fallbacks[i];
            try {
                const pools = await provider.getPools(currencyIn, currencyOut, providerConfig);
                return pools;
            }
            catch (err) {
                util_1.log.info(`Failed to get subgraph pools for ${this.protocol} from fallback #${i}`);
            }
        }
        throw new Error('Failed to get subgraph pools from any providers');
    }
}
exports.SubgraphProviderWithFallBacks = SubgraphProviderWithFallBacks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvc3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxrQ0FBOEI7QUFJOUIsTUFBc0IsNkJBQTZCO0lBSWpELFlBQ1UsU0FBNkMsRUFDN0MsUUFBa0I7UUFEbEIsY0FBUyxHQUFULFNBQVMsQ0FBb0M7UUFDN0MsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUN6QixDQUFDO0lBRUcsS0FBSyxDQUFDLFFBQVEsQ0FDbkIsVUFBa0IsRUFDbEIsV0FBbUIsRUFDbkIsY0FBK0I7UUFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFDcEMsSUFBSTtnQkFDRixNQUFNLEtBQUssR0FBRyxNQUFNLFFBQVEsQ0FBQyxRQUFRLENBQ25DLFVBQVUsRUFDVixXQUFXLEVBQ1gsY0FBYyxDQUNmLENBQUM7Z0JBQ0YsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLFVBQUcsQ0FBQyxJQUFJLENBQ04sb0NBQW9DLElBQUksQ0FBQyxRQUFRLG1CQUFtQixDQUFDLEVBQUUsQ0FDeEUsQ0FBQzthQUNIO1NBQ0Y7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFDckUsQ0FBQztDQUNGO0FBaENELHNFQWdDQyJ9