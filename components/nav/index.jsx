import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function Nav() {

  const router  = useRouter();
  const handleLogout =() => {
    localStorage.removeItem('jwt');
    router.push("/");
  }

  return (
    <nav className="bg-slate-600 text-white w-1/6 p-2 flex flex-col justify-between">
      <div className="mb-4 basis-1/6 pt-14">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
          />
        </div>
      </div>
      <ul className="flex flex-col space-y-2 basis-4/6 justify-evenly ">
        <li>
          <Link href="/budget">
            <a className="flex items-center justify-center p-1 hover:bg-gray-600 rounded">
              Budget
              <span className="w-4 h-4 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/transaction">
            <a className="flex items-center justify-center p-1 hover:bg-gray-600 rounded">
              Transaction
              <span className="w-4 h-4 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/split">
            <a className="flex items-center  justify-center p-1 hover:bg-gray-600 rounded">
              Split
              <span className="w-4 h-4 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path d="m14.85 4.85 1.44 1.44-2.88 2.88 1.42 1.42 2.88-2.88 1.44 1.44a.5.5 0 0 0 .85-.36V4.5c0-.28-.22-.5-.5-.5h-4.29a.5.5 0 0 0-.36.85zM8.79 4H4.5c-.28 0-.5.22-.5.5v4.29c0 .45.54.67.85.35L6.29 7.7 11 12.4V19c0 .55.45 1 1 1s1-.45 1-1v-7c0-.26-.11-.52-.29-.71l-5-5.01 1.44-1.44c.31-.3.09-.84-.36-.84z"></path>
                </svg>
              </span>
            </a>
          </Link>
        </li>
      </ul>

      <div className="group flex flex-col">
        <button className="flex items-center justify-center p-1 hover:bg-gray-600 rounded basis-1/6">
          Profile
          <span className="w-4 h-4 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </span>
        </button>
        <div className="flex flex-col items-center space-y-1 invisible group-hover:visible">
        <Link href="/profile"><button className="p-1 hover:bg-gray-600 rounded">Profile</button></Link>
          <button className="p-1 hover:bg-gray-600 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
