import React from "react";
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
    width: 50%;
    height: 90%;
    position: absolute;
    padding: 30px;
    background-color: aliceblue;
    border-radius: 10px;
    box-shadow: 5px 10px 10px grey;
    overflow: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    } /* Chrome, Safari, Opera*/
`

const Form = styled.div`

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
                {/* <Form></Form> */}
            </FormContainer>
        </Container>
    )
}

export default Detail
