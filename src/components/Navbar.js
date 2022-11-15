import { faBars, faAmbulance } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const Container = styled.div`
  height: 80px;
  width: 100%;
  margin-top: 10px;
  z-index: 2;
  background: linear-gradient(to right, #a1ffce, #f9fcfd);
  display: flex;
  align-items: center;
  padding: 1px;
  position: fixed;
`;

const HomepageTitle = styled.h1`
  font-size: 2.5rem;
  padding-left: 80px;
  font-weight: 600;
  color: #343434;
  &:hover {
    cursor: pointer;
  }
`;

const Navigators = styled.ul`
  height: 100%;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
  @media screen and (max-width: 992px) {
    display: none;
  }
`;

const MenuIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 50px;
  color: #343434;
  font-size: 2.5rem;
  &:hover {
    cursor: pointer;
  }
  @media screen and (min-width: 992px) {
    display: none;
  }
`;

const Navigator = styled.li`
  list-style: none;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 30px;
  color: rgba(0, 0, 0, 0.7);
  &:hover {
    cursor: pointer;
    color: rgba(0, 0, 0, 1);
  }
`;

const uint8ToBase64 = (arr) => {
  return btoa(
    Array(arr.length)
      .fill('')
      .map((_, i) => String.fromCharCode(arr[i]))
      .join(''),
  );
};

function NavBar({ menu, setMenu }) {
  let keplr = undefined;
  const open = () => {
    document.body.style.overflow = 'hidden';
    setMenu(!menu);
  };
  const navigate = useNavigate();

  return (
    <Container>
      <HomepageTitle
        onClick={() => {
          navigate('/');
        }}
      >
        YISP
      </HomepageTitle>
      <Navigators>
        <Navigator
          onClick={() => {
            navigate('/exchange');
          }}
        >
          거래소
        </Navigator>
        <Navigator
          onClick={() => {
            navigate('/dashboard');
          }}
        >
          대시보드
        </Navigator>
      </Navigators>
      <a>
        <FontAwesomeIcon
          style={{
            color: '#343434',
            fontSize: '2.5rem',
          }}
          icon={faAmbulance}
          onClick={async () => {
            try {
              keplr = window.keplr;
              const offlineSigner = keplr.getOfflineSigner('cosmoshub-4');
              console.log(keplr);
              const chainId = offlineSigner.chainId;
              const accounts = await offlineSigner.getAccounts();
              const publicAddress = accounts[0].address;
              const pubkey = uint8ToBase64(accounts[0].pubkey);
              console.log(accounts, publicAddress, pubkey);
            } catch (e) {
              console.log('케플러 지갑을 먼저 설치해주세요.');
            }
          }}
        />
      </a>
      <MenuIcon icon={faBars} onClick={open} />
    </Container>
  );
}

export default NavBar;
