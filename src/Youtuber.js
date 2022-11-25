import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { coin, coins, SigningCosmWasmClient } from 'cosmwasm';

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
  width: 80%;
  height: 70%;
  border-radius: 25px;
  background-color: aliceblue;
`;

const Youtuber = () => {
  let fund_result;
  useEffect(() => {}, []);
  return (
    <StyledContainer>
      <Wrapper>
        <YoutuberDashboard></YoutuberDashboard>
      </Wrapper>
    </StyledContainer>
  );
};

export default Youtuber;
