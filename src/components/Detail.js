import React from "react";
import styled from "styled-components";

const Container = styled.div`
    width:100vw;
    height:100vh;
    z-index: 20;
    position:fixed;
    display:${({show})=>(show?'flex':'none')};
    transition: 0.5s ease-in-out;
`

const Overlay = styled.div`
    background-color: rgba(36, 36, 36, 0.438);
    position: absolute;
    width:100%;
    height: 100%;

`

const Detail = ({show, setShow}) => {
    console.log(show);
    const close = () => {
        document.body.style.overflow = "unset";
        setShow(!show);
    };
    return (
        <Container show={show}>
            <Overlay/>
        
        </Container>
    )
}

export default Detail
