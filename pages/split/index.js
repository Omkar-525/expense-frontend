
import React , {useEffect}from 'react';
import Nav from "../../components/nav"
import { useRouter } from 'next/router';

const Split = ({ children }) => {
  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem('jwt'))
    router.push("/");
  },[])

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default Split;
