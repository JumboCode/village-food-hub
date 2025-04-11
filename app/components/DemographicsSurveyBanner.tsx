import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whiteOutlineLogo from '@app/images/non-blank headerLogo 160x130.png';
import { useState, useEffect } from 'react';
import { useClerk } from "@clerk/nextjs";

export default function DemographicsSurveyBanner() {
  // TODO: TEMPORARY
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

  const [bannerTranslation, setbannerTranslation] = useState([
      "Demographics Survey",
    ]);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {
        const defaultbannerTranslation = [
          "Demographics Survey",
        ];
        const newbannerTranslation = [...defaultbannerTranslation];
        if (language !== "en") {
          for (let i = 0; i < defaultbannerTranslation.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultbannerTranslation[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newbannerTranslation[i] = translationArray.map(t => t[0]).join('');
          }
        }
        setbannerTranslation(newbannerTranslation);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  
    return ( 
      <>
        <div className="relative w-full h-[120px] bg-banner-green flex items-center justify-center shadow-xl">
          <div className="absolute left-0 bottom-0 mr-5">
            <Link href="/welcome-page">
                <Image
                    src={whiteOutlineLogo}
                    alt="logo"
                    width={160}
                    height={130}
                />
              </Link>
          </div>
          <div className="text-center">
            <h1 className="text-[54px] font-crimson font-bold text-white">{bannerTranslation[0]}</h1>
          </div>
          {/* TODO: TEMPORARY */}
          <div className="absolute right-0 top-5 mt-4 mr-8">
            <div
              className="flex items-center text-white text-[24px] rounded-md font-crimson font-bold px-4 py-2 hover:text-light-gray cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out (will be removed)
            </div>
          </div>
        </div>
      </>
    );
}