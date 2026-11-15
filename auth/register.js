import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';

import { firebaseApp } from '../firebase-config';

const Register=(props)=> {
  // const email = props.email;
  // const password = props.password;
  const createUser = async () => {
  const auth = getAuth(firebaseApp);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = userCredential.user;

    await sendEmailVerification(user);

    await signOut(auth);

    alert("Account created successfully. Please check your email for verification.");
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message);
  }
};
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
