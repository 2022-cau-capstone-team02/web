import React, { useEffect, useState } from 'react'
import {Line, Doughnut} from 'react-chartjs-2';
import styled from 'styled-components';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: [

    ],
    datasets: [{
        label: 'My Stake Dataset',
        data: [70, 20, 10],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4,
    }]
};

const options = {
    layout: {
        padding: 20
    }  
}

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  width:50vh;
  height:50vh;
  @media screen and (max-width:576px){
    width:100%;
  }
`

const InfoContainer = styled.div`
  display: flex;
  padding: 1px;
  width:70%;
  height: 100%;
  @media screen and (max-width:576px){
    width:100%;
  }
`


const Container = styled.div`
  width: 100%;
  height: 400px;
  padding: 30px;
  display: flex;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 3px 3px 10px grey;
  @media screen and (max-width:576px){
    flex-direction: column;
  }
`

const Profile = styled.h1`
 
`

const AssetInfo = ({apiData}) => {
    const [show, setShow] = useState(false);
    const labels = ()=>{
        if(data.labels.length == 0){
            apiData[0].map((apiData, index)=>{data.labels.push(apiData.snippet.title)});
        }
        setShow(true);
    }

    useEffect(()=>{
        labels();
    },[]) 
    
    return (
        
        <Container>
            {show ? 
            <>
                <InfoContainer>
                    <Profile>
                    방성원님의 현재 자산
                    </Profile>
                </InfoContainer>
                <ChartContainer>
                    <Doughnut data={data} options={options} style={{width:'100%', height:'100%'}}/>
                </ChartContainer>
            </>:null}
            
        </Container>
    )
}

export default AssetInfo
