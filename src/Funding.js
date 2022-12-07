import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import {
  fundingChannel,
  totalFundingAmountQuery,
  icoInfoQuery,
  myFundingAmountQuery,
  tokenAddressQuery,
  channelTokenBalanceQuery,
  channelFundingState,
} from './queries';
import useClient from './hooks/useClient';
import { COIN_MINIMAL_DENOM, UPPERCASE_COIN_MINIMAL_DENOM } from './constants';
import { useRecoilState, useRecoilValue } from 'recoil';
import { channelListAtom, userAssetAtom, userFundingAtom } from './atoms';
import { commonTheme } from './theme';

const Funding = () => {
  const { client, stargateClient, userAddress } = useClient();
  const [userAsset, setUserAsset] = useRecoilState(userAssetAtom);
  const channelList = useRecoilValue(channelListAtom);
  console.log(channelList);
  return (
    <React.Fragment>
      <Container>
        <div style={{ fontSize: '2rem' }}>
          <b>
            투자 가능한 금액 : {userAsset[UPPERCASE_COIN_MINIMAL_DENOM]}{' '}
            {UPPERCASE_COIN_MINIMAL_DENOM}
          </b>
        </div>
        <ICO>
          <div>
            {channelList.map((channel) => {
              return (
                <IcoChannel
                  key={channel.icoContractAddress}
                  icoChannel={channel}
                  userAddress={userAddress}
                  availableKrw={userAsset[UPPERCASE_COIN_MINIMAL_DENOM]}
                  client={client}
                  stargateClient={stargateClient}
                />
              );
            })}
          </div>
        </ICO>
        <div style={{ padding: '20px' }} />
      </Container>
    </React.Fragment>
  );
};

const IcoChannel = ({ icoChannel, availableKrw, client, stargateClient, userAddress }) => {
  const [userAsset, setUserAsset] = useRecoilState(userAssetAtom);
  const [userFunding, setUserFunding] = useRecoilState(userFundingAtom);
  const [fundingState, setFundingState] = useState();
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
        icoChannel.icoContractAddress,
      );
      setIcoChannelTotalFundingAmount(icoChannelTotalFundingAmountQueryResult);
      console.log(icoChannelTotalFundingAmount);

      const icoInfoQueryResult = await icoInfoQuery(client, icoChannel.icoContractAddress);
      setIcoInfo(icoInfoQueryResult);
      console.log(icoInfo);
      console.log(userAddress);

      const result = await tokenAddressQuery(client, icoChannel.icoContractAddress);
      const tokenAddress = result.address;
      const newResult = await channelTokenBalanceQuery(client, userAddress, tokenAddress);
      setUserAsset((props) => {
        return {
          ...props,
          [icoChannel.ticker]: newResult.balance,
        };
      });
      const fundingStateResult = await channelFundingState(client, icoChannel.icoContractAddress);
      setFundingState(fundingStateResult);
      console.log(icoChannel.name);
      console.log(fundingState);
      const myFundingAmountQueryResult = await myFundingAmountQuery(
        client,
        userAddress,
        icoChannel.icoContractAddress,
      );
      console.log(myFundingAmountQuery);
      setUserFunding((prev) => {
        return {
          ...prev,
          [icoChannel.ticker]: {
            amount: myFundingAmountQueryResult.amount,
            base: UPPERCASE_COIN_MINIMAL_DENOM,
          },
        };
      });
    })();
  }, [client]);

  return (
    <div
      style={{
        background: 'aliceblue',
        padding: '50px',
        marginTop: '40px',
        borderRadius: '20px',
        boxShadow: '0px 3px 10px grey',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={icoChannel.src} />
      </div>
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>
            {icoChannel.name} ({icoChannel.ticker})
          </h1>
          {fundingState ? (
            <FundingState fundingState={fundingState}>펀딩종료</FundingState>
          ) : (
            <FundingState fundingState={fundingState}>펀딩중</FundingState>
          )}
        </div>
        <div>
          {/*<CircularProgress*/}
          {/*  mr={4}*/}
          {/*  value={*/}
          {/*    Math.floor(*/}
          {/*      Number(icoChannelTotalFundingAmount?.amount) /*/}
          {/*        Number(icoInfo?.target_funding_amount),*/}
          {/*    ) * 100*/}
          {/*  }*/}
          {/*  size={'120px'}*/}
          {/*/>*/}
          <div style={{ fontSize: '1.5rem' }}>
            <div>현재까지 모집 금액 : {icoChannelTotalFundingAmount?.amount} uKRW</div>
            {userAsset?.[icoChannel.ticker] && (
              <div style={{ marginTop: '10px' }}>
                내가 보유한 수량 : {userAsset[icoChannel.ticker]} {icoChannel.ticker}
              </div>
            )}
            <div style={{ marginTop: '10px' }}>
              내가 투자한 금액 : {userFunding[icoChannel.ticker]?.amount}{' '}
              {userFunding[icoChannel.ticker]?.base}
            </div>
            <div style={{ marginTop: '10px' }}>
              총 모집 금액 : {icoInfo?.target_funding_amount} uKRW
            </div>
          </div>
        </div>
        <Controller
          name="fundingAmount"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              type={'number'}
              max={availableKrw ? Number(availableKrw?.amount) : undefined}
              value={value}
              onChange={onChange}
              placeholder="얼마만큼 투자하시겠어요?"
            />
          )}
        />
        <button
          onClick={() => {
            handleSubmit(async (data) => {
              const { fundingAmount } = data;
              setIsFundingChannelLoading(true);
              try {
                await fundingChannel(
                  client,
                  userAddress,
                  icoChannel.icoContractAddress,
                  fundingAmount,
                );

                const balance = await stargateClient.getBalance(userAddress, COIN_MINIMAL_DENOM);
                setUserAsset((prev) => {
                  return {
                    ...prev,
                    [UPPERCASE_COIN_MINIMAL_DENOM]: balance.amount,
                  };
                });

                const icoChannelTotalFundingAmountQueryResult = await totalFundingAmountQuery(
                  client,
                  icoChannel.icoContractAddress,
                );
                setIcoChannelTotalFundingAmount(icoChannelTotalFundingAmountQueryResult);
                console.log(icoChannelTotalFundingAmountQueryResult);
                const myFundingAmountQueryResult = await myFundingAmountQuery(
                  client,
                  userAddress,
                  icoChannel.icoContractAddress,
                );
                console.log(myFundingAmountQueryResult.amount);
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
        >
          투자하기
        </button>
      </div>
    </div>
  );
};

const ICO = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 100px;
`;

const FundingState = styled.span`
  color: white;
  font-weight: 700;
  margin-left: 10px;
  padding: 0 10px 0 10px;
  border-radius: 5px;
  background: ${({ fundingState }) =>
    fundingState ? commonTheme.palette.light.blue700 : commonTheme.palette.light.green700};
`;

export default Funding;
