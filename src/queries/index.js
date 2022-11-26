import { coin } from 'cosmwasm';
import {
  CHAIN_ID,
  CHAIN_NAME,
  COIN_DENOM,
  COIN_MINIMAL_DENOM,
  REST_END_POINT,
  RPC_END_POINT,
} from '../constants';

const feeMsg = {
  amount: [
    {
      denom: COIN_MINIMAL_DENOM,
      amount: '1',
    },
  ],
  // gas는 항상 이만큼 사용되는 것이 아니라 상한선임
  gas: '450000',
};

export const suggestYsipChain = async () => {
  await window.keplr.experimentalSuggestChain({
    chainId: CHAIN_ID,
    chainName: CHAIN_NAME,
    rpc: RPC_END_POINT,
    rest: REST_END_POINT,
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: CHAIN_ID,
      bech32PrefixAccPub: CHAIN_ID + 'pub',
      bech32PrefixValAddr: CHAIN_ID + 'valoper',
      bech32PrefixValPub: CHAIN_ID + 'valoperpub',
      bech32PrefixConsAddr: CHAIN_ID + 'valcons',
      bech32PrefixConsPub: CHAIN_ID + 'valconspub',
    },
    currencies: [
      {
        coinDenom: COIN_DENOM,
        coinMinimalDenom: COIN_MINIMAL_DENOM,
        coinDecimals: 6,
        // coinGeckoId: 'krw',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: COIN_DENOM,
        coinMinimalDenom: COIN_MINIMAL_DENOM,
        coinDecimals: 6,
        // coinGeckoId: 'krw',
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: COIN_DENOM,
      coinMinimalDenom: COIN_MINIMAL_DENOM,
      coinDecimals: 6,
      // coinGeckoId: 'skrw',
    },
  });
};

export const instantiateToken = async (client, tokenName, tokenSymbol, minter) => {
  const message = {
    name: tokenName,
    symbol: tokenSymbol,
    decimals: 6,
    initial_balances: [],
    mint: {
      minter: minter,
      cap: null,
    },
  };

  const result = await client.instantiate(minter, 1, message, 'channel', feeMsg);
  return result.contractAddress;
};

export const instantiateIcoContract = async (
  client,
  admin,
  targetFunding,
  deadline,
  tokenName,
  tokenSymbol,
  channelTokenAmount,
  recipient,
) => {
  const message = {
    target_funding: targetFunding,
    deadline: deadline,
    token_code_id: 1,
    token_name: tokenName,
    token_symbol: tokenSymbol,
    channel_token_amount: channelTokenAmount,
    recipient: recipient,
  };

  console.log(message);

  const result = await client.instantiate(admin, 2, message, 'ico', feeMsg);
  return result.contractAddress;
};

// 사용자가 특정한 채널 컨트랙트에 펀딩을 하는 트랜잭션 (개인이 ICO에 돈을 넣는 것)
export const fundingChannel = async (client, userAddress, icoAddress, amount) => {
  const message = {
    fund_channel_token: {},
  };
  return await client.execute(userAddress, icoAddress, message, feeMsg, null, [
    coin(amount, 'ukrw'),
  ]);
};

// 관리자가 instantiate 할 때 지정한 채널 주인에게 펀딩 금액 전송
export const transferFunding = async (client, admin, icoContractAddress, amount) => {
  const message = {
    transfer_fund: {
      amount: amount,
    },
  };

  return await client.execute(admin, icoContractAddress, message, feeMsg, null, []);
};

//
export const queryChannelTokenBalance = async (client, accountAddress, tokenAddress) => {
  const message = {
    balance: {
      address: accountAddress,
    },
  };
  return await client.queryContractSmart(tokenAddress, message);
};

// 관리자가 토큰 홀더에게 배당금을 지급하는 트랜잭션
export const allocation = async (client, admin, icoContractAddress, amount) => {
  const message = {
    allocation: {
      amount,
    },
  };
  return await client.execute(admin, icoContractAddress, message, feeMsg, null, [
    coin(amount, COIN_MINIMAL_DENOM),
  ]);
};

// 채널의 현재 펀딩 금액 확인 가능
export const totalFundingAmount = async (client, address) => {
  const message = {
    total_funding_amount: {},
  };
  console.log(message);
  return await client.queryContractSmart(client, address, message);
};
