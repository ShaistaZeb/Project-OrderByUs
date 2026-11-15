
import React, { useEffect, useState } from "react";
import styles from "../styles/popUp.module.css";
import { doc, setDoc } from "firebase/firestore";
import {
  AiOutlinePlusCircle,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { database, authentication } from "../firebase-config";
import {
  RecaptchaVerifier,
  linkWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";

function PopUp(props) {
  const [number, setNumber] = useState("");
  const [verified, setVerified] = useState(false);
  const [Number, setnumber] = useState("");
  const [expandForm, setExpandForm] = useState(false);
  const [disable, setDisable] = useState(true);
  const [OTP, setOTP] = useState("");
  const [suggestionList, setsuggestionList] = useState([]);
  const [orderList, setorderList] = useState([]);
  const [fc, setfc] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
      if (!currentUser) {
        setVerified(false);
        setNumber("");
        setnumber("");
        return;
      }

      if (currentUser.phoneNumber) {
        setNumber(currentUser.phoneNumber);
        setnumber(currentUser.phoneNumber);
        setVerified(true);
        setDisable(true);
        setExpandForm(false);
      } else {
        setVerified(false);
        setnumber("");
      }
    });

    return () => unsubscribe();
  }, []);

  const placeOrder = async () => {
    const currentUser = authentication.currentUser;

    if (!currentUser) {
      alert("Please log in before placing an order.");
      return;
    }

    if (!currentUser.phoneNumber) {
      setVerified(false);
      alert("Please link and verify your mobile number before placing an order.");
      return;
    }

    const location = document.getElementById("areas")?.value;
    const uid = currentUser.uid;
    const today = new Date();

    const md5 = require("md5");
    const order_id = md5(uid + today);
    const user_id = md5(uid);
    const finalCost = fc;

    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    if (finalCost <= 0 || orderList.length === 0) {
      alert("Please add at least one item before placing your order.");
      return;
    }

    try {
      await setDoc(doc(database, uid, order_id), {
        order_id: order_id,
        location: location,
        agent_id: null,
        user_id: user_id,
        finalCost: finalCost,
        orderList: orderList,
        date: date,
        time: time,
        cost: 0,
        takenUp: 0,
        delivered: 0,
        uid: uid,
        email: currentUser.email || null,
        mobile: currentUser.phoneNumber,
        paid: false,
        terms_and_conditions: false,
        agent_accept: false,
      });

      props.props();
      window.location.href = window.location.pathname + "?t";
    } catch (error) {
      console.error("Place order error:", error);
      alert(error.message || "Unable to place order. Please try again.");
    }
  };

  // Searching items
  const itemsList = [
    { title: "Chicken Biryani", cost: 170, urll: "" },
    { title: "Veg Biryani", cost: 90, urll: "" },
    { title: "Egg Manchuria i", cost: 70, urll: "" },
    { title: "Veg Manchuria ", cost: 60, urll: "" },
    { title: "Chicken Manchurian", cost: 120, urll: "" },
    { title: "Chilly Chicken ", cost: 120, urll: "" },
    { title: "Egg Noodles", cost: 70, urll: "" },
    { title: "Egg Rice", cost: 60, urll: "" },
    { title: "Chicken Rice", cost: 90, urll: "" },
    { title: "Chicken Pakodi", cost: 70, urll: "" },
    { title: "Masala Dosa ", cost: 40, urll: "" },
    { title: "Onion Dosa", cost: 40, urll: "" },
    { title: "Plain Dosa", cost: 30, urll: "" },
    { title: "Mirchi ", cost: 20, urll: "" },
    { title: "Alu bajji ", cost: 20, urll: "" },
    { title: "Egg Bajji ", cost: 30, urll: "" },
    { title: "Pepsi - 20rs", cost: 20, urll: "" },
    { title: "Pepsi - 40rs", cost: 40, urll: "" },
    { title: "Pepsi - 60rs", cost: 60, urll: "" },
    { title: "Mountain Dew - 20rs", cost: 20, urll: "" },
    { title: "Mountain Dew - 40rs", cost: 40, urll: "" },
    { title: "Mountain Dew - 60rs", cost: 60, urll: "" },
    { title: "Coke - cola - 20rs", cost: 20, urll: "" },
    { title: "Sting", cost: 20, urll: "" },
    { title: "Pulpy Orange", cost: 20, urll: "" },
    { title: "Limca ", cost: 20, urll: "" },
    { title: "Water bottle ", cost: 20, urll: "" },
    { title: "Pineapple", cost: 20, urll: "" },
    { title: "Black Grapes ", cost: 30, urll: "" },
    { title: "Muskmelon ", cost: 30, urll: "" },
    { title: "Pineapple", cost: 20, urll: "" },
    { title: "Pineapple", cost: 20, urll: "" },
    { title: "Pineapple", cost: 20, urll: "" },
  ];

  const addThisItem = () => {
    const list = [...orderList];
    const input = document.getElementById("inputSearch");
    const text = input.value;
    input.value = "";

    const selectedItem = itemsList.find((item) => item.title === text);

    if (selectedItem) {
      list.push({
        name: text,
        cost: selectedItem.cost,
        availability: 0,
      });

      setorderList(list);
      setfc(Math.trunc(fc + selectedItem.cost * 1.1));
    }

    setsuggestionList([]);
  };

  const fillInput = (item) => {
    setsuggestionList([]);
    document.getElementById("inputSearch").value = item;
    addThisItem();
  };

  const inputFunction = () => {
    const matches = [];
    const text = document
      .getElementById("inputSearch")
      .value.trim()
      .toLowerCase();

    itemsList.forEach((item) => {
      if (
        text &&
        item.title.toLowerCase().includes(text) &&
        !matches.some((match) => match.title === item.title)
      ) {
        matches.push(item);
      }
    });

    setsuggestionList(matches);
  };

  let toggle = 0;

  function myFunction(index) {
    const popup = document.getElementById("myPopup" + index);

    if (toggle % 2 === 0) {
      popup.style.cssText = "visibility: visible;";
    } else {
      popup.style.cssText = "visibility: hidden;";
    }

    toggle++;
  }

  const addAgain = (index) => {
    const list = [...orderList];
    const item = list[index];

    if (!item) return;

    list.push(item);
    setorderList(list);
    setfc(Math.trunc(fc + item.cost * 1.1));
  };

  const deleteItem = (index) => {
    const item = orderList[index];

    if (!item) return;

    const list = [...orderList];
    list.splice(index, 1);
    setorderList(list);
    setfc(Math.max(0, Math.trunc(fc - item.cost * 1.1)));
  };

  const disableControl = (e) => {
    if (verified && authentication.currentUser?.phoneNumber) {
      alert("Your phone number is already linked and verified.");
      return;
    }

    if (disable) {
      setDisable(false);
    } else {
      setExpandForm(true);
      requestOTP(e);
    }
  };

  const generateRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
      },
      authentication
    );
  };

  const requestOTP = async (e) => {
    e.preventDefault();

    const currentUser = authentication.currentUser;

    if (!currentUser) {
      alert("Please log in with your existing account first.");
      return;
    }

    // Do not link the same phone number a second time.
    if (currentUser.phoneNumber) {
      setNumber(currentUser.phoneNumber);
      setnumber(currentUser.phoneNumber);
      setVerified(true);
      setDisable(true);
      setExpandForm(false);
      alert("Your phone number is already linked and verified.");
      return;
    }

    let phoneNumber = number.trim();

    if (!phoneNumber.startsWith("+91")) {
      phoneNumber = "+91" + phoneNumber;
    }

    if (!/^\+91\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      generateRecaptcha();

      const confirmationResult = await linkWithPhoneNumber(
        currentUser,
        phoneNumber,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setExpandForm(true);
      alert("OTP sent successfully.");
    } catch (error) {
      console.error("Phone linking error:", error);

      if (
        error.code === "auth/provider-already-linked" &&
        authentication.currentUser?.phoneNumber
      ) {
        const linkedPhone = authentication.currentUser.phoneNumber;
        setNumber(linkedPhone);
        setnumber(linkedPhone);
        setVerified(true);
        setDisable(true);
        setExpandForm(false);
        alert("Your phone number is already linked and verified.");
      } else {
        alert(error.message || "Unable to send OTP.");
      }
    }
  };

  const verifyOTP = async (e) => {
    const otp = e.target.value.trim();
    setOTP(otp);

    if (otp.length !== 6) return;

    try {
      if (!window.confirmationResult) {
        throw new Error("Please request an OTP first.");
      }

      const result = await window.confirmationResult.confirm(otp);
      const linkedUser = result.user;
      const linkedPhone = linkedUser.phoneNumber;

      await setDoc(
        doc(database, "database", linkedUser.uid),
        {
          uid: linkedUser.uid,
          number: linkedPhone,
        },
        { merge: true }
      );

      setNumber(linkedPhone);
      setnumber(linkedPhone);
      setVerified(true);
      setDisable(true);
      setExpandForm(false);
      setOTP("");
      window.confirmationResult = null;

      alert("Phone number verified and linked successfully.");
    } catch (error) {
      console.error("OTP verification error:", error);
      alert(error.message || "OTP verification failed.");
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.content}>
          <span className={styles.close} onClick={props.props}>
            X
          </span>

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
            <span className={styles.mn}>Mobile Number</span>
            <span>
              {disable ? (
                <input
                  value={number}
                  placeholder="click on add to enter number"
                  className={styles.numberInputD}
                  onChange={(e) => setNumber(e.target.value)}
                  disabled
                />
              ) : (
                <input
                  value={number}
                  className={styles.numberInput}
                  onChange={(e) => setNumber(e.target.value)}
                />
              )}
            </span>
          </div>

          <div className={styles.mobileNumber2}>
            <span className={styles.buttonn} onClick={disableControl}>
              {verified ? (
                <span>Verified</span>
              ) : Number ? (
                <span>Update</span>
              ) : (
                <span>{Number === number ? "Add" : "Get OTP"}</span>
              )}
            </span>

            <span className={styles.verified}>
              {verified ? <AiOutlineCheck /> : <AiOutlineClose />}
            </span>
          </div>

          <div className={styles.OTPArea}>
            {expandForm ? (
              <div>
                <span>Enter OTP : </span>
                <span>
                  <input
                    className={styles.numberInput}
                    value={OTP}
                    onChange={verifyOTP}
                    inputMode="numeric"
                    maxLength={6}
                  />
                </span>
              </div>
            ) : null}

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
              {suggestionList.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className={styles.item}
                  onClick={() => fillInput(item.title)}
                >
                  <div className="md:flex items-center py-8 border-t border-gray-200">
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
            <div key={`${name}-${index}`} className={styles.tile}>
              <span className={styles.name}>{name}</span>
              <span className={styles.cost}>{"₹" + cost}</span>

              <span className={styles.icon}>
                <div
                  className={styles.popup}
                  onClick={() => myFunction(index)}
                >
                  ...
                  <span className={styles.popuptext} id={"myPopup" + index}>
                    <div>
                      <div
                        className={styles.addAgain}
                        onClick={() => addAgain(index)}
                      >
                        <span>
                          <AiOutlinePlusCircle className={styles.iconD} />
                        </span>
                        <span> Add again</span>
                      </div>

                      <div
                        className={styles.delete}
                        onClick={() => deleteItem(index)}
                      >
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
            <span className={styles.submit} onClick={placeOrder}>
              Place order
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default PopUp;
