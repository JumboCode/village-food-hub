import React from 'react';
import { ButtonCancel, ButtonExit } from "./../components/SurveyButtons"


const ExitModal: React.FC = () => {
  return (
    <div className="h-[233px] w-[582px] bg-neutral-200 font-crimson
                    fixed top-50% left-50% ">
        <div className="flex flex-col">
            <p className="flex justify-center text-[40px] crimson-bold">Warning!</p>
            <p className="flex justify-center text-[40px] crimson-bold">Your changes will not be saved.</p>
        </div>
        <div className="flex flex-row justify-around ">
            <ButtonCancel/>
            <ButtonExit/>
        </div>
        
    </div>
  );
};

export default ExitModal;