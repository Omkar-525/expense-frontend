import '../styles/globals.css'
import { useEffect, useState} from 'react'
import Head from 'next/head'
import FeedbackButton from "../components/feedback/index"


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log("I am useEffect from app.js");
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"/>
      </Head>
      <Component {...pageProps} />
      <FeedbackButton googleFormLink="https://forms.gle/xVmV5pE3auy5iuHL6" />
    </>
  );
}

export default MyApp
