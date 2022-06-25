import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Photo from "../images/no-user.jpg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AuthContext } from "../../context/auth";

function ProfileNav({setshowProp, showProp, setShowProfile }) {
    const [userDetail, setUserDetail] = useState("")
    const { user } = useContext(AuthContext)
    const user1 = auth.currentUser?.uid
    useEffect(() => {
        // Getting logged in user details
        if (user) {
            getDoc(doc(db, "users", user1)).then((docSnap) => {
                if (docSnap.exists) {
                    setUserDetail(docSnap.data());
                }
            });
        }
    }, []);

    const navigate = useNavigate()
    const handleSignout = async () => {
        await updateDoc(doc(db, "users", auth.currentUser?.uid), {
            isOnline: false,
        });
        await signOut(auth);
        navigate("/login")
    };
    return (
        <>
            <ProfileContainer>
                <ProfileBox onClick={() => setShowProfile(true)}>
                    <ProfileImage src={userDetail?.avatar || Photo} alt="Profile Photo" />
                </ProfileBox>
                <NavLists>
                    <List>
                        <DotSpan>
                            <Dots onClick={()=>setshowProp(!showProp)} />
                        </DotSpan>
                        {showProp ? (
                            <DotLists>
                                <DotUl>
                                    <DotLi>
                                        <p onClick={() => handleSignout()} >Log out</p>
                                    </DotLi>
                                </DotUl>
                            </DotLists>
                        ) : null}
                    </List>
                </NavLists>
            </ProfileContainer>
        </>
    );
}
const ProfileContainer = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 70px;
    background-color: #d9d9d9;
    z-index: 5;
`;
const ProfileBox = styled.div`
    width: 50px;
    height: 50px;
    cursor: pointer;
`;
const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`;
const NavLists = styled.ul`
    list-style: none;
    height: 100%;
    display: flex;
    align-items: center;
`;
const List = styled.li`
    position: relative;
`;
const Dots = styled(BsThreeDotsVertical)`
    font-size: 25px;
    cursor: pointer;
`;
const DotSpan = styled.span`
    display: inline-block;
`;
const DotLists = styled.div`
    position: absolute;
    transition: 0.5s ease all;
    width: 200px;
    height: 200px;
    background-color: #ffffff;
    right: 10px;
    /* padding: 10px; */
    box-shadow: 0px 0px 9px #b4b4b4;
`;
const DotUl = styled.ul`
    list-style: none;

`;
const DotLi = styled.li`
    padding: 15px 30px 15px ;
    cursor: pointer;
    &:hover {
        background-color: #e4e4e4;
    }
`;
export default ProfileNav;
