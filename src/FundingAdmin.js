import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { endFunding, instantiateIcoContract, transferFunding } from './queries';
import useClient from './hooks/useClient';

const FundingAdmin = () => {
  const { client, userAddress } = useClient();
  const [isInstantiateIcoContractLoading, setIsInstantiateIcoContractLoading] = useState(false);

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
        <div>
          <p>관리자 영역</p>
          <div flexDirection={'row'}>
            <div flexDirection={'column'} mr={4}>
              Step1. ICO 컨트렉트를 생성합니다.
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
              <button
                isLoading={isInstantiateIcoContractLoading}
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
                      console.log(result);
                    } finally {
                      setIsInstantiateIcoContractLoading(false);
                    }
                  })();
                }}
              >
                ICO 컨트랙트 생성
              </button>
            </div>
            <EndFunding client={client} userAddress={userAddress} />
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

const EndFunding = ({ client, userAddress }) => {
  const [isEndFundingLoading, setIsEndFundingLoading] = useState(false);
  const [isTransferFundingLoading, setIsTransferFundingLoading] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      icoContractAddress: '',
    },
  });

  return (
    <div flexDirection={'column'}>
      Step3. ICO 마무리, 코인 개수를 모집된 금액에 따라 배분합니다
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
      <button
        onClick={() => {
          handleSubmit(async (data) => {
            setIsEndFundingLoading(true);
            const { icoContractAddress } = data;
            try {
              const result = await endFunding(client, userAddress, icoContractAddress);
              console.log(result);
            } finally {
              setIsEndFundingLoading(false);
            }
          })();
        }}
      >
        펀딩 종료
      </button>
      <button
        colorScheme="teal"
        isLoading={isTransferFundingLoading}
        w={'100%'}
        onClick={() => {
          handleSubmit(async (data) => {
            setIsTransferFundingLoading(true);
            const { icoContractAddress } = data;
            try {
              const result = await transferFunding(
                client,
                userAddress,
                icoContractAddress,
                (25000000).toString(10),
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
