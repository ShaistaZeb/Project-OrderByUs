import React from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../firebase-config';
import { useState } from 'react';

const Register=(props)=> {
  // const email = props.email;
  // const password = props.password;
  const createUser = ()=>{
    const auth = getAuth(firebaseApp);
      createUserWithEmailAndPassword(auth,email,password).then(
        (userCredential)=>{
          const user = userCredential.user;
          user.sendEmailVerification();
          auth.signOut();
          alert("email sent check ur inbox  ");
        }
      ).catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error);
      })
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateEmail = ()=>{
    var e = document.getElementById("email").value;
    setEmail(e);
    console.log(e);
  }
  const updatePassword = () => {
    var p = document.getElementById("password").value;
    setPassword(p);
    console.log(p);
  }
  

  return (
    <div>
      <div>
        <div>
          <span>Email : </span>
          <span><input id='email' placeholder='....@gmail.com' type="email" onChange={updateEmail} value={email} /></span>
        </div>
        <div>
          <span>Password : </span>
          <span><input id='password' placeholder='password' type="password" onChange={updatePassword} value={password}/></span>
        </div>
        <div>
          <button onClick={createUser}>Create Account</button>
        </div>
      </div>
    </div>
  )
}

export default Register
