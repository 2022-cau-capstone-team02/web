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
const userData = [];
let cnt = 0;

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
  const [next, setNext] = useState(false);
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
        console.log(apiData[0]);
        setNext(true);
      })
      .catch((err) => console.log(err));
  }

  async function fetchYoutubeVideoData(video) {
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${video}&maxResults=5&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        apiData2.push(res.data.items);
        console.log(apiData2);
        cnt = cnt + 1;
        setShow(true);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    if (isLoading === false) {
      let channel = '';
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
    if (next === true) {
      let video = '';
      apiData[0].forEach((element) => {
        console.log(element);
        video = element.contentDetails.relatedPlaylists.uploads;
        fetchYoutubeVideoData(video);
        setTimeout(() => {}, 100);
      });
    }
  }, [next]);

  if (isLoading) {
    return <div>Loading..</div>;
  }
  return (
    <React.Fragment>
      {show ? (
        <StyledContainer fluid>
          <AssetWrapper>
            <AssetInfo apiData={apiData} />
            <Assets apiData={apiData} videoData={apiData2} />
          </AssetWrapper>
        </StyledContainer>
      ) : null}
    </React.Fragment>
  );
}

export default Dashboard;
