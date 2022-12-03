import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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
} from '@chakra-ui/react';
import {
  fundingChannel,
  totalFundingAmountQuery,
  icoInfoQuery,
  myFundingAmountQuery,
  tokenAddressQuery,
  channelTokenBalanceQuery,
} from './queries';
import useClient from './hooks/useClient';
import { COIN_MINIMAL_DENOM } from './constants';

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

const icoChannelList = [
  {
    id: 0,
    name: 'Channel A',
    src: 'https://yt3.ggpht.com/IiZfu92VbzJoI3gcw7NwyQTXBSPgk9-GBIwVj8tGEex-9uozEIvfDX2N6DNJVh15Uh1yy42VaA=s176-c-k-c0x00ffffff-no-rj',
    ticker: 'CHA',
    address: 'ysip19wfdqvt2rfhffpl0unulepjuwcgf0ycz3fu448u2v6f45j2c7fvqysrygz',
  },
  // {
  //   id: 1,
  //   name: 'Channel B',
  //   src: 'https://yt3.ggpht.com/ytc/AMLnZu83-5or1HaIln7R1dxZ3te2xGAoRwhS6cAdsDzCtw=s176-c-k-c0x00ffffff-no-rj',
  //   ticker: 'CHB',
  //   address: 'ysip1aakfpghcanxtc45gpqlx8j3rq0zcpyf49qmhm9mdjrfx036h4z5sj0pstt',
  // },
];

// ysip1vhndln95yd7rngslzvf6sax6axcshkxqpmpr886ntelh28p9ghuqyrsx7m

const Funding = () => {
  const { client, stargateClient, userAddress } = useClient();
  const [availableKrw, setAvailableKrw] = useState();

  useEffect(() => {
    if (!stargateClient || !userAddress) return;

    (async () => {
      const balance = await stargateClient.getBalance(userAddress, COIN_MINIMAL_DENOM);
      setAvailableKrw(balance);
    })();
  }, [stargateClient, userAddress]);

  useEffect(() => {
    if (!client || !userAddress) return;

    (async () => {
      const result = await tokenAddressQuery(
        client,
        'ysip19wfdqvt2rfhffpl0unulepjuwcgf0ycz3fu448u2v6f45j2c7fvqysrygz',
      );
      const tokenAddress = result.address;
      const newResult = await channelTokenBalanceQuery(client, userAddress, tokenAddress);
      console.log(newResult, result);
    })();
  }, [client, userAddress]);

  return (
    <React.Fragment>
      <Container>
        <div>투자 가능한 금액 : {availableKrw?.amount} uKRW</div>
        <Stack>
          <Box>
            {icoChannelList.map((icoChannel) => {
              return (
                <IcoChannel
                  key={icoChannel.address}
                  icoChannel={icoChannel}
                  userAddress={userAddress}
                  availableKrw={availableKrw}
                  setAvailableKrw={setAvailableKrw}
                  client={client}
                  stargateClient={stargateClient}
                />
              );
            })}
          </Box>
        </Stack>
      </Container>
    </React.Fragment>
  );
};

const IcoChannel = ({
  icoChannel,
  availableKrw,
  client,
  stargateClient,
  setAvailableKrw,
  userAddress,
}) => {
  const [totalFundingAmount, setTotalFundingAmount] = useState();
  const [myFundingAmount, setMyFundingAmount] = useState();
  const [icoInfo, setIcoInfo] = useState();
  const [isFundingChannelLoading, setIsFundingChannelLoading] = useState(false);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      fundingAmount: 0,
    },
  });

  useEffect(() => {
    if (!client) return;

    (async () => {
      const totalFundingAmountQueryResult = await totalFundingAmountQuery(
        client,
        icoChannel.address,
      );
      setTotalFundingAmount(totalFundingAmountQueryResult);

      const icoInfoQueryResult = await icoInfoQuery(client, icoChannel.address);
      setIcoInfo(icoInfoQueryResult);

      const myFundingAmountQueryResult = await myFundingAmountQuery(
        client,
        userAddress,
        icoChannel.address,
      );
      setMyFundingAmount(myFundingAmountQueryResult);
    })();
  }, [client]);

  console.log(
    Number(totalFundingAmount?.amount),
    Number(icoInfo?.target_funding_amount),
    Math.floor(Number(totalFundingAmount?.amount) / Number(icoInfo?.target_funding_amount)),
  );

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
          <CircularProgress
            mr={4}
            value={Math.floor(
              Number(totalFundingAmount?.amount) / Number(icoInfo?.target_funding_amount),
            )}
            size={'120px'}
          />
          <Flex flexDirection={'column'}>
            <Box>현재까지 모집 금액 : {totalFundingAmount?.amount} uKRW</Box>
            <Box>내가 투자한 금액 : {myFundingAmount?.amount} uKRW</Box>
            <Box>총 모집 금액 : {icoInfo?.target_funding_amount} uKRW</Box>
          </Flex>
        </Flex>

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
              max={availableKrw ? Number(availableKrw?.amount) : undefined}
              value={value}
              onChange={onChange}
              placeholder="얼마만큼 투자하시겠어요?"
            />
          )}
        />
        <Button
          w={'100%'}
          isLoading={isFundingChannelLoading}
          onClick={() => {
            handleSubmit(async (data) => {
              const { fundingAmount } = data;
              setIsFundingChannelLoading(true);
              try {
                await fundingChannel(client, userAddress, icoChannel.address, fundingAmount);

                const balance = await stargateClient.getBalance(userAddress, COIN_MINIMAL_DENOM);
                setAvailableKrw(balance);

                const totalFundingAmountQueryResult = await totalFundingAmountQuery(
                  client,
                  icoChannel.address,
                );
                setTotalFundingAmount(totalFundingAmountQueryResult);

                const myFundingAmountQueryResult = await myFundingAmountQuery(
                  client,
                  userAddress,
                  icoChannel.address,
                );
                setMyFundingAmount(myFundingAmountQueryResult);

                setValue('fundingAmount', 0);
              } finally {
                setIsFundingChannelLoading(false);
              }
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
