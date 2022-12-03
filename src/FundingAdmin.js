import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import {
  createPool,
  endFunding,
  increaseAllowance,
  instantiateIcoContract,
  provideLiquidity,
  transferFunding,
} from './queries';
import useClient from './hooks/useClient';
import { useRecoilState } from 'recoil';
import { channelListAtom } from './atoms';

const FundingAdmin = () => {
  const { client, userAddress } = useClient();
  const [isInstantiateIcoContractLoading, setIsInstantiateIcoContractLoading] = useState(false);
  const [createdIcoContractAddress, setCreatedIcoContractAddress] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: {
      fundingAmount: 0,
      totalTokenAmount: 0,
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
                <b>Step1. ICO 컨트렉트를 생성합니다.</b>
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
                      console.log(client, userAddress);
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
                      console.log(result);
                      setCreatedIcoContractAddress(result);
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
          </div>
        </div>
        <div style={{ padding: '10px' }} />
      </Container>
    </React.Fragment>
  );
};

const EndFunding = ({ client, userAddress }) => {
  const [channelList, setChannelList] = useRecoilState(channelListAtom);
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

              // setChannelList((prev) => {
              //   let newChannelList = prev;
              //   const currentChannelIndex = findIndex(
              //     prev,
              //     (channel) => channel.icoContractAddress === icoContractAddress,
              //   );
              //   newChannelList[currentChannelIndex] = {
              //     ...newChannelList[currentChannelIndex],
              //     tokenAddress,
              //     poolAddress,
              //   };
              //   return newChannelList;
              // });
              const tokenAmount = '1000';
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
                '100000',
                tokenAmount,
              );
              console.log('provideLiquidityResult', provideLiquidityResult);
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
                (25000).toString(10),
              );
              console.log(result);
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
