"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbitrumGasDataProvider = void 0;
const GasDataArbitrum__factory_1 = require("../../types/other/factories/GasDataArbitrum__factory");
const util_1 = require("../../util");
class ArbitrumGasDataProvider {
    constructor(chainId, provider, gasDataAddress) {
        this.chainId = chainId;
        this.provider = provider;
        this.gasFeesAddress = gasDataAddress ? gasDataAddress : util_1.ARB_GASINFO_ADDRESS;
    }
    async getGasData(providerConfig) {
        const gasDataContract = GasDataArbitrum__factory_1.GasDataArbitrum__factory.connect(this.gasFeesAddress, this.provider);
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
exports.ArbitrumGasDataProvider = ArbitrumGasDataProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLWRhdGEtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YzL2dhcy1kYXRhLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLG1HQUFnRztBQUNoRyxxQ0FBaUQ7QUE0QmpELE1BQWEsdUJBQXVCO0lBTWxDLFlBQ1ksT0FBZ0IsRUFDaEIsUUFBc0IsRUFDaEMsY0FBdUI7UUFGYixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFHaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsMEJBQW1CLENBQUM7SUFDOUUsQ0FBQztJQUVNLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBK0I7UUFDckQsTUFBTSxlQUFlLEdBQUcsbURBQXdCLENBQUMsT0FBTyxDQUN0RCxJQUFJLENBQUMsY0FBYyxFQUNuQixJQUFJLENBQUMsUUFBUSxDQUNkLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxNQUFNLGVBQWUsQ0FBQyxjQUFjLENBQUM7WUFDbkQsUUFBUSxFQUFFLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxXQUFXO1NBQ3RDLENBQUMsQ0FBQztRQUNILE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU87WUFDTCxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN0QixnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzNDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQzNCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUE3QkQsMERBNkJDIn0=