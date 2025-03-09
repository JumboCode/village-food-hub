'use client';

import React from 'react';
import { redirect, useRouter } from 'next/navigation';
import { ButtonCancel, ButtonExit } from '@app/components/SurveyButtons';

interface ProfileUnsavedModalProps {
  closeUnsavedModal: () => void;
  redirectPage: string;
}

const ProfileUnsavedModal: React.FC<ProfileUnsavedModalProps> = ({ closeUnsavedModal, redirectPage}) => {
  const router = useRouter();
  
  const handleRedirection = (redirectPage: string) => {
    router.push(redirectPage);
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="h-[245px] w-[412px] bg-modal-gray font-crimson
                   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   pt-2 shadow-lg rounded-lg"
      >
        <div className="flex flex-col">
          <p className="flex justify-center text-[36px] crimson-semibold text-center leading-[1.4]">Are you sure you want to leave without saving?</p>
          <p className="flex justify-center text-[24px] crimson-semibold text-[#EB2B0C] text-center">
            Your profile changes will not be saved!
          </p>
        </div>
        <div className="flex flex-row justify-center space-x-5 pt-5">
          <button 
              className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[46px] rounded-[8px] border border-gray text-[24px] justify-center items-center" 
              onClick={closeUnsavedModal}>
            Cancel
          </button>
          <button className="flex text-white bg-[#EB2B0C] font-serif w-[117px] h-[46px] rounded-[8px] border border-[#EB2B0C] text-[24px] justify-center items-center"
                  onClick={() => handleRedirection(redirectPage)}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUnsavedModal;