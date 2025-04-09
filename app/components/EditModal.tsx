"use client";
import React, { useState, useEffect } from "react";
import UnitBoxes from "@app/components/UnitBoxes";
import addIcon from "@app/images/Vector.png";

interface EditModalProps {
  itemNameOld: string;
  initialUnits: string[];
  closeModal: () => void;
  handleSave: (
    oldItemName: string,
    newItemName: string,
    updatedUnits: string[],
    selectedCategory: string
  ) => void;
  selectedCategory: string;
}

const EditModal: React.FC<EditModalProps> = ({
  itemNameOld,
  initialUnits,
  closeModal,
  handleSave,
  selectedCategory,
}) => {
  const [itemName, setItemName] = useState(itemNameOld);
  const [newUnits, setNewUnits] = useState<string[]>(initialUnits || []);
  const [errorMessage, setErrorMessage] = useState("");

  // Update newUnits when initialUnits prop changes.
  useEffect(() => {
    setNewUnits(initialUnits || []);
  }, [initialUnits]);

  const onSave = () => {
    // Validate itemName is not empty.
    if (itemName.trim() === "") {
      setErrorMessage("Item name is required.");
      return;
    }

    // Validate that at least one unit is provided. 
    const validUnits = newUnits.filter(
      (unit) => unit && unit.trim() !== ""
    );
    
    // Check for duplicates (case-insensitive)
    const seen = new Set<string>();
    for (const unit of validUnits) {
      const lowerUnit = unit.toLowerCase();
      if (seen.has(lowerUnit)) {
        setErrorMessage("Cannot add duplicate units.");
        return;
      }
      seen.add(lowerUnit);
    }
    
    if (validUnits.length < 1) {
      setErrorMessage("At least one unit is required.");
      return;
    }
    // If validation passes, clear error and call handleSave.
    setErrorMessage("");
    handleSave(itemNameOld, itemName.trim(), newUnits, selectedCategory);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-20">
      <div className="w-[450px] bg-[#FFFFFF] font-crimson justify-center items-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green pl-4">
        <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Edit Item</div>
        <div className="flex flex-col mb-[30px] font-crimson">
          <div className="flex mb-2">
            <div className="text-[28px] w-24 ml-[5%]">Name</div>
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
          {errorMessage && (
            <p className="text-red text-center mt-2">{errorMessage}</p>
          )}
        </div>
        <div className="flex w-full justify-center space-x-[15px] items-center">
            <button
                className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[40px] rounded-[8px] border-[1px] pt-1 border-gray text-[20px] justify-center"
                onClick={closeModal}
            >
                Cancel
            </button>
            <button
                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[175px] h-[40px] pt-1 rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                onClick={onSave}
            >
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;