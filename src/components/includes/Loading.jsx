import React from 'react'
import styled from 'styled-components';
import LoadingGif from "../images/giphy.gif"

function Loading() {
  return (
    <PopupContainer>
        <Popup>
            <Gif src={LoadingGif} alt="Gif" />
        </Popup>
    </PopupContainer>
  )
}

const PopupContainer = styled.section`
    position: relative;
    width: 100%;
    height: 100vh;
`
const Popup = styled.div`
    width: 300px;
    height: 300px;
    /* background-color: #fff; */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
`;
const Gif = styled.img`
    width: 100%;
    border-radius: 50%;
`

export default Loading