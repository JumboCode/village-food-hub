'use client';

import React, { useState, useEffect } from 'react';
import { ButtonCancel, ButtonSave } from '@app/components/SurveyButtons';
import UnitBoxes from '@app/components/UnitBoxes';
// import addIcon from '@app/images/Vector.png';

interface EditUserModalProps {
    userData: string[];
    closeModal: () => void;
    handleSave: (
      updatedRole: string
    ) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ userData, closeModal, handleSave }) => {
  // Ensure we always initialize with an array
  const [firstName] = userData[0] !== "N/A" ? userData[0] : "";
  const [lastName] = userData[1] !== "N/A" ? userData[1] : "";
  const [role, setRole] = useState(userData[5]); 

  // When initialUnits prop changes, update newUnits state
  useEffect(() => {
    setRole(userData[5]);
  }, [userData]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-[412px] bg-[#FFFFFF] font-crimson justify-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
        <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Edit Role</div>
        <div className="flex flex-col mb-[30px] font-crimson">
          <div className="flex mb-2">
            <div className="text-[32px] w-24 ml-[5%]">Name</div>
          </div>
          <UnitBoxes 
            // onUnitsChange={setRole}
            // initialUnits={newUnits}
          />
        </div>
        <div className="flex w-full justify-center space-x-[15px] items-center">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave
                onClick={() =>
                    handleSave(itemNameOld, itemName, newUnits, selectedCategory)
                }
            />  

        </div>
      </div>
    </div>
  );
};

export default EditUserModal;