import { Protocol } from '@uniswap/router-sdk';
import { SubgraphProviderWithFallBacks } from '../subgraph-provider-with-fallback';
/**
 * Provider for getting V2 subgraph pools that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class V2SubgraphProviderWithFallBacks
 */
export class V2SubgraphProviderWithFallBacks extends SubgraphProviderWithFallBacks {
    /**
     * Creates an instance of V2SubgraphProviderWithFallBacks.
     * @param fallbacks Ordered list of `IV2SubgraphProvider` to try to get pools from.
     */
    constructor(fallbacks) {
        super(fallbacks, Protocol.V2);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdjIvc3ViZ3JhcGgtcHJvdmlkZXItd2l0aC1mYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDL0MsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFHbkY7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLCtCQUNYLFNBQVEsNkJBQTZDO0lBR3JEOzs7T0FHRztJQUNILFlBQVksU0FBZ0M7UUFDMUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGIn0=