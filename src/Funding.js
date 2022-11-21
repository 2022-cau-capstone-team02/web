import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { coin, CosmWasmClient, SigningCosmWasmClient } from 'cosmwasm';
import { SigningStargateClient } from '@cosmjs/stargate';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { fundingChannel, instantiateIcoContract } from './queries';
import { address } from 'faker';

// This is your rpc endpoint
const rpcEndpoint = 'http://127.0.0.1:26657';
const chainId = 'ysip';

const feeMsg = {
  amount: [
    {
      denom: 'ukrw',
      amount: '1',
    },
  ],
  // gas는 항상 이만큼 사용되는 것이 아니라 상한선임
  gas: '450000',
};

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

const suggest_ysip_chain = async () => {
  await window.keplr.experimentalSuggestChain({
    chainId: 'ysip',
    chainName: 'ysip chain',
    rpc: 'http://127.0.0.1:26657',
    rest: 'http://127.0.0.1:1317',
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'ysip',
      bech32PrefixAccPub: 'ysip' + 'pub',
      bech32PrefixValAddr: 'ysip' + 'valoper',
      bech32PrefixValPub: 'ysip' + 'valoperpub',
      bech32PrefixConsAddr: 'ysip' + 'valcons',
      bech32PrefixConsPub: 'ysip' + 'valconspub',
    },
    currencies: [
      {
        coinDenom: 'KRW',
        coinMinimalDenom: 'ukrw',
        coinDecimals: 6,
        // coinGeckoId: 'krw',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'KRW',
        coinMinimalDenom: 'ukrw',
        coinDecimals: 6,
        // coinGeckoId: 'krw',
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: 'KRW',
      coinMinimalDenom: 'ukrw',
      coinDecimals: 6,
      // coinGeckoId: 'skrw',
    },
  });
};

const icoChannelList = [
  {
    id: 0,
    name: '곽튜브KWAKTUBE',
    src: 'https://yt3.ggpht.com/IiZfu92VbzJoI3gcw7NwyQTXBSPgk9-GBIwVj8tGEex-9uozEIvfDX2N6DNJVh15Uh1yy42VaA=s176-c-k-c0x00ffffff-no-rj',
    ticker: 'KWAK',
    address: '123123121233',
  },
  {
    id: 1,
    src: 'https://yt3.ggpht.com/ytc/AMLnZu83-5or1HaIln7R1dxZ3te2xGAoRwhS6cAdsDzCtw=s176-c-k-c0x00ffffff-no-rj',
    name: '피지컬갤러리',
    ticker: 'PG',
    address: '12312312312323133121233',
  },
  {
    id: 2,
    src: 'https://yt3.ggpht.com/ytc/AMLnZu9NaXMe8tiBBVF3N608TFvJSihHF2Ez8yPIqkTl1g=s176-c-k-c0x00ffffff-no-rj',
    name: 'MrBeast',
    ticker: 'MRB',
    address: '12312312fasdfasdf1233',
  },
  {
    id: 3,
    src: 'https://yt3.ggpht.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s176-c-k-c0x00ffffff-no-rj',
    name: 'PewDiePie',
    ticker: 'PDD',
    address: '12312123123das312fasdfasdf1233',
  },
];

