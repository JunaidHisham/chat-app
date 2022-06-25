import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Preview({document, setDocument, setVideo, video, imgs, setImgs, handleSubmit }) {
    const CancelPreview = () => {
        if (imgs) {
            setImgs("");
        } else if (video) {
            setVideo("");
        } else if (document) {
            setDocument("")
        }
    };
    const navigate = useNavigate();
    const handleImages = (e) => {
        setImgs([...e.target.files]);
    };
    const Send = (e) => {
        navigate("/");

        handleSubmit(e);
    };

    return (
        <PreviewBox>
            <Close
                onClick={() => {
                    CancelPreview();
                }}
            >
                X
            </Close>
            <OutBox>
                {imgs ? (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {imgs.map((img, index) => (
                            <ImgPreviewBox  key={index}>
                                <DeleteImg onClick={(e) => setImgs((imgs) => imgs.filter((_, ind) => ind !== index))}>x</DeleteImg>
                                <ImgPreview id={index} src={URL.createObjectURL(img)} alt={"image"} />
                            </ImgPreviewBox>
                        ))}
                    </div>
                ) : null}
                {video ? (
                    <div>
                        {video.map((vid, index) => (
                            <video key={index} src={URL.createObjectURL(vid)} width={400} controls></video>
                        ))}
                    </div>
                ) : null}
                {document ? (
                    <div>
                        {document.map((doc, index)=> (
                            <iframe width={300} height={300} src={URL.createObjectURL(doc)} key={index} frameBorder="0"></iframe>
                        ))}
                    </div>
                ):null}
            </OutBox>
            <Buttons>
                <EditImg htmlFor="image">Edit</EditImg>
                <input multiple id="image" style={{ display: "none" }} type="file" onChange={(e) => handleImages(e)} />
                <SendButton type="submit" onClick={(e) => Send(e)}>
                    Send
                </SendButton>
            </Buttons>
        </PreviewBox>
    );
}

const PreviewBox = styled.div`
    z-index: 10000;
    width: 100%;
    height: 100vh;
    position: absolute;
    bottom: 90px;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 100;
    padding-top: 50px;
    background-color: rgba(0, 0, 0, 0.5);
`;
const ImgPreviewBox = styled.div`
    position: relative;
    height: 150px;
    margin: 0 auto 20px;
    &:hover span {
        display: block;
    }
`;
const DeleteImg = styled.span`
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    font-weight: 900;
`;
const ImgPreview = styled.img`
    display: block;
    height: 100%;
`;
const Close = styled.span`
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #fff;
    font-size: 30px;
    font-weight: 900;
    position: absolute;
    left: 30px;
`;
const OutBox = styled.div`
    width: 90%;
    height: 90vh;
    margin: 0 auto;
`;
const Buttons = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100px;
    padding-left: 100px;
`;
const EditImg = styled.label`
    background-color: #cd3232;
    color: #fff;
    margin-right: 20px;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
`;
const SendButton = styled.button`
    padding: 10px 20px;
    border-radius: 8px;
    background-color: #914646;
    color: #fff;
    outline: none;
    border: none;
    cursor: pointer;
`;
export default Preview;
