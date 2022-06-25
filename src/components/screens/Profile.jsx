import React, { useEffect, useState } from "react";
import styled from "styled-components";
import UserImg from "../images/no-user.jpg";
import { AiOutlineCamera, AiOutlineDelete} from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile({ setShowProfile }) {
    const [img, setImg] = useState(null);
    const [user, setUser] = useState();
    const navigate = useNavigate()

    useEffect(() => {
        getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
                setUser(docSnap.data());
            }
        });
        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`);
                try {
                    if(user.avatarPath){
                        await deleteObject(ref(storage, user.avatarPath))
                    }
                    const snap = await uploadBytes(imgRef, img);
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
                    console.log(url);
                    await updateDoc(doc(db, "users", auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath,
                    });
                    setImg(null);
                    navigate("/")
                } catch (err) {
                    console.log(err.message);
                }
            };
            uploadImg();
            
        }
    }, [img]);

    const deleteProfile = async () => {
        try {
            const confirm = window.confirm('Delete Avatar ?')
            if(confirm) {
                await deleteObject(ref(storage, user.avatarPath))
                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    avatar:"",
                    avatarPath:"",
                })
                
            }
            navigate("/")
            console.log("deleted");
        } catch (err) {
            console.log(err.message);
        }
    }

    return user ? (
        <ProfileContainer>
                <BackButtonBox>
                    <Back>
                        <Arrow onClick={()=> setShowProfile(false)} />
                        <Heading>Profile</Heading>
                    </Back>
                </BackButtonBox>
                <ProfileSection>
                    <PhotoContainer className="img-container">
                        <Photo src={user.avatar || UserImg} alt="User Image" />
                        <Overlay className="overlay">
                            <div>
                                <Label htmlFor="camera">
                                    <Camera />
                                </Label>
                                {user.avatar ? <Delete onClick={()=> deleteProfile()} /> : null}
                                <Input type="file" accept="image/*" id="camera" onChange={(e) => setImg(e.target.files[0])} />
                            </div>
                        </Overlay>
                    </PhotoContainer>
                    <TextContainer>
                        <NameLabel>Your name</NameLabel>
                        <UserName>{user.name}</UserName>
                    </TextContainer>
                    <TextContainer>
                        <NameLabel>Joined </NameLabel>
                        <Joined>{user.createdAt.toDate().toDateString()}</Joined>
                    </TextContainer>
                </ProfileSection>
        </ProfileContainer>
    ) : null;
}

const ProfileContainer = styled.section`
    background-color: #f0f2f5;
    width: 100%;
    height: 100%;
    z-index: 100;
`;
const ProfileSection = styled.div`
    width: 100%;
    padding-top: 30px;
`;
const PhotoContainer = styled.div`
    width: 200px;
    height: 200px;
    position: relative;
    margin: 0 auto;
`;
const Photo = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: 0.5s ease-in-out all;
`;
const TextContainer = styled.div`
    color: #000;
    background-color: #fff;
    padding: 30px;
    margin: 20px 0 40px;
`;
const UserName = styled.h3`
    font-size: 20px;
    font-weight: 400;
    margin-left: 20px;
`;
const NameLabel = styled.span`
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
    color: #008069;
    margin-bottom: 20px;
`;
const Joined = styled.small`
    font-size: 16px;
    margin-left: 20px;
    display: block;
`;
const Overlay = styled.div`
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    width: 93%;
    height: 93%;
`;
const Label = styled.label``;
const Camera = styled(AiOutlineCamera)`
    font-size: 25px;
    cursor: pointer;
    margin-right: 10px;
    color: #fff;
`;
const Delete = styled(AiOutlineDelete)`
    cursor: pointer;
    font-size: 25px;
    color: #f24957;
`;
const Input = styled.input`
    display: none;
`;
const BackButtonBox = styled.div`
    width: 100%;
    height: 120px;
    background-color: #458269;

`
const Back = styled.div`
    padding-top: 60px;
    padding-left: 30px;
    display: flex;
    color: #fff;
`
const Arrow = styled(BsArrowLeft)`
    cursor: pointer;
    font-size: 30px;
    margin-right: 30px;
    
`
const Heading = styled.h3`
    font-size: 25px;
    font-weight: 400;
`


export default Profile;
