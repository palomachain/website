import { Protocol } from '@uniswap/router-sdk';
import { SubgraphProviderWithFallBacks } from '../subgraph-provider-with-fallback';
/**
 * Provider for getting V3 subgraph pools that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class V3SubgraphProviderWithFallBacks
 */
export class V3SubgraphProviderWithFallBacks extends SubgraphProviderWithFallBacks {
    constructor(fallbacks) {
        super(fallbacks, Protocol.V3);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjMvc3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDL0MsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFHbkY7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLCtCQUNYLFNBQVEsNkJBQTZDO0lBR3JELFlBQVksU0FBZ0M7UUFDMUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGIn0=