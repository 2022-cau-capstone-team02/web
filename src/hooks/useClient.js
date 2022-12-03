import React, { useEffect, useState } from 'react';
import { suggestYsipChain } from '../queries';
import { SigningCosmWasmClient } from 'cosmwasm';
import { CHAIN_ID, RPC_END_POINT } from '../constants';
import { SigningStargateClient } from '@cosmjs/stargate';

const useClient = () => {
  const [client, setClient] = useState();
  const [userAddress, setUserAddress] = useState();
  const [stargateClient, setStargateClient] = useState();

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
