import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whiteOutlineLogo from '@app/images/non-blank headerLogo 160x130.png';
import { useState, useEffect } from 'react';

export default function DemographicsSurveyBanner() {
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
        </div>
      </>
    );
}