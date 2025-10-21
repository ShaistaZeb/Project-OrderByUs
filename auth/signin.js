import React from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../firebase-config';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Signin = () => {
    const router = useRouter();
    const signin = () => {
        const auth = getAuth(firebaseApp);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const { refreshToken, providerData } = user;
                console.log(refreshToken, providerData);
                localStorage.setItem("user", JSON.stringify(providerData));
                localStorage.setItem("accessToken", JSON.stringify(refreshToken));
                router.push("/activeOrders");
                // ...
            })
            .catch((error) => {
                alert(error);
            });
    }
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const updateEmail = () => {
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
                    <span><input id='password' placeholder='password' type="password" onChange={updatePassword} value={password} /></span>
                </div>
                <div>
                    <button onClick={signin}>Signin</button>
                </div>
            </div>
        </div>
    )
}

export default Signin
