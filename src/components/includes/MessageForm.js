// Packages
import React, { createRef, useEffect, useState } from "react";
import Picker, { SKIN_TONE_NEUTRAL, SKIN_TONE_LIGHT } from "emoji-picker-react";
import styled from "styled-components";
import { BiImageAlt, BiVideo, BiSend, BiUpload, BiWinkSmile } from "react-icons/bi";
import { doc, updateDoc } from "firebase/firestore";

// Components
import { db } from "../../firebase";
import typingstatus from "./typingstatus";
import music from "../WhatsApp.ogg"

// Icons
import { MdAudiotrack, MdDelete } from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";
import { BsFillMicFill } from "react-icons/bs";
import Waveform from "../Wave/Waveform";

function MessageForm({
    setAudioDuration,
    recordAudio,
    setRecordAudio,
    StartRecording,
    StopRecording,
    setVideo,
    video,
    setDocument,
    document,
    audio,
    setAudio,
    show,
    setShow,
    user1,
    user2,
    setImgs,
    text,
    setText,
    handleSubmit,
}) {
    const [recording, setRecording] = useState(true);
    const [emojiBox, ShowEmojiBox] = useState(false);
    const [ShowAudio, setShowAudio] = useState(false);
    const [cursorPosition, setCursorPosition] = useState();
    // const [music, setMusic] = useState(mus)
    // console.log("user 2", user2);

    const handleShow = () => {
        if (show === true) {
            setShow(false);
        } else {
            setShow(true);
        }
    };

    // Inputting Emojies....
    const inputRef = createRef();
    const pickEmoji = (e, { emoji }) => {
        const ref = inputRef.current;
        ref.focus();
        const start = text.substring(0, ref.selectionStart);
        const end = text.substring(ref.selectionStart);
        const msg = start + emoji + end;
        setText(msg);
        setCursorPosition(start.length + emoji.length);
    };
    useEffect(() => {
        inputRef.current.selectionEnd = cursorPosition;
    }, [cursorPosition]);

    const RecordAudio = () => {
        if (recording) {
            setRecording(false);
        } else {
            setRecording(true);
            setShowAudio(true);
        }
    };

    const Sending = () => {
        setShow(false);
        ShowEmojiBox(false);
        setShowAudio(false);
    };
    const HandleText = async (e) => {
        setText(e.target.value);
        typingstatus(user1);
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        await updateDoc(doc(db, "lastMsg", id), {
            from: user1,
            to: user2,
            typing: true,
            isUploaded: true,
        });
    };
    const handleChanges = (e) => {
        if (e.target.accept == "image/*") {
            console.log("image");
            setImgs([...e.target.files]);
        } else if (e.target.accept == "audio/*") {
            console.log("audio");
            setAudio(e.target.files[0]);
        } else if (e.target.accept == "file_extension") {
            setDocument([...e.target.files]);
            let send = window.confirm(`send ${document.length} documents`);
            if (send == true) {
                console.log("send document");
            } else {
                setDocument([]);
            }
            console.log("document");
        } else if (e.target.accept == "video/*") {
            setVideo([...e.target.files]);
            console.log("videos");
        }
    };

    return (
        <Form action="" onSubmit={handleSubmit}>
            <Smiley>
                <BiWinkSmile onClick={() => ShowEmojiBox(!emojiBox)} className="cursor" />
            </Smiley>
            <UploadingItems>
                <UploadBtn onClick={() => handleShow()}>
                    <Upload className="cursor" />
                </UploadBtn>
                <Uplists className="Uplists">
                    <Lists className={show ? "active" : ""}>
                        <Label htmlFor="uploadImg" onClick={()=>setShow(false)}>
                            <BiImageAlt className="upload_icons" title="images" />
                        </Label>
                        <InputField multiple type="file" id="uploadImg" accept="image/*" onChange={(e) => handleChanges(e)} />
                    </Lists>
                    <Lists className={show ? "active" : ""}>
                        <Label htmlFor="uploadAudio" onClick={()=>setShow(false)}>
                            <MdAudiotrack className="upload_icons" title="audios" />
                        </Label>
                        <InputField type="file" id="uploadAudio" accept="audio/*" onChange={(e) => handleChanges(e)} />
                    </Lists>
                    <Lists className={show ? "active" : ""}>
                        <Label htmlFor="uploadFile" onClick={()=>setShow(false)}>
                            <FiPaperclip className="upload_icons" title="docs" />
                        </Label>
                        <InputField multiple type="file" id="uploadFile" accept="file_extension" onChange={(e) => handleChanges(e)} />
                    </Lists>
                    <Lists className={show ? "active" : ""}>
                        <Label htmlFor="uploadVideo" onClick={()=>setShow(false)}>
                            <BiVideo className="upload_icons" title="videos" />
                        </Label>
                        <InputField multiple type="file" id="uploadVideo" accept="video/*" onChange={(e) => handleChanges(e)} />
                    </Lists>
                </Uplists>
            </UploadingItems>
            <InputContainer>
                {emojiBox ? <Picker onEmojiClick={pickEmoji} skinTone={{ SKIN_TONE_NEUTRAL, SKIN_TONE_LIGHT }} /> : null}
                {ShowAudio || audio ? (
                    <AudioContainer>
                    {console.log("recorded Audio", recordAudio)}
                        <Waveform audio={music} setAudioDuration={setAudioDuration} />
                        <RemoveAudio onClick={()=> {setShowAudio(false);setRecordAudio("");setAudioDuration("");setAudio("")}}><MdDelete /></RemoveAudio>
                    </AudioContainer>
                ) : (
                    // console.log("Path: ", recordAudio.name)
                    <Input type="text" placeholder={"Type your message..."} value={text} ref={inputRef} onChange={(e) => HandleText(e)} />
                )}
            </InputContainer>
            {text || audio || recordAudio || document.length > 0 || video.length > 0 ? (
                <ButtonContainer onClick={() => Sending()}>
                    <Button type="submit">
                        <Send />
                    </Button>
                </ButtonContainer>
            ) : (
                <Mic
                    className={`${!recording && "recording"}`}
                    onClick={() => {
                        RecordAudio();
                    }}
                >
                    {recording ? <BsFillMicFill onClick={StartRecording} /> : <BsFillMicFill style={{ color: "red" }} onClick={StopRecording} />}
                </Mic>
            )}
        </Form>
    );
}

