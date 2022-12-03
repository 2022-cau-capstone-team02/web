import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { coin, coins, SigningCosmWasmClient } from 'cosmwasm';
import { SigningStargateClient } from '@cosmjs/stargate';
<<<<<<< HEAD
import { totalFundingAmount, instantiateIcoContract, fundingChannel } from './queries';
import useClient from './hooks/useClient';
=======
import { totalFundingAmountQuery, instantiateIcoContract } from './queries';
>>>>>>> 539d7dffbbaebb5093a99c2368b96d91daf5fe6a

const rpcEndpoint = 'http://localhost:26657';
const chainId = 'ysip';

const icoChannelList = {
  id: 0,
  name: '곽튜브KWAKTUBE',
  src: 'https://yt3.ggpht.com/IiZfu92VbzJoI3gcw7NwyQTXBSPgk9-GBIwVj8tGEex-9uozEIvfDX2N6DNJVh15Uh1yy42VaA=s176-c-k-c0x00ffffff-no-rj',
  ticker: 'KWAK',
  address: '123123121233',
  funding: 252310002324,
};

const Youtuber = () => {
  const { client, stargateClient, userAddress } = useClient();
  const [fundingAmount, setFundingAmount] = useState();
  useEffect(() => {
    if (!stargateClient || !userAddress) return;
    (async () => {
<<<<<<< HEAD
      let ico_contract_address = await instantiateIcoContract(
        client,
        userAddress,
        '100',
        3000,
        'channelB',
        'CHB',
        '100000000000',
        'ysip1q3gy9kxnt2wvp283w63envhc4pnl0tj57lgspg',
      );
      console.log(ico_contract_address);
      console.log(userAddress);

      const fund = await fundingChannel(client, userAddress, ico_contract_address, 100);
      console.log(fund);
      const currentFundingAmount = await totalFundingAmount(client, ico_contract_address);
      console.log(currentFundingAmount);
      setFundingAmount(currentFundingAmount);
=======
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
        const currentFundingAmount = await totalFundingAmountQuery(
          currentClient,
          ico_contract_address,
        );
        console.log(currentFundingAmount);
        setFundingAmount(currentFundingAmount);
      }
>>>>>>> 539d7dffbbaebb5093a99c2368b96d91daf5fe6a
    })();
  }, [stargateClient, userAddress]);
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
                  {fundingAmount
                    ? (parseFloat(fundingAmount.amount) / 1000000)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + 'KRW'
                    : null}
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
