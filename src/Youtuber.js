import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { coin, coins, SigningCosmWasmClient } from 'cosmwasm';
import { SigningStargateClient } from '@cosmjs/stargate';
import { totalFundingAmount, instantiateIcoContract } from './queries';

const rpcEndpoint = 'http://localhost:26657';
const chainId = 'ysip';

const suggest_ysip_chain = async () => {
  await window.keplr.experimentalSuggestChain({
    chainId: 'ysip',
    chainName: 'ysip chain',
    rpc: 'http://localhost:26657',
    rest: 'http://localhost:1317',
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

const icoChannelList = {
  id: 0,
  name: '곽튜브KWAKTUBE',
  src: 'https://yt3.ggpht.com/IiZfu92VbzJoI3gcw7NwyQTXBSPgk9-GBIwVj8tGEex-9uozEIvfDX2N6DNJVh15Uh1yy42VaA=s176-c-k-c0x00ffffff-no-rj',
  ticker: 'KWAK',
  address: '123123121233',
  funding: 252310002324,
};

const Youtuber = () => {
  const [client, setClient] = useState();
  const [stargateClient, setStargateClient] = useState();
  const [userAddress, setUserAddress] = useState();
  const [fundingAmount, setFundingAmount] = useState();
  let fund_result;
  useEffect(() => {
    (async () => {
      if (!window.keplr) {
        alert('Please install keplr extension');
      } else {
        await suggest_ysip_chain();
        window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        setUserAddress(accounts[0].address);
        const currentClient = await SigningCosmWasmClient.connectWithSigner(
          rpcEndpoint,
          offlineSigner,
        );
        setClient(currentClient);
        const currentStargateClient = await SigningStargateClient.connect(
          rpcEndpoint,
          // userAddress,
          // offlineSigner,
        );
        let ico_contract_address = await instantiateIcoContract(
          currentClient,
          accounts[0].address,
          '100',
          3000,
          'channelB',
          'CHB',
          '100000000000',
          'ysip1q3gy9kxnt2wvp283w63envhc4pnl0tj57lgspg',
        );
        console.log(ico_contract_address);
        setStargateClient(currentStargateClient);
        const currentFundingAmount = await totalFundingAmount(currentClient, ico_contract_address);
        console.log(currentFundingAmount);
        setFundingAmount(currentFundingAmount);
      }
    })();
  }, []);
  return (
    <StyledContainer>
      <Wrapper>
        <YoutuberDashboard>
          <ChannelImg src={icoChannelList.src} />
          <ChannelInfo>
            <b>
              <p style={{ fontSize: '1.2rem' }}>{icoChannelList.name} 채널</p>
            </b>
            <FundingInfo>
              <p style={{ fontSize: '1.2rem' }}>펀딩 금액</p>
              <p style={{ fontSize: '2rem' }}>
                <b>
                  {icoChannelList.funding
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + 'ukrw'}
                </b>
              </p>
            </FundingInfo>
          </ChannelInfo>
        </YoutuberDashboard>
      </Wrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  margin-top: 90px;
  background: linear-gradient(to top, #a8ff78, #78ffd6);
  padding: 0 auto;
  width: 100%;
  height: 100vh;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const YoutuberDashboard = styled.div`
  display: flex;
  border-radius: 25px;
  padding: 20px;
  background-color: aliceblue;
`;

const ChannelImg = styled.img`
  border-radius: 10px;
`;

const FundingInfo = styled.div`
  padding-top: 20px;
`;

const ChannelInfo = styled.div`
  padding-left: 20px;
`;

export default Youtuber;
