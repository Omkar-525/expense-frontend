import '../styles/globals.css'
import { useEffect, useState} from 'react'
import Head from 'next/head'



function MyApp({ Component, pageProps }) {
  <Head>
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"/>
  </Head>
  useEffect(() => {
    console.log("I am useeffect from app.js")
  }, [])

  

  return <><Component {...pageProps} /></>
}

export default MyApp
