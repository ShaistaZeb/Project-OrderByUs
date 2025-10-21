// import React from 'react'
// import { getAuth, RecaptchaVerifier ,signInWithPhoneNumber} from 'firebase/auth';
// import { firebaseApp } from '../firebase-config';
// import { useState } from 'react';
// import { useRouter } from 'next/router';

// const MobileLogin = () => {
// const [mobile,setMobile] = useState("");

// const updateMobile = ()=>{
//     var m = document.getElementById("mobile").value;
//     setMobile(m);
// }
// const auth = getAuth(firebaseApp);
// const router = useRouter();

// const submit = ()=>{
//     if(mobile.length == 13)
//     {
        
        
//     }
// }
//   return (
//     <div>
//         <div>
//             <div>
//                 <span>Mobile Number :</span>
//                 <span><input placeholder='__________' value={mobile} type="mobile" onChange={updateMobile} id="mobile"/></span>
//             </div>
//               <div id='recaptcha-container'></div>
//             <button onClick={submit}>Get OTP</button>
//         </div>
//     </div>
//   )
// }

// export default MobileLogin


import React from 'react'
import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";



import {authentication} from '../firebase-config'

import styles from '../design/mobileLogin.module.css'

const MobileLogin = ()=> {
  const countryCode = "+91";

  const [phoneNumber,setPhoneNumber] = useState(countryCode);
  const [expandForm,setExpandForm] = useState(false);
  const [OTP,setOTP] = useState('');

  const generateRecaptcha = ()=>{
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
        console.log("response");
      }
    }, authentication);
  }



  const requestOTP = (e) =>{
    console.log("here");
    e.preventDefault();
    console.log(phoneNumber)
    if(phoneNumber.length ==10 || phoneNumber.length == 13)
    {
      setExpandForm(true);
      generateRecaptcha();
      console.log('kkkk');
      let appVerifier = window.recaptchaVerifier;
      console.log('kkkk');
      signInWithPhoneNumber(authentication,phoneNumber,appVerifier)
      .then(confirmationResult=>{
        window.confirmationResult = confirmationResult;
        console.log('123');
      }).catch((error) => {
        // Error; SMS not sent
        // ...
        console.log("error")
        console.log(error);
      });
    }
  }

  const verifyOTP = (e)=>{
    let otp = e.target.value;
    setOTP(otp);
    if(otp.length === 6)
    {
      console.log(otp);
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result)=>{
        const user = result.user;
        alert("success logged in");
        
      }).catch((error)=>{
          alert("error otp");
      });
    }
  }


  return (
   <div className={styles.formContainer}>
     <form onSubmit={requestOTP}>
        <h1>Sign in with Phone number</h1>
        <div className={styles.mb_3}>
            <label htmlFor='phoneNumberInput' className='form-label'>Phone Number</label>
            <input type="tel" className="form-control" id="phoneNumberInput" aria-describedby="emailHelper" onChange={(e)=>setPhoneNumber(e.target.value)}/>
          
        </div>
        {expandForm==true?
        <>
            <div className={styles.mb_3}>
            <label htmlFor='otpInput' className='form-label'>OTP</label>
            <input type="number" className = 'form-control' id="otpInput" value={OTP} onChange={verifyOTP}/>
              <button id='otpHelp' className={styles.submit} > enter otp</button>
          </div>
        </>:null
        }
        {
          expandForm===false?
          <button type='submit' className={styles.submit}>Request otp</button>:null
        }
        <div id="recaptcha-container"></div>
     </form>
   </div>
  )
}

export default MobileLogin