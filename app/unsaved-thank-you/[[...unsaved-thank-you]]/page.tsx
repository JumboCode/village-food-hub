'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

import Banner from '@app/components/DemographicsSurveyBanner';

import logo from '@app/images/logo.jpg';
import arrow from '@app/images/arrow.png';

// This functions returns the thank you page for an unsaved demographic survey
export default function UnsavedThankYou() {

    useEffect(() => {
      const timer = setTimeout(() => {
        window.location.href = "../volunteer-landing";
      }, 30000);

      return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className="background-white font-black"> 
            <Banner />
            <div className="font-crimson flex flex-col items-center text-black">
                <h1 className="font-bold text-[36px] mt-12" >You exited the survey before completing it.</h1>
                <h2 className="font-bold text-[36px] mt-6 mb-2 flex ">Your response was <p className = "text-red px-4">NOT</p> recorded</h2>
                <div className="">
                    <Image
                        src={logo}
                        alt="logo"
                        width={300}
                        height={263}
                    />
                </div>
                <p className="font-bold text-[36px] mt-6 mb-6">Thanks for visiting Village Food Hub!</p>
                <button 
                  className="bg-purple hover:bg-dark-purple text-white font-bold py-4 px-11 rounded-full text-[28px] flex"
                  onClick={() => window.location.href = "../volunteer-landing"}>
                    Return home 
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
