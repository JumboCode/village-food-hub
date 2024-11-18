import React, {useState} from 'react';
import { ButtonCancel_ExitModal, ButtonExit_ExitModal } from "./../components/SurveyButtons"


const ExitModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  const handleOpenModal = (): void => {
    setShowModal(true);
  };
  
  const handleCloseModal = (): void => {
    setShowModal(false);
  };
  
  
  return (
    
    
    {showModal && (
      <div className="h-[233px] w-[582px] bg-neutral-200 font-crimson
                      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      shadow-xl">
          <div className="flex flex-col">
              <p className="flex justify-center text-[40px] crimson-bold">Warning!</p>
              <p className="flex justify-center text-[40px] crimson-bold">Your changes will not be saved.</p>
          </div>
          <div className="flex flex-row justify-around ">
              <ButtonCancel_ExitModal onClick={handleCloseModal}/>
              <ButtonExit_ExitModal/>
          </div>
      </div>
    )}
  );
};

export default ExitModal;