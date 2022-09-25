import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';


const Container = styled.div`
  height : 80px;
  width: 100%;
  background : linear-gradient(to right, #A1FFCE, #f9fcfd);
  border-bottom: 10px solid rgb(116, 236, 206);
  display: flex;
  align-items: center;
  padding:1px;
  position: fixed;
`

const HomepageTitle = styled.h1`
  font-size: 2.5rem;
  padding-left: 80px;
  font-weight: 600;
  color: #343434;
  &:hover{
    cursor: pointer;
  }
`

const Navigators = styled.ul`
  height: 100%;
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
  @media screen and (max-width:992px){
    display: none;
  }
`

const MenuIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right:50px;
  color:#343434;
  font-size: 2.5rem;
  &:hover{
    cursor: pointer;
  }
  @media screen and (min-width:992px){
    display: none;
  }
`

const Navigator = styled.li`
  list-style: none;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 30px;
  color: rgba(0, 0, 0, 0.7);
  &:hover{
    cursor: pointer;
    color: rgba(0, 0, 0, 1);
  }
`


function NavBar({menu, setMenu}) {
  const open = () => {
    document.body.style.overflow = "hidden";
    setMenu(!menu);
  };
  const navigate = useNavigate();

  return (
    <Container>
      <HomepageTitle onClick={()=>{navigate('/')}}>
        SLP
      </HomepageTitle>
      <Navigators>
        <Navigator onClick={()=>{navigate('/exchange')}}>
          거래소
        </Navigator>
        <Navigator onClick={()=>{navigate('/dashboard')}}>
          대시보드
        </Navigator>
      </Navigators>
      <MenuIcon icon={faBars} onClick={open}/>
    </Container>
  );
}



  export default NavBar