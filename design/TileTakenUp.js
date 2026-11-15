
import React, { useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import styles from "./Tile.module.css";

import {
    doc,
    runTransaction,
} from "firebase/firestore";

import { database, authentication } from "../firebase-config";
import { useRouter } from "next/router";
// import { fetchUser } from "../utils/fetchDetails";

function TileTakenUp(props) {
    const router = useRouter();

    const [expanded, setExpanded] = useState(false);
    const [deliveryLoading, setDeliveryLoading] = useState(false);

    // Preserve the original card expansion behaviour.
    const toggleCard = () => {
        setExpanded((previous) => !previous);
    };

    const markAsDelivered = async (e) => {
        e.stopPropagation();

        if (deliveryLoading) return;

        const currentUser = authentication.currentUser;

        if (!currentUser) {
            alert("Please log in again.");
            return;
        }

        if (!props.uid || !props.orderid) {
            alert("Order information is missing.");
            return;
        }

        setDeliveryLoading(true);

        try {
            const orderRef = doc(
                database,
                props.uid,
                props.orderid.toString()
            );

            await runTransaction(database, async (transaction) => {
                const orderSnap = await transaction.get(orderRef);

                if (!orderSnap.exists()) {
                    throw new Error("Order not found.");
                }

                const orderData = orderSnap.data();
                console.log("Order Agent UID:", orderData.agent_id);

                if (orderData.agent_id !== currentUser.uid) {
                    throw new Error(
                        "You are not authorized to deliver this order."
                    );
                }

                if (orderData.takenUp !== 1) {
    throw new Error("This order has not been accepted.");
}

// Customer must approve the agent.
if (orderData.agent_accept !== true) {
    throw new Error("Waiting for customer approval.");
}

// Customer must accept the terms and conditions.
if (orderData.terms_and_conditions !== true) {
    throw new Error("Customer has not accepted the terms and conditions.");
}

if (orderData.delivered !== 0) {
    throw new Error("This order is already delivered.");
}

                transaction.update(orderRef, {
                    delivered: 1,
                });
            });

            alert("Order marked as delivered successfully!");

            router.reload(window.location.pathname);

        } catch (error) {
            console.error("Delivery update error:", error);
            alert(error.message || "Unable to update delivery status.");
        } finally {
            setDeliveryLoading(false);
        }
    };

    return (
        <>
            <div
                className={styles.card2}
                id={"card" + props.orderid}
                style={{
                    maxHeight: expanded ? "1000px" : "130px",
                    transition: "max-height 1s ease-in-out",
                }}
            >
                <div
                    className={styles.content}
                    onClick={toggleCard}
                >
                    <div className={styles.details}>
                        <div id={styles.table}>
                            <div>
                                <p>Order_ID</p>
                                <p style={{ fontSize: "15px" }}>Location</p>
                                <p>User_ID</p>
                            </div>

                            <div className={styles.values}>
                                <p>{props.orderid}</p>
                                <p style={{ fontSize: "15px" }}>
                                    {props.location}
                                </p>
                                <p>{props.user_id}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.right}>
                        <div className={styles.hovercost}>
                            {"₹" + props.cost}
                        </div>
                        <div>{props.date}</div>
                        <div>{props.time}</div>
                    </div>
                </div>

                <div className={styles.line}></div>

                <div className={styles.dropdown}>
                    <div className={styles.bottom}>
                        <div>
                            <p>Item_name</p>

                            {(props.orderlist || []).map((item, index) => (
                                <p
                                    className={styles.p1}
                                    key={index}
                                >
                                    {item.name}
                                </p>
                            ))}
                        </div>

                        <div className={styles.p2}>
                            <p>Cost</p>

                            {(props.orderlist || []).map((item, index) => (
                                <p
                                    className={styles.p1}
                                    key={index}
                                >
                                    {"₹" + item.cost}
                                </p>
                            ))}
                        </div>

                        <div className={styles.p3}>
                            <p>Availability</p>

                            {(props.orderlist || []).map((item, index) => (
                                <p key={index}>
                                    <label className={styles.container}>
                                        <input
                                            type="checkbox"
                                            className={styles.container}
                                            checked={item.availability == 1}
                                            disabled
                                            readOnly
                                        />
                                    </label>
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className={styles.bb}>
                        <div className={styles.finalCost}>
                            {"₹" + props.cost}
                        </div>

                        <div className={styles.takenUp}>
                            {props.paid ? "Viewed" : "Pending..."}
                        </div>
                    </div>

                    {props.delivered === 0 &&
 props.agent_accept === true &&
 props.terms_and_conditions === true && (
                        <div
                            style={{
                                padding: "12px",
                                textAlign: "center",
                            }}
                        >
                            <button
                                type="button"
                                onClick={markAsDelivered}
                                disabled={deliveryLoading}
                                style={{
                                    backgroundColor: deliveryLoading
                                        ? "#999"
                                        : "#16a34a",
                                    color: "white",
                                    padding: "10px 18px",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: deliveryLoading
                                        ? "not-allowed"
                                        : "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                {deliveryLoading
                                    ? "Updating..."
                                    : "Mark as Delivered"}
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.toggle}>
                    <AiOutlineArrowDown
                        id={"toggle" + props.orderid}
                        onClick={toggleCard}
                        style={{
                            transform: expanded
                                ? "rotate(-180deg)"
                                : "rotate(0deg)",
                            transition: "0.5s",
                            cursor: "pointer",
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default TileTakenUp;
