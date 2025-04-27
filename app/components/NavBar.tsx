"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import whiteOutlineLogo from "@app/images/headerLogo.png";
import face from "@app/images/Frame6.png";
import settings from "@app/images/Frame7.png";
import icon from "@app/images/Frame8.png";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

// Clerk
import { useClerk, useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    preventNavigation?: boolean;
  }
}

interface NavBarProps {
    savedChanges?: boolean
}

export const NavBar: React.FC<NavBarProps> = ({ savedChanges }) => {
//export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      setLoggedInUser(`${user.firstName || ""} ${user.lastName || ""}`.trim());
      setIsAdmin(user.publicMetadata?.role === "Admin");
    } else {
      setLoggedInUser("");
      setIsAdmin(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const updateUser = async () => {
    if (savedChanges == true) {
      await user?.reload();
    }
  }

  updateUser();

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/login" });
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };  

  const handleNavigation = (eventName: string, path: string) => {
    const event = new CustomEvent(eventName, { detail: { intendedPage: path } });
    document.dispatchEvent(event);
  
    setTimeout(() => {
      if (!("preventNavigation" in window) || !window.preventNavigation) {
        router.push(path);
      }
    }, 100);
  };  

  const handleMyProfile = () => {
    router.push("/my-profile");
  };
  
  return (
    <>
      {!isLoaded ? (
        <div className="text-white text-xl text-center p-4">Loading...</div>
      ) : (
        <div className="relative w-full h-[90px] bg-banner-green flex items-center shadow-xl">
          {/* Logo Section */}
          <div className="flex-shrink-0 mr-8 cursor-pointer" onClick={() => router.push('/overview')}>
            <Image src={whiteOutlineLogo} alt="logo" width={112} height={91} />
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-10">
            <button
              className={`text-[21px] font-crimson font-bold text-white px-6 py-3 rounded-xl ${
                currentPath === "/overview"
                  ? "bg-[#D9D9D9] hover:bg-opacity-90 bg-opacity-30"
                  : "bg-transparent hover:bg-[#D9D9D9] hover:bg-opacity-30"
              }`}
              onClick={() => handleNavigation("overviewClicked", "/overview")}
            >
              Overview
            </button>
            <button
              className={`text-[21px] font-crimson font-bold text-white px-6 py-3 rounded-xl ${
                currentPath === "/demographics"
                  ? "bg-[#D9D9D9] hover:bg-opacity-90 bg-opacity-30"
                  : "bg-transparent hover:bg-[#D9D9D9] hover:bg-opacity-30"
              }`}
              onClick={() => handleNavigation("demographicsClicked", "/demographics")}
            >
              Demographics
            </button>
            <button
              className={`text-[21px] font-crimson font-bold text-white px-6 py-3 rounded-xl ${
                currentPath === "/inventory"
                  ? "bg-[#D9D9D9] hover:bg-opacity-90 bg-opacity-30"
                  : "bg-transparent hover:bg-[#D9D9D9] hover:bg-opacity-30"
              }`}
              onClick={() => handleNavigation("inventoryClicked", "/inventory")}
            >
              Inventory
            </button>
            <button
              className={`text-[21px] font-crimson font-bold text-white px-6 py-3 rounded-xl ${
                currentPath === "/categories"
                  ? "bg-[#D9D9D9] hover:bg-opacity-90 bg-opacity-30"
                  : "bg-transparent hover:bg-[#D9D9D9] hover:bg-opacity-30"
              }`}
              onClick={() => handleNavigation("categoriesClicked", "/categories")}
            >
              Categories
            </button>
          </div>

          <div className="absolute right-10 flex items-center space-x-4">
            {/* User Name and Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-[21px] font-crimson font-bold text-white"
              >
                {loggedInUser}
                {isDropdownOpen ? (
                  <TiArrowSortedDown className="ml-2 transition-transform duration-300" />
                ) : (
                  <TiArrowSortedUp className="ml-2 transform rotate-90 scale-y-[-1] transition-transform duration-300 hover:rotate-0" />
                )}
              </button>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-7 bg-white rounded-md shadow-lg w-48 z-50">
                  <ul>
                    <li
                      className="flex items-center text-[21px] rounded-md font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer"
                      onClick={() => handleMyProfile()}
                    >
                      <Image src={face} alt="logo" width={24} height={24} className="mr-2" />
                      My Profile
                    </li>
                    {isAdmin && (
                      <li
                        className="flex items-center text-[21px] font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer"
                        onClick={() => handleNavigation("manageUsersClicked", "/manage-users")}
                      >
                        <Image src={settings} alt="settings-logo" width={24} height={24} className="mr-2" />
                        Manage Users
                      </li>
                    )}
                    <li
                      className="flex items-center text-[21px] rounded-md font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <Image src={icon} alt="icon" width={24} height={24} className="mr-2" />
                      Sign Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}