import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import {
  allocation,
  createPool,
  endFunding,
  increaseAllowance,
  instantiateIcoContract,
  provideLiquidity,
  transferFunding,
} from './queries';
import useClient from './hooks/useClient';
import {
  ADMIN_FUNDING_AMOUNT_DEPOSIT,
  ADMIN_PROVIDE_TOKEN_LIQUIDITY_AMOUNT,
  ADMIN_PROVIDE_UKRW_LIQUIDITY_AMOUNT,
} from './constants';
import { toast } from 'react-toastify';

const FundingAdmin = () => {
  const { client, userAddress } = useClient();
  const [isInstantiateIcoContractLoading, setIsInstantiateIcoContractLoading] = useState(false);
  const [createdIcoContractAddress, setCreatedIcoContractAddress] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: {
      fundingAmount: 1_000_000_000,
      totalTokenAmount: 100_000_000,
      tokenName: '',
      tokenSymbol: '',
      recipient: '',
    },
  });

  return (
    <React.Fragment>
      <Container>
        <div style={{ background: 'aliceblue', padding: '20px', borderRadius: '20px' }}>
          <p style={{ fontSize: '2rem' }}>관리자 영역</p>
          <div flexDirection={'row'}>
            <div style={{ display: 'flex', flexDirection: 'column' }} mr={4}>
              <p style={{ fontSize: '1.5rem' }}>
                <b>
                  Step1. ICO를 실시하기 위한 작업을 진행합니다. &gt; 투자자가 투자 할 수 있도록
                  설정하는 작업
                </b>
              </p>
              <div style={{ padding: '10px' }} />
              <Controller
                name="fundingAmount"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input value={value} onChange={onChange} placeholder="총 모집 금액" />
                )}
              />
              <div style={{ padding: '10px' }} />
              <Controller
                name="totalTokenAmount"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input value={value} onChange={onChange} placeholder="생성될 토큰 개수" />
                )}
              />
              <div style={{ padding: '10px' }} />
              <Controller
                name="tokenName"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input mb={4} value={value} onChange={onChange} placeholder="채널 이름" />
                )}
              />
              <div style={{ padding: '10px' }} />
              <Controller
                name="tokenSymbol"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input value={value} onChange={onChange} placeholder="채널 토큰 이름" />
                )}
              />
              <div style={{ padding: '10px' }} />
              <Controller
                name="recipient"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input value={value} onChange={onChange} placeholder="채널 주인의 지갑 주소" />
                )}
              />
              <div style={{ padding: '10px' }} />
              <button
                style={{
                  border: 'none',
                  padding: '10px',
                  borderRadius: '10px',
                  boxShadow: '0px 3px 10px grey',
                }}
                onClick={() => {
                  handleSubmit(async (data) => {
                    setIsInstantiateIcoContractLoading(true);
                    const { fundingAmount, tokenName, tokenSymbol, totalTokenAmount, recipient } =
                      data;
                    const deadline = 10000000000;
                    try {
                      const result = await instantiateIcoContract(
                        client,
                        userAddress,
                        fundingAmount.toString(),
                        deadline,
                        tokenName,
                        tokenSymbol,
                        totalTokenAmount.toString(),
                        recipient,
                      );
                      setCreatedIcoContractAddress(result);

                      const prevChannelList = localStorage.getItem('channelList');
                      const newChannelList = JSON.parse(prevChannelList).list.map((channel) => {
                        if (channel.ticker === tokenSymbol) {
                          return {
                            ...channel,
                            icoContractAddress: result,
                          };
                        } else return channel;
                      });
                      localStorage.setItem('channelList', JSON.stringify({ list: newChannelList }));
                      toast('ICO 실행에 성공했어요!', {
                        position: 'top-right',
                      });
                    } finally {
                      setIsInstantiateIcoContractLoading(false);
                    }
                  })();
                }}
              >
                ICO 컨트랙트 생성
              </button>
              {createdIcoContractAddress && (
                <div>
                  생성된 ICO Contract 주소 : {createdIcoContractAddress}
                  <button onClick={() => navigator.clipboard.writeText(createdIcoContractAddress)}>
                    복사
                  </button>
                </div>
              )}
            </div>
            <EndFunding client={client} userAddress={userAddress} />
            <Allocation client={client} userAddress={userAddress} />
          </div>
        </div>
        <div style={{ padding: '10px' }} />
      </Container>
    </React.Fragment>
  );
};

