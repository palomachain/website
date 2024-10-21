import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { MixedRouteQuoterV2, MixedRouteQuoterV2Interface } from "../MixedRouteQuoterV2";
export declare class MixedRouteQuoterV2__factory {
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
            components: ({
                name: string;
                type: string;
                internalType: string;
                components: {
                    name: string;
                    type: string;
                    internalType: string;
                }[];
            } | {
                name: string;
                type: string;
                internalType: string;
                components?: undefined;
            })[];
        }[];
        outputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability: string;
    } | {
        type: string;
        name: string;
        inputs: ({
            name: string;
            type: string;
            internalType: string;
            components?: undefined;
        } | {
            name: string;
            type: string;
            internalType: string;
            components: {
                name: string;
                type: string;
                internalType: string;
                components: {
                    name: string;
                    type: string;
                    internalType: string;
                }[];
            }[];
        })[];
        outputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability: string;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability?: undefined;
        outputs?: undefined;
    })[];
    static createInterface(): MixedRouteQuoterV2Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): MixedRouteQuoterV2;
}
