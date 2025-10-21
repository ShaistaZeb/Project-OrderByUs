import React from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { useEffect, useState } from "react";
import styles from "./Tile.module.css";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
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
function TileTakenUp(props) {

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
    useEffect(()=>{
        
        
    },[]);
    
    
    return (
        
        <>{
            <div className={styles.card2} id={"card" + props.orderid} >
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
                                <p style={{ "fontSize": "15px" }}>{props.location}</p>
                                <p >{props.user_id}</p>
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
                        <div >
                            <p>Item_name</p>
                            {props.orderlist.map(({ name }) => (
                                <p className={styles.p1}>{name}</p>
                            ))}
                        </div>
                        <div className={styles.p2}>
                            <p>Cost</p>
                            {props.orderlist.map(({ cost }) => (
                                <p className={styles.p1}>{"₹" + cost}</p>
                            ))}
                        </div>
                        <div className={styles.p3}>
                            <p>Availability</p>
                            {props.orderlist.map(({ availability }, index) => (
                                <p>
                                    {availability == 0 ? (
                                        <label className={styles.container}>
                                            <input type="checkbox" className={styles.container}  disabled/>
                                        </label>
                                    ) : (
                                        <label className={styles.container}>
                                                <input type="checkbox" className={styles.container} checked="checked" disabled color="black"/>
                                        </label>
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className={styles.bb}>
                        <div className={styles.finalCost}>{`₹` + props.cost}</div>
                        <div className={styles.takenUp}>{props.paid  ? "Viewed" : "Pending..."}</div>
                    </div>
                </div>
                <div className={styles.toggle}>
                    <AiOutlineArrowDown id={"toggle" + props.orderid} onClick={fun} />
                </div>
            </div>}
        </>
    );
}

export default TileTakenUp;
