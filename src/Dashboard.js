import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import AssetInfo from './components/AssetInfo';
import Assets from './components/Assets';
import _Navbar from './components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
// import Sidebar from './components/Sidebar';

const apiData = [];
const apiData2 = [];
const apiData3 = [];
const apiData5 = [];
var apiData4 = [];
let searchCnt = 15;
let cnt = 0;
let cnt2 = 0;

const StyledContainer = styled(Container)`
  margin-top: 90px;
  background-color: #f5f7fb;
  padding: 0 auto;
  height: 100%;
`;

const AssetWrapper = styled.div`
  width: 100%;
  padding: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

async function fetchUserData() {
  return await axios.get('/userInfo', { responseType: 'json' });
}

function Dashboard() {
  const [show, setShow] = useState(false);
  const { data, isLoading } = useQuery('userInfo', fetchUserData);
  const [params, setParams] = useState({
    key: process.env.REACT_APP_YOUTUBE_API_KEY,
    id: '',
    part: 'id,snippet,contentDetails,statistics',
  });
  const [params2, setParams2] = useState({
    key: process.env.REACT_APP_YOUTUBE_API_KEY,
    id: '',
    part: 'snippet',
  });

  async function fetchYoutubeData() {
    await axios
      .get('https://www.googleapis.com/youtube/v3/channels', { params })
      .then((res) => {
        apiData.push(res.data.items);
        for (const data of res.data.items) {
          let video = data.contentDetails.relatedPlaylists.uploads;
          let id = data.id;
          fetchRecentYoutubeVideo(video, cnt); // 채널의 최근 동영상 정보 가져옴
          fetchYoutubePopularVideoData(id, cnt); // 채널의 인기 동영상 정보 가져옴
          cnt += 1;
        }
        setShow(true);
      })
      .catch((err) => console.log(err));
  }

  async function fetchRecentYoutubeVideo(video, cnt) {
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${video}&maxResults=${searchCnt}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        let ids = '';
        apiData2[cnt] = res.data.items;
        apiData4[cnt] = new Array(searchCnt);
        for (const video of apiData2[cnt]) {
          ids += `${video.snippet.resourceId.videoId},`;
          fetchRecentVideoData(video.snippet.resourceId.videoId, cnt, cnt2); // 동영상의 싫어요 수를 가져오는 함수
          cnt2 += 1;
        }
        console.log(apiData4);
        fetchRecentVideoData2(cnt, ids); // 동영상의 싫어요 수와 같은 민감한 정보는 제외된 좀더 디테일한 정보를 가져오는 함수
        cnt2 = 0;
      })
      .catch((err) => console.log(err));
  }

  async function fetchRecentVideoData(id, cnt, cnt2) {
    await axios
      .get(`/votes?videoId=${id}`)
      .then((res) => {
        console.log(cnt2);
        apiData4[cnt][cnt2] = res;
      })
      .catch((err) => console.log(err));
  }

  async function fetchRecentVideoData2(cnt, ids) {
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,topicDetails&id=${ids}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        apiData5[cnt] = res.data.items;
        console.log(apiData5);
      })
      .catch((err) => console.log(err));
  }

  async function fetchYoutubePopularVideoData(id, cnt) {
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${id}&order=viewCount&type=video&maxResults=10&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        apiData3[cnt] = res.data.items;
        console.log(apiData3);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (isLoading === false) {
      let channel = '';
      apiData2.length = data.data.data[0].stake.length;
      apiData3.length = data.data.data[0].stake.length;
      apiData5.length = data.data.data[0].stake.length;
      apiData4.length = data.data.data[0].stake.length;
      data.data.data[0].stake.forEach((element) => {
        channel += element;
      });
      setParams(() => {
        let copy = { ...params };
        return { ...copy, id: channel };
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (params.id != '') {
      fetchYoutubeData();
    }
  }, [params]);

  useEffect(() => {
    return () => {
      const apiData = [];
      const apiData2 = [];
      const apiData3 = [];
      const apiData5 = [];
      var apiData4 = [];
      let searchCnt = 15;
      let cnt = 0;
      let cnt2 = 0;
    };
  }, []);

  if (isLoading) {
    return <div>Loading..</div>;
  }
  return (
    <React.Fragment>
      {show ? (
        <StyledContainer fluid>
          <AssetWrapper>
            <AssetInfo apiData={apiData} userData={data} />
            <Assets
              apiData={apiData}
              videoData={apiData2}
              popularVideoData={apiData3}
              detailData={apiData4}
              detailData2={apiData5}
            />
          </AssetWrapper>
        </StyledContainer>
      ) : null}
    </React.Fragment>
  );
}

export default Dashboard;
