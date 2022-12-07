import React, { useEffect, useState } from 'react';
import { Container, Navbar, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { Route, Routes } from 'react-router';
import NavBar from './components/Navbar';
import Info from './Info';
import Exchange from './Exchange';
import Investor from './Investor';
import Sidebar from './components/Sidebar';
import Progressbar from './components/ProgressBar';
import Test from './Test';
import Liquidity from './Liquidity';
import Funding from './Funding';
import Youtuber from './Youtuber';
import FundingAdmin from './FundingAdmin';
import Dashboard from './Dashboard';
import { RecoilRoot } from 'recoil';
import jsonChannelList from './channelList.json';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomContainer = styled(Container)`
  position: relative;
  width: 100%;
  min-height: ${window.innerHeight};
  padding: 0;
  margin: 0;
`;

const CustomRow = styled(Row)`
  padding: 0;
  margin: 0;
  width: 100%;
`;

const App = ({ history }) => {
  const [menu, setMenu] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 3 } } }),
  );

  useEffect(() => {
    if (localStorage.getItem('channelList')) return;
    localStorage.setItem('channelList', JSON.stringify(jsonChannelList));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter history>
        <RecoilRoot>
          <CustomContainer fluid>
            <ToastContainer />
            <Progressbar />
            <Sidebar menu={menu} setMenu={setMenu} />
            <CustomRow>
              <NavBar menu={menu} setMenu={setMenu} />
            </CustomRow>
            <CustomRow>
              <Routes>
                <Route path="/" element={<Info />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/test" element={<Test />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/investor" element={<Investor />} />
                <Route path="/dashboard/youtuber" element={<Youtuber />} />
                <Route path="/funding" element={<Funding />} />
                <Route path="/funding/admin" element={<FundingAdmin />} />
                <Route path="/liquidity" element={<Liquidity />} />
              </Routes>
            </CustomRow>
          </CustomContainer>
        </RecoilRoot>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
