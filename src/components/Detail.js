import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import styled from 'styled-components';
import './Detail.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import SwiperCore, { Pagination } from 'swiper';
import { parse } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';
import { useQuery } from 'react-query';
SwiperCore.use([Pagination]);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

var likeDislike = [];
var viewCountArr = [];
var viewCountComment = [];
var labels = [];

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  display: ${({ show }) => (show ? 'flex' : 'none')};
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
  @media screen and (min-width: 1280px) {
    width: 1050px;
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
  font-family: 'Noto Sans KR', sans-serif;
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

const Channel = styled.div`
  display: flex;
  align-items: center;
`;

const ChannelName = styled.h4``;

const ChannelTier = styled.h5`
  margin-left: 1rem;
  font-weight: 600;
`;

const DetailInfo = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
  }
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

const RecentYoutubeList = styled.div`
  height: 350px;
  margin-top: 50px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  border-radius: 20px;
  padding: 20px;
`;

const PopularYoutubeList = styled.div`
  height: 350px;
  margin-top: 50px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  border-radius: 20px;
  padding: 20px;
`;

const YoutubePlayer = styled.iframe`
  width: 100%;
  height: 100%;
  display: ${({ hide }) => {
    hide ? 'none' : 'block';
  }};
  z-index: 1;
`;

const ChannelRecentAverageView = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ChannelAverageView = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ChannelViewCountvsSubscribers = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ChannelLikesvsDislikes = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ChannelCommentsVSviewCount = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ProfileAnalysis = styled.div`
  margin-top: 30px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const YoutubeChart = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 992px) {
    flex-direction: column;
  }
`;

const RecentView = styled.div``;

const LikeDislike = styled.div`
  margin-top: 50px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  border-radius: 20px;
  padding: 20px;
  @media screen and (min-width: 992px) {
    width: 380px;
  }
  @media screen and (min-width: 1280px) {
    width: 450px;
  }
`;

const ViewCountComment = styled.div`
  margin-top: 50px;
  box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
  border-radius: 20px;
  padding: 20px;
  @media screen and (min-width: 992px) {
    width: 380px;
  }
  @media screen and (min-width: 1280px) {
    width: 450px;
  }
`;

async function fetchMonthlyDataByCustomUrl(customUrl) {
  return await axios.get(`/youtube/monthly/${customUrl}`, { responseType: 'json' });
}

