import { coin, coins, SigningCosmWasmClient } from 'cosmwasm';
import React from 'react';

const rpcEndpoint = 'http://127.0.0.1:26657';
const chainId = 'ysip';

const feeMsg = {
  amount: [
    {
      denom: 'ukrw',
      amount: '1',
    },
  ],
  // gas는 항상 이만큼 사용되는 것이 아니라 상한선임
  gas: '450000',
};

const suggest_ysip_chain = async () => {
  await window.keplr.experimentalSuggestChain({
    chainId: 'ysip',
    chainName: 'ysip chain',
    rpc: 'http://127.0.0.1:26657',
    rest: 'http://127.0.0.1:1317',
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'ysip',
      bech32PrefixAccPub: 'ysip' + 'pub',
      bech32PrefixValAddr: 'ysip' + 'valoper',
      bech32PrefixValPub: 'ysip' + 'valoperpub',
      bech32PrefixConsAddr: 'ysip' + 'valcons',
      bech32PrefixConsPub: 'ysip' + 'valconspub',
    },
    currencies: [
      {
        coinDenom: 'KRW',
        coinMinimalDenom: 'ukrw',
        coinDecimals: 6,
        // coinGeckoId: 'krw',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'KRW',
        coinMinimalDenom: 'ukrw',
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
      coinDenom: 'KRW',
      coinMinimalDenom: 'ukrw',
      coinDecimals: 6,
      // coinGeckoId: 'skrw',
    },
  });
};

const instantiate_token = async (client, name, symbol, minter) => {
  const token_instantiate_msg = {
    name: name,
    symbol: symbol,
    decimals: 6,
    initial_balances: [],
    mint: {
      minter: minter,
      cap: null,
    },
  };

  let token_instantiate_result = await client.instantiate(
    minter,
    1,
    token_instantiate_msg,
    'channal',
    feeMsg,
  );

  return token_instantiate_result.contractAddress;
};

const instantiate_ico_contract = async (
  client,
  admin,
  target_funding,
  deadline,
  token_name,
  token_symbol,
  channel_token_amount,
  recipient,
) => {
  const ico_contact_instantiate_msg = {
    target_funding: target_funding,
    deadline: deadline,
    token_code_id: 1,
    token_name: token_name,
    token_symbol: token_symbol,
    channel_token_amount: channel_token_amount,
    recipient: recipient,
  };

  let ico_instantiate_result = await client.instantiate(
    admin,
    2,
    ico_contact_instantiate_msg,
    'ico',
    feeMsg,
  );
  return ico_instantiate_result.contractAddress;
};

const fund_channel = async (client, user_address, ico_address, amount) => {
  let fund_msg = {
    fund_channel_token: {},
  };
  let fund_result = await client.execute(user_address, ico_address, fund_msg, feeMsg, null, [
    coin(amount, 'ukrw'),
  ]);
  return fund_result;
};

const end_funding = async (client, admin, ico_address) => {
  let end_funding_msg = {
    end_funding: {},
  };
  let end_funding_result = await client.execute(
    admin,
    ico_address,
    end_funding_msg,
    feeMsg,
    null,
    [],
  );
  return end_funding_result;
};

const query_channel_token_balance = async (client, account_address, token_address) => {
  let query_channel_token_balane_msg = {
    balance: {
      address: account_address,
    },
  };
  let balance_response = await client.queryContractSmart(
    token_address,
    query_channel_token_balane_msg,
  );
  return balance_response;
};

const transfer_fund = async (client, admin, ico_contract_address, amount) => {
  let transfer_fund_msg = {
    transfer_fund: {
      amount: amount,
    },
  };
  let transfer_fund_result = await client.execute(
    admin,
    ico_contract_address,
    transfer_fund_msg,
    feeMsg,
    null,
    [],
  );
  return transfer_fund_result;
};

const allocation = async (client, admin, ico_contract_address, amount) => {
  let allocation_msg = {
    allocation: {
      amount: amount,
    },
  };
  let allocation_result = await client.execute(
    admin,
    ico_contract_address,
    allocation_msg,
    feeMsg,
    null,
    [coin(amount, 'ukrw')],
  );
  return allocation_result;
};

const Test = () => {
  window.onload = async () => {
    if (!window.keplr) {
      alert('Please install keplr extension');
    } else {
      await suggest_ysip_chain();
      window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      let cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        offlineSigner,
      );
      let token_contract_address = await instantiate_token(
        cosmwasmClient,
        'channelA',
        'CHA',
        accounts[0].address,
      );
      console.log('token_contract_address: ');
      console.log(token_contract_address);

      let ico_contract_address = await instantiate_ico_contract(
        cosmwasmClient,
        accounts[0].address,
        '100',
        3000,
        'channalB',
        'CHB',
        '100000000000',
        'ysip1q3gy9kxnt2wvp283w63envhc4pnl0tj57lgspg',
      );
      console.log('ico_contract_address: ');
      console.log(ico_contract_address);

      let fund_channel_result = await fund_channel(
        cosmwasmClient,
        accounts[0].address,
        ico_contract_address,
        100,
      );
      console.log('fund_channel_result: ');
      console.log(fund_channel_result);

      let end_funding_result = await end_funding(
        cosmwasmClient,
        accounts[0].address,
        ico_contract_address,
      );
      console.log('end_funding_result: ');
      console.log(end_funding_result);

      let new_channel_token_address = end_funding_result.logs[0].events[1].attributes[0].value;

      let channel_token_balance = await query_channel_token_balance(
        cosmwasmClient,
        accounts[0].address,
        new_channel_token_address,
      );
      console.log('channel_token_balance: ');
      console.log(channel_token_balance);

      let transfer_fund_result = await transfer_fund(
        cosmwasmClient,
        accounts[0].address,
        ico_contract_address,
        '100',
      );
      console.log('transfer_fund_result: ');
      console.log(transfer_fund_result);

      let allocation_result = await allocation(
        cosmwasmClient,
        accounts[0].address,
        ico_contract_address,
        '1000',
      );
      console.log('allocation_result: ');
      console.log(allocation_result);
    }
  };
  return <div></div>;
};

export default Test;
