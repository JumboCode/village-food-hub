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

  const firstName = userData[0] !== "N/A" ? userData[0] : "";
  const lastName = userData[1] !== "N/A" ? userData[1] : "";
  const userId = userData[3];

  const pronouns = userData[2]; 
  const phoneNumber = userData[6];


  const [role, setRole] = useState(userData[5]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setRole(userData[5]);
  }, [userData]);

  const handleSaveClick = async () => {
    setLoading(true);
    setError(null);
  

  const requestData = {
    userId, 
    firstName,
    lastName,
    role,
    pronouns,
    phoneNumber,
  };

      try {
        const response = await fetch("/api/users", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: requestData
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update user: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(`Successfully updated user: ${firstName} ${lastName}`);
        closeModal();
    } catch (err) {
        console.error('Error updating user:', err);
        setError('Failed to update user. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-[412px] bg-[#FFFFFF] font-crimson justify-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
        <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Edit Role</div>
        <div className="flex flex-col mb-[30px] font-crimson">
          <div className="flex mb-2">
            <div className="text-[32px] w-24 ml-[5%] gap-4">Name</div>
            <input
                        type="text"
                        value={`${firstName} ${lastName}`}
                        readOnly
                        className="w-full h-[50px] px-3 text-gray-700 text-[24px] border-none bg-transparent focus:outline-none"
                    />
                </div>

                <div className="flex flex-row items-center font-crimson px-[5%] gap-4">
                    <label className="mb-1 text-[32px]">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-[50px] rounded-[13px] border-[3px] border-[#E1E1E1] px-3 bg-gray-100 text-gray-700 cursor-pointer text-[24px]"
                    >
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
            <div className="flex flex-row justify-center gap-4 mt-4">
              <ButtonCancel onClick={closeModal} />
              <ButtonSave
                  onClick={() =>
                      handleSaveClick()
                  }
              />  
            </div>

        </div>
      </div>
    </div>
  );
};

export default EditUserModal;