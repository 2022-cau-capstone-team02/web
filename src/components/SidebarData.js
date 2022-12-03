import React from 'react';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';

/**
 * Sidebar에 넣을 메뉴, 링크, 서브 메뉴를 담은 데이터입니다.
 */
const SidebarData = [
  {
    title: '홈',
    link: '/',
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    // sub:[
    //     {
    //         title:'sample',
    //         link:'/sample',
    //     },
    // ]
  },
  {
    title: '거래소',
    link: '/exchange',
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    // sub:[
    // ]
  },
  {
    title: '펀딩',
    link: '/funding',
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    // sub:[
    // ]
  },
  {
    title: '대시보드',
    link: '/dashboard',
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    // sub:[
    // ]
  },
];

export default SidebarData;
