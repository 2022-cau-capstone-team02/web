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

    background-color: #fffff7;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 5px 10px 10px grey;
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
        width: 550px;
    }
`

const Form = styled.div`
    width: 100%;
    height: 100%;

`

const CloseIcon = styled(RiCloseFill)`
    position: absolute;
    top:2%;
    right:2%;
    font-size: 4rem;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.7);
    &:hover{
        cursor: pointer;
    }
`


const Detail = ({show, setShow, apiData}) => {
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

                </Form>
            </FormContainer>
        </Container>
    )
}

export default Detail
