import { Environment, MapControls, OrbitControls, PerspectiveCamera, Plane } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef } from 'react'
import { Container } from 'react-bootstrap'
import styled from 'styled-components'
import { Physics } from '@react-three/cannon'
import { useNavigate } from 'react-router'
import Camera from './components/Camera'
import Control from './components/Control'
import Objects from './components/Objects'

const StyledContainer = styled(Container)`
  padding-top: 1px;
  margin: 0 auto;
  width: 100%;
  height: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Banner = styled.div`
  margin-top: 90px;
  width: 100%;
  height: 70%;
  position: relative;
`

const TextContainer = styled.div`
  position: absolute;
  top: 20%;
  z-index: 1;
  @media screen and (min-width:992px){
  left: 8%;
  }
  @media screen and (max-width:992px){
    left: 0;
    right:0;
  }
`

const Text = styled.h1`
  text-align: center;
  color : aliceblue;
  text-shadow: 1px 1px 5px aliceblue;
  font-size: 3rem;
  @media screen and (min-width:992px){
    font-size: 3.5rem;
  }
  @media screen and (min-width:1440px){
    font-size: 4rem;
  }
`

const MoveButton = styled.button`
  position: absolute;
  background-color: aliceblue;
  top: 50%;
  font-size: 1.5rem;
  height: 75px;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 600;
  border: none;
  border-radius: 15px;
  padding-left:30px;
  padding-right: 30px;
  box-shadow: 0px 2px 10px grey;
  &:hover{
    color: rgba(0, 0, 0, 1);
  }
`

const InfoContainer = styled.div`
  width:100%;
  height:50%;
  background-color: aliceblue;
`

const ObjectContainer = styled.div`
  position:absolute;
  width:100%;
  height: 100%;
`


const Info = () => {
  const navigate = useNavigate();
  
  return (
    <StyledContainer>
      <Banner>
        <TextContainer>
          <Text>Youtube Stake<br/>Investment Platform</Text>
        </TextContainer>
        <ObjectContainer>
   
          <Canvas  shadows={true}  gl={{antialias: true, powerPreference: 'high-performance'}} >
          <Environment preset='forest'/>
            <color attach="background" args={["#141414"]}/>
            
            <Control/>
            <Camera/>
            <Suspense fallback={null}>
              <Physics>
                <Objects/>
              </Physics>
            </Suspense>
            
          </Canvas>
        </ObjectContainer>
      </Banner>
      <MoveButton onClick={()=>{navigate('/exchange')}}>거래소 둘러보기</MoveButton>
      <InfoContainer>

      </InfoContainer>
    </StyledContainer>
  )
}

export default Info
