import React, { useCallback, useEffect, useState } from 'react';
import { commonTheme } from './theme';
import styled from 'styled-components';
import FlexRowCenter from './components/FlexRowCenter';
import Modal from 'react-modal';
import { HiChevronDown } from 'react-icons/hi';
import { CosmWasmClient } from 'cosmwasm';

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

const tokenList = [
  {
    id: 0,
    name: '곽튜브KWAKTUBE',
    src: 'https://yt3.ggpht.com/IiZfu92VbzJoI3gcw7NwyQTXBSPgk9-GBIwVj8tGEex-9uozEIvfDX2N6DNJVh15Uh1yy42VaA=s176-c-k-c0x00ffffff-no-rj',
    ticker: 'KBAK',
  },
  {
    id: 1,
    src: 'https://yt3.ggpht.com/ytc/AMLnZu83-5or1HaIln7R1dxZ3te2xGAoRwhS6cAdsDzCtw=s176-c-k-c0x00ffffff-no-rj',
    name: '피지컬갤러리',
    ticker: 'PG',
  },
  {
    id: 2,
    src: 'https://yt3.ggpht.com/ytc/AMLnZu9NaXMe8tiBBVF3N608TFvJSihHF2Ez8yPIqkTl1g=s176-c-k-c0x00ffffff-no-rj',
    name: 'MrBeast',
    ticker: 'MRB',
  },
  {
    id: 3,
    src: 'https://yt3.ggpht.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s176-c-k-c0x00ffffff-no-rj',
    name: 'PewDiePie',
    ticker: 'PDD',
  },
];

const Exchange = () => {
  let client;
  const [topInput, setTopInput] = useState(0);
  const [currentTokenPosition, setCurrentTokenPosition] = useState('TOP');
  const [bottomToken, setBottomToken] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      client = await CosmWasmClient.connect(rpcEndpoint);
    })();
  }, []);

  const handleModal = useCallback(() => {
    setModalIsOpen((prev) => !prev);
  }, [modalIsOpen]);

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
        {tokenList.map((token, index) => {
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
                marginBottom: tokenList.length === index + 1 ? 0 : 8,
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
        <SwapWrapper border={`1px solid ${commonTheme.palette.light.blue700}`}>
          <SwapHeader>
            <span>스왑</span>
          </SwapHeader>
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
                  <span>μKRW</span>
                </button>
              </FlexRowCenter>
              <span>₩{topInput * 0.000001}</span>
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
              <span>
                ₩123,456,789 <span style={{ color: 'red' }}>(-3.81%)</span>
              </span>
            </SwapTokenWrapper>
          </SwapTokenContainer>
          <SwapButton>스왑하기</SwapButton>
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
  padding: 16px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export default Exchange;
