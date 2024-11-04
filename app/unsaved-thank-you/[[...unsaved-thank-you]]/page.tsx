import React from 'react';
import Image from 'next/image';

import Banner from '../../components/DemographicsSurveyBanner';

import logo from '../../images/logo.jpg';
import arrow from '../../images/arrow.png';

// This functions returns the thank you page for an unsaved demographic survey
export default function UnsavedThankYou() {
    
    return (
        <div className="background-white font-black"> 
            <Banner />
            <div className="font-crimson flex flex-col items-center text-black">
                <h1 className="font-bold text-[48px] mt-12" >You exited the survey before completing it.</h1>
                <h2 className="font-bold text-[48px] mt-6 mb-2 flex ">Your response was <p className = "text-[#EB2B0C] px-4">NOT</p> recorded</h2>
                <div className="">
                    <Image
                        src={logo}
                        alt="logo"
                        width={361}
                        height={316}
                    />
                </div>
                <p className="font-bold text-[48px] mt-6 mb-16">Thanks for visiting Village Food Hub!</p>
                <button className="bg-[#3851BC] hover:bg-blue-700 text-white font-bold py-4 px-11 rounded-full text-[40px] flex">
                Return home 
                <div className="relative bottom-0 left-5 p-2">
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
