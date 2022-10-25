import React, {useState} from 'react'
import {commonTheme} from "./theme";
import styled from "styled-components";
import FlexRowCenter from "./components/FlexRowCenter";

const Exchange = () => {
  const [topInput, setTopInput ] = useState(0)
  return (
    <Container style={{ backgroundColor : commonTheme.palette.light.blue900}}>
      <SwapWrapper border={`1px solid ${commonTheme.palette.light.blue700}`}>
        <SwapHeader>
          <span>스왑</span>
        </SwapHeader>
        <SwapTokenContainer>
          <SwapTokenWrapper bgColor={commonTheme.palette.light.blue300} className={"wrapper"}>
            <FlexRowCenter>
              <SwapTokenInput inputMode="decimal"
                              onChange={(e) => {
                                setTopInput(Number(e.target.value))
                              }}
                              autoComplete="off" autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0"
                              minLength="1" maxLength="79" spellCheck="false" value={topInput} />
              <button>ETH</button>
            </FlexRowCenter>
            <p>$123,456.81</p>
          </SwapTokenWrapper>
          <SwapTokenWrapper bgColor={commonTheme.palette.light.blue300} className={"wrapper"}>
            <FlexRowCenter>
              <SwapTokenInput inputMode="decimal"
                              onChange={(e) => {
                                setTopInput(Number(e.target.value))
                              }}
                              autoComplete="off" autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0"
                              minLength="1" maxLength="79" spellCheck="false" value={topInput} />
              <button>ETH</button>
            </FlexRowCenter>
            <span>$123,456.81 <span style={{ color : 'red' }}>(-3.81%)</span></span>
          </SwapTokenWrapper>
        </SwapTokenContainer>
        <SwapButton>스왑하기</SwapButton>
      </SwapWrapper>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height : 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SwapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding : 16px;
  border-radius: 16px;
  border: ${(props) => props.border};
`

const SwapHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SwapTokenContainer = styled.div`
  margin-bottom: 16px;
  .wrapper:first-child {
    margin-bottom: 16px;
  }
`

const SwapTokenWrapper =styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.bgColor};
  border-radius: 16px;
  padding : 16px;
`

const SwapTokenInput = styled.input`
  filter: none;
  opacity: 1;
  background-color: transparent;
  border: none;
  transition: opacity 0.2s ease-in-out 0s;
  text-align: left;
  font-size: 36px;
  line-height: 44px;
  font-variant: small-caps;
`

const SwapButton = styled.button`
  display: flex;
  padding : 16px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`


export default Exchange
