import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { fundingChannel } from './queries';
import useClient from './hooks/useClient';

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
  const { client, stargateClient, userAddress } = useClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableKrw, setAvailableKrw] = useState();

  useEffect(() => {
    if (!stargateClient || !userAddress) return;

    (async () => {
      const balance = await stargateClient.getBalance(userAddress, 'ukrw');
      setAvailableKrw(balance);
    })();
  }, [stargateClient, userAddress]);

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
          <Box>
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
          </Box>
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

export default Funding;
