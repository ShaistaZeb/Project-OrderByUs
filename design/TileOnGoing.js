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
import { useRouter } from "next/router";
import { BiCheckbox } from "react-icons/bi";
function TileOnGoing(props) {
    var md5 = require("md5");
    const router = useRouter();
    const [aA,setaA] = useState(0);
    const [aDA, setaDA] = useState(0);
    const [aTC,setaTC] = useState(0);
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


   

    const paid = async(order_id, uid) => {
        
        //after proceeding payment;
        await updateDoc(doc(database, uid, order_id), {
            paid: true,
        })
        router.reload(window.location.pathname);
    }

    const agentApproval = (id,val,disapprovalId)=>{
        var idd = document.getElementById(disapprovalId);
        
        if(val==0)
        {   
            setaA(1);
            idd.disabled = true;

        }
        else
        {
            setaA(0);
            idd.disabled = false;
        }
    }

    const agentDisapproval = (id,val,approvalId)=>{
        var idd = document.getElementById(approvalId);

        if(val==0)
        {
            
            setaDA(1);
            idd.disabled = true;
        }
        else
        {
            setaDA(0);
            idd.disabled = false;

        }
    }

    const atc = (id, val) => {
        if (val == 0) {
            setaTC(1);
        }
        else {
            setaTC(0);
        }
    }

    const buttonSubmit = async()=>{
        
        if(aA && aTC)
        {
            try {
                await updateDoc(doc(database, props.uid, props.orderid), {
                    
                    delivered: 1,
                    agent_accept:true,
                    terms_and_conditions:true,
                    
                })
                router.reload(window.location.pathname);

            } catch (error) {
                alert(error);
            }
        }
        else if(aDA && aTC){
            alert("rejected");
            try {
                await updateDoc(doc(database, props.uid, props.orderid), {

                    delivered: -1,
                    agent_accept: false,
                    terms_and_conditions: true,

                })
                router.reload(window.location.pathname);

            } catch (error) {
                alert(error);
            }

        }
        else
        {
            alert("click two checkboxes");
        }
    }
    return (

        <>
            <div className={styles.card2} id={"card" + props.orderid} >
                <div className={styles.content} onClick={fun}>
                    <div className={styles.details}>
                        <div id={styles.table}>
                            <div>
                                <p>Order_ID</p>
                                <p style={{ "fontSize": "15px" }}> Location</p>
                                <p >User_ID</p>
                                <p>Agent_ID</p>
                            </div>
                            <div className={styles.values}>
                                <p>{props.orderid}</p>
                                <p style={{ "fontSize": "15px" }}>{props.location}</p>
                                <p >{props.user_id}</p>
                                <p>{md5(props.agent_id)}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.hovercost} >{"₹" + props.finalCost}</div>
                        <div>{props.date}</div>
                        <div>{props.time}</div>
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
                                            <input type="checkbox" className={styles.container} disabled />
                                        </label>
                                    ) : (
                                        <label className={styles.container}>
                                                <input type="checkbox" className={styles.container} checked="checked" disabled color="black" />
                                        </label>
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className={styles.bb}>
                        <div className={styles.finalCost}>{`₹` + props.cost}</div>
                        {props.paid == true ? <></> : <div className={styles.takenUp} onClick={() => paid(props.orderid, props.uid)}>{props.takenup == 0 ? "Take up" : "View Mobile Number"}</div>}

                    </div>
                </div>
                <div className={styles.toggle}>
                    <AiOutlineArrowDown id={"toggle" + props.orderid} onClick={fun} />
                </div>
                {props.paid == true ?
                <div>
                    <span>Mobile number of Agent :</span>
                    <span>{props.mobile}</span>
                    <div>
                       <div>
                                <span>
                                    <input type="checkbox" id={"AgentDisapproval" + props.orderid} onClick={() => agentDisapproval("AgentDisapproval" + props.orderid, aDA, "AgentApproval" + props.orderid)} />
                                </span>
                                <span >Reject the agent</span>
                       </div>

                            <div>
                                <span>
                                    <input type="checkbox" id={"AgentApproval" + props.orderid} onClick={() => agentApproval("AgentApproval" + props.orderid, aA, "AgentDisapproval" + props.orderid)} /></span>
                                <span>Accept the agent</span>
                                </div>
                    </div>
                        <div>
                            <span><input type="checkbox" id={"ATC" + props.orderid} onClick={() => atc("ATC" + props.orderid,aTC)}/></span>
                            <span>Accept terms & conditions</span>
                        </div>
                        <div onClick={buttonSubmit}>
                            <span ><button onClick={buttonSubmit} className={styles.button}>Submit</button></span>
                            
                        </div>
                </div>:<div>Click on view to get details of agent</div>}
            </div> 
            
        </>
    );
}

export default TileOnGoing;
