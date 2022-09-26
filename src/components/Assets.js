import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Detail from './Detail'
import { useDrag, useDrop } from 'react-dnd'

const AssetsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

`

const Asset = styled.div`
  width: 100%;
  margin-top: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 10px grey;
  display: flex;
  &:hover{
    cursor: pointer;
  }
`

const ThumbNail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width:20%;
`

const ThumbNailWrapper = styled.div`
  height: 80%;
`

const ChannelInfo = styled.div`
  width: 80%;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 10px;
`

const Info = styled.div`

  display: grid;
  grid-template-areas:
    "title title . ."
    "holdingShare dividEnd . ."
    "subscribers views videos ."
    "channelIncome AffiliateIncome . .";
`

const Title = styled.p`
  grid-area: title;
  font-weight: 600;
  font-size: 1.5rem;
`

const HoldingShare = styled.p`
  grid-area: holdingShare;
`

const DividEnd = styled.p`
  grid-area: dividEnd;
`

const Subscribers = styled.p`
  grid-area: subscribers;
`


const Views = styled.p`
  grid-area: views;
`


const Videos = styled.p`
  grid-area: videos;
`

const ChannelIncome = styled.p`
  grid-area: channelIncome;
`

// const AffiliateIncome = styled.p`
//   grid-area: AffiliateIncome;
// `


const Assets = ({apiData}) => {

    const [show, setShow] = useState(false);
    const open = ()=>{
        document.body.style.overflow='hidden';
        setShow(!show);
    }
    

    return (
      <AssetsContainer>
        <Detail show={show} setShow={setShow} apiData={apiData}/>
        {apiData[0] ? apiData[0].map((apiData, index)=>{
            return (
              <Asset key={index} onClick={open}>
                <ThumbNail>
                  <ThumbNailWrapper>
                    <Image src={apiData.snippet.thumbnails.default.url}/>
                  </ThumbNailWrapper>
                </ThumbNail>
                <ChannelInfo>
                  <Info>
                    <Title>채널명 : {apiData.snippet.title}</Title>
                    <Subscribers>구독자수 : {apiData.statistics.subscriberCount}</Subscribers>
                    <Views>총 조회수 : {apiData.statistics.viewCount}</Views>
                    <Videos>총 비디오수 : {apiData.statistics.videoCount}</Videos>
                    <ChannelIncome>예상 채널 수익 : ${(apiData.statistics.viewCount / 1000) * 4}</ChannelIncome> 
                    {/* <AffiliateIncome>동영상 1개당 예상 제휴 수익 : {}</AffiliateIncome> */}
                    <HoldingShare>보유지분 : ??</HoldingShare>
                    <DividEnd>예상 배당금 : {}</DividEnd>  
                  </Info>
                </ChannelInfo>          
              </Asset>
            );
          }     
        ):null}
      </AssetsContainer>
    )
}

export default Assets
