'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import welcomeScreenBG from '@app/images/welcome-screen-background.png';
import welcomeBWLogo from '@app/images/welcome-bw-logo.png';
import { useRouter } from 'next/navigation';

const DEFAULT_TRANSLATIONS = [
    "Welcome to Village Food Hub!",
    "Please fill out this quick demographic survey",
    "each visit",
    "to help us grow and reach more people in the community!",
    "Choose Language",
    "English",
    "Spanish",
    "Click to Complete the Demographic Survey",
    "Start Demographic Survey →",
];

const WelcomePage: React.FC = () => {
    const router = useRouter();
    const startSurvey = () => {
        router.push('/customer-questions');
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [language, setLanguage] = useState<string>('en');
    const [translations, setTranslations] = useState(DEFAULT_TRANSLATIONS);

    // Added loading state to ensure language is set before render
    const [loading, setLoading] = useState(true); 

    const clickDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Define a type for the translation tuple returned by the API.
    type TranslationTuple = [string, ...unknown[]];

    const translateText = async (lang: string) => {
        if (lang === 'en') {
            setTranslations(DEFAULT_TRANSLATIONS);
            return;
        }

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(DEFAULT_TRANSLATIONS.join('\n'))}`;
            const response = await fetch(url);
            const data = await response.json();
            if (
                data &&
                Array.isArray(data[0]) &&
                data[0].length > 0 &&
                Array.isArray(data[0][0])
            ) {
                const translatedTexts = (data[0] as TranslationTuple[]).map((t) => t[0]);
                setTranslations(translatedTexts);
            } else {
                console.error(`Unexpected response format for translation: ${JSON.stringify(data)}`);
                setTranslations(DEFAULT_TRANSLATIONS);
            }
        } catch (e) {
            console.error("Translation error:", e);
            setTranslations(DEFAULT_TRANSLATIONS);
        }
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || 'en';
        setLanguage(savedLanguage);
        translateText(savedLanguage);
        setLoading(false); 
    }, []);

    useEffect(() => {
        if (!loading) { 
            localStorage.setItem("language", language);
            translateText(language);
            setDropdownOpen(false);  
        }
    }, [language, loading]);

    if (loading) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-[#24593D] font-crimson text-white">
            <div className="h-1/4 w-full text-center content-center text-7xl crimson-bold">
                {translations[0]}
            </div>
            <div className="flex flex-row h-full w-full">
                <div className="flex bg-gray-300 w-full">
                    <Image
                        src={welcomeScreenBG}
                        width={628}
                        height={193}
                        alt="welcome BW Logo"
                        className="flex h-4/5 w-1/2 absolute"
                    />
                    <div className="flex w-full justify-center items-center">
                        <div className="flex h-3/4 w-2/5 text-black text-center absolute bg-white text-[2.5rem]">
                            <div className="box-content p-6 pt-14">
                                <span className="font-bold">{translations[1]}</span>
                                <br />
                                &nbsp;<span className="font-bold text-[#7EB672]">{translations[2]}</span>
                                &nbsp;<span>{translations[3]}</span>
                            </div>
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
                <div className="flex flex-col bg-white justify-center items-center p-10 pt-14 w-full space-y-10">
                    <div className="flex flex-row absolute top-[220px] space-x-5">
                        <div className="text-black text-3xl crimson">{translations[4]}</div>
                        <div className="w-[200px] h-[35px] flex-col">
                            <button
                                className="w-full h-full text-white bg-white hover:bg-modal-gray border-2 border-modal-gray font-medium rounded-lg text-sm text-center inline-flex items-center"
                                type="button"
                                onClick={clickDropdown}
                            >
                                <div className="font-bold text-black pl-4">
                                    {language === 'en' ? translations[5] : translations[6]}
                                </div>
                            </button>
                            {dropdownOpen && (
                                
                                <div className="absolute top-[35px] text-black w-[200px] border-x-2 border-modal-gray rounded">
                                    <button className="h-[35px] w-full hover:bg-[#ebf9e9]" onClick={() => setLanguage('en')}>
                                        <p className="h-full w-full pt-[5px]">{translations[5]}</p>
                                    </button>
                                    <button className="h-[35px] w-full hover:bg-[#ebf9e9]" onClick={() => setLanguage('es')}>
                                        <p className="h-full w-full pt-[5px]">{translations[6]}</p>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center text-black text-4xl crimson-bold">{translations[7]}</div>
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