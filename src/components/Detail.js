import React from "react";
import { RiCloseFill } from "react-icons/ri";
import styled from "styled-components";

const Container = styled.div`
    width:100vw;
    height:100vh;
    z-index: 20;
    position:fixed;
    top:0;
    left:0;
    display:${({show})=>(show?'flex':'none')};
    justify-content: center;
    align-items: center;
`

const Overlay = styled.div`
    background-color: rgba(36, 36, 36, 0.438);
    position: absolute;
    width:100%;
    height: 100%;
`

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
    @media screen and (max-width:768px){
        width: 350px;
    }
    @media screen and (min-width:768px){
        width: 450px;  
    }
    @media screen and (min-width:992px){
        width: 850px;
    }
`

const Form = styled.div`
    width: 100%;
    height: 100%;

`

const CloseIcon = styled(RiCloseFill)`
    position: absolute;
    top:20px;
    right:20px;
    font-size: 4rem;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.7);
    &:hover{
        cursor: pointer;
    }
`

const ProfileContainer = styled.div`
    margin-top: 50px;
    display: flex;
`

const ProfileImageContainer = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ProfileImage = styled.img`
    border-radius: 20px;
    box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
    width: 150px;
    height: 150px;
`

const ProfileInfo = styled.div`
    flex-grow: 4;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 5px 0 rgb(51 3 0 / 20%);
    padding:20px;
    border-radius: 20px;
`

const Title = styled.h4`
    grid-area: Channel;
`

const DetailInfo = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`


const Subscribers = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Views = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Videos = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const ChannelIncome = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`



const Detail = ({show, setShow, data}) => {
    const close = () => {
        document.body.style.overflow = "unset";
        setShow(!show);
    };
    return (

        <Container show={show}>
            <Overlay onClick={close}/>
            <FormContainer>
                <CloseIcon onClick={close}/>
                <Form>
                    <ProfileContainer>
                        <ProfileImageContainer>
                            <ProfileImage src={data.snippet.thumbnails.default.url}/>
                        </ProfileImageContainer>
                        <ProfileInfo>
                            <Title>{data.snippet.title}</Title>
                            <DetailInfo>
                                <Subscribers>
                                    <span style={{opacity:'0.5'}}>구독자 수</span>
                                    <span>{data.statistics.subscriberCount}</span>
                                </Subscribers>
                                <Views>
                                    <span style={{opacity:'0.5'}}>총 조회수</span>
                                    <span>{data.statistics.viewCount}</span>
                                </Views>
                                <Videos>
                                    <span style={{opacity:'0.5'}}>총 비디오수</span>
                                    <span>{data.statistics.videoCount}</span>
                                </Videos>
                                <ChannelIncome>
                                    <span style={{opacity:'0.5'}}>예상 채널 수익</span>
                                    <span>{(data.statistics.viewCount / 1000) * 4}$</span>
                                </ChannelIncome>
                            </DetailInfo> 
                        </ProfileInfo>
                    </ProfileContainer>
                    
                </Form>
            </FormContainer>
        </Container>
    )
}

export default Detail
