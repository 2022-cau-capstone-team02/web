import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import styled from "styled-components";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: [],
  datasets: [
    {
      label: "My Stake Dataset",
      data: [70, 20, 10],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
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

const ChartWrapper = styled.div`
  width: 350px;
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 30px;
  width: 100%;
  height: 350px;
  margin-right: 50px;
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

const AssetInfo = ({ apiData }) => {
  const [show, setShow] = useState(false);
  const labels = () => {
    if (data.labels.length == 0) {
      apiData[0].map((apiData, index) => {
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
        <>
          <InfoContainer>
            <Profile>방성원님의 현재 자산</Profile>
          </InfoContainer>
          <ChartContainer>
            <ChartWrapper>
              <Doughnut
                data={data}
                options={options}
                style={{ width: "100%", height: "100%" }}
              />
            </ChartWrapper>
          </ChartContainer>
        </>
      ) : null}
    </Container>
  );
};

export default AssetInfo;
