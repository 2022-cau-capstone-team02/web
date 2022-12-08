import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';

import { totalFundingAmountQuery } from './queries';
import useClient from './hooks/useClient';
import { UPPERCASE_COIN_MINIMAL_DENOM } from './constants';
import { digitNumber } from './utils/common';

const Youtuber = () => {
  const { client } = useClient();
  const [fundingAmount, setFundingAmount] = useState();
  const channelList = JSON.parse(localStorage.getItem('channelList'))?.list;
  const youtuber = channelList[0];

  useEffect(() => {
    (async () => {
      const currentFundingAmount = await totalFundingAmountQuery(
        client,
        youtuber.icoContractAddress,
      );
      console.log(currentFundingAmount);
      setFundingAmount(currentFundingAmount);
    })();
  }, []);

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
                <b>
                  {fundingAmount
                    ? `${digitNumber(fundingAmount.amount)} ${UPPERCASE_COIN_MINIMAL_DENOM}`
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
