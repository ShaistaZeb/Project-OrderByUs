import NavBar from '../design/NavBar'
import '../styles/globals.css'
import Router from 'next/router'
import { useState } from 'react';
import Head from 'next/head';
import Loader  from '../components/loader';
import nprogress from 'nprogress';
import styles from "../design/HOME.module.css"
import Image from "next/image";
import loaderGif from "../public/images/loader.gif";
function MyApp({ Component, pageProps }) {
  const [loading,setLoading] = useState(false);
  Router.events.on("routeChangeStart",(url)=>{
    
    nprogress.start();
    setLoading(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    
    nprogress.done();
    setLoading(false);
  });
  return (

    // loading?<div className = {styles.loader } >
    // <Image src={loaderGif} width="500px" />
    // </div > : 

    <div>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==" crossOrigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      {/* {loading && <Loader/>} */}
      {/* <NavBar></NavBar> */}
      <Component {...pageProps} />
    </div>
    
  )
}

export default MyApp
