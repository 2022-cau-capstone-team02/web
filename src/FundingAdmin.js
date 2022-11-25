import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Flex, Input, Stack } from '@chakra-ui/react';
import { instantiateIcoContract } from './queries';
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

const FundingAdmin = () => {
  const { client, userAddress } = useClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              Step3. ICO 마무리, 코인 개수를 모집된 금액에 따라 배분합니다
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
      </Container>
    </React.Fragment>
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
