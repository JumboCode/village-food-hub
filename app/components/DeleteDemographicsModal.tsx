'use client';

import React from 'react';
import { ButtonCancel, ButtonDelete } from '@app/components/SurveyButtons';

interface DeleteDemographicModalProps {
  userName: string;
  closeModal: () => void;
  handleDelete: (arg: string) => void; 
}

const DeleteDemographicModal: React.FC<DeleteDemographicModalProps> = ({ userName, closeModal, handleDelete}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-20">
        <div className="h-[260px] w-[400px] bg-[#FFFFFF] font-crimson
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        pt-8 shadow-lg rounded-lg justify-items-center
                        border-[2px] border-red" >
        <div className="flex flex-col">
          <p className="flex justify-center text-[28px] crimson-bold">Are you sure you</p>
          <p className="flex justify-center text-[28px] crimson-bold">
            want to delete
          </p>
          <p className="flex justify-center text-[28px] crimson-bold">
           {userName} ?
          </p>
        </div>
        <div className="flex w-full justify-center space-x-[15px] items-center pt-8">
              <button
                className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-gray text-[20px] justify-center"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="flex bg-red hover:bg-dark-red text-white font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-dark-red text-[20px] justify-center"
                onClick={() => handleDelete(userName)}
              >
                Delete
              </button>
            </div>
      </div>
    </div>
  );
};

export default DeleteDemographicModal;