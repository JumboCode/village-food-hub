'use client'; 

import React, { useState, useEffect } from 'react';
import { ButtonCancel, ButtonSave } from '@app/components/SurveyButtons';

interface EditUserModalProps {
    userId: string;
    userData: string[];
    closeModal: () => void;
    handleSave: (updatedRole: string, userId: string) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ userId, userData, closeModal, handleSave }) => {
    console.log("User Data from Backend:", userData);
    const firstName = userData[0] !== "N/A" ? userData[0] : "";
    const lastName = userData[1] !== "N/A" ? userData[1] : "";
    const receivedRole = userData[3] !== "N/A" ? userData[3] : "Staff";

    console.log("Received Role from Backend:", receivedRole);
    const [role, setRole] = useState<"Admin" | "Staff">(receivedRole === "Admin" ? "Admin" : "Staff");

    useEffect(() => {
        setRole(receivedRole === "Admin" ? "Admin" : "Staff");
    }, [receivedRole]);

    const handleSaveClick = async () => {
        if (!userId) {
            console.error("User ID is missing before making PUT request.");
            return;
        }
        await handleSave(role, userId);
        closeModal();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="h-[320px] w-[400px] bg-[#FFFFFF] font-crimson justify-center py-[25px] shadow-lg rounded-[7px] border-[2px] border-light-green">
                <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Edit Role</div>
                <div className="flex flex-col mb-[30px] font-crimson">
                    <div className="flex my-4">
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
                            onChange={(e) => setRole(e.target.value as "Admin" | "Staff")}
                            className="w-full h-[50px] rounded-[13px] border-[3px] border-[#E1E1E1] ml-3 mr-4 px-3 bg-gray-100 text-gray-700 cursor-pointer text-[24px]"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                    <div className="flex flex-row justify-center gap-4 mt-4">
                        <ButtonCancel onClick={closeModal} />
                        <ButtonSave onClick={handleSaveClick} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;