const Detail = ({ show, setShow, data, video, popularVideo, detailData, detailData2 }) => {
  const [spinner, setSpinner] = useState(true);
  const [monthlyDataByCustomUrl, setMonthlyDataByCustomUrl] = useState(null);
  console.log(monthlyDataByCustomUrl);
  const [likesVSdislikes, setLikesVSdislikes] = useState(0);
  const [recentAverageView, setRecentAverageView] = useState(0);
  const [commentsVSviewCount, setCommentsVSviewCount] = useState(0);
  const [tier, setTier] = useState('');

  useEffect(() => {
    if (!data.snippet.customUrl) return;

    (async () => {
      const monthlyDataByCustomUrl = await fetchMonthlyDataByCustomUrl(data.snippet.customUrl);
      console.log(monthlyDataByCustomUrl);
      setMonthlyDataByCustomUrl(monthlyDataByCustomUrl);
    })();
  }, []);

  const close = () => {
    document.body.style.overflow = 'unset';
    setShow(!show);
  };

  const hideSpinner = () => {
    setSpinner(false);
  };
  useEffect(() => {
    var sumLikes = 0;
    var sumDislikes = 0;
    var sumViewcount = 0;
    var comments = 0;
    var cnt = 0;
    console.log(detailData);
    detailData2.forEach((element, index) => {
      sumDislikes += parseInt(detailData[index].data.dislikes);
      sumLikes += parseInt(element.statistics.likeCount);
      sumViewcount += parseInt(element.statistics.viewCount);
      comments += parseInt(element.statistics.commentCount);
      viewCountArr.unshift(parseInt(element.statistics.viewCount));
      likeDislike.unshift(
        parseInt(detailData[index].data.dislikes) / parseInt(element.statistics.likeCount),
      );
      viewCountComment.unshift(
        parseInt(element.statistics.commentCount) / parseInt(element.statistics.viewCount),
      );
      cnt += 1;
      labels.unshift(`${cnt}`);
    });

    setCommentsVSviewCount(comments / sumViewcount);
    setLikesVSdislikes(sumDislikes / sumLikes);
    setRecentAverageView(sumViewcount / cnt);

    data.statistics.subscriberCount >= 10000000
      ? setTier('Tier 7')
      : data.statistics.subscriberCount < 10000000 && data.statistics.subscriberCount >= 1000000
      ? setTier('Tier 6')
      : data.statistics.subscriberCount < 1000000 && data.statistics.subscriberCount >= 500000
      ? setTier('Tier 5')
      : data.statistics.subscriberCount < 500000 && data.statistics.subscriberCount >= 300000
      ? setTier('Tier 4')
      : data.statistics.subscriberCount < 300000 && data.statistics.subscriberCount > 100000
      ? setTier('Tier 3')
      : data.statistics.subscriberCount < 100000 && data.statistics.subscriberCount >= 50000
      ? setTier('Tier 2')
      : data.statistics.subscriberCount < 50000 && data.statistics.subscriberCount >= 10000
      ? setTier('Tier 1')
      : null;
    return () => {
      likeDislike = [];
      viewCountArr = [];
      viewCountComment = [];
      labels = [];
    };
  }, []);

  console.log(monthlyDataByCustomUrl?.data.subscriber);

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
              <Channel>
                <ChannelName>{data.snippet.title}</ChannelName>
                <ChannelTier>{tier}</ChannelTier>
              </Channel>
              <DetailInfo>
                <Subscribers>
                  <span style={{ opacity: '0.5' }}>구독자 수</span>
                  <span>
                    {data.statistics.subscriberCount
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                  </span>
                </Subscribers>
                <Views>
                  <span style={{ opacity: '0.5' }}>총 조회수</span>
                  <span>
                    {data.statistics.viewCount
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                  </span>
                </Views>
                <Videos>
                  <span style={{ opacity: '0.5' }}>총 비디오수</span>
                  <span>
                    {data.statistics.videoCount
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                  </span>
                </Videos>
                <ChannelIncome>
                  <span style={{ opacity: '0.5' }}>예상 채널 수익</span>
                  <span>
                    {((data.statistics.viewCount / 1000) * 4)
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                    $
                  </span>
                </ChannelIncome>
              </DetailInfo>
            </ProfileInfo>
          </ProfileContainer>
          <ProfileAnalysis>
            <ChannelAverageView>
              <span style={{ opacity: '0.5' }}>전체 영상 평균 조회수</span>
              <span>
                <b>
                  {Math.round(data.statistics.viewCount / data.statistics.videoCount)
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                </b>
              </span>
            </ChannelAverageView>
            <ChannelRecentAverageView>
              <span style={{ opacity: '0.5' }}>최근 영상 평균 조회수</span>
              {recentAverageView != 0 ? (
                <>
                  <span>
                    <b>
                      {Math.round(recentAverageView)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                    </b>
                  </span>
                </>
              ) : null}
            </ChannelRecentAverageView>
            <ChannelViewCountvsSubscribers>
              <span style={{ opacity: '0.5' }}>구독자 수 대비 조회수</span>
              <span>
                <b>
                  {Math.round(data.statistics.viewCount / data.statistics.subscriberCount)
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                </b>
              </span>
            </ChannelViewCountvsSubscribers>
            <ChannelLikesvsDislikes>
              <span style={{ opacity: '0.5' }}>좋아요 수 대비 싫어요 수</span>
              {likesVSdislikes != 0 ? (
                <>
                  <span>
                    <b>
                      {likesVSdislikes
                        .toFixed(4)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                    </b>
                  </span>
                </>
              ) : null}
            </ChannelLikesvsDislikes>
            <ChannelCommentsVSviewCount>
              <span style={{ opacity: '0.5' }}>조회수 대비 코멘트 수</span>
              {commentsVSviewCount != 0 ? (
                <>
                  <span>
                    <b>
                      {commentsVSviewCount
                        .toFixed(4)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                    </b>
                  </span>
                </>
              ) : null}
            </ChannelCommentsVSviewCount>
          </ProfileAnalysis>
          <RecentYoutubeList>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 style={{ opacity: '0.5' }}>최근 동영상</h2>
              {spinner ? <div className="load"></div> : null}
            </div>
            <Swiper
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              spaceBetween={30}
              slidesPerView={'auto'}
              slidesPerGroup={1}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                996: {
                  slidesPerView: 2,
                  spaceBetween: 50,
                },
              }}
            >
              {video
                ? video.map((video, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <YoutubePlayer
                          src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen={true}
                          onLoad={hideSpinner}
                          hide={spinner}
                        ></YoutubePlayer>
                      </SwiperSlide>
                    );
                  })
                : null}
            </Swiper>
          </RecentYoutubeList>
          <PopularYoutubeList>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 style={{ opacity: '0.5' }}>인기 동영상</h2>
              {spinner ? <div className="load"></div> : null}
            </div>
            <Swiper
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              spaceBetween={30}
              slidesPerView={'auto'}
              slidesPerGroup={1}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                996: {
                  slidesPerView: 2,
                  spaceBetween: 50,
                },
              }}
            >
              {popularVideo
                ? popularVideo.map((popularVideo, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <YoutubePlayer
                          src={`https://www.youtube.com/embed/${popularVideo.id.videoId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen={true}
                          onLoad={hideSpinner}
                          hide={spinner}
                        ></YoutubePlayer>
                      </SwiperSlide>
                    );
                  })
                : null}
            </Swiper>
          </PopularYoutubeList>
          <YoutubeChart>
            <LikeDislike>
              <div>
                <h2 style={{ opacity: '0.5' }}>좋아요 수 / 싫어요 수</h2>
              </div>
              {likeDislike.length == 10 ? (
                <Line
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: '좋아요 수 대비 싫어요 수',
                        data: likeDislike,
                        borderColor: 'rgb(235, 139, 122)',
                        backgroundColor: 'rgba(235, 139, 122, 0.5)',
                      },
                    ],
                  }}
                  style={{ width: '100%', height: '100%', flexGrow: '1' }}
                />
              ) : (
                console.log(likeDislike)
              )}
            </LikeDislike>
            <ViewCountComment>
              <div>
                <h2 style={{ opacity: '0.5' }}>조회수 수 / 코멘트 수</h2>
              </div>
              {viewCountComment.length == 10 ? (
                <Line
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: '조회수 대비 코멘트 수',
                        data: viewCountComment,
                        borderColor: 'rgb(235, 139, 122)',
                        backgroundColor: 'rgba(235, 139, 122, 0.5)',
                      },
                    ],
                  }}
                  style={{ width: '100%', height: '100%', flexGrow: '1' }}
                />
              ) : (
                console.log(viewCountComment)
              )}
            </ViewCountComment>
          </YoutubeChart>
          <ViewChartContainer>
            <div>
              <h2 style={{ opacity: '0.5' }}>채널 조회수</h2>
            </div>
            {monthlyDataByCustomUrl?.data.data.view && (
              <Line
                data={{
                  labels: Object.keys(monthlyDataByCustomUrl?.data.data.view),
                  datasets: [
                    {
                      label: '채널 조회수',
                      data: Object.values(monthlyDataByCustomUrl?.data.data.view),
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                  ],
                }}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </ViewChartContainer>
          {/* <RecentView>
            <div>
              <h2 style={{ opacity: '0.5' }}>채널 최근 조회수</h2>
            </div>
            {viewCountArr.length == 15 ? (
              <Line
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: '최근 영상 조회수',
                      data: viewCountArr,
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                  ],
                }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              console.log(viewCountArr)
            )}
          </RecentView> */}
          <SubscriberChartContainer>
            <h2 style={{ opacity: '0.5' }}>채널 구독자수</h2>
            {monthlyDataByCustomUrl?.data.data.subscriber && (
              <Line
                data={{
                  labels: Object.keys(monthlyDataByCustomUrl?.data.data.subscriber),
                  datasets: [
                    {
                      label: '채널 구독자수',
                      data: Object.values(monthlyDataByCustomUrl?.data.data.subscriber),
                      borderColor: 'rgb(255, 209, 132)',
                      backgroundColor: 'rgba(255, 209, 132, 0.5)',
                    },
                  ],
                }}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </SubscriberChartContainer>

          <SizedBox />
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Detail;
