import React, { useCallback, useState } from 'react';
import { commonTheme } from './theme';
import styled from 'styled-components';
import FlexRowCenter from './components/FlexRowCenter';
import Modal from 'react-modal';
import { HiChevronDown } from 'react-icons/hi';

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
    name: 'Wrapped ETH',
    src: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880',
    ticker: 'WETH',
  },
  {
    id: 1,
    src: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880',
    name: 'Ethereum',
    ticker: 'ETH',
  },
  {
    id: 2,
    src: 'https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028',
    name: '1inch',
    ticker: '1INCH',
  },
  {
    id: 3,
    src: 'https://assets.coingecko.com/coins/images/12390/thumb/ACH_%281%29.png?1599691266',
    name: 'My Neighbor Alice',
    ticker: 'ALICE',
  },
];

const Exchange = () => {
  const [topInput, setTopInput] = useState(0);
  const [currentTokenPosition, setCurrentTokenPosition] = useState('TOP');
  const [topToken, setTopToken] = useState({
    id: 1,
    src: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880',
    name: 'Ethereum',
    ticker: 'ETH',
  });
  const [bottomToken, setBottomToken] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
            <button
              onClick={() => {
                if (currentTokenPosition === 'TOP') {
                  setTopToken(token);
                } else {
                  setBottomToken(token);
                }
                handleModal();
              }}
              key={token.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: tokenList.length === index + 1 ? 0 : 8,
              }}
            >
              <img alt={`TOKEN_IMG--${token.ticker}`} src={token.src} />
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
            </button>
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
                <button
                  onClick={() => {
                    setCurrentTokenPosition('TOP');
                    handleModal();
                  }}
                >
                  <img alt={`TOKEN_IMG--${topToken.ticker}`} src={topToken.src} />
                  {topToken.ticker}
                  <HiChevronDown />
                </button>
              </FlexRowCenter>
              <span>$123,456.81</span>
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
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    setCurrentTokenPosition('BOTTOM');
                    handleModal();
                  }}
                >
                  {bottomToken && (
                    <img alt={`TOKEN_IMG--${bottomToken.ticker}`} src={bottomToken.src} />
                  )}
                  {bottomToken ? bottomToken.ticker : '토큰 선택'}
                  <HiChevronDown />
                </button>
              </FlexRowCenter>
              <span>
                $123,456.81 <span style={{ color: 'red' }}>(-3.81%)</span>
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
