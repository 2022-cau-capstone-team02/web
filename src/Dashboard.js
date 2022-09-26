import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col} from 'react-bootstrap';
import styled from 'styled-components';
import AssetInfo from './components/AssetInfo';
import Assets from './components/Assets';
import _Navbar from './components/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DndProvider} from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import Sidebar from './components/Sidebar';

const apiData = [];
let cnt = 0;

const StyledContainer = styled(Container)`
  margin-top: 80px;
  background-color: #F5F7FB;
  padding : 0 auto;
  height: 100%;
`

const AssetWrapper = styled.div`
  width: 100%;
  padding: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`


function Dashboard() {
  const [show, setShow] = useState(false);
  const [params, setParams] = useState({
    key:process.env.REACT_APP_YOUTUBE_API_KEY,
    id:'UCSLrpBAzr-ROVGHQ5EmxnUg,UCaO6VoaYJv4kS-TQO_M-N_g,UCsKsymTY_4BYR-wytLjex7A,',
    part: 'id,snippet,contentDetails,statistics',
  });
  const id = [
    'UCSLrpBAzr-ROVGHQ5EmxnUg',
    'UCaO6VoaYJv4kS-TQO_M-N_g',
    'UCsKsymTY_4BYR-wytLjex7A',
  ];
  axios.defaults.baseURL = 'https://www.googleapis.com/youtube/v3';

  async function fetchData(){
    cnt = cnt+1;
    await axios.get('/channels', {params})
    .then((res)=>{
      apiData.push(res.data.items);
      setShow(true);
      localStorage.setItem(`keywordData${cnt}`, JSON.stringify(res.data.items)); 
      localStorage.setItem('count', JSON.stringify(cnt));
    })
    .catch(err=>console.log(err));
  }

  const changeParameter = () => {
    let copy = {...params};
    copy.id = id;
    setParams({...copy});
  }

  useEffect(()=>{
    let count = JSON.parse(localStorage.getItem('count'));
    if(count != null){
      cnt = count;
      apiData.push(JSON.parse(localStorage.getItem(`keywordData${cnt}`)));
      setShow(true);
    }
    else{
      fetchData();
    }
  },[])
  

  return (
      
    <StyledContainer fluid>
      {/* <Column lg={2}>
        <Sidebar/>
      </Column>
      <Column lg={10}> */}
      {show ? 
        <AssetWrapper>
          <AssetInfo apiData={apiData}/>
          {/* <DndProvider backend={HTML5Backend}> */}
            <Assets apiData={apiData}/>
          {/* </DndProvider> */}
        </AssetWrapper>
      :null}
     
        
      {/* </Column> */}
        
    </StyledContainer>      
  );
}

export default Dashboard;
