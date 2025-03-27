'use client'; 

import React, { useState} from 'react'; 

interface QuantityProps {
    itemName: string; 
    units: string; 
    categoryName: string; 
    closeModal: () => void; 
    handleUpdate: (itemName: string, units: string, quantityChange: number, categoryName: string) => void; 

}

const QuantityModal: React.FC<QuantityProps> = ({ itemName, units, categoryName, closeModal, handleUpdate}) => {
    const [quantityChange, setQuantityChange] = useState(0);
    const [showQuantityError, setShowQuantityError] = useState(false);

    const handleSave = () => {
        if(quantityChange <= 0) {
            setShowQuantityError(true);
        } else {
            handleUpdate(itemName, units, quantityChange, categoryName); 
            console.log("updating");
        }
    };

    return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-20">
                    <div className="h-[230px] w-[412px] bg-[#FFFFFF] font-crimson justify-center items-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
                        <p className="text-center text-[32px] font-bold pb-[15px]">Edit Quantity</p>
                        <div className="flex w-full justify-center items-center pb-[30px]">
                            <input
                                type="number"
                                min="0"
                                onChange={(e) => setQuantityChange(parseInt(e.target.value, 10) || 0)}
                                className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] justify-center"
                            />
                        </div>
                        {showQuantityError && (
                            <p className="absolute w-[412px] text-center top-1/2 pt-5 text-red">
                                Please enter a valid quantity.
                            </p>
                        )}
                        
                        <div className="flex w-full justify-center space-x-[15px] items-center">
                            <button
                                className="flex text-gray hover:bg-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
    )
}

export default QuantityModal;