const Form = styled.form`
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 50px;
`;
const Label = styled.label`
    cursor: pointer;
    display: inline-block;
`;
const Upload = styled(BiUpload)`
    font-size: 30px;
    z-index: 12312;
`;
const InputContainer = styled.div`
    position: relative;
    height: 100%;
    flex-grow: 1;
`;
const Input = styled.input`
    height: 100%;
    width: 100%;
    outline: none;
    border-radius: 10px;
    padding: 0 20px;
    font-size: 17px;
    position: absolute;
    top: 0;
    border: none;
`;
const InputField = styled.input`
    display: none;
`;
const ButtonContainer = styled.div`
    height: 100%;
    padding: 0 10px;
    border-radius: 15px;
    margin-left: 15px;
    cursor: pointer;
`;
const Button = styled.button`
    height: 100%;
    width: 100%;
    display: inline-block;
    background-color: transparent;
    border: none;
    outline: none;
`;
const Send = styled(BiSend)`
    font-size: 25px;
    cursor: pointer;
`;
const UploadBtn = styled.div`
    z-index: 1200;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f2f5;
    position: absolute;
    bottom: 0;
    border-radius: 10px;
`;
const UploadingItems = styled.div`
    width: 50px;
    height: 270px;
    position: relative;
    border-radius: 5px;
    overflow-y: hidden;
    margin-right: 10px;
`;
const Lists = styled.li`
    z-index: 100;
    transform-origin: 100px;
    transition-delay: 0.3s;
    width: 45px;
    height: 45px;
    border-radius: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    transition: 0.5s ease-in all;
    transform: translateY(220px);
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Uplists = styled.ul`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
`;
const Mic = styled.div`
    z-index: 2;
    width: 50px;
    height: 50px;
    color: #000;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    margin-left: 5px;
    cursor: pointer;
    position: relative;
`;
const Smiley = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    height: 100%;
    width: 40px;
    position: relative;
`;
const AudioContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`
const RemoveAudio = styled.span`
    display: inline-block;
    font-size: 20px;
    cursor: pointer;
    margin-left: 10px;
`

export default MessageForm;
