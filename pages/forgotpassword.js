import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { AiOutlineHome, AiOutlineEyeInvisible, AiOutlineEye, AiOutlineUser, AiFillLock } from "react-icons/ai";
import styles from "../design/login.module.css"
import { useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseApp } from '../firebase-config';
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import LoadingIcons from 'react-loading-icons'
import logoo from "../public/mp4/title.gif"
import Image from 'next/image';

import 'firebase/firestore';
import { database } from '../firebase-config';
import { db, deleteDoc, doc, setDoc, updateDoc, getDocs, collection, getDoc } from "firebase/firestore";
const Forgotpassword = () => {
    const router = useRouter();

    const auth = getAuth(firebaseApp);

    const [e1, sete1] = useState('password');
    const [e2, sete2] = useState("password");
    const [page, setPage] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    //for sign in page
    const [emailS, setEmailS] = useState("");
    const [passwordS, setPasswordS] = useState("");
    const [loading, setLoading] = useState(false);




    const home = () => {
        router.push('/home');
    }
    const sendMail = () => {
        document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.6)";
        setLoading(true);

        const auth = getAuth(firebaseApp);
        alert(emailS)
        sendPasswordResetEmail(auth, emailS)
            .then(() => {
                // Password reset email sent!
                // ..
                alert("reset mail sent")
                document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.9)";
                setLoading(false);
                router.push({
                    pathname: '/login',
                    query: { page: 'signin' }
                }, '/login')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(error);
                console.log("error", error);
                // ..
                document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.9)";
                setLoading(false);
            });


    }
    return (
        <>
            <div className={styles.body}>
                <div className={styles.home} onClick={home}>
                    <span> <AiOutlineHome className={styles.iconn} /></span><span className={styles.homee}>Home</span>
                </div>
                <div className={styles.logo}>
                    <Image src={logoo} objectFit="center" />
                </div>
                <div className={styles.head}>
                    Forgot password??
                </div>
                <div className={styles.description}>
                    Please enter your email
                </div>
                <form>
                    <div className={styles.login}>
                        <AiOutlineUser className={styles.icon} />
                        <input className={styles.text} placeholder='Email' value={emailS} onChange={(e) => { setEmailS(e.target.value) }} />
                    </div>




                    <div className={styles.button} onClick={sendMail} id="load">
                        {loading ? <span className={styles.loader} >Sending Mail</span> : "Send Mail"}

                    </div>

                </form>

            </div>

        </>
    )
}

export default Forgotpassword