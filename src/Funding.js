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
} from './queries';
import useClient from './hooks/useClient';
import { COIN_MINIMAL_DENOM, UPPERCASE_COIN_MINIMAL_DENOM } from './constants';
import { useRecoilState, useRecoilValue } from 'recoil';
import { channelListAtom, userAssetAtom, userFundingAtom } from './atoms';

const Funding = () => {
  const { client, stargateClient, userAddress } = useClient();
  const [userAsset, setUserAsset] = useRecoilState(userAssetAtom);
  const channelList = useRecoilValue(channelListAtom);

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
        <div>
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
        </div>
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

  console.log(userAsset, userFunding, icoInfo, icoChannelTotalFundingAmount);

  useEffect(() => {
    if (!client) return;

    (async () => {
      const icoChannelTotalFundingAmountQueryResult = await totalFundingAmountQuery(
        client,
        icoChannel.icoContractAddress,
      );
      setIcoChannelTotalFundingAmount(icoChannelTotalFundingAmountQueryResult);

      const icoInfoQueryResult = await icoInfoQuery(client, icoChannel.icoContractAddress);
      setIcoInfo(icoInfoQueryResult);

      console.log(icoInfo);

      const myFundingAmountQueryResult = await myFundingAmountQuery(
        client,
        userAddress,
        icoChannel.icoContractAddress,
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

      const result = await tokenAddressQuery(client, icoChannel.icoContractAddress);
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
    <div>
      <div>
        <img src={icoChannel.src} />
      </div>
      <div>
        <div>
          <h1>
            {icoChannel.name} ({icoChannel.ticker})
          </h1>
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
          <div>
            <div>현재까지 모집 금액 : {icoChannelTotalFundingAmount?.amount} uKRW</div>
            {userAsset?.[icoChannel.ticker] && (
              <div>
                내가 보유한 수량 : {userAsset[icoChannel.ticker]} {icoChannel.ticker}
              </div>
            )}
            <div>
              내가 투자한 금액 : {userFunding[icoChannel.ticker]?.amount}{' '}
              {userFunding[icoChannel.ticker]?.base}
            </div>
            <div>총 모집 금액 : {icoInfo?.target_funding_amount} uKRW</div>
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

                const myFundingAmountQueryResult = await myFundingAmountQuery(
                  client,
                  userAddress,
                  icoChannel.icoContractAddress,
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
        >
          투자하기
        </button>
      </div>
    </div>
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
