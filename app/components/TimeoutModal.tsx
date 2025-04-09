'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimeoutModalProps {
  closeTimeoutModal: () => void;
}

const TimeoutModal: React.FC<TimeoutModalProps> = ({ closeTimeoutModal}) => {
  const router = useRouter();

  // Function to confirm navigation
  const confirmNavigation = () => {
    closeTimeoutModal();
    window.preventNavigation = false;

    router.push("/welcome-page");
  };

  const [timer, setTimer] = useState(5);

  useEffect(() => {
    setTimeout(() => {
        setTimer(timer - 1);
    }, 1000);

    if (timer === 0) {
        confirmNavigation();
    }
  }, [timer])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="w-[430px] bg-modal-gray font-crimson
                   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   pt-2 shadow-lg rounded-lg"
      >
        <div className="flex flex-col">
          <p className="flex justify-center text-[32px] crimson-semibold text-center leading-[1.4] pt-6 py-6">
            Click to remain on survey
          </p>
        </div>
        <div className="flex flex-row justify-center space-x-5">
          <button 
            className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[46px] rounded-[8px] border border-gray text-[24px] justify-center items-center" 
            onClick={closeTimeoutModal}
          >
            Stay
          </button>
          <button 
            className="flex text-white bg-[#EB2B0C] font-serif w-[117px] h-[46px] rounded-[8px] border border-[#EB2B0C] text-[24px] justify-center items-center"
            onClick={confirmNavigation}
          >
            Leave
          </button>
        </div>
        <div className="flex flex-col py-6">
            <p className="flex justify-center text-[24px] crimson-semibold text-[#EB2B0C] text-center">
                {timer}{" seconds left..."}
            </p>
        </div>
      </div>
    </div>
  );
};

export default TimeoutModal;