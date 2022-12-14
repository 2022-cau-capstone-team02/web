import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProgressBar = styled.div`
  position: fixed;
  width: 100vw;
  height: 10px;
  z-index: 10;
  background-color: rgba(154, 246, 207, 1);
`;

const Progress = styled.div`
  width: ${({ scroll }) => `${scroll}vw`};
  height: 100%;
  background-color: rgba(18, 211, 154, 1);
  transition: all 0.5s;
`;

export default function Progressbar() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', progres);
    return () => {
      window.removeEventListener('scroll', progres);
    };
  }, [scroll]);

  const progres = () => {
    const scrollTotal = document.documentElement.scrollTop;
    const heightWin = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setScroll((scrollTotal / heightWin) * 100);
  };

  return (
    <ProgressBar>
      <Progress scroll={scroll} />
    </ProgressBar>
  );
}
