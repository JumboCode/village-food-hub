'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ButtonCancel, ButtonExit } from '@app/components/SurveyButtons';

interface ExitModalProps {
  closeModal: () => void;
  redirectPage: string;
}

const ExitModal: React.FC<ExitModalProps> = ({ closeModal, redirectPage }) => {
  const router = useRouter();

  const handleExitAnyway = () => {
    router.push(redirectPage);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="h-[240px] w-[550px] bg-modal-gray font-crimson
                   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   pt-8 shadow-lg rounded-lg"
      >
        <div className="flex flex-col">
          <p className="flex justify-center text-[28px] crimson-bold">Warning!</p>
          <p className="flex justify-center text-[28px] crimson-bold">
            Your changes will not be saved.
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