import React from "react";
import styles from "../styles/popUp.module.css";
import { useState, useEffect } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import "firebase/firestore";
import {
  db,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { AiOutlinePlusCircle, AiFillDelete } from "react-icons/ai";
import { database } from "../firebase-config";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { authentication } from "../firebase-config";
import Image from "next/image";

import chickenbiryani from "../public/images/biryani.jpg";
import { useRouter } from "next/router";
function PopUp(props) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [number, setNumber] = useState("");
  const [verified, setVerified] = useState(false);
  const [Number, setnumber] = useState("");
  const [expandForm, setExpandForm] = useState(false);

  const [disable, setDisable] = useState(true);
  let uidd = "";
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const accessToken = userAccessToken();
    if (accessToken) {
      const [userInfo] = fetchUser();
    }

    setUser(userInfo);
    uidd = userInfo?.uid;

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
              number = l[i]?.number;
              break;
            }
          }

          if (uid == userInfo?.uid) {

            if (number != 0) {
              setnumber(number);
              setNumber(number);
              setVerified(true);

            } else {


              // alert("plz enter ur mobile number for secure communications");
            }
          }
        });
      } catch (error) {

      }
    };
    fetchNumber();
  }, []);

  const placeOrder = async () => {
    if (verified) {
      var location = document.getElementById("areas").value;
      const uid = user?.uid;
      var today = new Date();

      var md5 = require("md5");
      var order_id = md5(uid + today);
      var user_id = md5(uid);
      var agent_id = null;
      var finalCost = fc;
      var list = [...orderList];
      var takenUp = 0;
      var delivered = 0;
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // 
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      // 
      if (finalCost > 0) {

        var md5 = require("md5");

        //sending data to firebase
        try {
          // await setDoc(doc(database,"database", uid), {
          //     uid:uid,
          //     number:null,
          // });
          await setDoc(doc(database, uid, order_id), {
            order_id: order_id,
            location: location,
            agent_id: agent_id,
            user_id: user_id,
            finalCost: finalCost,
            orderList: orderList,
            date: date,
            time: time,
            cost: 0,
            takenUp: takenUp,
            delivered: delivered,
            uid: uid,
            mobile: number,
            paid: false,
            terms_and_conditions: false,
            agent_accept: false,
          });

          // await updateDoc(doc(database,title,"L"),{
          //     name:"Hell"
          // })
          // await deleteDoc(doc(database,title,"L"),{

          // })
          props.props();
          // setShowModal(true)
          // alert("success");
          // router.reload(window.location.pathname);
          window.location.href = window.location.pathname + "?" + "t"
          // router.reload({
          //   pathname: '/activeOrders',
          //   query: { page: 't' }
          // }, '/activeOrders')
        } catch (error) {

          alert(error);
        }
      } else {
        alert("cannot place order");
      }
    } else {
      alert("mobile verification required");
    }
  };
  //searching items
  let itemsList = [
    { title: "Chicken Biryani", cost : 170, urll:""},
{ title: "Veg Biryani", cost: 90, urll:"" },

{ title: "Egg Manchuria i", cost: 70, urll:"" },

{ title: "Veg Manchuria ", cost: 60, urll:"" },

{ title: "Chicken Manchurian", cost: 120, urll:"" },

{ title: "Chilly Chicken ", cost: 120, urll:"" },

{ title: "Egg Noodles", cost: 70, urll:"" },

{ title: "Egg Rice", cost: 60, urll:"" },
{ title: "Chicken Rice", cost: 90, urll:"" },
{ title: "Chicken Pakodi", cost: 70, urll:"" },
{ title: "Masala Dosa ", cost: 40, urll:"" },
{ title: "Onion Dosa", cost: 40, urll:"" },
{ title: "Plain Dosa", cost: 30, urll:"" },
{ title: "Mirchi ", cost: 20, urll:"" },

{ title: "Alu bajji ", cost: 20, urll:"" },
{ title: "Egg Bajji ", cost: 30, urll:"" },

{ title: "Pepsi - 20rs", cost: 20, urll:"" },
{ title: "Pepsi - 40rs", cost: 40, urll:"" },

{ title: "Pepsi - 60rs", cost: 60, urll:"" },
{ title: "Mountain Dew - 20rs", cost: 20, urll:"" },

{ title: "Mountain Dew - 40rs", cost: 40, urll:"" },
{ title: "Mountain Dew - 60rs", cost: 60, urll:"" },

{ title: "Coke - cola - 20rs", cost: 20, urll:"" },
{ title: "Sting", cost: 20, urll:"" },
{ title: "Pulpy Orange", cost: 20, urll:"" },
{ title: "Limca ", cost: 20, urll:"" },
{ title: "Water bottle ", cost: 20, urll:"" },
{ title: "Pineapple", cost: 20, urll:"" },

{ title: "Black Grapes ", cost: 30, urll:"" },
{ title: "Muskmelon ", cost: 30, urll:"" },

{ title: "Pineapple", cost: 20, urll:"" },

{ title: "Pineapple", cost: 20, urll:"" },

{ title: "Pineapple", cost: 20, urll:"" },

  ];

