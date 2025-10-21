import { async } from '@firebase/util';
import React from 'react'
import { useState, useEffect } from 'react';
import { userAccessToken, fetchUser } from '../utils/fetchDetails';
import { database } from '../firebase-config';
import { getDoc,getDocs,collection } from 'firebase/firestore';


function Read() {

    
    const [user, setUser] = useState(null);
    let [length, setLength] = useState(0);
    let [array, setArray] = useState([]);

    useEffect(() => {
        const accessToken = userAccessToken();
        if (accessToken) {
            const [userInfo] = fetchUser();
        }
        console.log(userInfo);
        setUser(userInfo);
    }, []);

    const readData=async ()=>{
        setArray(array => [[], []]);
        console.log(user?.uid);
        const title = user?.uid;
        try {
            let a = []
            const querySnapshot = await getDocs(collection(database, title));
            console.log(querySnapshot.size);
            if(querySnapshot.size)
            querySnapshot.forEach((doc) => {
                a.push(doc.data());
                
                console.log(a);
                // doc.data() is never undefined for query doc snapshots
                
                console.log(doc.id, " => ", doc.data());
            });
            setLength(querySnapshot.size);
            console.log("hererer");
            console.log(a);
            setArray(array => [...array, JSON.stringify(a)]);
            console.log(array);


            
        } catch (error) {
            alert(error)
        }
        
    }
  return (
    <>
          
    <button onClick={readData} color="blue">Read data</button>
          <div>{length}</div>
    <div>
        {array}
    </div>
          
         
    </>
  )
}

export default Read