"use client";

import useAuthStore from "../store/useAuthStore";
import { useRouter } from "next/navigation";

const User = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg">HELLO USER</p>
        <p className="text-gray-600 mt-2">You are successfully logged in as a user.</p>
      </div>
    </div>
  );
};

export default User;