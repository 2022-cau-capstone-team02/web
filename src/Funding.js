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
import { COIN_MINIMAL_DENOM, UPPERCASE_COIN_MINIMAL_DENOM, icoChannelList } from './constants';
import { useRecoilState } from 'recoil';
import { userAssetAtom, userFundingAtom } from './atoms';

const Funding = () => {
  const { client, stargateClient, userAddress } = useClient();
  const [userAsset, setUserAsset] = useRecoilState(userAssetAtom);

  useEffect(() => {
    if (!stargateClient || !userAddress) return;

    (async () => {
      const balance = await stargateClient.getBalance(userAddress, COIN_MINIMAL_DENOM);
      setUserAsset((prev) => {
        return {
          ...prev,
          [UPPERCASE_COIN_MINIMAL_DENOM]: balance.amount,
        };
      });
    })();
  }, [stargateClient, userAddress]);

  return (
    <React.Fragment>
      <Container>
        <div>
          투자 가능한 금액 : {userAsset[UPPERCASE_COIN_MINIMAL_DENOM]}{' '}
          {UPPERCASE_COIN_MINIMAL_DENOM}
        </div>
        <Stack>
          <Box>
            {icoChannelList.map((icoChannel) => {
              return (
                <IcoChannel
                  key={icoChannel.address}
                  icoChannel={icoChannel}
                  userAddress={userAddress}
                  availableKrw={userAsset[UPPERCASE_COIN_MINIMAL_DENOM]}
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

const IcoChannel = ({ icoChannel, availableKrw, client, stargateClient, userAddress }) => {
  const [userAsset, setUserAsset] = useRecoilState(userAssetAtom);
  const [userFunding, setUserFunding] = useRecoilState(userFundingAtom);

  const [icoChannelTotalFundingAmount, setIcoChannelTotalFundingAmount] = useState();
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
      const icoChannelTotalFundingAmountQueryResult = await totalFundingAmountQuery(
        client,
        icoChannel.address,
      );
      setIcoChannelTotalFundingAmount(icoChannelTotalFundingAmountQueryResult);

      const icoInfoQueryResult = await icoInfoQuery(client, icoChannel.address);
      setIcoInfo(icoInfoQueryResult);

      const myFundingAmountQueryResult = await myFundingAmountQuery(
        client,
        userAddress,
        icoChannel.address,
      );
      setUserFunding((prev) => {
        return {
          ...prev,
          [icoChannel.ticker]: {
            amount: myFundingAmountQueryResult.amount,
            base: UPPERCASE_COIN_MINIMAL_DENOM,
          },
        };
      });

      const result = await tokenAddressQuery(client, icoChannel.address);
      const tokenAddress = result.address;
      const newResult = await channelTokenBalanceQuery(client, userAddress, tokenAddress);
      setUserAsset((props) => {
        return {
          ...props,
          [icoChannel.ticker]: newResult.balance,
        };
      });
    })();
  }, [client]);

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
            value={
              Math.floor(
                Number(icoChannelTotalFundingAmount?.amount) /
                  Number(icoInfo?.target_funding_amount),
              ) * 100
            }
            size={'120px'}
          />
          <Flex flexDirection={'column'}>
            <Box>현재까지 모집 금액 : {icoChannelTotalFundingAmount?.amount} uKRW</Box>
            {userAsset?.[icoChannel.ticker] && (
              <Box>
                내가 보유한 수량 : {userAsset[icoChannel.ticker]} {icoChannel.ticker}
              </Box>
            )}
            <Box>
              내가 투자한 금액 : {userFunding[icoChannel.ticker]?.amount}{' '}
              {userFunding[icoChannel.ticker]?.base}
            </Box>
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
                setUserAsset((prev) => {
                  return {
                    ...prev,
                    [UPPERCASE_COIN_MINIMAL_DENOM]: balance.amount,
                  };
                });

                const icoChannelTotalFundingAmountQueryResult = await totalFundingAmountQuery(
                  client,
                  icoChannel.address,
                );
                setIcoChannelTotalFundingAmount(icoChannelTotalFundingAmountQueryResult);

                const myFundingAmountQueryResult = await myFundingAmountQuery(
                  client,
                  userAddress,
                  icoChannel.address,
                );
                setUserFunding((prev) => {
                  return {
                    ...prev,
                    [icoChannel.ticker]: {
                      amount: myFundingAmountQueryResult.amount,
                      base: UPPERCASE_COIN_MINIMAL_DENOM,
                    },
                  };
                });

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
