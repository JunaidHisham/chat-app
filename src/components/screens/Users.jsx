// Packages
import { onSnapshot, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BiMicrophone } from "react-icons/bi";
// Components
import { db } from "../../firebase";
import Img from "../images/no-user.jpg";

function Users({ user1, user, SelectedUser, chat, text }) {
    const user2 = user?.uid; // Getting Selected User
    const [data, setData] = useState("");
    const [userData, setUserData] = useState("");
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    useEffect(() => {
        // updating Last Message
        let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, []);
    useEffect(() => {
        // updating chatting User
        let unsub = onSnapshot(doc(db, "users", user2), (doc) => {
            setUserData(doc.data());
        });
        return () => unsub();
    }, []);

    return (
        <UserWrapper className={chat.name === user.name && "selected-user"} onClick={() => SelectedUser(user)}>
            <UserInfo>
                <UserDetail>
                    <ProfileContainer>
                        <Profile src={user.avatar || Img} alt="Profile Image" />
                    </ProfileContainer>
                    <Detail>
                        <UserName>{user.name}</UserName>
                        {/* {data ?  : ""}</LastMsg> */}
                        <LastMsg>
                            { data && data.from === user1
                                ? data.text ||
                                  (data.documents.length > 0 ? "document" : "") ||
                                  (data.recordAudio || data.audio ? (
                                      <Duration>
                                          {data.duration} <BiMicrophone />
                                      </Duration>
                                    ) : ( "" )) ||
                                  (data.photos.length > 0 ? "image" : "")
                                : userData?.isTyping  ? 
                                    "typing..."
                                    : ""}
                        </LastMsg>
                        {/* {(userData?.isTyping ? "typing..." : "")} */}
                    </Detail>
                    {data?.to === user1 && data?.unread ? <New></New> : null}
                </UserDetail>
            </UserInfo>
        </UserWrapper>
    );
}
const UserWrapper = styled.div`
    height: 70px;
    padding: 0 20px;
    cursor: pointer;
    &.selected-user {
        background-color: #f0f2f5;
    }
`;
const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
`;
const UserDetail = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;
const ProfileContainer = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
`;
const Profile = styled.img`
    width: 50px;
    height: 50px;
    display: block;
    margin-right: 15px;
    border-radius: 50%;
`;
const UserName = styled.h3`
    margin-bottom: 5px;
    width: 113%;
    color: #000;
    font-weight: 400;
`;
const LastMsg = styled.p`
    font-size: 15px;
    white-space: nowrap;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #000;
`;
const Detail = styled.div`
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #bdbdbd;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const Duration = styled.span`
    color: #4ef645;
    font-size: 15px;
    display: flex;
    align-items: center;
`;
const New = styled.span`
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #51ff00;
`;
export default Users;
