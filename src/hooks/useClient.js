import React, { useEffect, useState } from 'react';
import { channelTokenBalanceQuery, suggestYsipChain, tokenAddressQuery } from '../queries';
import { SigningCosmWasmClient } from 'cosmwasm';
import {
  CHAIN_ID,
  COIN_MINIMAL_DENOM,
  RPC_END_POINT,
  UPPERCASE_COIN_MINIMAL_DENOM,
} from '../constants';
import { SigningStargateClient } from '@cosmjs/stargate';
import { useRecoilState, useRecoilValue } from 'recoil';
import { channelListAtom, userAssetAtom } from '../atoms';
import forEach from 'lodash/forEach';

const useClient = () => {
  const [client, setClient] = useState();
  const [userAddress, setUserAddress] = useState();
  const [stargateClient, setStargateClient] = useState();
  const [userAsset, setUserAsset] = useRecoilState(userAssetAtom);
  const channelList = useRecoilValue(channelListAtom);

  useEffect(() => {
    (async () => {
      if (!window.keplr) {
        alert('Please install keplr extension');
      } else {
        await suggestYsipChain();
        window.keplr.enable(CHAIN_ID);

        const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
        const accounts = await offlineSigner.getAccounts();
        setUserAddress(accounts[0].address);
        console.log(accounts[0].addres);
        const currentClient = await SigningCosmWasmClient.connectWithSigner(
          RPC_END_POINT,
          offlineSigner,
        );
        setClient(currentClient);

        const currentStargateClient = await SigningStargateClient.connect(RPC_END_POINT);
        setStargateClient(currentStargateClient);

        const balance = await stargateClient.getBalance(userAddress, COIN_MINIMAL_DENOM);
        setUserAsset((prev) => {
          return {
            ...prev,
            [UPPERCASE_COIN_MINIMAL_DENOM]: balance.amount,
          };
        });

        forEach(channelList, async (icoChannel) => {
          const result = await tokenAddressQuery(client, icoChannel.icoContractAddress);
          const tokenAddress = result.address;
          const newResult = await channelTokenBalanceQuery(client, userAddress, tokenAddress);
          setUserAsset((props) => {
            return {
              ...props,
              [icoChannel.ticker]: newResult.balance,
            };
          });
        });
      }
    })();
  }, []);

  return {
    client,
    stargateClient,
    userAddress,
  };
};

export default useClient;
