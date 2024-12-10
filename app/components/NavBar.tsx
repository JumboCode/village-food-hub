"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import whiteOutlineLogo from '@app/images/headerLogo.png';
import dropArrow from '@app/images/Vector.png';
import initials from '@app/images/group2.png';
import face from '@app/images/Frame6.png';
import settings from '@app/images/Frame7.png';
import icon from '@app/images/Frame8.png';
import downArrow2 from '@app/images/downArrow.png';

export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter(); 

  const handleSignOut = () => {
    router.push("/login/page");
  };

  const handleInventory = () => {
    router.push("/inventory/page");
  };
  
    return (
        <>
            <div className="relative w-full h-[120px] bg-banner-green flex items-center shadow-xl">
                {/* Logo Section */}
                <div className="flex-shrink-0 mr-8">
                    <Image
                        src={whiteOutlineLogo}
                        alt="logo"
                        width={160}
                        height={130}
                    />
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-40">
                    <button className="text-[24px] font-crimson font-bold 
                    text-white px-6 py-3 rounded-xl bg-transparent hover:bg-[#D9D9D9]">
                        Demographics
                    </button>
                    <button className="text-[24px] font-crimson font-bold 
                    text-white px-6 py-3 rounded-xl bg-transparent hover:bg-[#D9D9D9]"
                    onClick={handleInventory}>
                        Inventory
                    </button>
                    <button className="text-[24px] font-crimson font-bold 
                    text-white px-6 py-3 rounded-xl bg-transparent hover:bg-[#D9D9D9]">
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
                      className="flex items-center text-[24px] font-crimson font-bold text-white">
                      Glen McLeod
                      <Image
                          src={isDropdownOpen ? downArrow2 : dropArrow}
                          alt="drop-down-arrow"
                          width={isDropdownOpen ? 25 : 8.59}
                          height={isDropdownOpen ? 30 : 14.85}
                          className="ml-2"
                      />
                  </button>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg w-48 z-50">
                            <ul>
                            <li className="flex items-center text-[24px] font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer">
                            <Image src={face} alt="logo" width={24} height={24} className="mr-2" />
                              My Profile
                            </li>
                            <li className="flex items-center text-[24px] font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer">
                            <Image src={settings} alt="settings-logo" width={24} height={24} className="mr-2" />
                              Settings
                            </li>
                            <li className="flex items-center text-[24px] font-crimson font-bold px-4 py-2 hover:bg-[#ECF9E9] cursor-pointer"
                            onClick={handleSignOut}>
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