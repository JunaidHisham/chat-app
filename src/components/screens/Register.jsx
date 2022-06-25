import React, { useState } from "react";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loading from "../includes/Loading";

function Register() {
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        error: null,
        loading: false,
    });
    const navigate = useNavigate();
    const { name, email, password, error, loading } = data;

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!name) {
            setData({ ...data, error: "Your name is required" });
        } else if (!email) {
            setData({ ...data, error: "Your email is required" });
        } else if (!password) {
            setData({ ...data, error: "Please enter a strong password" });
        }
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // console.log(result.user);
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                password,
                createdAt: Timestamp.fromDate(new Date()),
                isOnline: true,
                isTyping:false,
                isRecording:false,
            });
            setData({
                name: "",
                email: "",
                phone: "",
                password: "",
                error: null,
                loading: false,
            });
            // console.log(auth);
            // console.log(auth.currentUser);
            navigate("/");
        } catch (err) {
            setData({ ...data, error: err.message, loading: false });
        }
    };

    return (
        <>
            <RegisterContainer>
                <RegisterWrapper className="wrapper">
                    <FormBoxContainer>
                        <RegisterHeading>Create an account</RegisterHeading>
                        <RegisterForm onSubmit={(e) => handleSubmit(e)}>
                            <InputContainer>
                                <Label htmlFor="name">Name</Label>
                                <InputField placeholder="Your Name" name="name" type="text" value={name} onChange={(e) => handleChange(e)} />
                            </InputContainer>
                            <InputContainer>
                                <Label htmlFor="email">Email</Label>
                                <InputField placeholder="Enter email" name="email" type="email" value={email} onChange={(e) => handleChange(e)} />
                            </InputContainer>
                            <InputContainer>
                                <Label htmlFor="password">Password</Label>
                                <InputField placeholder="Type Stronger Password" name="password" type="password" value={password} onChange={(e) => handleChange(e)} />
                            </InputContainer>
                            {error ? <ErrorTxt>{error}</ErrorTxt> : null}
                            <ButtonContainer>
                                <RegisterBtn type="submit">{loading ? "Registering" : "Register"}</RegisterBtn>
                            </ButtonContainer>
                        </RegisterForm>
                    </FormBoxContainer>
                    {loading ? <Loading />:""}
                </RegisterWrapper>
            </RegisterContainer>
        </>
    );
}

const RegisterContainer = styled.section``;
const RegisterWrapper = styled.section``;
const FormBoxContainer = styled.div`
    max-width: 500px;
    margin: 0 auto;
    margin-top: 100px;
    box-shadow: 1px 2px 10px var(--color-4);
    padding: 10px 20px;
    border-radius: 5px;
`;
const RegisterHeading = styled.h3`
    text-align: center;
    font-size: 20px;
    color: var(--color-4);
    margin-top: 20px;
`;
const RegisterForm = styled.form`
    margin-top: 30px;
    padding: 0 20px;
`;
const InputContainer = styled.div`
    margin-bottom: 20px;
`;
const Label = styled.label``;
const InputField = styled.input`
    width: 100%;
    padding: 10px;
    outline: none;
    margin-top: 10px;
    border: 1px solid var(--color-6);
    border-radius: 5px;
`;
const ButtonContainer = styled.div`
    margin: 10px 0;
    text-align: center;
`;
const RegisterBtn = styled.button`
    display: inline-block;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: 1px solid var(--color-4);
    background: var(--color-1);
    color: var(--color-2);
    cursor: pointer;
    transition: 0.4s ease-in-out all;
    font-size: 18px;
    &:hover {
        transform: scale(1.05);
    }
`;
const ErrorTxt = styled.p`
    color: var(--color-5);
    text-align: left;
    font-size: 15px;
    margin-bottom: 10px;
`;

export default Register;
