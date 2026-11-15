import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import {AiOutlineArrowDown} from "react-icons/ai";
import { useEffect, useState } from "react";
import styles from "./Tile.module.css";
import { userAccessToken, fetchUser, getIdToken } from "../utils/fetchDetails";
import 'firebase/firestore'
import { db, deleteDoc, doc, setDoc, updateDoc, getDocs, collection, getDoc, runTransaction } from "firebase/firestore";
import { database } from "../firebase-config";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential
} from "firebase/auth";

import { authentication } from '../firebase-config'
function Tile(props) {
  const router = useRouter();
  const mobile = 100;
  const [number, setNumber] = useState(0);
  const [expandForm, setExpandForm] = useState(false);
  var md5 = require("md5");
  const m = () => {

  }

  const takenUpfun = async () => {

    if (verified) {


      if (user?.uid != props.uid && cost) {
        try {
          // Claim inside a transaction: it reads the order and only takes it if nobody else has,
          // so two agents tapping "Take up" at once can't both get it.
          const orderRef = doc(database, props.uid, props.orderid);
          await runTransaction(database, async (tx) => {
            const snap = await tx.get(orderRef);
            if (!snap.exists() || snap.data().takenUp !== 0) {
              throw new Error("This order has already been taken up.");
            }
            tx.update(orderRef, {
            // order_id: props.orderid,
            // location: props.location,
             agent_id: authentication.currentUser?.uid,
            // user_id: props.user_id,
            // finalCost: props.cost,
            orderList: props.orderlist,
            // date: props.date,
            // time: props.time,
            cost: cost,
            takenUp: 1,
            // delivered: props.delivered,
            // uid: props.uid,
           agent_mobile: number,
            // paid:props.paid
            });
          });


          // Email the customer, and wait for it, so the reload below can't cancel the request.
          await sendmail().catch(() => {});
          //




           router.reload(window.location.pathname);

        } catch (error) {
          alert(error.message || error);
        }
      }
      else {
        if (cost == 0) {
          alert("select items");
        }
        else
          alert("you cannot takeup your own order");
      }
    }
    else
    {
      alert("set ur mobile number");
    }


   

  }

  const sendmail = async ()=>{
    // The server looks up the order, checks this agent claimed it, and emails its owner.
    let data = {
      ownerUid: props.uid,
      orderId: props.orderid,
    }
    const idToken = await getIdToken();
    return fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(data)
    }).then((res) => {

    })
  }

  const [expanded, setExpanded] = useState(false);