const Funding = () => {
  const [client, setClient] = useState();
  const [stargateClient, setStargateClient] = useState();
  const [userAddress, setUserAddress] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableKrw, setAvailableKrw] = useState();

  const [isInstantiateIcoContractLoading, setIsInstantiateIcoContractLoading] = useState(false);
  useEffect(() => {
    if (!stargateClient || !userAddress) return;

    (async () => {
      const balance = await stargateClient.getBalance(userAddress, 'ukrw');
      setAvailableKrw(balance);
    })();
  }, [stargateClient, userAddress]);

  console.log(availableKrw);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      fundingAmount: 0,
      totalTokenAmount: 0,
      tokenName: '',
      tokenSymbol: '',
      recipient: '',
    },
  });

  useEffect(() => {
    (async () => {
      if (!window.keplr) {
        alert('Please install keplr extension');
      } else {
        await suggest_ysip_chain();
        window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        setUserAddress(accounts[0].address);
        const currentClient = await SigningCosmWasmClient.connectWithSigner(
          rpcEndpoint,
          offlineSigner,
        );
        setClient(currentClient);
        const currentStargateClient = await SigningStargateClient.connect(
          rpcEndpoint,
          // userAddress,
          // offlineSigner,
        );
        setStargateClient(currentStargateClient);
      }
    })();
  }, []);

  const handleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, [isModalOpen]);

  return (
    <React.Fragment>
      <Modal isOpen={isModalOpen} style={customStyles}>
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
              onClick={() => handleModal()}
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
      <Container>
        <Stack>
          <p>관리자 영역</p>
          <Flex flexDirection={'row'}>
            <Box flexDirection={'column'} mr={4}>
              Step1. 토큰 컨트렉트를 생성합니다.
              <Controller
                name="fundingAmount"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="총 모집 금액" />
                )}
              />
              <Controller
                name="totalTokenAmount"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="생성될 토큰 개수" />
                )}
              />
              <Controller
                name="tokenName"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="채널 이름" />
                )}
              />
              <Controller
                name="tokenSymbol"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="채널 토큰 이름" />
                )}
              />
              <Controller
                name="recipient"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="채널 주인 이름" />
                )}
              />
              <Button
                w={'100%'}
                colorScheme="teal"
                onClick={() => {
                  handleSubmit(async (data) => {
                    setIsInstantiateIcoContractLoading(true);
                    const { fundingAmount, tokenName, tokenSymbol, totalTokenAmount, recipient } =
                      data;
                    const deadline = 3000;
                    try {
                      await instantiateIcoContract(
                        client,
                        userAddress,
                        fundingAmount.toString(),
                        deadline,
                        tokenName,
                        tokenSymbol,
                        totalTokenAmount.toString(),
                        recipient,
                      );
                    } finally {
                      setIsInstantiateIcoContractLoading(false);
                    }
                  })();
                }}
              >
                토큰 생성
              </Button>
            </Box>
            <Box flexDirection={'column'}>
              Step2. 토큰을 생성합니다.
              <Controller
                name="fundingAmount"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="총 모집 금액" />
                )}
              />
              <Controller
                name="totalTokenAmount"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="생성될 토큰 개수" />
                )}
              />
              <Controller
                name="tokenName"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="채널 이름" />
                )}
              />
              <Controller
                name="tokenSymbol"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="채널 토큰 이름" />
                )}
              />
              <Controller
                name="recipient"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input mb={4} value={value} onChange={onChange} placeholder="채널 주인 이름" />
                )}
              />
              <Button
                colorScheme="teal"
                isLoading={isInstantiateIcoContractLoading}
                w={'100%'}
                onClick={() => {
                  handleSubmit(async (data) => {
                    setIsInstantiateIcoContractLoading(true);
                    const { fundingAmount, tokenName, tokenSymbol, totalTokenAmount, recipient } =
                      data;
                    const deadline = 3000;
                    try {
                      await instantiateIcoContract(
                        client,
                        userAddress,
                        fundingAmount.toString(),
                        deadline,
                        tokenName,
                        tokenSymbol,
                        totalTokenAmount.toString(),
                        recipient,
                      );
                    } finally {
                      setIsInstantiateIcoContractLoading(false);
                    }
                  })();
                }}
              >
                토큰 생성
              </Button>
            </Box>
          </Flex>
        </Stack>
        <Stack>
          <p>유저 영역</p>
          {icoChannelList.map((icoChannel) => {
            return (
              <IcoChannel
                key={icoChannel.address}
                icoChannel={icoChannel}
                userAddress={userAddress}
                availableKrw={availableKrw}
                client={client}
              />
            );
          })}
        </Stack>
      </Container>
    </React.Fragment>
  );
};

const IcoChannel = ({ icoChannel, client, availableKrw, userAddress }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      fundingAmount: 0,
    },
  });

  return (
    <Flex alignItems={'center'} flexDirection={'row'}>
      <Box mr={8}>
        <Image rounded={'md'} src={icoChannel.src} />
      </Box>
      <Box>
        <Box mb={4}>
          <Heading>
            {icoChannel.name} ({icoChannel.ticker})
          </Heading>
        </Box>
        <Flex mb={4} alignItems={'center'}>
          <CircularProgress mr={4} value={80} size={'120px'} />
          <Flex flexDirection={'column'}>
            <Box>현재까지 모집 금액 : 80000 uKRW</Box>
            <Box>총 모집 금액 : 100000 uKRW</Box>
          </Flex>
        </Flex>

        <Text>투자 가능한 금액 : {availableKrw?.amount} uKRW</Text>
        <Controller
          name="fundingAmount"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              mb={4}
              type={'number'}
              max={Number(availableKrw?.amount)}
              value={value}
              onChange={onChange}
              placeholder="얼마만큼 투자하시겠어요?"
            />
          )}
        />
        <Button
          w={'100%'}
          onClick={() => {
            handleSubmit(async (data) => {
              const { fundingAmount } = data;
              await fundingChannel(client, userAddress, icoChannel.address, fundingAmount);
            })();
          }}
          colorScheme="teal"
        >
          투자하기
        </Button>
      </Box>
    </Flex>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 100px;
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

export default Funding;
