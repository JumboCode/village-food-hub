// Write your code hereimport React from 'react';
import Image from 'next/image';

import Banner from '../../components/UpdateInventoryBanner';

import logo from '../../images/logo.jpg';
import arrow from '../../images/arrow.png';

// This functions returns the thank you page for an unsaved demographic survey
export default function VolunteerUnsaved() {
    
    return (
        <div className="background-white font-black"> 
            <Banner />
            <div className="font-crimson flex flex-col items-center text-black">
                <h1 className="font-bold text-[36px] mt-12" >You exited before submitting.</h1>
                <h2 className="font-bold text-[36px] mb-12 flex ">This item was<p className = "text-red px-4">NOT</p> updated in the inventory.</h2>
                <div className="">
                    <Image
                        src={logo}
                        alt="logo"
                        width={300}
                        height={263}
                    />
                </div>
                <p className="mt-6 mb-6"></p>
                <button className="bg-purple hover:bg-dark-purple text-white font-bold py-4 px-11 rounded-full text-[28px] flex">
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
