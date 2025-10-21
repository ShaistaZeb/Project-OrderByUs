import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { useEffect, useState } from "react";
import styles from "./Tile.module.css";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { AiFillDelete, AiOutlineArrowDown } from "react-icons/ai";
import {
    db,
    deleteDoc,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    getDocs,
    collection,
} from "firebase/firestore";
import { database } from "../firebase-config";
import { useRouter } from "next/router";
import { BiCheckbox } from "react-icons/bi";

function TileYourOrders(props) {
    const router = useRouter();
    const [aA, setaA] = useState(0);
    const [aTC, setaTC] = useState(0);
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
    const deletee = async ()=>{
        
        
        const [userInfo] = fetchUser();
        const uidd = userInfo?.uid;
        await deleteDoc(doc(database, uidd, props.orderid));
      
        alert("deleted");
        router.reload(window.location.pathname)
    }
    const [showModal, setShowModal] = useState(false);
    const deleteee = ()=>{
        setShowModal(true);
    }



    
    return (

        <>
            <div className={styles.card2} id={"card" + props.orderid} >
                <div className={styles.content}>
                    <div className={styles.details} onClick={fun} >
                        <div id={styles.table}>
                            <div>
                                <p>Order_ID</p>
                                <p style={{ "fontSize": "15px" }}> Location</p>
                                <p >User_ID</p>
                                {props.agent_id?<p>Agent_ID</p>:<></>}
                            </div>
                            <div className={styles.values}>
                                <p>{props.orderid}</p>
                                <p style={{ "fontSize": "15px" }}>{props.location}</p>
                                <p >{props.user_id}</p>
                                {props.agent_id?<p>{props.agent_id}</p>:<></>}
                            </div>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div onClick={fun}  className={styles.hovercost}>{"₹" + props.finalCost}</div>
                        <div onClick={fun}>{props.time}</div>
                        {props.delivered == -1 ? <div className={styles.delete} > rejected  </div>:
                        props.delivered ? <div className={styles.delete} > delivered  </div> : <div> <AiFillDelete onClick={deleteee} className={styles.iconD} />
                        </div>}
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.dropdown}>
                    <div className={styles.bottom}>
                        <div >
                            <p>Item_name</p>
                            {props.orderList.map(({ name }) => (
                                <p className={styles.p1}>{name}</p>
                            ))}
                        </div>
                        <div className={styles.p2}>
                            <p>Cost</p>
                            {props.orderList.map(({ cost }) => (
                                <p className={styles.p1}>{"₹" + cost}</p>
                            ))}
                        </div>
                        <div className={styles.p3}>
                            <p>Availability</p>
                            {props.orderList.map(({ availability }, index) => (
                                <p>
                                    {availability == 0 ? (
                                        <label className={styles.container}>
                                            <input type="checkbox" disabled className={styles.container} />
                                        </label>
                                    ) : (
                                        <label className={styles.container}>
                                                <input type="checkbox" checked="checked" className={styles.container} disabled color="black" />
                                        </label>
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className={styles.bb}>
                        <div className={styles.finalCost}>{`₹` + props.cost}</div>
                        <div className={styles.takenUp}>{props.delivered ? "Delivered" :props.takenup?"takenup":"Not Yet Taken"}</div>

                    </div>
                </div>
                <div className={styles.toggle}>
                    <AiOutlineArrowDown id={"toggle" + props.orderid} onClick={fun} />
                </div>
                
            </div>

            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Delete??
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                        You cannot recover your order after deleting
                                    </p>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-black-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() =>{
                                            setShowModal(false);
                                            deletee();
                                        } }
                                    >
                                        <div>Delete</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

        </>
    );
}

export default TileYourOrders;