const [suggestionList, setsuggestionList] = useState([]);
const [orderList, setorderList] = useState([]);
const [fc, setfc] = useState(0);
const addThisItem = () => {
  let list = [...orderList];

  setorderList(list);
  var text = document.getElementById("inputSearch").value;
  document.getElementById("inputSearch").value = "";
  var c = 0;
  itemsList.map(({ cost, title }) => {
    if (title == text) {
      c = cost;
    }
  });
  if (c != 0) {
    list.push({ name: text, cost: c, availability: 0 });
    setorderList(list);
  }
  setorderList(list);


  var intvalue = Math.trunc(fc + (c * 0.1) + c)
  setfc(intvalue);
  setsuggestionList([]);
};
const fillInput = (item) => {
  setsuggestionList([]);
  document.getElementById("inputSearch").value = item;
  addThisItem();
};

const inputFunction = () => {
  suggestionList = [];
  // console.clear();
  var text = document.getElementById("inputSearch").value;
  text = text.trim();
  text = text.toLowerCase();
  itemsList.map((item) => {
    if (item.title.toLowerCase().match(text) && text != "") {
      if (suggestionList.indexOf(item.title) < 0) {
        suggestionList.push(item);
      }
      setsuggestionList(suggestionList);


    }

    // else{
    //     
    // }
  });
  setsuggestionList(suggestionList);


};

let toggle = 0;
function myFunction(index) {
  var popup = document.getElementById("myPopup" + index);
  if (toggle % 2 == 0) {
    popup.style.cssText = `visibility: visible;`;
  } else {
    popup.style.cssText = `visibility: hidden;`;
  }
  toggle++;


}
function fun() {
  var popup = document.getElementById("hi");
  popup.style.cssText = "color:black";
}

const addAgain = (index) => {
  var list = [...orderList];
  list.push(list[index]);
  setorderList(list);
  var intvalue = Math.trunc(fc + list[index]["cost"] + list[index]["cost"] * 0.1)

  setfc(intvalue);
};
const deleteItem = (index) => {
  var list = [...orderList];
  if (index > -1) {
    list.splice(index, 1); // 2nd parameter means remove one item only
  }
  setorderList(list);
  var intvalue = Math.trunc(fc - (orderList[index]["cost"] + (orderList[index]["cost"] * 0.1)))
  setfc(intvalue);
};

const disableControl = (e) => {
  if (disable) {
    setDisable(false);
  } else {
    setExpandForm(true);
    requestOTP(e);
  }
};
const countryCode = "+91";
const [OTP, setOTP] = useState("");

const generateRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();

      },
    },
    authentication
  );
};

const requestOTP = (e) => {
  let phoneNumber = number;
  if(phoneNumber.substring(0,3) != "+91"){
    phoneNumber = "+91"+phoneNumber;
  }

  e.preventDefault();

  if (phoneNumber.length == 10 || phoneNumber.length == 13) {
    setExpandForm(true);
    generateRecaptcha();

    let appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;

        alert("successfully sent");
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...


        alert(error);
      });
  }
};

