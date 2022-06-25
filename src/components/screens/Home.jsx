// Packages
import React, { useContext, useEffect, useState } from "react";
import { collection, query, where, onSnapshot, Timestamp, orderBy, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL , uploadBytesResumable } from "firebase/storage";
import styled from "styled-components";
import MicRecorder from "mic-recorder-to-mp3";

// Components
import { db, auth, storage } from "../../firebase";
import Users from "./Users";
import Messages from "./Messages";
import ProfileNav from "../includes/ProfileNav";
import { AuthContext } from "../../context/auth";
import Profile from "./Profile";
import Preview from "../includes/Preview";

function Home() {
    const { user } = useContext(AuthContext); // Logged in user details
    const user1 = auth.currentUser.uid; // Current Loggedin User
    const [users, setUsers] = useState([]); // Array of other users
    const [chat, setChat] = useState(""); // Details of selected user
    const [text, setText] = useState(""); // variable for text
    const [imgs, setImgs] = useState([]); // Array of Images
    const [video, setVideo] = useState([]); // variable for video
    const [document, setDocument] = useState([]); // variable for document
    const [msgs, setMsgs] = useState([]); // List of Msgs
    const [audio, setAudio] = useState(""); // variable for audio
    const [recordAudio, setRecordAudio] = useState(""); // variable for Recorded Audio
    const [userDetail, setUserDetail] = useState(""); // Loggedin User Details
    const [showProfile, setShowProfile] = useState(false); //
    const [showProp, setshowProp] = useState(false); // Dropdown
    const [audioDuration, setAudioDuration] = useState("");
    const [progress, setProgress] = useState(100); // Progress of uploading file
    const [uploaded, setUploaded] = useState(false); 

    const user2 = chat?.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const date = Timestamp.fromDate(new Date());
    const id2 = user1 + date;
    

    //-----------------------------------------------------( Getting logged in user details )------------------------------------------------------
    useEffect(() => {
        if (user) {
            getDoc(doc(db, "users", user1)).then((docSnap) => {
                if (docSnap.exists) {
                    setUserDetail(docSnap.data());
                }
            });
        }
    }, [user]);

    // ------------------------------------------------------------------(Listing Other Users )---------------------------------------------------------
    useEffect(() => {
        const usersRef = collection(db, "users");
        // creating query object
        const q = query(usersRef, where("uid", "not-in", [user1]));

        // exicuting query
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub();
    }, []);

    //----------------------------------------------------------------------( Getting Recorded audio )------------------------------------------------------- 

    const Mp3Recorder = new MicRecorder({
        bitRate: 128,
    });
    const StartRecording = () => {
        Mp3Recorder.start()
            .then(async () => {
                await updateDoc(doc(db, "users", user1), {
                    isRecording: true,
                });
            })
            .catch((e) => {
                console.log(e.message);
            });
    };
    const StopRecording = async () => {
        Mp3Recorder.stop()
            .getMp3()
            .then(async ([buffer, blob]) => {
                const file = new File(buffer, `${new Date().getTime()}-voice.mp3`, {
                    type: blob.type,
                    lastModified: Date.now(),
                });
                console.log(file);
                setRecordAudio(file);
                await updateDoc(doc(db, "users", user1), {
                    isRecording: false,
                });
            })
            .catch((e) => {
                alert("We could not retrieve your message");
                console.log(e);
            });

        console.log(recordAudio);
    };

    //-------------------------------------------------------------------( Selected User )----------------------------------------------------------------
    const SelectedUser = async (user) => {
        setChat(user);

        const user2 = user.uid;
        const msgsRef = collection(db, `messages`, id, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));

        onSnapshot(q, (querySnapshot) => {
            let msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push(doc.data());
            });
            setMsgs(msgs);
        });

        // Get last message b/w two users
        const docSnap = await getDoc(doc(db, "lastMsg", id));
        if (docSnap.data() && docSnap.data().from !== user1) {
            updateDoc(doc(db, "lastMsg", id), {
                unread: false,
            });
        }
    };
    {console.log("progress", progress);}
    //------------------------------------------------------------------- ( Form Submitting ) -------------------------------------------------------------
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user2 = chat.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let RecordUrl;
        let audioUrl ;
        
        let imgUrl = [];
        let videoUrl = [];
        let docUrl = [];
        
        
        await setDoc(doc(db, `messages/${id}/chat`, id2), {
            text:text || "",
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            photos: imgUrl || "",
            audio: audioUrl || "",
            recordAudio: RecordUrl || "",
            videos: videoUrl || "",
            duration: audioDuration || "",
            documents: docUrl || "",
            isUploaded: uploaded || false,
        });
        await setDoc(doc(db, "lastMsg", id), {
            text:text || "",
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            photos: imgUrl || "",
            audio: audioUrl || "",
            recordAudio: RecordUrl || "",
            videos: videoUrl || "",
            duration: audioDuration || "",
            documents: docUrl || "",
            isUploaded: uploaded || false,
            unread: true,
        });
        
        
        // {progress == 100 ? setUploaded(true):setUploaded(false)}
        // ------------------------------------------------------------------------( Uploading text )-----------------------------------------------
        if (text) {
            // setUploaded(true);
            setProgress(100);
            {progress == 100 ? setUploaded(true):setUploaded(false)}
            await updateDoc(doc(db, `messages/${id}`, "chat", id2), {
                text: text,
                isUploaded:  uploaded,
            });
            
            await updateDoc(doc(db, "lastMsg", id), {
                text: text,
                isUploaded:  uploaded,
            });
        }
        // -----------------------------------------------------------------------( Uploading Image )-------------------------------------------------------
        if (imgs) {
            imgs.map((img) => {
                const imgRef = ref(storage, `Images/${user2}/${new Date().getTime()}-${img.name}`);
                try {
                    const uploadTask = uploadBytesResumable(imgRef, img);
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                            setProgress(Math.round(prog));

                            switch (snapshot.state) {
                                case "paused":
                                    console.log("Upload is paused");
                                    break;
                                case "running":
                                    console.log("Upload is running");
                                    break;
                            }
                            // {progress == 100 ? setUploaded(true):setUploaded(false)}
                        },
                        (error) => {
                            // Handle unsuccessful uploads
                            alert(error.message);
                            console.log(error);
                        },
                        async () => {
                            // Handle Successfull uploads
                            {progress == 100 ? setUploaded(true):setUploaded(false)}
                            await getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                                imgUrl.push(downloadUrl);
                                console.log(downloadUrl);
                            });
                            await updateDoc(doc(db, `messages/${id}`, "chat", id2), {
                                photos: imgUrl,
                                isUploaded:  uploaded,
                            });
                            
                            await updateDoc(doc(db, "lastMsg", id), {
                                photos: imgUrl,
                                isUploaded:  uploaded,
                            });
                        }
                    );
                } catch (err) {
                    console.log(err.message);
                }
            });
        }
        // --------------------------------------------------------------------------------( Uploading Audio files )----------------------------------------------------
        if (audio) {
            const audioRef = ref(storage, `Audios/${user2}/${new Date().getTime()}-${audio.name}`);
            try {
                const uploadTask = uploadBytesResumable(audioRef, audio);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        setProgress(Math.round(prog));

                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        alert(error.message);
                        console.log(error);
                    },
                    async () => {
                        // Handle Successfull uploads
                        await getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                            audioUrl = downloadUrl
                        });
                        {progress == 100 ? setUploaded(true):setUploaded(false)}
                        await updateDoc(doc(db, `messages/${id}`, "chat", id2), {
                            audio: audioUrl,
                            isUploaded:  uploaded,
                        });
                        await updateDoc(doc(db, "lastMsg", id), {
                            audio: audioUrl,
                            isUploaded:  uploaded,
                        });
                    }
                );
            } catch (err) {
                console.log(err.message);
            }
        }
        // -------------------------------------------------( Uploading recordings )-----------------------------------------------
        if (recordAudio) {
            const recordRef = ref(storage, `Recordings/${user2}/${recordAudio.name}`);
            
            try {
                const snapUpload = uploadBytesResumable(recordRef, recordAudio);
                snapUpload.on(
                    "state_changed",
                    (snapshot) => {
                        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("recording Uploading status", prog);
                        setProgress(Math.round(prog));

                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        alert(error.message);
                        console.log(error);
                    },
                    async () => {
                        await getDownloadURL(snapUpload.snapshot.ref).then((downloadUrl) => {
                            RecordUrl = downloadUrl ;
                        });
                        {progress == 100 ? setUploaded(true):setUploaded(false)}
                        await updateDoc(doc(db, `messages/${id}`, "chat", id2), {
                            recordAudio: videoUrl,
                            isUploaded:  uploaded,
                        });
                        await updateDoc(doc(db, "lastMsg", id), {
                            recordAudio: videoUrl,
                            isUploaded:  uploaded,
                        });
                    }
                );
            } catch (err) {
                console.log(err.message);
            }
        }
        // ---------------------------------------------------------( Uploading Video )------------------------------------------------------------
        if (video) {
            video.map((vid) => {
                const videoRef = ref(storage, `Videos/${user2}/${new Date().getTime()}-${vid.name}`);
                try {
                    const snapUpload = uploadBytesResumable(videoRef, vid);
                    snapUpload.on(
                        "state_changed",
                        (snapshot) => {
                            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("video Uploading status", prog);
                            setProgress(Math.round(prog));

                            switch (snapshot.state) {
                                case "paused":
                                    console.log("Upload is paused");
                                    break;
                                case "running":
                                    console.log("Upload is running");
                                    break;
                            }
                        },
                        (error) => {
                            // Handle unsuccessful uploads
                            alert(error.message);
                            console.log(error);
                        },
                        async () => {
                            await getDownloadURL(snapUpload.snapshot.ref).then((downloadUrl) => {
                                videoUrl.push(downloadUrl);
                            });
                            {progress == 100 ? setUploaded(true):setUploaded(false)}
                            await updateDoc(doc(db, `messages/${id}`, "chat", id2), {
                                videos: videoUrl,
                                isUploaded:  uploaded,
                            });
                            await updateDoc(doc(db, "lastMsg", id), {
                                videos: videoUrl,
                                isUploaded:  uploaded,
                            });
                        }
                    );
                } catch (err) {
                    console.log(err.message);
                }
            });
        }
        // ----------------------------------------------------------( Uploading Documents )----------------------------------------------------
        if (document) {
            document.map((docs)=>{

                const docRef = ref(storage, `Documents/${user2}/${new Date().getTime()}-${docs.name}`);
                try {
                    const snapUpload = uploadBytesResumable(docRef, docs);
                    snapUpload.on(
                        "state_changed",
                        (snapshot) => {
                            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("documents Uploading status", prog);
                            setProgress(Math.round(prog));

                            switch (snapshot.state) {
                                case "paused":
                                    console.log("Upload is paused");
                                    break;
                                case "running":
                                    console.log("Upload is running");
                                    break;
                            }
                        },
                        (error) => {
                            // Handle unsuccessful uploads
                            alert(error.message);
                            console.log(error);
                        },
                        async () => {
                            await getDownloadURL(snapUpload.snapshot.ref).then((downloadUrl) => {
                                docUrl.push(downloadUrl);
                            });
                            {progress == 100 ? setUploaded(true):setUploaded(false)}
                            await updateDoc(doc(db, `messages/${id}`, "chat", id2), {
                                documents: docUrl,
                                isUploaded:  uploaded,
                            });
                            await updateDoc(doc(db, "lastMsg", id), {
                                documents: docUrl,
                                isUploaded:  uploaded,
                            });
                        }
                    );
                } catch (err) {
                    console.log(err.message);
                }
            })
        }


        setVideo("");
        setText("");
        setImgs("");
        setRecordAudio("");
        setAudio("");
        setAudioDuration("");
        setDocument("");
        setProgress(100);
    };

    // --------------------------------------------------------------------------------------------------
    return (
        <>
            <div className="background"></div>
            <HomeContainer>
                <HomeWrapper>
                    <Container>
                        <UsersContainer className="container">
                            <ProfilePage className={`${showProfile && "ham"}`}>
                                <Profile setShowProfile={setShowProfile} />
                            </ProfilePage>
                            <div style={{ width: "100%", position: "sticky", top: 0 }}>
                                <ProfileNav showProp={showProp} setshowProp={setshowProp} setShowProfile={setShowProfile} userDetail={userDetail} />
                            </div>
                            <div onClick={() => setshowProp(false)}>
                                {users.map((user) => (
                                    <Users audioDuration={audioDuration} text={text} chat={chat} user1={user1} key={user.uid} user={user} SelectedUser={SelectedUser} />
                                ))}
                            </div>
                        </UsersContainer>
                        <MessageContainer>
                            {chat ? (
                                <Messages
                                    audio={audio}
                                    imgs={imgs}
                                    setAudio={setAudio}
                                    user1={user1}
                                    msgs={msgs}
                                    chat={chat}
                                    setImgs={setImgs}
                                    handleSubmit={handleSubmit}
                                    text={text}
                                    setText={setText}
                                    StartRecording={StartRecording}
                                    StopRecording={StopRecording}
                                    recordAudio={recordAudio}
                                    setRecordAudio={setRecordAudio}
                                    setVideo={setVideo}
                                    video={video}
                                    setAudioDuration={setAudioDuration}
                                    setDocument={setDocument}
                                    document={document}
                                    progress={progress}
                                />
                            ) : (
                                <div>select user</div>
                            )}
                        </MessageContainer>
                    </Container>
                </HomeWrapper>
            </HomeContainer>
            {imgs.length !== 0 ? (
                <Preview handleSubmit={handleSubmit} imgs={imgs} setImgs={setImgs} />
            ) : video.length !== 0 ? (
                <Preview handleSubmit={handleSubmit} video={video} setVideo={setVideo} />
            ) : document.length !== 0 ? (
                <Preview handleSubmit={handleSubmit} document={document} setDocument={setDocument} />
            ) : null}
        </>
    );
}

const HomeContainer = styled.section`
    background-color: #991111;
    width: 90%;
    margin: 0 auto;
`;
const HomeWrapper = styled.section`
    margin: 0 auto;
    background-color: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
`;
const Container = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 3fr;
    overflow: hidden;
    height: calc(100vh - 20px);
    width: 100%;
`;
const UsersContainer = styled.div`
    border-right: 1px solid #bdbdbd;
    overflow-y: auto;
    position: relative;
    overflow-x: hidden;
    height: 100%;
`;
const MessageContainer = styled.div``;
const ProfilePage = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    left: -100%;
    z-index: 100;
    transition: 0.5s ease all;
`;

export default Home;
