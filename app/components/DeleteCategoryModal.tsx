'use client';

import React from 'react';

interface DeleteModalProps {
  categoryName: string;
  itemName: string;
  closeModal: () => void;
  handleDelete: (arg: string) => void; 
}

const DeleteCategoryModal: React.FC<DeleteModalProps> = ({ categoryName, closeModal, handleDelete}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="w-[400px] bg-white font-crimson
                      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      pt-5 pb-6 px-6 shadow-lg rounded-lg
                      border-[2px] border-red max-w-[90vw]">

        {/* Message Text */}
        <p className="text-center text-[24px] crimson-bold text-red break-words overflow-wrap">
          Are you sure you want to delete <br />
          <span className="break-words">{categoryName}</span>?
        </p>

        {/* Button Row */}
        <div className="flex justify-center space-x-4 items-center pt-8">
          <button
            className="text-gray hover:bg-light-gray font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-gray text-[20px]"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-red hover:bg-dark-red text-white font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-dark-red text-[20px]"
            onClick={() => handleDelete(categoryName)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;