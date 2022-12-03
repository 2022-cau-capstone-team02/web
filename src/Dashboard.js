import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  width: 100%;
  padding: 0 auto;
  height: 500px;
  display: flex;
  margin-top: 180px;
`;

const InvestorPath = styled.div`
  width: 100%;
  padding: 50px;
  margin-left: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: aliceblue;
  border-radius: 50px;
  box-shadow: 0px 3px 20px grey;
  flex-direction: column;
  &:hover {
    cursor: pointer;
  }
`;

const YoutuberPath = styled.div`
  width: 100%;
  padding: 50px;
  margin-left: 50px;
  margin-right: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: aliceblue;
  border-radius: 50px;
  box-shadow: 0px 3px 20px grey;
  flex-direction: column;
  &:hover {
    cursor: pointer;
  }
`;

const Image = styled.img`
  height: 80%;
  @media screen and (max-width: 992px) {
    width: 100%;
  } ;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <StyledContainer fluid>
        <InvestorPath
          onClick={() => {
            navigate('/dashboard/investor');
          }}
        >
          <Image src={process.env.PUBLIC_URL + '/image/investor.png'} />
          <p style={{ fontSize: '3rem', color: '#202121' }}>투자자</p>
        </InvestorPath>
        <YoutuberPath
          onClick={() => {
            navigate('/dashboard/youtuber');
          }}
        >
          <Image src={process.env.PUBLIC_URL + '/image/youtube.png'} />
          <p style={{ fontSize: '3rem', color: '#202121' }}>유튜버</p>
        </YoutuberPath>
      </StyledContainer>
      <div style={{ padding: '50px' }} />
    </React.Fragment>
  );
};

export default Dashboard;
