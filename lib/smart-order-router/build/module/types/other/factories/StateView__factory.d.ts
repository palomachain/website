import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { StateView, StateViewInterface } from "../StateView";
export declare class StateView__factory {
    static readonly abi: ({
        type: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability: string;
        name?: undefined;
        outputs?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        outputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability: string;
    })[];
    static createInterface(): StateViewInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): StateView;
}
