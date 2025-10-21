import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { AiOutlineHome, AiOutlineEyeInvisible, AiOutlineEye, AiOutlineUser, AiFillLock } from "react-icons/ai";
import styles from "../design/login.module.css"
import { useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { firebaseApp } from '../firebase-config';
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import LoadingIcons from 'react-loading-icons'
import logoo from "../public/mp4/title.gif"
import Image from 'next/image';

import 'firebase/firestore';
import { database } from '../firebase-config';
import { db, deleteDoc, doc, setDoc, updateDoc, getDocs, collection, getDoc } from "firebase/firestore";
const Login = () => {
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

    useEffect(() => {
        //

        const p = router.asPath.substring(9, router.asPath.length)
        //
        if (p) {
            setPage(p);
        }
        else {
            setPage("register");
        }

        const accessToken = userAccessToken();
        if (!accessToken) return router.push("/login");
        else return router.push("/activeOrders");
        const [userInfo] = fetchUser();

    }, [])




    const f2 = () => {
        setPage("signin");
    }

    const f1 = () => {
        setPage("register");
    }


    const eye1 = (e) => {

        // var val = document.getElementById(id);
        if (e === "password") {
            sete1("text");

        }
        else {
            sete1("password")
        }
    }
    const eye2 = (e) => {

        // var val = document.getElementById(id);
        if (e === "password") {
            sete2("text");

        }
        else {
            sete2("password")
        }
    }

    const sendDataToFirestore = async (providerData) => {
        const uid = providerData[0]?.uid;
        // providerData[0]
        try {
            await setDoc(doc(database, "database", uid), {
                uid: uid,
                number: 0,
            });


        } catch (error) {

            setLoading(false);
            alert(error);
        }
    }

    const createAccount = () => {
        document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.6)";
        setLoading(true)
        if (password === confirmPassword) {



            createUserWithEmailAndPassword(auth, email, password).then(
                (userCredential) => {
                    const user = userCredential.user;
                    const { refreshToken, providerData } = user;
                    // const uid = user[0].uid;
                    // const uid = providerData.uid;
                    try {
                        sendEmailVerification(user)
                        alert("email sent check your spam folder in mail  ");
                    } catch (error) {
                        alert(error);
                    }




                    setPage("signin");
                    sendDataToFirestore(providerData);
                    alert("account created");
                    document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.9)";
                    setLoading(false);
                    // document.getElementById("load").style.backgroundColor = "black"
                    // const { refreshToken, providerData } = user;
                    //
                    // localStorage.setItem("user", JSON.stringify(providerData));
                    // localStorage.setItem("accessToken", JSON.stringify(refreshToken));
                    // router.push("/activeOrders");

                }
            ).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.9)";
                setLoading(false);
                // document.getElementById("load").style.backgroundColor = "black"
                alert(error);


            });
        }
        else {
            alert("password error");
        }
        setEmail("");
        setConfirmPassword("");
        setPassword("");

    }

    const forgotPassword = () => {
        router.push('/forgotpassword');
    }

    const signIn = () => {
        document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.6)";
        setLoading(true);
        signInWithEmailAndPassword(auth, emailS, passwordS)
            .then(async (userCredential) => {

                // Signed in
                const user = userCredential.user;
                if (user.emailVerified) {
                    const { refreshToken, providerData } = user;

                    localStorage.setItem("user", JSON.stringify(providerData));
                    localStorage.setItem("accessToken", JSON.stringify(refreshToken));
                    router.push("/activeOrders");
                }
                else {
                    alert("email not verifiesd");
                    document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.9)";
                    setLoading(false);
                    // document.getElementById("load").style.backgroundColor = "black"
                }

            })
            .catch((error) => {
                setLoading(false);
                // document.getElementById("load").style.backgroundColor = "black"
                document.getElementById("load").style.backgroundColor = "rgba(232 ,156, 7,0.9)";


                alert(error);
            });
    }
    const home = () => {
        router.push('/home');
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
                    {page === "signin" ? "Welcome....!" : "Create Account"}
                </div>
                <div className={styles.description}>
                    {page === "signin" ? "Sign in to your account" : "Register with your details"}

                </div>
                {page === "register" ?
                    <form>
                        <div className={styles.login}>
                            <AiOutlineUser className={styles.icon} />
                            <input className={styles.text} placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        </div>
                        <div className={styles.password}>
                            <AiFillLock className={styles.icon} />
                            <div id='eye1' onClick={() => eye1(e1)}>
                                {e1 === "password" ?
                                    <AiOutlineEye className={styles.rightIcon} /> : <AiOutlineEyeInvisible className={styles.rightIcon} />}
                            </div>

                            <input className={styles.text} placeholder='Password' value={password} type={e1} onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        <div className={styles.password2}>
                            <AiFillLock className={styles.icon} />
                            <div id="eye2" onClick={() => eye2(e2)}> {e2 === "password" ?
                                <AiOutlineEye className={styles.rightIcon} /> : <AiOutlineEyeInvisible className={styles.rightIcon} />}</div>
                            <input className={styles.text} placeholder='Confirm Password' value={confirmPassword} type={e2} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                        </div>

                        <div className={styles.button} onClick={createAccount} id="load">
                            {loading ? <span className={styles.loader} >Creating...</span> : "Create"}
                        </div>

                    </form> : <form>
                        <div className={styles.login}>
                            <AiOutlineUser className={styles.icon} />
                            <input className={styles.text} placeholder='Email' value={emailS} onChange={(e) => { setEmailS(e.target.value) }} />
                        </div>
                        <div className={styles.password}>
                            <AiFillLock className={styles.icon} />
                            <div id='eye1' onClick={() => eye1(e1)}>
                                {e1 === "password" ?
                                    <AiOutlineEye className={styles.rightIcon} /> : <AiOutlineEyeInvisible className={styles.rightIcon} />}
                            </div>

                            <input className={styles.text} placeholder='Password' value={passwordS} type={e1} onChange={(e) => { setPasswordS(e.target.value) }} />
                        </div>

                        <div className={styles.fp} onClick={forgotPassword}>
                            forgot password?
                        </div>

                        <div className={styles.button} onClick={signIn} id="load">
                            {loading ? <span className={styles.loader} >Signing in...</span> : "Sign in"}

                        </div>

                    </form>}
                <div className={styles.options}>
                    <span className={styles.register} onClick={f1}>
                        Register
                    </span>
                    <span className={styles.signin} onClick={f2}>
                        SignIn
                    </span>
                </div>
            </div>

        </>
    )
}

export default Login