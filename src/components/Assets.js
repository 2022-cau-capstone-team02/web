import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Detail from './Detail';

var colors = require('nice-color-palettes');

const AssetsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const AssetWrapper = styled.div`
  width: 100%;
`;

const Asset = styled.div`
  width: 100%;
  margin-top: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 10px grey;
  display: flex;
  padding-left: 20px;
  border-right: 12px solid #95f78b;
  &:hover {
    cursor: pointer;
  }
`;

const ThumbNailContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ThumbNailWrapper = styled.div`
  width: 125px;
  height: 125px;
  @media screen and (min-width: 998px) {
    width: 100px;
    height: 100px;
  }
`;

const ChannelInfo = styled.div`
  flex-grow: 1;
  padding-left: 30px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 10px;
  box-shadow: 0px 0px 8px grey;
`;

const Info = styled.div`
  padding: 20px;
  display: grid;
  grid-template-areas:
    'title title . .'
    'holdingShare dividEnd channelIncome .'
    'subscribers views videos .';
  @media screen and (max-width: 998px) {
    grid-template-areas:
      'title title'
      'holdingShare dividEnd'
      'subscribers views'
      'videos channelIncome';
  }
  @media screen and (max-width: 600px) {
    grid-template-areas:
      'title'
      'holdingShare'
      'dividEnd'
      'channelIncome';
  }
`;

const Title = styled.p`
  grid-area: title;
  height: 20px;
  font-weight: 600;
  font-size: 1.2rem;
`;

const HoldingShare = styled.p`
  grid-area: holdingShare;
  height: 20px;
  font-weight: 600;
`;

const DividEnd = styled.p`
  grid-area: dividEnd;
  height: 20px;
  font-weight: 600;
`;

const Subscribers = styled.p`
  grid-area: subscribers;
  height: 20px;
  font-weight: 600;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const Views = styled.p`
  grid-area: views;
  height: 20px;
  font-weight: 600;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const Videos = styled.p`
  grid-area: videos;
  height: 20px;
  font-weight: 600;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const ChannelIncome = styled.p`
  height: 20px;
  font-weight: 600;
  grid-area: channelIncome;
`;

const Assets = ({ apiData, videoData }) => {
  const [dataIndex, setDataIndex] = useState(-1);
  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const open = (e, index) => {
    document.body.style.overflow = 'hidden';
    setDataIndex(index);
    setShow(!show);
  };
  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    const copyListItems = [...dataList];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setDataList(copyListItems);
  };

  useEffect(() => {
    setDataList(apiData[0]);
    setVideoList(videoData);
  }, []);

  return (
    <AssetsContainer>
      {dataList
        ? dataList.map((data, index) => {
            return (
              <AssetWrapper
                key={index}
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
              >
                {show && dataIndex == index ? (
                  <Detail
                    show={show}
                    setShow={setShow}
                    data={dataList[dataIndex]}
                    video={videoList[dataIndex]}
                  />
                ) : null}
                <Asset onClick={(e) => open(e, index)}>
                  <ThumbNailContainer>
                    <ThumbNailWrapper>
                      <Image src={data.snippet.thumbnails.default.url} />
                    </ThumbNailWrapper>
                  </ThumbNailContainer>
                  <ChannelInfo>
                    <Info>
                      <Title>{data.snippet.title}</Title>
                      <Subscribers>구독자수 {data.statistics.subscriberCount}</Subscribers>
                      <Views>총 조회수 {data.statistics.viewCount}</Views>
                      <Videos>총 비디오수 {data.statistics.videoCount}</Videos>
                      <ChannelIncome>
                        예상 채널 수익 ${(data.statistics.viewCount / 1000) * 4}
                      </ChannelIncome>
                      {/* <AffiliateIncome>동영상 1개당 예상 제휴 수익 : {}</AffiliateIncome> */}
                      <HoldingShare>보유지분 ??</HoldingShare>
                      <DividEnd>예상 배당금 </DividEnd>
                    </Info>
                  </ChannelInfo>
                </Asset>
              </AssetWrapper>
            );
          })
        : null}
    </AssetsContainer>
  );
};

export default Assets;
