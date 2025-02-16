import {
    BalancerJoinExitFragment,
    BalancerSwapFragment,
    useGetTransactionDataLazyQuery,
} from '../../apollo/generated/graphql-codegen-generated';
import { useEffect, useRef } from 'react';
import { BALANCER_SUBGRAPH_START_TIMESTAMP } from './constants';
import { orderBy, uniqBy, groupBy, mapValues, sumBy, map } from 'lodash';

export function useBalancerTransactionData(
    addresses: string[],
    poolIds: string[],
): {
    swaps: BalancerSwapFragment[];
    joinExits: BalancerJoinExitFragment[];
    swapPairVolumes: { name: string; value: number }[];
} {
    const [getTokenTransactionData, { data }] = useGetTransactionDataLazyQuery();
    const ref = useRef<{ poolIds: string[]; addresses: string[] }>({ poolIds: [], addresses: [] });

    useEffect(() => {
        if (poolIds.length !== ref.current.poolIds.length || addresses.length !== ref.current.addresses.length) {
            ref.current = { poolIds, addresses };

            getTokenTransactionData({
                variables: {
                    addresses,
                    poolIds,
                    startTimestamp: BALANCER_SUBGRAPH_START_TIMESTAMP,
                },
            });
        }
    }, [poolIds, addresses]);

    const swaps = uniqBy(
        orderBy([...(data?.swapsIn || []), ...(data?.swapsOut || [])], 'timestamp', 'desc'),
        (swap) => swap.id,
    );

    const groupedByPair = groupBy(swaps, (swap) => `${swap.tokenInSym} -> ${swap.tokenOutSym}`);
    const swapPairVolumes = map(groupedByPair, (swaps, key) => {
        return {
            name: key,
            value: sumBy(swaps, (swap) => parseFloat(swap.valueUSD)),
        };
    });

    return {
        swaps,
        joinExits: data?.joinExits || [],
        swapPairVolumes,
    };
}
