'use client';

import React from 'react';
import { ButtonCancel, ButtonDelete } from '@app/components/SurveyButtons';

interface DeleteModalProps {
  categoryName: string;
  itemName: string;
  closeModal: () => void;
  handleDelete: (arg: string) => void; 
}

const DeleteCategoryModal: React.FC<DeleteModalProps> = ({ categoryName, closeModal, handleDelete}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
        <div className="h-[260px] w-[400px] bg-modal-gray font-crimson
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        pt-8 shadow-lg rounded-lg justify-items-center" >
            <p className="flex w-[80%] justify-center text-center text-[28px] crimson-bold">Are you sure you want to delete {categoryName} ?</p>
            <div className="flex flex-row justify-around pt-8">
                <ButtonCancel onClick={closeModal} />
                <ButtonDelete onClick={handleDelete}/>
            </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;