const fun = () => {
  setExpanded((previous) => !previous);
};

  const [temp, setTemp] = useState([]);
  const [cost, setCost] = useState(0);

  function checkBox(index) {
    
    if (temp[index] == 0) {
      temp[index] = 1;
      var intvalue = Math.trunc(cost - (props.orderlist[index].cost + (props.orderlist[index].cost * 0.1)));
      // let toint = (int)();
      
      setCost(intvalue);
      props.orderlist[index].availability = 0;
    }
    else {
      temp[index] = 0
      var intvalue = Math.trunc(cost + (props.orderlist[index].cost + (props.orderlist[index].cost * 0.1)));
      setCost(intvalue);

      props.orderlist[index].availability = 1;
    }

    setTemp(temp);
    

    
  }

  const [user, setUser] = useState(null);
  const [disable, setDisable] = useState(true);
  const [verified, setVerified] = useState(false);
  const disableControl = (e) => {
    if (disable) {
      setDisable(false);
    }
    else {
      setExpandForm(true);
      requestOTP(e);
    }
  }
  const countryCode = "+91";
  const [OTP, setOTP] = useState('');

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
        
      }
    }, authentication);
  }



  const requestOTP = (e) => {
    let phoneNumber = number;
    
    if (phoneNumber.substring(0, 3) != "+91") {
      phoneNumber = "+91" + phoneNumber;
    }

    console.log(phoneNumber,"num");
    
    e.preventDefault();
    
    if (phoneNumber.length == 13) {
      setExpandForm(true);
      generateRecaptcha();
      
      let appVerifier = window.recaptchaVerifier;
      
      signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
          
          alert("successfully sent");
        }).catch((error) => {
          // Error; SMS not sent
          // ...
          
          
          alert(error);
        });
    }
  }

  const verifyOTP = async (e) => {
  const otp = e.target.value.trim();
  setOTP(otp);

  if (otp.length === 6) {
    try {
      const currentUser = authentication.currentUser;

      if (!currentUser) {
        alert("Please log in to your agent account first.");
        return;
      }

      const confirmationResult = window.confirmationResult;

      if (!confirmationResult) {
        alert("Please request OTP first.");
        return;
      }

      // Create phone authentication credential
      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otp
      );

      // Link phone number to the existing agent account
      const result = await linkWithCredential(
        currentUser,
        credential
      );

      const agentUid = result.user.uid;

      // Save the agent's phone number in Firestore
      await setDoc(
  doc(database, "database", agentUid),
  {
    uid: agentUid,
    number: number
  },
  { merge: true }
);

      setVerified(true);
      setExpandForm(false);
      setDisable(true);

      alert("Phone number successfully linked to agent account!");

    } catch (error) {
      console.error("Phone verification error:", error);

      if (error.code === "auth/credential-already-in-use") {
        alert("This phone number is already linked to another account.");
      } else if (error.code === "auth/invalid-verification-code") {
        alert("Incorrect OTP. Please try again.");
      } else if (error.code === "auth/provider-already-linked") {
        alert("A phone number is already linked to this account.");
      } else {
        alert(error.message || "Phone verification failed.");
      }
    }
  }
};

  useEffect(() => {
    
    // [props.orderlist[0]["available"]]
    let temp = [];
    // props.orderlist.map((item,index)=>{temp.push(item["available"]);});
    props.orderlist.map(({ available, index }) => { temp.push(available); });
    
    setTemp(temp);

    //getting agent details
    const accessToken = userAccessToken();

let userInfo = null;

if (accessToken) {
  const storedUser = fetchUser();
  userInfo = Array.isArray(storedUser) ? storedUser[0] : null;
}

setUser(userInfo);
    const fetchNumber = async () => {
      
      try {
        // var l = [];
        var l = [];
        const querySnapshot = await getDocs(collection(database, "database"));
        
        if (querySnapshot.size)
          querySnapshot.forEach(async (doc) => {
            l.push(doc.data());
            // doc.data() is never undefined for query doc snapshots
            // var q = await getDocs(collection(database,doc.id));
            // 

            

          });
        
        //   
        l.map(async () => {
          
          let uid;
          let number;
          for (let i = 0; i < l.length; i++) {
            if (l[i]?.uid == userInfo?.uid) {
              uid = l[i]?.uid;
              number = l[i]?.number
              break;
            }
          }
          
          if (uid == userInfo?.uid) {
            
            if (number != 0) {
              setNumber(number);
              setVerified(true);
              
            }
            else {
              
              
            }
          }

        });


      } catch (error) {
        
      }
    }
    fetchNumber();
    // 
    // var webname = ["welcome", "to",
    //   "GeeksforGeeeks"];

    // 
    //   return index;
    // }));
  }, []);
  return (
    <div
  className={styles.card2}
  id={"card" + props.orderid}
  style={{
    maxHeight: expanded ? "1000px" : "130px",
    transition: "max-height 1s ease-in-out",
  }}
>
      <div className={styles.content} onClick={fun}>
        <div className={styles.details}>
          <div id={styles.table}>
            <div>
              <p>Order_ID</p>
              <p style={{ "fontSize": "15px" }}> Location</p>
              <p >User_ID</p>
            </div>
            <div className={styles.values}>
              <p>{props.orderid}</p>
              <p style={{ "fontSize":"15px" }}>{props.location}</p>
              <p >{props.uid == user?.uid ? "You" : props.user_id}</p>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.hovercost} >{"₹" + props.cost}</div>
          <div>{props.date}</div>
          <div>{props.time}</div>
        </div>
       
      </div>
      <div className={styles.line}></div>
      <div className={styles.dropdown}>
        <div className={styles.bottom}>
          <div>
            <p>Item_name</p>
            {props.orderlist.map(({ name }, index) => (
  <p key={index} className={styles.p1}>{name}</p>
))}
          </div>
          <div className={styles.p2}>
            <p>Cost</p>
            {props.orderlist.map(({ cost }, index) => (
  <p key={index} className={styles.p1}>{"₹" + cost}</p>
))}
          </div>
          <div className={styles.p3}>
            <p>Availability</p>
           {props.orderlist.map(({ availability }, index) => (
  <p key={index}>
                {availability == 0 ? (
                  <label className={styles.container}>
                    <input type="checkbox" className={styles.container}  onClick={() => checkBox(index, 0)} />
                  </label>
                ) : (
                  <label className={styles.container}>
                      <input type="checkbox" className={styles.container} checked="checked" onClick={() => checkBox(index, 1)} />
                  </label>
                )}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.mobileNumber}>
          <span>
             Number
          </span>
          <span>
            {disable ? <input value={number} className={styles.numberInputD} onChange={(e) => { setNumber(e.target.value) }} disabled /> : <input value={number} className={styles.numberInput} onChange={(e) => { setNumber(e.target.value) }} />}

          </span>
          <span className={styles.buttonn} onClick={disableControl}>
            {Number ? <span>Change</span> : <span>{Number == number ? "Add" : "Get OTP"}</span>}
          </span>
          <span className={styles.verified}>{verified ? <AiOutlineCheck /> : <AiOutlineClose />}</span>
        </div>

        <div className={styles.OTPArea}>
          {expandForm ? <div>
            <span>Enter OTP : </span>
            <span><input className={styles.numberInput} value={OTP} onChange={verifyOTP} /></span>
            <span><button className={styles.buttonn}>Submit</button></span>
          </div> : null}
          <div id="recaptcha-container"></div>
        </div>
        <div className={styles.bb}>
          <div className={styles.finalCost}>{`₹` + cost}</div>
          <button
  type="button"
  className={styles.takeUpButton}
  onClick={(e) => {
    e.stopPropagation();
    takenUpfun();
  }}
  disabled={props.takenup != 0}
>
  {props.takenup == 0 ? "Take Up Order" : "Already Taken"}
</button>
        </div>
      </div>
      <div className={styles.toggle}>
  <AiOutlineArrowDown
    id={"toggle" + props.orderid}
    onClick={fun}
    style={{
      transform: expanded ? "rotate(-180deg)" : "rotate(0deg)",
      transition: "transform 0.5s ease",
      cursor: "pointer",
    }}
  />
</div>
      
    </div>
  );
}

export default Tile;
