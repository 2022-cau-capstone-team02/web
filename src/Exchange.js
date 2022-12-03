import React, { useCallback, useEffect, useState } from 'react';
import { commonTheme } from './theme';
import styled from 'styled-components';
import FlexRowCenter from './components/FlexRowCenter';
import Modal from 'react-modal';
import { HiChevronDown } from 'react-icons/hi';
import { useRecoilValue } from 'recoil';
import useClient from './hooks/useClient';
import { channelListAtom, userAssetAtom } from './atoms';
import { buySwap, sellSwap, liquidityQuery, increaseAllowance } from './queries';
import { UPPERCASE_COIN_MINIMAL_DENOM } from './constants';

// This is your rpc endpoint
const rpcEndpoint = 'https://rpc.cliffnet.cosmwasm.com:443/';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Exchange = () => {
  const { client, stargateClient, userAddress } = useClient();
  const channelList = useRecoilValue(channelListAtom);
  const userAsset = useRecoilValue(userAssetAtom);
  const [topInput, setTopInput] = useState(0);
  const [liquidities, setLiquidities] = useState(0);
  const [currentTokenPosition, setCurrentTokenPosition] = useState('TOP');
  const [bottomToken, setBottomToken] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBuy, setIsBuy] = useState(true);

  const handleModal = useCallback(() => {
    setModalIsOpen((prev) => !prev);
  }, [modalIsOpen]);

  useEffect(() => {
    if (!bottomToken) return;
    (async () => {
      const liquidityQueryResult = await liquidityQuery(client, bottomToken.poolAddress);
      setLiquidities(liquidityQueryResult.liquidity);
    })();
  }, [bottomToken]);

  return (
    <React.Fragment>
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <span>토큰 선택</span>
          <button onClick={handleModal}>X</button>
        </div>
        {channelList.map((token, index) => {
          return (
            <a
              onClick={() => {
                setBottomToken(token);
                handleModal();
              }}
              key={token.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: channelList.length === index + 1 ? 0 : 8,
                border: '1px solid red',
                padding: '8px 24px',
              }}
            >
              <img
                alt={`TOKEN_IMG--${token.ticker}`}
                src={token.src}
                style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <span>{token.name}</span>
                <span>{token.ticker}</span>
              </div>
            </a>
          );
        })}
      </Modal>
      <Container style={{ backgroundColor: commonTheme.palette.light.blue900 }}>
        <SwapWrapper
          style={{ background: 'aliceblue' }}
          border={`3px solid ${commonTheme.palette.light.blue700}`}
        >
          <SwapHeader>
            <span style={{ fontSize: '2rem' }}>스왑</span>
            <button onClick={() => setIsBuy((prev) => !prev)}>{isBuy ? '매수' : '매도'}</button>
          </SwapHeader>
          {isBuy ? (
            <React.Fragment>
              <SwapTokenContainer>
                <SwapTokenWrapper bgColor={commonTheme.palette.light.blue300} className={'wrapper'}>
                  <FlexRowCenter>
                    <SwapTokenInput
                      inputMode="decimal"
                      onChange={(e) => {
                        setTopInput(Number(e.target.value));
                      }}
                      autoComplete="off"
                      autoCorrect="off"
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      placeholder="0"
                      minLength="1"
                      maxLength="79"
                      spellCheck="false"
                      value={topInput}
                    />
                    <button>
                      <span>{UPPERCASE_COIN_MINIMAL_DENOM}</span>
                    </button>
                  </FlexRowCenter>
                  <span>
                    보유량 : {userAsset?.[UPPERCASE_COIN_MINIMAL_DENOM]}{' '}
                    {UPPERCASE_COIN_MINIMAL_DENOM}
                  </span>
                </SwapTokenWrapper>
                <SwapTokenWrapper bgColor={commonTheme.palette.light.blue300} className={'wrapper'}>
                  <FlexRowCenter>
                    <SwapTokenInput
                      inputMode="decimal"
                      onChange={(e) => {
                        setTopInput(Number(e.target.value));
                      }}
                      autoComplete="off"
                      autoCorrect="off"
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      placeholder="0"
                      minLength="1"
                      maxLength="79"
                      spellCheck="false"
                      value={
                        liquidities && Number(topInput) > 0
                          ? (
                              (Number(liquidities?.[0].amount) / Number(liquidities?.[1].amount)) *
                              Number(topInput)
                            ).toFixed(8)
                          : 0
                      }
                    />
                    <a
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid black',
                        padding: '4px 8px',
                      }}
                      onClick={() => {
                        setCurrentTokenPosition('BOTTOM');
                        handleModal();
                      }}
                    >
                      {bottomToken && (
                        <img
                          alt={`TOKEN_IMG--${bottomToken.ticker}`}
                          src={bottomToken.src}
                          style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                        />
                      )}
                      {bottomToken ? bottomToken.ticker : '토큰 선택'}
                      <HiChevronDown />
                    </a>
                  </FlexRowCenter>
                  {liquidities && (
                    <span>
                      가격 :{' '}
                      {(Number(liquidities?.[1].amount) / Number(liquidities?.[0].amount)).toFixed(
                        8,
                      )}{' '}
                      {UPPERCASE_COIN_MINIMAL_DENOM}
                    </span>
                  )}
                </SwapTokenWrapper>
              </SwapTokenContainer>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <SwapTokenContainer>
                <SwapTokenWrapper bgColor={commonTheme.palette.light.blue300} className={'wrapper'}>
                  <FlexRowCenter>
                    <SwapTokenInput
                      inputMode="decimal"
                      onChange={(e) => {
                        setTopInput(Number(e.target.value));
                      }}
                      autoComplete="off"
                      autoCorrect="off"
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      placeholder="0"
                      minLength="1"
                      maxLength="79"
                      spellCheck="false"
                      value={topInput}
                    />
                    <a
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid black',
                        padding: '4px 8px',
                      }}
                      onClick={() => {
                        setCurrentTokenPosition('BOTTOM');
                        handleModal();
                      }}
                    >
                      {bottomToken && (
                        <img
                          alt={`TOKEN_IMG--${bottomToken.ticker}`}
                          src={bottomToken.src}
                          style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                        />
                      )}
                      {bottomToken ? bottomToken.ticker : '토큰 선택'}
                      <HiChevronDown />
                    </a>
                  </FlexRowCenter>
                  {liquidities && (
                    <span>
                      가격 :{' '}
                      {(Number(liquidities?.[1].amount) / Number(liquidities?.[0].amount)).toFixed(
                        8,
                      )}{' '}
                      {UPPERCASE_COIN_MINIMAL_DENOM}
                    </span>
                  )}
                </SwapTokenWrapper>
                <SwapTokenWrapper bgColor={commonTheme.palette.light.blue300} className={'wrapper'}>
                  <FlexRowCenter>
                    <SwapTokenInput
                      inputMode="decimal"
                      autoComplete="off"
                      autoCorrect="off"
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      placeholder="0"
                      minLength="1"
                      maxLength="79"
                      spellCheck="false"
                      value={
                        liquidities && Number(topInput) > 0
                          ? (
                              (Number(liquidities?.[1].amount) / Number(liquidities?.[0].amount)) *
                              Number(topInput)
                            ).toFixed(8)
                          : 0
                      }
                    />
                    <button>
                      <span>{UPPERCASE_COIN_MINIMAL_DENOM}</span>
                    </button>
                  </FlexRowCenter>
                </SwapTokenWrapper>
              </SwapTokenContainer>
            </React.Fragment>
          )}
          <SwapButton
            onClick={async () => {
              if (!bottomToken && Number(topInput) === 0) return;
              if (isBuy) {
                const bidSwapResult = await buySwap(
                  client,
                  userAddress,
                  bottomToken.poolAddress,
                  topInput.toString(10),
                );
                console.log('bidSwapResult', bidSwapResult);
              } else {
                console.log(bottomToken);
                const increaseAllowanceResult = await increaseAllowance(
                  client,
                  userAddress,
                  bottomToken.tokenAddress,
                  bottomToken.poolAddress,
                  topInput.toString(10),
                );
                console.log('increaseAllowanceResult', increaseAllowanceResult);

                const askSwapResult = await sellSwap(
                  client,
                  userAddress,
                  bottomToken.tokenAddress,
                  bottomToken.poolAddress,
                  topInput.toString(10),
                );
                console.log('askSwapResult', askSwapResult);
              }
              window.dispatchEvent('refreshAsset');
            }}
          >
            스왑하기
          </SwapButton>
        </SwapWrapper>
      </Container>
    </React.Fragment>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SwapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
  border: ${(props) => props.border};
`;

const SwapHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SwapTokenContainer = styled.div`
  margin-bottom: 16px;
  .wrapper:first-child {
    margin-bottom: 16px;
  }
`;

const SwapTokenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.bgColor};
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 2px 7px ${commonTheme.palette.light.blue700};
`;

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
`;

const SwapButton = styled.button`
  display: flex;
  border: none;
  box-shadow: 0px 3px 10px grey;
  padding: 16px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export default Exchange;