const Allocation = ({ client, userAddress }) => {
  const [channel, setChannel] = useState();
  const channelList = JSON.parse(localStorage.getItem('channelList'))?.list;

  const { control, handleSubmit } = useForm({
    defaultValues: {
      amount: '',
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
      <p style={{ fontSize: '1.5rem' }}>
        <b>Step3. 배당 합니다</b>
      </p>
      {channelList?.map((currentChannel, index) => {
        if (index === 2) {
          if (!currentChannel.icoContractAddress) return null;
          return (
            <a
              style={{
                ...(channel?.id === currentChannel.id && {
                  color: 'red',
                }),
              }}
              key={currentChannel.id}
              onClick={() => setChannel(currentChannel)}
            >
              {currentChannel.name}
            </a>
          );
        }
        return (
          <a
            style={{
              ...(channel?.id === currentChannel.id && {
                color: 'red',
              }),
            }}
            key={currentChannel.id}
            onClick={() => setChannel(currentChannel)}
          >
            {currentChannel.name}
          </a>
        );
      })}
      <Controller
        name="amount"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <input value={value} onChange={onChange} placeholder="배당 총액" />
        )}
      />
      <div style={{ padding: '10px' }} />
      <button
        style={{
          border: 'none',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '0px 3px 10px grey',
        }}
        onClick={() => {
          if (!channel) return;
          handleSubmit(async (data) => {
            const allocationResult = await allocation(
              client,
              userAddress,
              channel.icoContractAddress,
              data.amount,
            );
            console.log(allocationResult);
            toast('배당금 지급에 성공했어요!', {
              position: 'top-right',
            });
          })();
        }}
      >
        배당하기
      </button>
    </div>
  );
};

const EndFunding = ({ client, userAddress }) => {
  const channelList = JSON.parse(localStorage.getItem('channelList'))?.list;
  const [isEndFundingLoading, setIsEndFundingLoading] = useState(false);
  const [isTransferFundingLoading, setIsTransferFundingLoading] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      icoContractAddress: '',
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
      <p style={{ fontSize: '1.5rem' }}>
        <b>Step2. ICO 마무리, 코인 개수를 모집된 금액에 따라 배분합니다</b>
      </p>
      <div style={{ padding: '10px' }} />
      {channelList?.map((channel, index) => {
        console.log(channel, index);
        if (index === 2) {
          if (!channel.icoContractAddress) return null;
          return (
            <div key={channel.id}>
              <span>
                {channel.name} : {channel.icoContractAddress}
              </span>
            </div>
          );
        } else {
          return (
            <div key={channel.id}>
              <span>
                {channel.name} : {channel.icoContractAddress}
              </span>
            </div>
          );
        }
      })}
      <Controller
        name="icoContractAddress"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <input value={value} onChange={onChange} placeholder="펀딩 종료된 ICO 컨트랙트 주소" />
        )}
      />
      <div style={{ padding: '10px' }} />
      <button
        style={{
          border: 'none',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '0px 3px 10px grey',
        }}
        onClick={() => {
          handleSubmit(async (data) => {
            setIsEndFundingLoading(true);
            const { icoContractAddress } = data;
            try {
              const endFundingResult = await endFunding(client, userAddress, icoContractAddress);
              console.log('endFundingResult', endFundingResult);
              const tokenAddress = endFundingResult.logs[0].events[1].attributes[0].value;

              const createPoolResult = await createPool(
                client,
                userAddress,
                tokenAddress,
                '0.1',
                '0.2',
              );

              console.log('createPoolResult', createPoolResult);
              const poolAddress = createPoolResult.contractAddress;

              const prevChannelList = localStorage.getItem('channelList');
              const newChannelList = JSON.parse(prevChannelList).list.map((channel) => {
                if (channel.icoContractAddress === icoContractAddress) {
                  return {
                    ...channel,
                    tokenAddress,
                    poolAddress,
                  };
                } else {
                  return channel;
                }
              });
              localStorage.setItem('channelList', JSON.stringify({ list: newChannelList }));

              const tokenAmount = ADMIN_PROVIDE_TOKEN_LIQUIDITY_AMOUNT.toString(10);
              const increaseAllowanceResult = await increaseAllowance(
                client,
                userAddress,
                tokenAddress,
                poolAddress,
                tokenAmount,
              );
              console.log('increaseAllowanceResult', increaseAllowanceResult);

              const provideLiquidityResult = await provideLiquidity(
                client,
                userAddress,
                tokenAddress,
                poolAddress,
                ADMIN_PROVIDE_UKRW_LIQUIDITY_AMOUNT.toString(10),
                tokenAmount,
              );
              console.log('provideLiquidityResult', provideLiquidityResult);
              toast('ICO 종료에 성공했어요!', {
                position: 'top-right',
              });
            } finally {
              setIsEndFundingLoading(false);
            }
          })();
        }}
      >
        펀딩 종료
      </button>
      <div style={{ padding: '10px' }} />
      <button
        style={{
          border: 'none',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '0px 3px 10px grey',
        }}
        onClick={() => {
          handleSubmit(async (data) => {
            setIsTransferFundingLoading(true);
            const { icoContractAddress } = data;
            try {
              const result = await transferFunding(
                client,
                userAddress,
                icoContractAddress,
                ADMIN_FUNDING_AMOUNT_DEPOSIT.toString(10),
              );
              console.log(result);
              toast('펀딩 금액 송금에 성공했어요!', {
                position: 'top-right',
              });
            } finally {
              setIsTransferFundingLoading(false);
            }
          })();
        }}
      >
        펀딩 금액 송금
      </button>
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

export default FundingAdmin;
