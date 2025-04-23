'use client';

import Image from 'next/image';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import welcomeScreenBG from '@app/images/welcome-screen-background.png';
import welcomeBWLogo from '@app/images/welcome-bw-logo.png';
import { useRouter } from 'next/navigation';

// sign out
import { IoMdMore } from "react-icons/io";
import { ImExit } from "react-icons/im";
import { useClerk } from "@clerk/nextjs";

const DEFAULT_TRANSLATIONS = [
    "Welcome to Village Food Hub!",
    "Please fill out this quick demographic survey",
    "each visit",
    "to help us grow and reach more people in the community!",
    "Choose Language:",
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
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const logoutModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showPasswordModal) {
          setPasswordInput('');
          setPasswordError('');
        }
    }, [showPasswordModal]);      

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (logoutModalRef.current && !logoutModalRef.current.contains(e.target as Node)) {
            setShowLogoutModal(false);
          }
        };
      
        if (showLogoutModal) {
          document.addEventListener("mousedown", handleClickOutside);
        }
      
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [showLogoutModal]);      

    // Added loading state to ensure language is set before render
    const [loading, setLoading] = useState(true); 

    const clickDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Sign out logic
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        try {
            console.log("Attempting to sign out...");
            await signOut({ redirectUrl: "/login" });
            console.log("Signed out successfully");
        } catch (error) {
            console.error("Sign-out error:", error);
        }
    };
    

    // Define a type for the translation tuple returned by the API.
    type TranslationTuple = [string, ...unknown[]];

    const translateText = useCallback(async (lang: string) => {
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
    }, []);    

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || 'en';
        setLanguage(savedLanguage);
        translateText(savedLanguage);
        setLoading(false); 
    }, [translateText]);

    useEffect(() => {
        if (!loading) { 
            localStorage.setItem("language", language);
            translateText(language);
            setDropdownOpen(false);  
        }
    }, [language, loading, translateText]);

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
                        <div className="flex h-3/4 w-2/5 text-black text-center absolute bg-white text-[2.5rem] rounded-md">
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
                <div className="absolute right-0 top-5 mt-4 mr-8">
                    <button onClick={() => setShowLogoutModal(true)}>
                        <IoMdMore size={24} />
                    </button>

                    {showLogoutModal && (
                        <div
                        ref={logoutModalRef}
                        className="absolute right-0 mt-2 mr-0 bg-white border border-gray-300 shadow-md rounded-md z-50"
                        >
                        <button
                            onClick={() => {
                                setShowLogoutModal(false); // hide dropdown
                                setShowPasswordModal(true); // show password prompt
                            }}
                            className="flex items-center px-4 py-2 text-black hover:bg-gray-100 w-[120px]"
                        >
                            <ImExit className="mr-2" /> Sign Out
                        </button>
                        </div>
                    )}
                    </div>
                <div className="flex flex-col bg-white justify-center items-center p-10 pt-14 w-full space-y-10">
                    <div className="flex flex-row absolute top-[220px] space-x-5">
                        <div className="text-black text-4xl crimson">{translations[4]}</div>
                        <div className="w-[200px] h-[35px] flex-col">
                            <button
                                className="w-full h-full mt-[3px] text-white bg-white hover:bg-modal-gray border-2 border-modal-gray font-medium rounded-lg text-md text-center inline-flex items-center"
                                type="button"
                                onClick={clickDropdown}
                            >
                                <div className="font-bold text-black pl-4 text-2xl">
                                    {language === 'en' ? translations[5] : translations[6]}
                                </div>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute top-[35px] text-black w-[200px] border-2 border-x-2 border-modal-gray rounded">
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
                    <div className="text-center text-black text-5xl crimson-bold pb-8">{translations[7]}</div>
                    <div className="justify-center items-center pb-10">
                        <button className="bg-[#7EB672] rounded-full text-white text-4xl p-5 px-8 hover:bg-dark-green" onClick={startSurvey}>
                            {translations[8]}
                        </button>
                    </div>
                </div>
            </div>
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-center text-black">Admin Password Required</h2>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full border rounded px-4 py-2 mb-3 text-black"
                    />
                    {passwordError && <p className="text-red text-sm mb-2">{passwordError}</p>}
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-black border border-gray rounded">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_SIGN_OUT_PASSWORD) {
                                signOut({ redirectUrl: '/login' });
                                } else {
                                setPasswordError("Incorrect password.");
                                }
                            }}
                            className="px-4 py-2 bg-light-green text-white rounded"
                            >
                                Confirm
                        </button>
                    </div>
                    </div>
                </div>
                )}
        </div>
    );
};

export default WelcomePage;