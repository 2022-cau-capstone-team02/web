import React, { useState } from 'react'
import { Container, Navbar, Row } from 'react-bootstrap'
import styled from 'styled-components'
import { Route, Routes } from 'react-router'
import NavBar from './components/Navbar'
import Info from './Info'
import Exchange from './Exchange'
import Dashboard from './Dashboard'
import Sidebar from './components/Sidebar'
import Progressbar from './components/ProgressBar'


const CustomContainer = styled(Container)`
  position: relative;
  width: 100%;
  min-height:${window.innerHeight};
  padding:0;
  margin:0;
`

const CustomRow = styled(Row)`
  padding:0;
  margin:0;
  width: 100%;
`


const App = () => {
  const [menu, setMenu] = useState(false);
  return (
    <CustomContainer fluid>
      <Progressbar/>
      <Sidebar menu={menu} setMenu={setMenu}/>
      <CustomRow>
        <NavBar menu={menu} setMenu={setMenu}/>
      </CustomRow>
      <CustomRow>
        <Routes>
          <Route path='/' element={<Info/>}/>
          <Route path='/exchange' element={<Exchange/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </CustomRow>
    </CustomContainer>
  )
}

export default App;
