'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import Banner from '@app/components/DemographicsSurveyBanner';

import logo from '@app/images/Logo 300x263.png';
import arrow from '@app/images/arrow.png';

// This functions returns the thank you page for an unsaved demographic survey
export default function UnsavedThankYou() {

    useEffect(() => {
      const timer = setTimeout(() => {
        window.location.href = "../welcome-page";
      }, 30000);

      return () => clearTimeout(timer);
    }, []);

    const [unsavedTranslations, setUnsavedTranslations] = useState([
        "You exited the survey before completing it.",
        "Your response was ",
        "NOT",
        " recorded.",
        "Thanks for visiting Village Food Hub!",
        "Return home",
    ]);

    useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
        try {
        const defaultunsavedTranslations = [
            "You exited the survey before completing it.",
            "Your response was ",
            "NOT",
            " recorded.",
            "Thanks for visiting Village Food Hub!",
            "Return home",
        ];
        const newunsavedTranslations = [...defaultunsavedTranslations];
        if (language !== "en") {
            for (let i = 0; i < defaultunsavedTranslations.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultunsavedTranslations[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newunsavedTranslations[i] = translationArray.map(t => t[0]).join('');
            }
        }
        setUnsavedTranslations(newunsavedTranslations);
        } catch (error) {
        console.error(error);
        }
    })();
    }, []);
    
    return (
        <div className="background-white font-black"> 
            <Banner />
            <div className="font-crimson flex flex-col items-center text-black">
                <h1 className="font-bold text-[36px] mt-12" >{unsavedTranslations[0]}</h1>
                <h2 className="font-bold text-[36px] mt-6 mb-2 flex ">{unsavedTranslations[1]}<p className = "text-red px-4">{unsavedTranslations[2]}</p> {unsavedTranslations[3]}</h2>
                <div className="">
                    <Image
                        src={logo}
                        alt="logo"
                        width={300}
                        height={263}
                    />
                </div>
                <p className="font-bold text-[36px] mt-6 mb-6">{unsavedTranslations[4]}</p>
                <button 
                  className="bg-purple hover:bg-dark-purple text-white font-bold py-4 px-11 rounded-full text-[28px] flex"
                  onClick={() => window.location.href = "../welcome-page"}>
                    {unsavedTranslations[5]} 
                    <div className="relative bottom-0 left-5">
                        <Image
                            src={arrow}
                            alt="arrow"
                            width={42}
                            height={42}
                        />
                    </div>
                </button>
            </div>
        </div>
        );
}
