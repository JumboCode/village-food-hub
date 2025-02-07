// imports
'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import welcomeScreenBG from '../../images/welcome-screen-background.png';
import welcomeBWLogo from '../../images/welcome-bw-logo.png';
import { useRouter } from 'next/navigation';

const WelcomePage: React.FC = () => {
    const router = useRouter();
    const startSurvey = () => {
        router.push('/customer-questions');
    }

    // for the language picker
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // when the language dropdown is toggled
    const clickDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    // when navigating to this page
    useEffect(() => {
      const language = localStorage.getItem("language");
      translateText(language === '' ? 'en' : language);
    }, []);

    // selecting a language for translating
    const [language, setLanguage] = useState('')
    // storing the translations
    const [translations, setTranslations] = useState([
        "Welcome to Village Food Hub!",
        "Please fill out this quick demographic survey",
        "each visit",
        "to help us grow and reach more people in the community!",
        "Choose Language",
        "English",
        "Spanish",
        "Click to Complete the Demographic Survey",
        "Start Demographic Survey →",
    ]);

    // function to translate the text with API calls
    const translateText = async (language: any) => {
        try {
            // Reset back to english to avoid lost in translation after resets
            let newTranslations = [
                "Welcome to Village Food Hub!",
                "Please fill out this quick demographic survey",
                "each visit",
                "to help us grow and reach more people in the community!",
                "Choose Language",
                "English",
                "Spanish",
                "Click to Complete the Demographic Survey",
                "Start Demographic Survey →",
            ]

            // if the language is not english, translate it
            if (language !== 'en') {
                for (let i = 0; i < translations.length; i++) {
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(translations[i])}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    newTranslations[i] = data[0].map((t: any[]): any => t[0]).join('');
                }
            }
                
            // store the translations
            setTranslations(newTranslations);

        } catch (e) {
            console.error(e);
        }
    }

    // triggered when the dropdown is clicked
    useEffect(() => {
        localStorage.setItem("language", language);
        translateText(language);
        setDropdownOpen(false);
    }, [language])
    
  return (
    //creates columns and sets
    <div className="flex flex-col justify-center items-center h-screen bg-[#24593D] font-crimson text-white">

        {/* banner at top of screen */}
        <div className="h-1/4 w-full text-center content-center text-7xl crimson-bold">
            {translations[0]}
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
                                {translations[1]}
                            </span>

                            <br/>

                            {/* the bolded, green text */}
                            &nbsp;
                            <span className="font-bold text-[#7EB672]">
                                {translations[2]}
                            </span>

                            {/* the normal text */}
                            &nbsp;
                            <span>
                                {translations[3]}
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
            <div className="flex flex-col bg-white justify-center items-center p-10 pt-14 w-full space-y-10">

                {/* the text that prompts the user to chose how to complete the survey */}
                <div className="flex flex-row absolute top-[220px] space-x-5">
                    
                    {/* Prompt */}
                    <div className="text-black text-3xl crimson">
                        {translations[4]}
                    </div>

                    {/* Dropdown */}
                    <div className="w-[200px] h-[35px] flex-col">
                        <button id="dropdownDefaultButton" 
                            className="w-full h-full text-white bg-white hover:bg-modal-gray border-2 border-modal-gray font-medium rounded-lg text-sm text-center inline-flex items-center" 
                            type="button"
                            onClick={() => clickDropdown()}
                        >
                            <div className="font-bold text-black pl-4">
                                {language === '' || language === 'en' ? translations[5] : translations[6]}
                            </div>
                            <svg className={`w-2.5 h-2.5 ms-3 ${dropdownOpen ? "" : "transform rotate-180"} absolute right-5`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </button>

                        {/* Dropdown options */}
                        {dropdownOpen &&
                            <div className="absolute top-[35px] text-black w-[200px] border-x-2 border-modal-gray rounded">
                                {/* English */}
                                <div className="h-[35px] border-b-2 border-modal-gray justify-center item-center">
                                    <button 
                                        className="h-full w-full justify-center item-center hover:bg-[#ebf9e9]" 
                                        onClick={() => setLanguage('en')}
                                    >
                                        <p className="h-full w-full pt-[5px]">{translations[5]}</p>
                                    </button>
                                </div>
                                {/* Spanish */}
                                <div className="h-[35px] border-b-2 border-modal-gray">
                                    <button 
                                        className="h-full w-full hover:bg-[#ebf9e9]"
                                        onClick={() => setLanguage('es')}>
                                        <p className="h-full w-full pt-[5px]">{translations[6]}</p>
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {/* the text that prompts the user to chose how to complete the survey */}
                <div className="text-center text-black text-4xl crimson-bold">
                    {translations[7]}
                </div>

                {/* the button to start a demographic survey */}
                <div className="justify-center items-center pb-20">
                    <button className="bg-[#7EB672] rounded-full text-white text-2xl p-5 px-8" onClick={startSurvey}>
                        {translations[8]}
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
};

export default WelcomePage;
