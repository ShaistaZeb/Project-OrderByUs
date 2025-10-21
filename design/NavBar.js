import styles from "./NavBar.module.css";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { firebaseApp } from "../firebase-config";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import Link from "next/link";
import { FcExpand, FcCollapse } from "react-icons/fc";

const NavBar = (props) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const [userInfo] = fetchUser();

    setUser(userInfo);
    document.getElementById("navbarr").style.boxShadow =
      "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px";
    document.getElementById("navbarr").style.maxheight = "180px";
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/home");
    console.clear();
  };

  return (
    <>
      <nav
        className="flex items-center flex-wrap bg-transparent-400 p-2 "
        id="navbarr"
      >
        <Link href="/home.html">
          <a className="inline-flex items-center ">
            <img src="./mp4/title.gif" className={styles.logo_obu_gif} alt="" />
          </a>
        </Link>
        <button
          className={`${styles.navbartoggle} inline-flex p-3 rounded lg:hidden text-black ml-auto hover:text-white outline-none`}
          onClick={handleClick}
        >
          {active ? <FcCollapse /> : <FcExpand />}
          
        </button>
        {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
        <div
          className={`${
            active ? "" : "hidden"
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
            <Link href="/home.html">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 text-sm rounded font text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600 ">
                Home
              </a>
            </Link>
            <Link href="/home.html/#aboutid">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-sm text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                About
              </a>
            </Link>
            <Link href="/home.html/#teamid">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-sm text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                Team
              </a>
            </Link>
            <Link href="/home.html/#contactid">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-sm text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                Contact
              </a>
            </Link>
            <Link href="#">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-sm text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                {user?.uid}
              </a>
            </Link>
            <Link href="/">
              <a
                onClick={logout}
                className={`${styles.logout} " lg:inline-flex lg:w-auto w-20px px-3 py-2 rounded text-sm text-gray-600 items-center justify-center border hover:bg-black hover:text-gray-600"`}
              >
                Logout
              </a>
              {/* <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg> */}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
