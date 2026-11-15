
import styles from "./NavBar.module.css";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { authentication } from "../firebase-config";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Link from "next/link";
import { FcExpand, FcCollapse } from "react-icons/fc";

const NavBar = (props) => {
  const [active, setActive] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleClick = () => {
    setActive(!active);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
      setUser(currentUser);
    });

    const navbar = document.getElementById("navbarr");

    if (navbar) {
      navbar.style.boxShadow =
        "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px";
      navbar.style.maxHeight = "180px";
    }

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(authentication);
      localStorage.clear();
      router.push("/home");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to log out. Please try again.");
    }
  };

  return (
    <>
      <nav
        className="flex items-center flex-wrap bg-transparent-400 p-2"
        id="navbarr"
      >
        <Link href="/home.html">
          <a className="inline-flex items-center">
            <img src="./mp4/title.gif" className={styles.logo_obu_gif} alt="" />
          </a>
        </Link>

        <button
          className={`${styles.navbartoggle} inline-flex p-3 rounded lg:hidden text-black ml-auto hover:text-white outline-none`}
          onClick={handleClick}
        >
          {active ? <FcCollapse /> : <FcExpand />}
        </button>

        <div
          className={`${
            active ? "" : "hidden"
          } w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto">
            <Link href="/welcome.html">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 text-sm rounded font text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                Home
              </a>
            </Link>

            <Link href="/welcome.html#aboutid">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-sm text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                About
              </a>
            </Link>

            <Link href="/welcome.html#contactid">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-sm text-gray-600 items-center justify-center hover:bg-gray-50 hover:text-gray-600">
                Contact
              </a>
            </Link>

            <span className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-sm text-gray-600 items-center justify-center">
              {user?.email || user?.phoneNumber || ""}
            </span>

            <Link href="/">
              <a
                onClick={logout}
                className={`${styles.logout} lg:inline-flex lg:w-auto w-20px px-3 py-2 rounded text-sm text-gray-600 items-center justify-center border hover:bg-black hover:text-gray-600`}
              >
                Logout
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
