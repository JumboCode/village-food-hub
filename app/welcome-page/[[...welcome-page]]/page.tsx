// imports
'use client';

import Image from 'next/image';
import React from 'react';
import welcomeScreenBG from '../../images/welcome-screen-background.png';
import welcomeBWLogo from '../../images/welcome-bw-logo.png';
import qrCode from '../../images/qr-code.png';
import { useRouter } from 'next/navigation';

const WelcomePage: React.FC = () => {
    const router = useRouter();
    const startSurvey = () => {
        router.push('/customer-questions');
    }
    
  return (
    //creates columns and sets
    <div className="flex flex-col justify-center items-center h-screen bg-[#24593D] font-crimson text-white">

        {/* banner at top of screen */}
        <div className="h-1/4 w-full text-center content-center text-7xl crimson-bold">
            Welcome to Village Food Hub!
        </div>

        {/* sets rows below welcome banner */}
        <div className="flex flex-row h-full w-full">

            {/* sets col */}
            <div className="flex bg-gray-300 w-full">

                {/* background image on left side */}
                <Image
                    src={welcomeScreenBG}
                    width={628}
                    height={193}
                    alt="welcome BW Logo"
                    className="flex h-4/5 w-1/2 absolute"
                />

                {/* the box that contains the text and VFH logo */}
                <div className="flex w-full justify-center items-center">
                    <div className="flex h-3/4 w-2/5 text-black text-center absolute bg-white text-[2.5rem]">

                    
                        {/* the text prompting the user to fill out the survey */}
                        <div className="box-content p-6 pt-14">

                            {/* the bolded, black text */}
                            <span className="font-bold">
                                Please fill out this quick demographic survey
                            </span>

                            <br/>

                            {/* the bolded, green text */}
                            &nbsp;
                            <span className="font-bold text-[#7EB672]">
                                each visit
                            </span>

                            {/* the normal text */}
                            &nbsp;
                            <span>
                                to help us grow and reach more people in the community!
                            </span>
                        </div>
                        

                            {/* the black and white VFH logo at the bottom */}
                            <Image
                                src={welcomeBWLogo}
                                width={628}
                                height={193}
                                alt="welcome BW Logo"
                                className="flex w-full absolute bottom-0"
                            />
                    </div>
                </div>    
            </div>


            {/* the right column of the screen */}
            <div className="flex bg-white justify-center p-10 pt-14 w-full">

                {/* the text that prompts the user to chose how to complete the survey */}
                <div className="relative text-center text-black text-4xl crimson-bold">
                    Scan or Click to Complete the Demographic Survey
                </div>

                {/* the QR code that links to the demographic survey */}
                <div className="flex absolute m-[50px] top-1/3">
                    <Image
                        src={qrCode}
                        width={294}
                        height={294}
                        alt="welcome BW Logo"
                    />
                </div>

                {/* the button to start a demographic survey */}
                <div className="absolute bottom-0 align-bottom pb-20">
                    <button className="bg-[#7EB672] rounded-full text-white text-2xl p-5 px-8" onClick={startSurvey}>
                        Start Demographic Survey →
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
};

export default WelcomePage;
