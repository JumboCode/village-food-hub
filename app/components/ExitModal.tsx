import React, {useState} from 'react';
import { ButtonCancel, ButtonExit } from "./../components/SurveyButtons"

interface ExitModalProps {
  closeModal: () => void;
}

const ExitModal: React.FC<ExitModalProps> = ({ closeModal }) => {
  return (
    (
      <div className="h-[233px] w-[582px] bg-neutral-200 font-crimson
                      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      shadow-xl">
          <div className="flex flex-col">
              <p className="flex justify-center text-[40px] crimson-bold">Warning!</p>
              <p className="flex justify-center text-[40px] crimson-bold">Your changes will not be saved.</p>
          </div>
          <div className="flex flex-row justify-around ">
              <ButtonCancel onClick={closeModal}/>
              <ButtonExit onClick={() => window.location.href = '../../volunteer-unsaved' } />
          </div>
      </div>
    )
  );
};

export default ExitModal;