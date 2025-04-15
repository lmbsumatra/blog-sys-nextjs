"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/src/store/useAuthStore";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = ({ token }: { token: string | undefined }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  if (!isLoggedIn) return null;

  return (
    <nav className="px-4 py-2 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full">
        <div className="w-full lg:w-auto flex lg:flex-row items-center justify-between gap-4 lg:gap-8 ">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/assets/icons/open-mind.svg"
              alt="Logo"
              className="w-12 h-12 mr-2"
            />

            <span className="hidden md:block">Lorem Ipsum</span>
          </Link>

          <div className="w-full lg:w-[500px]">
            <Input
              placeholder="Search here..."
              className="shadow-none focus:shadow-none rounded-full w-full"
            />
          </div>
        </div>

        <div className="w-full flex justify-between items-center lg:w-auto lg:gap-4">
          <button
            className={`${
              pathname === "/" || pathname === "/home" ? "bg-gray-800" : ""
            } rounded-[12px] cursor-pointer text-2xl font-bold flex items-center p-2`}
            onClick={() => router.push("/")}
          >
            <img
              src="/assets/icons/home.svg"
              alt="Home Icon"
              className={`w-8 h-8 transition ${
                pathname === "/" || pathname === "/home"
                  ? "filter invert"
                  : "filter grayscale"
              }`}
            />
          </button>

          <button
            className="cursor-pointer p-2"
            onClick={() => router.push("/hashtag")}
          >
            <img
              src="/assets/icons/hashtag.svg"
              alt="Hashtag Icon"
              className="w-8 h-8"
            />
          </button>

          <button
            className={`${
              pathname === "/blog/create" ? "bg-gray-800" : ""
            } rounded-[12px] cursor-pointer text-2xl font-bold flex items-center p-2`}
            onClick={() => router.push("/blog/create")}
          >
            <img
              src="/assets/icons/create.svg"
              alt="Create Icon"
              className={`w-8 h-8 transition ${
                pathname === "/blog/create"
                  ? "filter invert"
                  : "filter grayscale"
              }`}
            />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer h-10 w-10">
                <AvatarImage src="/path-to-user-image.jpg" alt="User" />
                <AvatarFallback className="font-bold">L</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=> router.push(`/profile`)}>
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
