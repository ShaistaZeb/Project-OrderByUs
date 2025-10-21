import React from 'react'
import Layout from '../design/layout'
import { useRouter } from 'next/router';
import { useState ,useEffect} from 'react';
import { userAccessToken, fetchUser } from '../utils/fetchDetails';
import TileOnGoing from '../design/TileOnGoing';
import styles from "../styles/activeOrders.module.css";
import { AiOutlineInfo } from "react-icons/ai";
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
function OngoingOrders() {
    const [loader, setLoader] = useState(false);
    const [list, setlist] = useState([]);
   
    const router = useRouter();


    const [user, setUser] = useState(null);
    var ll = false;
    useEffect( () => {
        document.getElementById("network").style.visibility = "hidden";

        function showDiv1() {
            if (ll == true) {
                document.getElementById("network").style.visibility = "visible";

                function change() {
                    if (ll == false) {
                        document.getElementById("network").style.visibility = "hidden";
                        
                        clearInterval(inst);
                    }
                }
                var inst = setInterval(change, 1000);
            }



        }
        setTimeout(showDiv1, 15000);
        setLoader(true);
        ll = true;
        const fetchData = async()=>{
            const accessToken = userAccessToken();
            if (!accessToken)
            {
                alert("login to enter orderspage")
                return router.push("/home");
            }
            const [userInfo] = fetchUser();
            const uidd = userInfo?.uid;
            
            setUser(userInfo);

            try {
                var l = [];
                const querySnapshot = await getDocs(collection(database, "database"));
                
                if (querySnapshot.size)
                    querySnapshot.forEach(async (doc) => {
                        l.push(doc.id);
                        // doc.data() is never undefined for query doc snapshots
                        // var q = await getDocs(collection(database,doc.id));
                        // 

                        

                    });
                
                //   
                l.map(async (uid) => {
                    const qSS = await getDocs(collection(database, uid));
                    if (qSS.size) {
                        qSS.forEach(async (d) => {

                            const docRef = doc(database, uid, d.id);
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists()) {
                                if (docSnap.data().takenUp == 1 && docSnap.data().uid == uidd && docSnap.data().delivered == 0) {
                                    list.push(docSnap.data());
                                    const l = list;
                                    setlist([]);
                                    setlist(l);
                                    list.sort((a, b) => {
                                        return b.time.localeCompare(a.time);
                                    });
                                    
                                }

                            } else {
                                // doc.data() will be undefined in this case
                                
                            }

                        });
                    }
                    setLoader(false);
                    ll = false;

                });
                
                


            } catch (error) {
                
            }

        }
        fetchData();




        // var s = await setDoc(doc(database, "database", user?.uid), {
        //     uid: user?.uid,
        // });
        //   //getting database values
    }, []);
    const [showModal, setShowModal] = useState(false);

    const helperText = () => {
        setShowModal(true);
    }
    return (
        <>
            <Layout>
                <div style={{ "display": "flex", "flexDirection": "row" }}>

                    <span style={{ "fontSize": "30px", "fontFamily": "sans-serif" }} >Ongoing orders</span>
                    <AiOutlineInfo onClick={helperText} style={{ "padding": "5px", "marginTop": "10px", "marginLeft": "30px", fontSize: "30px", "backgroundColor": "rgb(31,151,242)", "color": "white", borderRadius: "50px" }} />
                </div>
                {loader ? <div className={styles.loader}>
                    Fetching data...
                </div> :
                    <>
                <div className={styles.list}>
                    {list.length != 0 ?
                        list.map(({
                            index,
                            order_id,
                            location,
                            user_id,
                            finalCost,
                            orderList,
                            takenUp,
                            date,
                            time,
                            uid,
                            delivered,
                            paid,
                            cost,
                            agent_id,
                            mobile
                        }) => (

                            <TileOnGoing key={order_id}
                             date={date}
                                time={time}
                                index={index}
                                orderid={order_id}
                                location={location}
                                user_id={user_id}
                                finalCost={finalCost}
                                orderList={orderList}
                                takenup={takenUp}
                                uid={uid}
                                cost={cost}
                                delivered={delivered}
                                paid={paid}
                                agent_id={agent_id}
                                mobile={mobile}
                                 />

                        )) : <>NO data</>}
                </div>
                    </>}
                <div id="network" className={styles.network}>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                       
                        <span className="block sm:inline">Check your connection..</span>
                        
                        
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
                                            Ongoing Orders
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
                                            Status of your order which was taken by an agent is displayed in this page.
                                        </p>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        {/* <button
                                            className="text-black-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button> */}
                                        <button
                                            className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);

                                            }}
                                        >
                                            <div>Close</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </Layout>
        </>
    )
}

export default OngoingOrders