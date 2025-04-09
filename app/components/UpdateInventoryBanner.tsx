import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whiteOutlineLogo from '@app/images/non-blank headerLogo 160x130.png';
import icon from "@app/images/Frame8.png";
import { useClerk } from "@clerk/nextjs";

export default function UpdateInventoryBanner() {

  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut({ redirectUrl: "/login?justSignedOut=true" });
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

    return ( 
      <>
        <div className="relative w-full h-[120px] bg-banner-green flex items-center justify-center shadow-xl">
          <div className="absolute left-0 bottom-0 mr-5">
            <Link href="/volunteer-landing">
              <Image
                  src={whiteOutlineLogo}
                  alt="logo"
                  width={160}
                  height={130}
              />
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-[54px] font-crimson font-bold text-white">Update Inventory</h1>
          </div>
          <div className="absolute right-0 top-5 mt-4 mr-8">
            <div
              className="flex items-center text-white text-[24px] rounded-md font-crimson font-bold px-4 py-2 hover:text-light-gray cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </div>
          </div>
        </div>
      </>
    );
}