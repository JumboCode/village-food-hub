'use client';

import React, { useState, useEffect } from 'react';
import { ButtonCancel, ButtonSave } from '@app/components/SurveyButtons';
import UnitBoxes from '@app/components/UnitBoxes';
import addIcon from '@app/images/Vector.png';

interface EditModalProps {
    itemNameOld: string;
    initialUnits: string[];
    closeModal: () => void;
    // Updated handleSave now accepts:
    // oldItemName (original item name),
    // newItemName (updated name),
    // updatedUnits (array of updated units),
    // selectedCategory (the category for the item)
    handleSave: (
      oldItemName: string,
      newItemName: string,
      updatedUnits: string[],
      selectedCategory: string
    ) => void;
    selectedCategory: string;
}

const EditModal: React.FC<EditModalProps> = ({ itemNameOld, initialUnits, closeModal, handleSave, selectedCategory }) => {
  // Ensure we always initialize with an array
  const [itemName, setItemName] = useState(itemNameOld);
  const [newUnits, setNewUnits] = useState<string[]>(initialUnits || []);

  // When initialUnits prop changes, update newUnits state
  useEffect(() => {
    setNewUnits(initialUnits || []);
  }, [initialUnits]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-[412px] bg-[#FFFFFF] font-crimson justify-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
        <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Edit Item</div>
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
          <UnitBoxes 
            icon={addIcon}
            onUnitsChange={setNewUnits}
            initialUnits={newUnits}
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

export default EditModal;