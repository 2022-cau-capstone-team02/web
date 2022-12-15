import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useRecoilValue } from 'recoil';
import { userAssetAtom } from '../atoms';
import { COIN_MINIMAL_DENOM_DIGIT, UPPERCASE_COIN_MINIMAL_DENOM } from '../constants';
import forEach from 'lodash/forEach';
import { liquidityQuery } from '../queries';
import useClient from '../hooks/useClient';
import { digitNumber } from '../utils/common';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: [],
  datasets: [
    {
      label: 'My Stake Dataset',
      data: [70, 20, 10],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        // 'rgb(61, 245, 89)',
        // 'rgb(135, 219, 245)',
      ],
      hoverOffset: 4,
    },
  ],
};

const options = {
  layout: {
    padding: 20,
  },
};

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 10px grey;
  @media screen and (max-width: 998px) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const InfoContainer = styled.div`
  padding: 30px;
  width: 100%;
  height: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 10px grey;
  @media screen and (max-width: 998px) {
    width: 100%;
    margin: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  @media screen and (max-width: 768px) {
    border-radius: 10px;
    height: 300px;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Profile = styled.h1`
  font-size: 1.7rem;
  font-weight: 700;
`;

const AssetInfo = ({ apiData, userData }) => {
  const { client } = useClient();
  const [show, setShow] = useState(false);
  const userAsset = useRecoilValue(userAssetAtom);

  const [liquidites, setLiquidities] = useState();
  const channelList = JSON.parse(localStorage.getItem('channelList')).list;

  useEffect(() => {
    if (!client) return;
    (async () => {
      forEach(channelList, async (channel) => {
        const liquidityQueryResult = await liquidityQuery(client, channel.poolAddress);
        setLiquidities((prev) => {
          return {
            ...prev,
            [channel.ticker]: Number(liquidityQueryResult.liquidity[0].amount),
          };
        });
      });
    })();
  }, [client]);

  const labels = () => {
    if (data.labels.length === 0) {
      apiData[0].map((apiData) => {
        data.labels.push(apiData.snippet.title);
      });
    }
    setShow(true);
  };
  useEffect(() => {
    labels();
  }, []);

  return (
    <Container>
      {show ? (
        <InfoContainer>
          <Profile>{userData.data.data[0].name}님의 현재 자산</Profile>
          <h3>
            {Object.keys(userAsset).map((key) => {
              if (key === 'uKRW') {
                return (
                  <p key={key}>
                    {userAsset[key]} {key}
                  </p>
                );
              } else {
                return (
                  <p key={key}>
                    {userAsset[key]} {key}
                    <br />
                    <span style={{ fontSize: 16 }}>
                      개당 가격 : {digitNumber(liquidites?.[key]?.toString(10))}{' '}
                      {UPPERCASE_COIN_MINIMAL_DENOM}
                    </span>
                  </p>
                );
              }
            })}
          </h3>
        </InfoContainer>
      ) : null}
    </Container>
  );
};

export default AssetInfo;
