import React from "react";
import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import SidebarData from "./SidebarData";
import styled from "styled-components";
import SubMenu from "./SubMenu";

const CloseIcon = styled(RiCloseFill)`
  position: absolute;
  top: 2%;
  right: 2%;
  font-size: 4rem;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.7);
  &:hover {
    cursor: pointer;
  }
`;

const SidebarContainer = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 20;
  position: fixed;
  display: flex;
  transform: translateX(${({ activate }) => (activate ? "0" : "100vw")});
  transition: 0.5s ease-in-out;

  @media screen and (min-width: 992px) {
    display: none;
  }
`;

const SidebarWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  } /* Chrome, Safari, Opera*/
  background: linear-gradient(to bottom, #abffcb, #f1fff5);
`;

const ItemContainer = styled.div`
  margin-top: 20%;
`;

const Overlay = styled.div`
  background-color: rgba(36, 36, 36, 0.438);
  width: 50%;
  height: 100vh;
`;

const Sidebar = ({ menu, setMenu }) => {
  /**
   * body 부분의 scroll을 다시 롤백시키며, menu를 닫는 함수입니다.
   */

  const close = () => {
    document.body.style.overflow = "unset";
    setMenu(!menu);
  };

  return (
    <>
      <SidebarContainer activate={menu}>
        <Overlay onClick={close} />
        <SidebarWrapper>
          <CloseIcon onClick={close} />
          <ItemContainer>
            {
              /** Sidebar에 담겨져 있는 data의 수만큼 메뉴를 생성합니다. */
              SidebarData.map((item, index) => {
                return <SubMenu close={close} item={item} key={index} />;
              })
            }
          </ItemContainer>
        </SidebarWrapper>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
