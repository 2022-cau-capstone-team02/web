import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { coin, coins, SigningCosmWasmClient } from 'cosmwasm';
import { SigningStargateClient } from '@cosmjs/stargate';
import { totalFundingAmountQuery, instantiateIcoContract, fundingChannel } from './queries';
import useClient from './hooks/useClient';
import { useRecoilState } from 'recoil';
import { channelListAtom, userAssetAtom, userFundingAtom } from './atoms';

const rpcEndpoint = 'http://localhost:26657';
const chainId = 'ysip';

const icoChannelList = {
  id: 0,
  name: '방성원',
  src: 'https://yt3.ggpht.com/ytc/AMLnZu-aO9vHmg6ClLIweCyo5auE1HhpGz-YZKOa6m7h0Q=s176-c-k-c0x00ffffff-no-rj',
  ticker: 'KAPU',
  address: '123123121233',
  funding: 252310002324,
};

const Youtuber = () => {
  const { client, stargateClient, userAddress } = useClient();
  const [fundingAmount, setFundingAmount] = useState();
  const [channelList, setChannelList] = useRecoilState(channelListAtom);
  const youtuber = channelList[0];
  console.log(youtuber);
  useEffect(() => {
    if (!client) return;
    (async () => {
      const currentFundingAmount = await totalFundingAmountQuery(
        client,
        youtuber.icoContractAddress,
      );
      console.log(currentFundingAmount);
      setFundingAmount(currentFundingAmount);
    })();
  }, [client, youtuber]);
  return (
    <StyledContainer>
      <Wrapper>
        <YoutuberDashboard>
          <ChannelImg src={youtuber.src} />
          <ChannelInfo>
            <b>
              <p style={{ fontSize: '1.5rem' }}>{youtuber.name}님의 채널</p>
            </b>
            <FundingInfo>
              <p style={{ fontSize: '1.5rem' }}>펀딩 금액</p>
              <p style={{ fontSize: '2.5rem' }}>
                <b>{fundingAmount ? fundingAmount.amount : null}</b>
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
  padding: 50px;
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
