'use client';

import React from 'react';
import { ButtonCancel, ButtonDelete } from '@app/components/SurveyButtons';

interface DeleteModalProps {
  userName: string;
  closeModal: () => void;
  handleDelete: () => void; 
}

const DeleteUserModal: React.FC<DeleteModalProps> = ({ userName, closeModal, handleDelete}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div
        className="h-[300px] w-[350px] bg-modal-gray font-crimson
                   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   pt-8 shadow-lg rounded-lg border-2 border-red"
      >
        <div className="flex flex-col mx-2">
          <p className="flex justify-center text-[28px] crimson-bold">Are you sure</p>
          <p className="flex justify-center text-[28px] crimson-bold">you want to delete</p>
          <p className="flex justify-center text-[28px] crimson-bold">
           {userName} ?
          </p>
          <p className='flex justify-center text-[18px] crimson-bold pt-4 text-red'>This action cannot be undone</p>
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

export default DeleteUserModal;

