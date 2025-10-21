import { React, useState, useEffect } from "react";
import { userAccessToken, fetchUser } from "../utils/fetchDetails";
import NavBar from "../design/NavBar";
import Body from "../design/Body";
import { useRouter } from "next/router";
import HOME from "../design/HOME";
import Image from "next/image";
import loaderGif from "../public/images/loader.gif";
import styles from "../design/HOME.module.css"

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const accessToken = userAccessToken();
    if (accessToken) return router.push("/activeOrders");
    setLoader(true);
    setInterval(change, 4000);


    function change() {

      location.href = "/home.html";
      setLoader(false);
      clearInterval(change);

    }



  }, []);




  return (
    < >
      {loader ? < div className={styles.loader}>
        <Image src={loaderGif} width="500px" />
      </div> : <></>}
      {/* <HOME/> */}
      {/* <a href="//home.html" onLoadStart="true">A</a> */}
    </>
  );
};

export default Home;
