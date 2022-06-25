import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import WaveSurfer from "wavesurfer.js";
import { MdPause } from "react-icons/md";
import { BsPlayFill } from "react-icons/bs";
import styled from "styled-components";

function Waveform({ audio, setAudioDuration }) {
    const [isPlaying, toggleIsPlaying] = useState(false);
    const containerRef = useRef();
    const waveSurferRef = useRef({
        isPlaying: () => false,
    });

    useEffect(() => {
        const waveSurfer = WaveSurfer.create({
            container: containerRef.current,
            responsive: true,
            cursorWidth: 0,
            barWidth: 2,
            barHeight: 2,
            waveColor:"#d3e7d1",
            progressColor:"#63866b"
        });
        waveSurfer.load(audio);
        // waveSurfer.loadBlob(audio)
        waveSurfer.on("ready", () => {
            waveSurferRef.current = waveSurfer;
            setAudioDuration(waveSurfer.getDuration().toFixed(2))
            
        });
        
        return () => {
            waveSurfer.destroy();
        };
    }, [audio]);
    return (
        <AudioContainer>
            <Button
                onClick={() => {
                    waveSurferRef.current.playPause()
                    toggleIsPlaying(waveSurferRef.current.isPlaying());
                }}
                type="button"
            >
                {isPlaying ? <Pause /> : <Play />}
            </Button>
            <WaveBox ref={containerRef}></WaveBox>
        </AudioContainer>
    );
}

Waveform.propTypes = {
    audio: PropTypes.string.isRequired,
};

const AudioContainer = styled.div`
    display: flex;
    width: 250px;
    height: 50px;
    border: 1px solid #43e743;
    border-radius: 50px;
    padding: 3px;
    position: relative;
`;
const WaveBox = styled.div`
    margin-left: 35px;
    width: 100%;
    & wave {
        width: 100%;
        height: 100% !important;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    &::-webkit-scrollbar {
        display: none;
    }
`;
const Button = styled.button`
    position: absolute;
    top: 50%;
    left: 6px;
    transform: translate(0px, -50%);
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    border-radius: 50%;
    background-color: unset;
`;
const Pause = styled(MdPause)`
    font-size: 25px;
`;
const Play = styled(BsPlayFill)`
    font-size: 25px;
`;
export default Waveform;
