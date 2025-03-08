'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import welcomeScreenBG from '@app/images/welcome-screen-background.png';
import whiteOutlineLogo from '@app/images/headerLogo.png';
import welcomeBWLogo from '@app/images/welcome-bw-logo.png';
import { useRouter } from 'next/navigation';

const DEFAULT_TRANSLATIONS = [
    "Welcome to Village Food Hub!",
    "Please fill out this quick demographic survey each visit to help us grow and reach more people in the community!",
    "Choose Language",
    "English",
    "Spanish",
    "Start Demographic Survey →",
];

const WelcomePage: React.FC = () => {
    const router = useRouter();
    const startSurvey = () => router.push('/customer-questions');
    
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState(DEFAULT_TRANSLATIONS);
    const [loading, setLoading] = useState(true);

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
        }
    }, [language, loading]);

    if (loading) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen font-crimson">
            <div className="grid grid-cols-[1fr_6fr] w-full h-[160px] bg-banner-green shadow-xl items-center px-10">
                <div className="flex items-center">
                    <Image src={whiteOutlineLogo} alt="logo" width={160} height={130} />
                </div>
                <div className="flex justify-center">
                    <h1 className={`${language === 'es' ? 'text-[48px] pl-6' : 'text-[60px]'} font-crimson font-bold text-white text-center`}>
                        {translations[0]}
                    </h1>
                </div>
            </div>
            <div className="flex flex-col flex-grow bg-white p-20 max-w-6xl w-full mx-auto text-center shadow-lg">
                <div className="flex items-center justify-center space-x-4 mb-10">
                    <span className="text-3xl font-semibold text-black text-[42px] pr-4">{translations[2]}:</span>
                    <button
                        className={`px-10 py-4 rounded-full text-[24px] font-bold border-2 transition-all ${language === 'en' ? 'bg-light-green text-white' : 'bg-white text-dark-green border-dark-green'}`}
                        onClick={() => setLanguage('en')}
                    >
                        {translations[3]}
                    </button>
                    <button
                        className={`px-10 py-4 rounded-full text-[24px] font-bold border-2 transition-all ${language === 'es' ? 'bg-light-green text-white' : 'bg-white text-dark-green border-dark-green'}`}
                        onClick={() => setLanguage('es')}
                    >
                        {translations[4]}
                    </button>
                </div>
                <div className="flex flex-col flex-grow bg-white p-16 max-w-4xl w-full mx-auto text-center border-2 border-light-green rounded-3xl">
                    <div className="text-3xl text-black mb-8">
                        <p className="text-[48px]">{translations[1]}</p>
                    </div>
                    <div className="mt-12">
                        <button 
                            className="bg-[#7EB672] text-white text-3xl px-14 py-4 rounded-full shadow-lg hover:bg-dark-green transition-all"
                            onClick={startSurvey}
                        >
                            <p className="text-[36px]">{translations[5]}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;