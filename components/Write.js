import firebase from 'firebase/app';
import 'firebase/firestore'
import { useState, useEffect } from "react";
import Firestore from 'firestore';
import {db, deleteDoc, doc, setDoc, updateDoc,getDocs,collection } from "firebase/firestore"; 
import { database } from '../firebase-config';
import { fetchUser,userAccessToken } from '../utils/fetchDetails';

const WriteToCloudFirestore = () =>{

    const [user, setUser] = useState(null);

    useEffect(() => {
        const accessToken = userAccessToken();
        if (accessToken)
        {
            const [userInfo] = fetchUser();
        }
        console.log(userInfo);
        setUser(userInfo);
    }, []);
    console.log("hell");
    console.log(user?.uid);
    const title  = user?.uid;
    const sendData = async()=> {
        try{
            await setDoc(doc(database, title, "LAa"), {
                name: "Los Angeles",
                state: "CA",
                country: "USA"
            });
            
            // await updateDoc(doc(database,title,"L"),{
            //     name:"Hell"
            // })
            // await deleteDoc(doc(database,title,"L"),{
            
            // })
            alert("success");
        }
        catch(error){
            console.log(error)
            alert(error)
        }

    }
    const readData = async()=>{
        
        try{
            // const docRef = doc(db, "cities", "SF");
            // const docSnap = await getDoc(docRef);

            // if (docSnap.exists()) {
            //     console.log("Document data:", docSnap.data());
            // } else {
            //     // doc.data() will be undefined in this case
            //     console.log("No such document!");
            // }
            const querySnapshot = await getDocs(collection(database,title));
            console.log(querySnapshot.size);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });

        }catch(e)
        {
            alert(e)
        }
    }

    return (
        <>
        <button onClick={sendData}>send data</button>
        <button onClick={readData}>get data</button>
        </>
    )
}

export default WriteToCloudFirestore