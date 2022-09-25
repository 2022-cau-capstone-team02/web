import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import styled from 'styled-components'

let size;

const MenuContainer = styled.div`  
    width: 100%;
    height:${({sub})=>(sub?`${size}px`:'100px')};
    overflow: hidden;
    transition: 0.5s ease-in-out;
`

const MainMenuContainer = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    padding:20px;
    list-style: none;
    height: 100px;
    text-decoration: none;
    font-size: 2rem;
    color: rgba(0, 0, 0, 0.7);
    &:hover{
        cursor: pointer;
        color: rgba(0, 0, 0, 1);
        border-right: 5px solid rgba(17, 236, 65, 0.3);
    }
`

const SidebarLabel = styled.span`
    margin-left: 10px;
`

const DropDown = styled.div`
    background:#abffcb;
    height: 100px;
    padding-left:3rem;
    display:flex;
    align-items: center;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.7);
    &:hover{
        cursor: pointer;
        color: rgba(0, 0, 0, 1);
        border-right: 5px solid rgba(17, 236, 65, 0.9);
    }
`



const SubMenu = ({close, item}) => {
    const [sub, setSub] = useState(false);
    const navigate = useNavigate();

    /**
     * sub boolean 변수의 state를 true, false로 변환시키는 함수입니다.
     */
    const showSub = () => {
        setSub(!sub);
    }

    return(
        <>
            <MenuContainer sub={sub} size={size}>
                <MainMenuContainer onClick={()=>{
                    /**
                     * subMenu가 존재한다면 그 내용을 보여주며, MenuContainer의 size를 subMenu의 수 만큼 확장시킵니다. 
                     * subMenu가 없다면 클릭했을 때, link로 이동합니다.
                     */
                        if(item.sub == null){
                            navigate(item.link);
                            close(); 
                        }
                        else{
                            size = (item.sub.length+1) * 100;
                            showSub();
                        }
                        
                    }}>
                    <SidebarLabel>{item.title}</SidebarLabel>
                    {
                        /**
                         * subMenu가 존재하며, 내용을 보여주는 상태라면 opened 상태의 Icon을,
                         * subMenu가 존재하며, 내용을 보여주지 않는 상태라면 closed 상태의 Icon을,
                         * subMenu가 존재하지 않는다면, null이 됩니다.
                         */
                        item.sub && sub 
                        ? item.iconOpened
                        : item.sub
                        ? item.iconClosed
                        : null
                    }
                </MainMenuContainer>
                {
                    /**
                     * subMenu가 존재한다면, subMenu들을 보여줍니다.
                     */
                    item.sub ? item.sub.map((item, index)=>{
                        return (
                            <DropDown key={index} onClick={()=>{
                                    navigate(item.link);
                                    close(); 
                                } 
                            }>
                                <SidebarLabel>{item.title}</SidebarLabel>
                            </DropDown>
                        )
                }):null}
            </MenuContainer>
        </>
    )
}

export default SubMenu