const verifyOTP = (e) => {
  let otp = e.target.value;
  setOTP(otp);
  if (otp.length === 6) {

    let confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(otp)
      .then((result) => {
        const userr = result.user;
        setVerified(true);
        setExpandForm(false);
        const updateNumber = async () => {
          // 
          await setDoc(doc(database, "database", user?.uid), {
            uid: user?.uid,
            number: number,
          });
        };
        updateNumber();
        alert("success logged in");
      })
      .catch((error) => {
        alert("error otp");
      });
  }
};

return (

  < >
    <div className={styles.card}>
      <div className={styles.content}>
        <span className={styles.close} onClick={props.props}>X</span>
        <div className={styles.location}>
          <span className={styles.l}>Location</span>
          <span className={styles.areas}>
            <select name="areas" id="areas" className={styles.a}>
              <option value="BH1">BH1</option>
              <option value="BH2">BH2</option>
              <option value="GH1">GH1</option>
              <option value="GH2">GH2</option>
              <option value="OBH">OBH</option>
              <option value="OGH">OGH</option>
            </select>
          </span>
        </div>
        <div className={styles.mobileNumber}>
          <span className={styles.mn}>
            Mobile Number
          </span>
          <span>
            {disable ? <input value={number} placeholder="click on add to enter number" className={styles.numberInputD} onChange={(e) => { setNumber(e.target.value) }} disabled /> : <input value={number} className={styles.numberInput} onChange={(e) => { setNumber(e.target.value) }} />}

          </span>

        </div>
        <div className={styles.mobileNumber2}>
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

        <div className={styles.searchArea}>
          <div className={styles.s}>Select Your Orders</div>
          <span>
            <input
              id="inputSearch"
              type="text"
              onChange={inputFunction}
              className={styles.searchInput}
              placeholder="Search for items.."
            />
          </span>

          <span className={styles.addS} onClick={addThisItem}>
            ADD
          </span>

          <div className={styles.mainList}>
            {suggestionList.map((item) => (

              <div className={styles.item}
                onClick={() => {
                  fillInput(item.title);
                }}>

                <div className="md:flex items-center py-8 border-t border-gray-200">
                  {/* <div className="w-1/4">
                      <Image
                        src={chickenbiryani}
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div> */}
                  <div className="md:pl-3 md:w-3/4">

                    <div className="flex items-center justify-between w-full pt-1">
                      <p className="text-base font-black leading-none text-gray-800">
                        {item.title}
                      </p>

                    </div>


                    <div className="flex items-center justify-between pt-5 pr-6">

                      <p className="text-base font-black leading-none text-green-400">
                        {"₹" + item.cost}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {orderList.map(({ name, cost }, index) => (
          <div className={styles.tile}>
            <span className={styles.name}>{name }</span>
            <span className={styles.cost}>{"₹" + cost}</span>
            <span className={styles.icon}>
              <div className={styles.popup} onClick={() => myFunction(index)}>
                ...
                <span className={styles.popuptext} id={"myPopup" + index} >
                  <div>
                    <div className={styles.addAgain} onClick={() => addAgain(index)}>
                      <span>
                        <AiOutlinePlusCircle className={styles.iconD} />
                      </span>
                      <span> Add again</span>
                    </div>
                    <div className={styles.delete} onClick={() => deleteItem(index)}>
                      <span>
                        <AiFillDelete className={styles.iconD} />
                      </span>
                      <span>Delete</span>
                    </div>
                  </div>
                </span>
              </div>
            </span>
          </div>
        ))}
        <p className={styles.dcost}>+10% delivery cost</p>
        <div className={styles.bottom}>
          <span className={styles.fc}>{"₹" + fc}</span>
          <span className={styles.submit} onClick={placeOrder}>Place order</span>
        </div>



      </div>
    </div>



  </>



);


}

export default PopUp;
