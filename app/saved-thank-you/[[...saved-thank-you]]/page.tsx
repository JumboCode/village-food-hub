import React from 'react';
import Image from 'next/image';

import Banner from '../../components/DemographicsSurveyBanner';

import logo from '../../images/logo.jpg';
import arrow from '../../images/arrow.png';

// This functions returns the thank you page for successfully submitting the 
// demographic survey
export default function SavedThankYou() {

    return (
        <div className="background-white font-black" > 
            <Banner />
            <div className="font-crimson flex flex-col items-center text-black">
                <h1 className="font-bold text-[36px] mt-12" >THANK YOU FOR COMPLETING THE SURVEY!</h1>
                <p className="font-bold text-[36px] mt-6 mb-2">Village Food Hub will be able to grow with your help!</p>
                <div className="">
                    <Image
                        src={logo}
                        alt="logo"
                        width={300}
                        height={263}
                    />
                </div>
                <p className="font-bold text-[36px] mt-6 mb-6">Thanks for visiting Village Food Hub!</p>
                <button className="bg-purple hover:bg-dark-purple text-white font-bold py-4 px-11 rounded-full text-[28px] flex">
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
