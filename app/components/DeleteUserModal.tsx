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
        className="h-[260px] w-[450px] bg-modal-gray font-crimson
                   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   pt-8 shadow-lg rounded-lg"
      >
        <div className="flex flex-col">
          <p className="flex justify-center text-[28px] crimson-bold">Are you sure you want to delete</p>
       
          <p className="flex justify-center text-[28px] crimson-bold">
           {userName} ?
          </p>
          <p className='flex justify-center text-[18px] crimson-bold text-red-100'>This action cannot be undone</p>
        </div>
        <div className="flex flex-row justify-around pt-8">
          <ButtonCancel onClick={closeModal} />
          <ButtonDelete onClick={handleDelete}/>


        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;

