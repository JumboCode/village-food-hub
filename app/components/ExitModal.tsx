'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ButtonCancel, ButtonExit } from '@app/components/SurveyButtons';
import { useState, useEffect } from 'react';

interface ExitModalProps {
  closeModal: () => void;
  redirectPage: string;
}

const ExitModal: React.FC<ExitModalProps> = ({ closeModal, redirectPage }) => {
  const router = useRouter();

  const handleExitAnyway = () => {
    router.push(redirectPage);
  };

  const [ExitTranslations, setExitTranslations] = useState([
    "Warning!",
    "Your changes will not be saved.",
  ]);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {
        const defaultExitTranslations = [
          "Warning!",
          "Your changes will not be saved.",
        ];
        const newExitTranslations = [...defaultExitTranslations];
        if (language !== "en") {
          for (let i = 0; i < defaultExitTranslations.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultExitTranslations[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newExitTranslations[i] = translationArray.map(t => t[0]).join('');
          }
        }
        setExitTranslations(newExitTranslations);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="h-[240px] w-[550px] bg-modal-gray font-crimson
                   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   pt-8 shadow-lg rounded-lg"
      >
        <div className="flex flex-col">
          <p className="flex justify-center text-[28px] crimson-bold">{ExitTranslations[0]}</p>
          <p className="flex justify-center text-[28px] crimson-bold">
          {ExitTranslations[1]}
          </p>
        </div>
        <div className="flex flex-row justify-around pt-8">
          <ButtonCancel onClick={closeModal} />
          <ButtonExit onClick={handleExitAnyway} />
        </div>
      </div>
    </div>
  );
};

export default ExitModal;