import React, {useContext, useEffect, useState} from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import { AuthContext } from "../../context/auth"
import {useNavigate} from "react-router-dom"
import Photo from "../images/no-user.jpg"


function Navbar() {
    const {user}=useContext(AuthContext)
    const [userDetail, setUserDetail] = useState('')
    const navigate = useNavigate()
    const handleSignout = async () => {
        await updateDoc(doc(db, "users", auth.currentUser?.uid), {
            isOnline: false,
        });
        await signOut(auth);
        navigate("/login")
    };
    useEffect(()=> {
        if(user){
            getDoc(doc(db, "users", auth.currentUser?.uid)).then(docSnap=> {
                if(docSnap.exists){
                    setUserDetail(docSnap.data())
                }
            })
        }
    }, [user])
    // console.log(user?.uid)
    // console.log(userDetail)

    return (
        <NavContainer>
            <NavWrapper className="wrapper">
                {/* <Logo>
                    <LogoLink to="/">Messenger</LogoLink>
                </Logo> */}
                <NavLists>
                        {user ? (
                            <>
                            <NavList>
                                <NavListItem>
                                    <Linking to="">
                                        <ProfileImg src={ userDetail?.avatar ||Photo} alt="profile" />
                                    </Linking>
                                </NavListItem>
                                <NavListItem>
                                    <LogoutBtn onClick={() => handleSignout()}>Logout</LogoutBtn>
                                </NavListItem>
                            </NavList>
                            </>
                        ) : (
                            <>
                            <NavList>
                                <NavListItem>
                                    <Linking to="/login">Login</Linking>
                                </NavListItem>
                                <NavListItem>
                                    <Linking to="/register">Register</Linking>
                                </NavListItem>
                            </NavList>
                            </>
                        )}
                </NavLists>
            </NavWrapper>
        </NavContainer>
    );
}

const NavContainer = styled.section`
    background-color: red;
    border-bottom: 1px solid var(--color-6);
    height: 70px;
    width: 90%;
    margin: 0 auto;
`;
const NavWrapper = styled.section`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;
`;
const NavLists = styled.div``;
const NavList = styled.ul`
    list-style: none;
    display: flex;
    align-items: center;
`;
const NavListItem = styled.li``;
const Linking = styled(Link)`
    margin-right: 20px;
    text-decoration: none;
    color: var(--color-2);
`;
const LogoutBtn = styled.button`
    border: 1px solid #fff;
    background-color: var(--color-1);
    color :var(--color-2);
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
`
const ProfileImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`

export default Navbar;
