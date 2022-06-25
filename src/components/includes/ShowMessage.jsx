// Components
import React, { useRef, useEffect, useState } from "react";
import Moment from "react-moment";
import styled from "styled-components";
import music from "../WhatsApp.ogg";

// Icons
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import { MdOutlineDownloading } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Waveform from "../Wave/Waveform";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

function ShowMessage({ progress, chat, msg, user1, setAudioDuration }) {
    const scrollRef = useRef();
    const audioRef = useRef();
    const [seen, setSeen] = useState();
    const [lastMsgData, setLastMsgData] = useState();
    let user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            let dur = audioRef.current.duration;
            setAudioDuration(dur.toFixed(2));
        }
    };
    useEffect(() => {
        let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
            console.log(doc.data());
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });

        if (chat.isOnline) {
            setSeen(true);
        }
    }, [msg]);

    // ---------------------------------------------------------------------------

    return (
        <MsgWrapper className={` msg_wrapper ${msg.from === user1 ? "mine" : "his"}`} ref={scrollRef}>
            <Box className={msg.from === user1 ? "me" : "friend"}>
                <Angle></Angle>

                {msg.isUploaded ? (
                    ""
                ) : (
                    <Percent>
                        <CircularProgressbar value={progress} text={`${progress}%`} />
                    </Percent>
                )}
                {msg.photos && msg.photos.length !== 0
                    ? msg.photos.map((element, i) => (
                          <MsgContainer key={i}>
                              <MsgPhoto src={element} alt={"Image"} />
                          </MsgContainer>
                      ))
                    : null}

                {/* {msg.audio && msg.audio.length !== 0 ? <audio style={{minWidth:"200px", maxWidth:"270px"}} className="audio" controls type="audio/mp3" src={msg.audio}></audio> : null} */}

                {msg.recordAudio ? (
                    // <Waveform audio={msg.recordAudio} setAudioDuration={setAudioDuration} />
                    // <Waveform audio={music} setAudioDuration={setAudioDuration} />
                    <audio src={msg.recordAudio} onLoadedMetadata={onLoadedMetadata} controls type="audio/mp3"></audio>
                ) : null}

                {msg.video?.length > 0 ? (
                    <VideoBox>
                        <Video controls type="video/*" src={msg.video}></Video>
                    </VideoBox>
                ) : null}

                {msg.text ? <Msg>{msg.text}</Msg> : null}

                {msg.documents && msg.documents.length > 0
                    ? msg.documents.map((ele, ind) => (
                          <FileBox key={ind}>
                              <a href={ele} target="_blank">
                                  <Download />
                              </a>
                              File
                          </FileBox>
                      ))
                    : null}

                <Small>
                    <Moment fromNow>{msg.createdAt.toDate()}</Moment>
                    <Tick>{msg.from === user1 ? msg.isUploaded ? seen ? <DoubleCheck className="readed" /> : <SingleCheck /> : <AiOutlineClockCircle /> : ""}</Tick>
                </Small>
            </Box>
        </MsgWrapper>
    );
}

const MsgWrapper = styled.section`
    margin-top: 6px;
    border-radius: 5px;
    &:last-child {
        margin-bottom: 20px;
    }
`;
const Box = styled.div`
    display: inline-block;
    max-width: 50%;
    min-width: 150px;
    text-align: left;
    border-radius: 5px;
    padding: 10px;
    position: relative;
    z-index: 100;
    box-shadow: 0px 2px 2px 0px #a99c9c;
`;
const Angle = styled.span`
    position: absolute;
    top: 0;
    right: -10px;
    border-top: 20px solid #d1f4cc;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    z-index: -1;
`;
const MsgContainer = styled.div`
    width: 100%;
    position: relative;
`;
const Percent = styled.div`
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 50%;
    overflow: hidden;
    z-index: 33;
`;
const MsgPhoto = styled.img`
    max-width: 300px;
    width: 100%;
    border-radius: 5px;
`;
const Small = styled.small`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    opacity: 0.8;
    font-size: 12px;
    margin-top: 5px;
`;
const Msg = styled.p`
    width: 100%;
    display: inline-block;
    max-width: 100%;
    line-height: 1.5rem;
`;
const VideoBox = styled.div`
    width: 100%;
`;
const Video = styled.video`
    max-width: 300px;
    width: 100%;
    height: 250px;
    display: block;
`;
const FileBox = styled.div`
    min-width: 200px;
    display: flex;
    align-items: center;
    font-size: 20px;
`;
const Download = styled(MdOutlineDownloading)`
    font-size: 25px;
`;
const Tick = styled.small`
    font-size: 15px;
    font-weight: 900;
`;
const DoubleCheck = styled(BsCheck2All)`
    &.readed {
        color: #17b2ff;
    }
`;
const SingleCheck = styled(BsCheck2)``;

export default ShowMessage;
