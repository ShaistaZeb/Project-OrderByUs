import React from 'react'
import Image from 'next/image';
import home from '../images/images.jpeg'
import styles from "../design/HOME.module.css";
import user from "../images/user-1.png"
import Bar from './bar';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { firebaseApp } from "../firebase-config";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';

import { userAccessToken } from '../utils/fetchDetails';

function HOME() {

  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const signIn = async () => {
    const firebaseAuth = getAuth(firebaseApp);
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));
    router.push("/activeOrders");
  };

  const signin = ()=>{
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const {refreshToken, providerData} = user;
        
        localStorage.setItem("user", JSON.stringify(providerData));
        localStorage.setItem("accessToken", JSON.stringify(refreshToken));
        router.push("/activeOrders");
        // ...
      })
      .catch((error) => {
        alert(error);
      });
  }

  


  const gotoForm = (text) =>{
    if(text ===  "signin")
    {
      router.push({
        pathname: '/login',
        query: { page: 'signin' }
      },'/login')
    }
    else if(text === "register")
    {
      router.push({
        pathname: '/login',
        query: { page: 'register' }
      }, '/login')
    }
  }



  const logout = () => {
    localStorage.clear();
    router.push("/login");
    console.clear();
  };

  useEffect(()=>{
    var text = ["Welcome to a Trust worthy website", "This is the website where you can order food from room", "Eat happily without getting stressed","Save your Energy for greater use 😁"];
    var counter = 0;
    var elem = document.getElementById("changeText");
    var inst = setInterval(change, 4000);

    function change() {
      elem.innerHTML = text[counter];
      counter++;
      if (counter >= text.length) {
        counter = 0;
        // clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
      }
    }
  },[]);
  


  return (
    <div className={styles.body}>
      <div className={styles.navbar}>
        <Bar></Bar>
        {/* <div className={styles.signIn} >
          <p className={styles.p} onClick={signIn}>Sign in</p>
          
          <div className={styles.img}>
            <Image
              src={user}
              width="30px"
              height="20px"

            >

            </Image>
          </div>
        </div> */}
        <div className={styles.right}>
          <span className={styles.logIn} onClick={()=>gotoForm("signin")}>
            LogIn
          </span>
          <span className={styles.signUp} onClick={() => gotoForm("register")}>
            SignUp
          </span>
        </div>
      </div>
      <div className={styles.b}>
        <div className={styles.centerText} id="changeText">
          
        </div>

        <div id={styles.runner} ></div>
      </div>
    </div>
  )
}

export default HOME