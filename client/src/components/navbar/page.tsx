"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/src/store/useAuthStore";

const NavBar = ({ token }: { token: string | undefined }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    console.log({token});
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  if (!isLoggedIn) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-bold flex">
          <img
            src="/assets/icons/email.svg"
            alt="Mail Icon"
            className="w-8 h-8 mr-2"
          />
          Lorem ipsum
        </a>
        <div className="flex">
          <button className="text-white hover:bg-gray-700 px-4 py-2 rounded flex items-center">
            <img
              src="/assets/icons/home.svg"
              alt="Home Icon"
              className="w-8 h-8 mr-2"
            />
            Home
          </button>
          <button className="text-white hover:bg-gray-700 px-4 py-2 rounded flex items-center">
            <img
              src="/assets/icons/hashtag.svg"
              alt="Hashtag Icon"
              className="w-8 h-8 mr-2"
            />
            Trends
          </button>
          <button
            className="text-white hover:bg-gray-700 px-4 py-2 rounded flex items-center"
            onClick={(e) => router.push(`/blog/create`)}
          >
            <img
              src="/assets/icons/create.svg"
              alt="Create Icon"
              className="w-8 h-8 mr-2"
            />
            Create
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
