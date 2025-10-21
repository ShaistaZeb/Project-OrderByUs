import React, { useEffect, useState } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import { useRouter } from "next/router";
import { IoLogOut } from "react-icons/io5";
import { getDocs, collection } from "firebase/firestore";
import WriteToCloudFirestore from "../components/Write";
import { database, firebaseApp } from "../firebase-config";
import Read from "../components/Read";
import NavBar from "../design/NavBar";
import Layout from "../design/layout";

const Index = () => {
  //login Route

  const router = useRouter();
  const [user, setUser] = useState(null);
  useEffect( () => {
    const fetchData = async()=>{
      const accessToken = userAccessToken();
      if (!accessToken) return router.push("/home");
      if (accessToken) return router.push("/activeOrders");
      const [userInfo] = fetchUser();
      
      setUser(userInfo);
    }
    fetchData();

    //   //getting database values
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
    console.clear();
  };

  return (
    <>
      {/* <div>
        <WriteToCloudFirestore />
      </div> */}

      {/* <div className="w-screen h-screen flex justify-center items-center bg-slate-100">
        <div className="w-1/3 h-auto p-4 bg-white shadow-md rounded-md flex justify-start items-center relative">
          <IoLogOut
            fontSize={25}
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={logout}
          />
          <img src={user?.photoURL} className="rounded-md shadow-md" alt="" />
          <p className="text-2xl font-sans font-semibold ml-2">
            {user?.displayName}
            <span className="block text-xs font-serif font-normal">
              {user?.email}
            </span>
          </p>
        </div>
      </div> */}

      {/*<div>
        <Read></Read>
      </div> */}

      {/* <Layout></Layout> */}
    </>
  );
};
export default Index;
