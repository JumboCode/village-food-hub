'use client';

import React from 'react';
import { ButtonCancel, ButtonDelete } from '@app/components/SurveyButtons';

interface DeleteModalProps {
  itemName: string;
  units: string;
  closeModal: () => void;
  handleDelete: (arg: string) => void; 
}

const DeleteInventoryModal: React.FC<DeleteModalProps> = ({ itemName, units, closeModal, handleDelete}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-20">
        <div className="h-[300px] w-[400px] bg-[#FFFFFF] font-crimson
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        pt-8 shadow-lg rounded-lg justify-items-center
                        border-[2px] border-red" >
            <p className="flex w-[80%] justify-center text-center text-[28px] crimson-bold">Are you sure you want to delete {itemName} with unit {units}?</p>
            <p className='flex justify-center text-[18px] crimson-bold pt-4 text-red'>This action cannot be undone</p>
            <div className="flex w-full justify-center space-x-[15px] items-center pt-8">
              <button
                className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-gray text-[20px] justify-center"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="flex bg-red hover:bg-dark-red text-white font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-dark-red text-[20px] justify-center"
                onClick={() => handleDelete(itemName)}
              >
                Delete
              </button>
            </div>
      </div>
    </div>
  );
};

export default DeleteInventoryModal;