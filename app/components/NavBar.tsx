"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import whiteOutlineLogo from "@app/images/headerLogo.png";
import initials from "@app/images/group2.png";
import face from "@app/images/Frame6.png";
import settings from "@app/images/Frame7.png";
import icon from "@app/images/Frame8.png";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

// Clerk
import { useClerk } from "@clerk/nextjs";

export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    signOut({ redirectUrl: "/" });
    console.log("Sign out successful");
  };

  const handleDemographics = () => {
    router.push("/demographics");
  };

  const handleInventory = () => {
    router.push("/inventory");
  };

  const handleCategories = () => {
    router.push("/categories");
  };

  const handleManageUsers = () => {
    router.push("/manage-users");
  };

  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <>
      <div className="relative w-full h-[90px] bg-banner-green flex items-center shadow-xl">
        {/* Logo Section */}
        <div className="flex-shrink-0 mr-8">
          <Image src={whiteOutlineLogo} alt="logo" width={112} height={91} />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-10">
          <button
            className={`text-[21px] font-crimson font-bold text-white px-6 py-3 rounded-xl ${
              currentPath === "/demographics"
                ? "bg-[#D9D9D9] hover:bg-opacity-90 bg-opacity-30"
                : "bg-transparent hover:bg-[#D9D9D9] hover:bg-opacity-30"
            }`}
            onClick={handleDemographics}
          >
            Demographics
          </button>
          <button
            className={`text-[21px] font-crimson font-bold text-white px-6 py-3 rounded-xl ${
              currentPath === "/inventory"
                ? "bg-[#D9D9D9] hover:bg-opacity-90 bg-opacity-30"
                : "bg-transparent hover:bg-[#D9D9D9] hover:bg-opacity-30"
            }`}
            onClick={handleInventory}
          >
            Inventory
          </button>
          <button
            className={`text-[21px] font-crimson font-bold text-white px-6 py-3 rounded-xl ${
              currentPath === "/categories"
                ? "bg-[#D9D9D9] hover:bg-opacity-90 bg-opacity-30"
                : "bg-transparent hover:bg-[#D9D9D9] hover:bg-opacity-30"
            }`}
            onClick={handleCategories}
          >
            Categories
          </button>
        </div>

        <div className="absolute right-10 flex items-center space-x-4">
          {/* User Initials */}
          <Image
            src={initials}
            alt="initial_letters"
            width={51}
            height={51}
            className="rounded-full"
          />

          {/* User Name and Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-[21px] font-crimson font-bold text-white"
            >
              Glen McLeod
              {isDropdownOpen ? (
                <TiArrowSortedDown className="ml-2" />
              ) : (
                <TiArrowSortedUp className="ml-2" />
              )}
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-7 bg-white rounded-md shadow-lg w-48 z-50">
                <ul>
                  <li className="flex items-center text-[21px] rounded-md font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer">
                    <Image src={face} alt="logo" width={24} height={24} className="mr-2" />
                    My Profile
                  </li>
                  <li
                    className="flex items-center text-[21px] font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer"
                    onClick={handleManageUsers}
                  >
                    <Image src={settings} alt="settings-logo" width={24} height={24} className="mr-2" />
                    Manage Users
                  </li>
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
    </>
  );
}