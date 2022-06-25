import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer  from 'wavesurfer.js'


function Wave({ audio, path }) {
    const [waveformLoaded, setWaveformLoaded] = useState(false)
    const websurfer = useRef(null)
    const audioData = useRef(null)
    useEffect(()=> {
        websurfer.current = WaveSurfer.create({
            container: document.querySelector("#waveform"),
            waveColor:"#D9DCFF",
            progressColor:"#4353FF",
            cursorColor:"#4353FF",
            barWidth:2,
            barHeight:1,
            barRadius:3,
            cursorWidth:1,
            height: 200,
            barGap:null,
        })
        websurfer.current.on("ready", ()=> {
            setWaveformLoaded(true)
            websurfer.current.load(path)
        })
        // websurfer.current.on("region-created", (e)=> {})
        // websurfer.current.enableDragSelection()
    }, [])
    const createWaveform = (e)=> {
        // if (regions.length > 0) {
        //     websurfer.current.regions.clearRegions();
        // }
        setWaveformLoaded(false);
        var file = audio
        // if(file){
        //     var reader = new FileReader()
        //     reader.onload = async (event) => {
        //         audioData.current = event.target.result;
        //         let blob = new window.Blob([new Uint8Array(event.target.results)],{
        //             type:"audio/mp3",
        //         })
        //         websurfer.current.loadBlob(blob)
        //     }
        //     reader.readAsArrayBuffer(file)
        // }
    }
    const playPause = () => {
        if(!websurfer.current.isPlaying()){
            websurfer.current.play();
        }else{
            websurfer.current.pause();
        }
    }
    if (audio) {
        createWaveform()
    }
  return (
    <div>
        <div id='waveform' style={{visibility:`${waveformLoaded? "visible":"hidden"}`}}></div>
        {!waveformLoaded && <div>Loading...</div> }
        <input type="button" value="Play/Pause" onClick={playPause} />
    </div>
  )
}

export default Wave