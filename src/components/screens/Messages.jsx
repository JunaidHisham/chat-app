import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import Img from "../images/no-user.jpg";
import MessageForm from "../includes/MessageForm";
import ShowMessage from "../includes/ShowMessage";

function Messages({
    StartRecording,
    StopRecording,
    recordAudio,
    setRecordAudio,
    setAudioDuration,
    setDocument,
    document,
    img,
    audio,
    setAudio,
    chat,
    user1,
    msgs,
    setImgs,
    handleSubmit,
    text,
    setText,
    setVideo,
    video,
    progress,
}) {
    const user2 = chat?.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const [show, setShow] = useState(false);
    const [upload, setUpload] = useState();
    const [recordStatus, setRecordStatus] = useState()

    // selected user seen || last message
    useEffect(() => {
        const UpdateUser = async () => {
            const docSnap = await getDoc(doc(db, "lastMsg", id));
            setUpload(docSnap.data());
            if (docSnap.data()?.to) {
                if (chat.uid === docSnap.data().to) {
                    // console.log("same");
                    await updateDoc(doc(db, "lastMsg", id), {
                        unread: false,
                    });
                }
            }
        };
        UpdateUser();
    }, [msgs]);

    useEffect(()=> {
        const unsub = onSnapshot(doc(db, "users", user2 ), (doc)=> {
            setRecordStatus(doc.data())
        })
        return () => unsub()
    }, [])

    // Setting Preview
    useEffect(() => {
        setShow(false);
    }, [img]);

    useEffect(() => {
        if (show == true) {
            setShow(false);
        }
    }, [chat]);
    const handleShow = () => {
        if (show == true) {
            setShow(false);
        }
    };

    // ------------------------------------------------------------------------------

    return (
        <>
            <MessageContainer>
                <Header>
                    <Profile src={chat.avatar || Img} alt="Profile" />
                    <div>
                        <UserName>{chat.name}</UserName>
                        <UserStatus className={chat.isOnline ? "online" : "offline"}>{chat.isOnline ? (recordStatus?.isRecording ? "recording audio...":(recordStatus?.isTyping ? "typing..." : "online")) : "..."}</UserStatus>
                    </div>
                </Header>
                <MessageBox className="Message_box" onClick={() => handleShow()}>
                    {/* {upload?.isUploaded ? console.log("uploaded") : console.log("uploading")} */}
                    {msgs.length ? msgs.map((msg, i) => <ShowMessage progress={progress} setAudioDuration={setAudioDuration} audio={audio} chat={chat} user1={user1} key={i} msg={msg} />) : null}
                </MessageBox>
                <Footer>
                    <MessageForm
                        StartRecording={StartRecording}
                        StopRecording={StopRecording}
                        setAudioDuration={setAudioDuration}
                        recordAudio={recordAudio}
                        setRecordAudio={setRecordAudio}
                        img={img}
                        setAudio={setAudio}
                        audio={audio}
                        setShow={setShow}
                        show={show}
                        user2={chat.uid}
                        user1={user1}
                        setImgs={setImgs}
                        handleSubmit={handleSubmit}
                        setText={setText}
                        text={text}
                        setVideo={setVideo}
                        video={video}
                        setDocument={setDocument}
                        document={document}
                    />
                </Footer>
            </MessageContainer>
        </>
    );
}
const MessageContainer = styled.section`
    position: relative;
    height: calc(100vh - 20px);
    background-color: #efeae2;
`;
const Header = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 30px;
    background-color: #f0f2f5;
`;
const Profile = styled.img`
    width: 50px;
    height: 50px;
    display: block;
    margin-right: 15px;
    border-radius: 50%;
`;
const UserName = styled.h3`
    margin-bottom: 0px;
    font-weight: 400;
`;
const UserStatus = styled.p``;
const Footer = styled.div`
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #f0f2f5;
    padding: 10px 20px;
    z-index: 100;
`;
const MessageBox = styled.div`
    overflow-y: auto;
    height: calc(100vh - 180px);
    width: 90%;
    margin: 0 auto;
    position: relative;
`;
export default Messages;
