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
  isFundingFinishedQuery,
} from './queries';
import useClient from './hooks/useClient';
import { COIN_MINIMAL_DENOM, UPPERCASE_COIN_MINIMAL_DENOM } from './constants';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAssetAtom, userFundingAtom } from './atoms';
import { commonTheme } from './theme';
import { digitNumber } from './utils/common';

const Funding = () => {
  const { client, stargateClient, userAddress } = useClient();
  const userAsset = useRecoilValue(userAssetAtom);
  const channelList = JSON.parse(localStorage.getItem('channelList'))?.list;

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
            {channelList?.map((channel) => {
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
  const [isFundingFinished, setIsFundingFinished] = useState(false);
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
      if (!icoChannel.icoContractAddress) return;

      const icoChannelTotalFundingAmountQueryResult = await totalFundingAmountQuery(
        client,
        icoChannel.icoContractAddress,
      );
      setIcoChannelTotalFundingAmount(icoChannelTotalFundingAmountQueryResult);

      const icoInfoQueryResult = await icoInfoQuery(client, icoChannel.icoContractAddress);
      setIcoInfo(icoInfoQueryResult);

      const tokenAddressResult = await tokenAddressQuery(client, icoChannel.icoContractAddress);
      const tokenAddress = tokenAddressResult.address;

      if (userAddress && tokenAddress) {
        const newResult = await channelTokenBalanceQuery(client, userAddress, tokenAddress);
        setUserAsset((props) => {
          return {
            ...props,
            [icoChannel.ticker]: digitNumber(newResult.balance),
          };
        });
      }

      const isFundingFinishedResult = await isFundingFinishedQuery(
        client,
        icoChannel.icoContractAddress,
      );
      setIsFundingFinished(isFundingFinishedResult.status);

      const myFundingAmountQueryResult = await myFundingAmountQuery(
        client,
        userAddress,
        icoChannel.icoContractAddress,
      );

      setUserFunding((prev) => {
        return {
          ...prev,
          [icoChannel.ticker]: {
            amount: digitNumber(myFundingAmountQueryResult.amount),
            base: UPPERCASE_COIN_MINIMAL_DENOM,
          },
        };
      });
    })();
  }, [client]);

  console.log(userAsset);

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
          {isFundingFinished ? (
            <FundingState isFundingFinished={isFundingFinished}>펀딩종료</FundingState>
          ) : (
            <FundingState isFundingFinished={isFundingFinished}>펀딩중</FundingState>
          )}
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>
            {!isFundingFinished ? (
              <React.Fragment>
                <div style={{ marginTop: '10px' }}>
                  총 모집 금액 : {digitNumber(icoInfo?.target_funding_amount ?? 0)}{' '}
                  {UPPERCASE_COIN_MINIMAL_DENOM}
                </div>
                <div style={{ marginTop: '10px' }}>
                  현재까지 모집 금액 : {digitNumber(icoChannelTotalFundingAmount?.amount ?? 0)}{' '}
                  {UPPERCASE_COIN_MINIMAL_DENOM}
                </div>
                <div style={{ marginTop: '10px' }}>
                  내가 투자한 금액 : {userFunding[icoChannel.ticker]?.amount ?? 0}{' '}
                  {UPPERCASE_COIN_MINIMAL_DENOM}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={{ marginTop: '10px' }}>
                  내가 투자한 금액 : {userFunding[icoChannel.ticker]?.amount ?? 0}{' '}
                  {UPPERCASE_COIN_MINIMAL_DENOM}
                </div>
                <div style={{ marginTop: '10px' }}>
                  내가 보유한 수량 : {userAsset[icoChannel.ticker] ?? 0} {icoChannel.ticker}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        {!isFundingFinished && (
          <React.Fragment>
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

                    const balance = await stargateClient.getBalance(
                      userAddress,
                      COIN_MINIMAL_DENOM,
                    );
                    setUserAsset((prev) => {
                      return {
                        ...prev,
                        [UPPERCASE_COIN_MINIMAL_DENOM]: digitNumber(balance.amount),
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
                          amount: digitNumber(myFundingAmountQueryResult.amount),
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
          </React.Fragment>
        )}
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
  background: ${({ isFundingFinished }) =>
    isFundingFinished ? commonTheme.palette.light.blue700 : commonTheme.palette.light.green700};
`;

export default Funding;
