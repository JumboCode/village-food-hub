'use client';

import React, { useState } from 'react';
import { ButtonCancel, ButtonSave } from './SurveyButtons';
import UnitBoxes from './UnitBoxes';
import addIcon from '@app/images/Vector.png';

interface EditModalProps {
    itemNameOld: string;
    // units: string[]([]);
    closeModal: () => void;
    // handle save updates the category/inventory database 
    // input: updated name, updated units, current category
    handleSave: (updatedName: string, unit: string[], selectedCategory: string) => void; 
    selectedCategory: string;

}

const EditModal: React.FC<EditModalProps> = ({ itemNameOld, closeModal, handleSave, selectedCategory}) => {
    const [itemName, setItemName] = useState('');
    const [newUnits, setNewUnits] = useState<string[]>([]);
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[412px] bg-[#FFFFFF] font-crimson justify-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
                {/* Title */}
                <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Edit Item</div>

                {/* Name Input */}
                <div className="flex flex-col mb-[30px] font-crimson">
                    <div className="flex mb-2">
                        <div className="text-[32px] w-24 ml-[5%]">Name</div>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] px-3 text-lg"
                        />
                    </div>

                    {/* Units Input */}
                    <UnitBoxes 
                        icon={addIcon}
                        onUnitsChange={setNewUnits}
                    />
                </div> 

                {/* Buttons */}
                <div className="flex w-full justify-center space-x-[15px] items-center">

        

                    <ButtonCancel onClick={closeModal} />
                    <ButtonSave onClick={() => handleSave(String(itemName), newUnits, String(selectedCategory))}/>
                    {/* <ButtonSave onClick={() => {console.log(newUnits.type)}} */}
                
                </div>
            </div>
        </div>
    );
};

export default EditModal;
