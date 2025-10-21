import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { useEffect, useState } from "react";
import styles from "./Tile.module.css";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import 'firebase/firestore'
import { db, deleteDoc, doc, setDoc, updateDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { database } from "../firebase-config";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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
          await updateDoc(doc(database, props.uid, props.orderid), {
            // order_id: props.orderid,
            // location: props.location,
            agent_id: user?.uid,
            // user_id: props.user_id,
            // finalCost: props.cost,
            orderList: props.orderlist,
            // date: props.date,
            // time: props.time,
            cost: cost,
            takenUp: 1,
            // delivered: props.delivered,
            // uid: props.uid,
            mobile: number,
            // paid:props.paid
          })

        } catch (error) {
          alert(error);
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


    router.reload(window.location.pathname);

  }

  let t = 0;
  const fun = () => {
    if (t % 2 == 0) {
      document.getElementById("toggle" + props.orderid).style.cssText =
        " transform: rotate(-180deg) ;transition:0.5s ";
      document.getElementById("card" + props.orderid).style.cssText =
        " max-height:1000px; transition: max-height 1s ease-in-out;";
    } else {
      document.getElementById("card" + props.orderid).style.cssText =
        "transition: max-height 0.5s ease-out;max-height:130px;";
      document.getElementById("toggle" + props.orderid).style.cssText =
        " transform: rotate(0deg); transition:0.5s ";
    }
    t++;

   

    // ele.classList.add("active");
  };

  const [temp, setTemp] = useState([]);
  const [cost, setCost] = useState(0);

  function checkBox(index) {
    
    if (temp[index] == 0) {
      temp[index] = 1;
      setCost(cost - props.orderlist[index].cost);
      props.orderlist[index].availability = 0;
    }
    else {
      temp[index] = 0
      setCost(cost + props.orderlist[index].cost);

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
    
    e.preventDefault();
    
    if (phoneNumber.length == 10 || phoneNumber.length == 13) {
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

  const verifyOTP = (e) => {
    let otp = e.target.value;
    setOTP(otp);
    if (otp.length === 6) {
      
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result) => {
        const userr = result.user;
        setVerified(true);
        setExpandForm(false);
        const updateNumber = async () => {
          // 
          await setDoc(doc(database, "database", user?.uid), {
            uid: user?.uid,
            number: number,
          });
        }
        updateNumber();
        alert("success logged in");


      }).catch((error) => {
        alert("error otp");
      });
    }
  }

  useEffect(() => {
    
    // [props.orderlist[0]["available"]]
    let temp = [];
    // props.orderlist.map((item,index)=>{temp.push(item["available"]);});
    props.orderlist.map(({ available, index }) => { temp.push(available); });
    
    setTemp(temp);

    //getting agent details
    const accessToken = userAccessToken();
    if (accessToken) {
      const [userInfo] = fetchUser();
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
    <div className={styles.card} id={"card" + props.orderid}>
      <div className={styles.content} onClick={fun}>
        <div className={styles.details}>
          <div id={styles.table}>
            <div>
              <p>Order_ID</p>
              <p> Location</p>
              <p>User_ID</p>
            </div>
            <div className={styles.values}>
              <p>{props.orderid}</p>
              <p>{props.location}</p>
              <p>{props.uid == user?.uid ? "You" : props.user_id}</p>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div >{"$" + props.cost}</div>
          <div>{props.date}</div>
          <div>{props.time}</div>
        </div>
      </div>
      <div className={styles.dropdown}>
        <div className={styles.bottom}>
          <div className={styles.p1}>
            <p>Item_name</p>
            {props.orderlist.map(({ name }) => (
              <p>{name}</p>
            ))}
          </div>
          <div className={styles.p2}>
            <p>Cost</p>
            {props.orderlist.map(({ cost }) => (
              <p>{"$" + cost}</p>
            ))}
          </div>
          <div className={styles.p3}>
            <p>Availability</p>
            {props.orderlist.map(({ availability }, index) => (
              <p>
                {availability == 0 ? (
                  <label className={styles.container}>
                    <input type="checkbox" onClick={() => checkBox(index, 0)} />
                  </label>
                ) : (
                  <label className={styles.container}>
                    <input type="checkbox" checked="checked" onClick={() => checkBox(index, 1)} />
                  </label>
                )}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.mobileNumber}>
          <span>
            Mobile Number
          </span>
          <span>
            {disable ? <input value={number} className={styles.numberInputD} onChange={(e) => { setNumber(e.target.value) }} disabled /> : <input value={number} className={styles.numberInput} onChange={(e) => { setNumber(e.target.value) }} />}

          </span>
          <span className={styles.buttonn} onClick={disableControl}>
            {Number ? <span>Update</span> : <span>{Number == number ? "Add" : "Get OTP"}</span>}
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
          <div className={styles.finalCost}>{`$` + cost}</div>
          <div className={styles.takenUp} onClick={takenUpfun}>{props.takenup == 0 ? "Take up" : "bye"}</div>
        </div>
      </div>
      <div className={styles.toggle}>
        <AiOutlineArrowUp id={"toggle" + props.orderid} onClick={fun} />
      </div>
    </div>
  );
}

export default Tile;
