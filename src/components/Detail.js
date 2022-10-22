import React from "react";
import { RiCloseFill } from "react-icons/ri";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  display: ${({ show }) => (show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.div`
  background-color: rgba(36, 36, 36, 0.438);
  position: absolute;
  width: 100%;
  height: 100%;
`;

const FormContainer = styled.div`
  height: 600px;
  position: absolute;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  } /* Chrome, Safari, Opera*/
  @media screen and (max-width: 768px) {
    width: 450px;
  }
  @media screen and (min-width: 768px) {
    width: 550px;
  }
  @media screen and (min-width: 992px) {
    width: 850px;
  }
`;

const Form = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 60px;
`;

const CloseIcon = styled(RiCloseFill)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 4rem;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.7);
  &:hover {
    cursor: pointer;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  @media screen and (max-width: 992px) {
    flex-direction: column;
  } ;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  @media screen and (max-width: 992px) {
    width: 100%;
    justify-content: center;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  } ;
`;

const ProfileImageWrapper = styled.div`
  width: 150px;
  height: 150px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: fill;
`;

const ProfileInfo = styled.div`
  flex-grow: 4;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  padding: 20px;
  border-radius: 20px;
  @media screen and (max-width: 992px) {
    margin: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  } ;
`;

const ChannelName = styled.h4``;

const DetailInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Subscribers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Views = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Videos = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ChannelIncome = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ViewChartContainer = styled.div`
  margin-top: 50px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const SubscriberChartContainer = styled.div`
  margin-top: 50px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const SizedBox = styled.div`
  height: 50px;
`;

const Detail = ({ show, setShow, data }) => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const view = {
    labels,
    datasets: [
      {
        label: "채널 조회수",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000000 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const subscriber = {
    labels,
    datasets: [
      {
        label: "채널 구독자수",
        data: labels.map(() =>
          faker.datatype.number({ min: 200000, max: 250000 })
        ),
        borderColor: "rgb(255, 209, 132)",
        backgroundColor: "rgba(255, 209, 132, 0.5)",
      },
    ],
  };
  const close = () => {
    document.body.style.overflow = "unset";
    setShow(!show);
  };
  return (
    <Container show={show}>
      <Overlay onClick={close} />
      <FormContainer>
        <CloseIcon onClick={close} />
        <Form>
          <ProfileContainer>
            <ProfileImageContainer>
              <ProfileImageWrapper>
                <ProfileImage src={data.snippet.thumbnails.default.url} />
              </ProfileImageWrapper>
            </ProfileImageContainer>
            <ProfileInfo>
              <ChannelName>{data.snippet.title}</ChannelName>
              <DetailInfo>
                <Subscribers>
                  <span style={{ opacity: "0.5" }}>구독자 수</span>
                  <span>{data.statistics.subscriberCount}</span>
                </Subscribers>
                <Views>
                  <span style={{ opacity: "0.5" }}>총 조회수</span>
                  <span>{data.statistics.viewCount}</span>
                </Views>
                <Videos>
                  <span style={{ opacity: "0.5" }}>총 비디오수</span>
                  <span>{data.statistics.videoCount}</span>
                </Videos>
                <ChannelIncome>
                  <span style={{ opacity: "0.5" }}>예상 채널 수익</span>
                  <span>{(data.statistics.viewCount / 1000) * 4}$</span>
                </ChannelIncome>
              </DetailInfo>
            </ProfileInfo>
          </ProfileContainer>
          <ViewChartContainer>
            <div>
              <h2 style={{ opacity: "0.5" }}>채널 조회수</h2>
            </div>
            <Line data={view} style={{ width: "100%", height: "100%" }} />
          </ViewChartContainer>
          <SubscriberChartContainer>
            <h2 style={{ opacity: "0.5" }}>채널 구독자수</h2>
            <Line data={subscriber} style={{ width: "100%", height: "100%" }} />
          </SubscriberChartContainer>
          <SizedBox />
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Detail;
