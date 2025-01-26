'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Banner from '../../components/UpdateInventoryBanner';

import logo from '../../images/logo.jpg';
import arrow from '../../images/arrow.png';

// This functions returns the thank you page for successfully submitting the 
// demographic survey
export default function VolunteerSaved() {

    const router = useRouter();
    const handleNewChange = () => {
        router.push('/volunteer-landing');
    }

    return (
        <div className="background-white font-black" > 
            <Banner />
            <div className="font-crimson flex flex-col items-center text-black">
                <h1 className="font-bold text-[36px] mt-12" >THE ITEM WAS SUCCESSFULLY</h1>
                <h1 className="font-bold text-[36px] mb-12">UPDATED IN THE INVENTORY!</h1>
                <div className="">
                    <Image
                        src={logo}
                        alt="logo"
                        width={300}
                        height={263}
                    />
                </div>
                <p className="mt-6 mb-6"></p>
                <button className="bg-purple hover:bg-dark-purple text-white mt-15 font-bold py-4 px-11 rounded-full text-[28px] flex" onClick={handleNewChange}>
                    New Inventory Change
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
