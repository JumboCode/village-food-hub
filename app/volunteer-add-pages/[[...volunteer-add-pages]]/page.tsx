'use client';

import React, { useState, useEffect } from 'react';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit } from '@app/components/SurveyButtons';
import UpdateInventoryBanner from '@app/components/UpdateInventoryBanner';
import { NameDropdown } from '@app/components/Dropdowns';
import ExitModal from "@app/components/ExitModal"

type Step = 'details' | 'confirm';

interface Inventory {
  categoryName: string;
  itemName: string;
  quantity: number;
  units: string;
  lastUpdated: Date;
}

const VolunteerAddPages: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDropdownsDisabled, setDropdownsDisabled] = useState(true);

  const handleNext = () => {
    console.log('Next clicked, transitioning to confirm');
    setCurrentStep('confirm');
  };

  const handleBack = () => {
    console.log('Back clicked, currentStep:', currentStep);
    if (currentStep === 'confirm') {
      setCurrentStep('details');
    }
  };

  const openModal = (): void => {
      setShowModal(true);
  };

  const closeModal = (): void => {
      setShowModal(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <UpdateInventoryBanner />

      {/* Back and Exit buttons */}
      <div className = "flex flex-row h-full w-full justify-between mt-10 px-40 py-18">
        <div className= "flex flex-2">
            <ButtonBack onClick={handleBack}/>
        </div>
        <div className = "">
            <ButtonExit onClick={openModal}/>
            {showModal && <ExitModal  closeModal={closeModal}/>}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex justify-center w-full h-full">
        {currentStep === 'details' && (
          <div className="w-4/5 h-4/5">
            <VolunteerAddDetailsModule />
          </div>
        )}
        {currentStep === 'confirm' && (
          <div className="w-4/5 h-4/5">
            <VolunteerAddConfirmModule />
          </div>
        )}
      </div>

      {/* Next Button */}
      {currentStep === 'details' && (
        <div className="flex justify-center mt-8">
          <ButtonNext onClick={handleNext} />
        </div>
      )}
    </div>
  );
};

// Subcomponents

const VolunteerAddDetailsModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const handleCategorySelect = (selected: string) => {
    console.log("Category selected:", selected);
    setSelectedCategory(selected);
  };
  
  const handleItemNameSelect = (selected: string) => {
    console.log("Item Name selected:", selected);
    setSelectedItemName(selected);
  };

  const handleUnitSelect = (selected: string) => {
    console.log("Unit selected:", selected);
    setSelectedUnit(selected);
  };
  
  return (
    <div className="flex flex-col h-1/2 w-3/5 justify-center font-crimson justify-self-center">
      <p className="justify-self-center text-[36px] font-bold">What are you adding?</p>
      <div className="font-bold text-[20px] py-4">
        <p className="mb-2">Category Name</p>
        <NameDropdown 
          fetchUrl="/api/categories" 
          filterName="name" 
          onSelect={handleCategorySelect}/>
      </div>
      <div className="font-bold text-[20px]">
        <p className="mb-2">Item Name</p>
        <NameDropdown 
          fetchUrl="/api/categories" 
          filterName="name" 
          currentDropdown="itemName"
          onSelect={handleItemNameSelect} 
          disabled={!selectedCategory} 
          filterValue={selectedCategory || ""}/>
      </div>
      <div className="flex flex-row w-full justify-between">
        <div className="font-bold text-[20px] pt-6">
          <p className="mb-2 w-1/3">Quantity</p>
          <input
            type="text"
            placeholder=""
            className="input input-bordered input-xs max-w-xs rounded-xl border-light-gray"
            disabled={!selectedItemName}
          />
        </div>
        <div className="font-bold text-[20px] w-1/3 pt-6">
          <p className="mb-2">Units</p>
          <NameDropdown 
            fetchUrl="/api/categories" 
            filterName="itemName" 
            currentDropdown="units"
            onSelect={handleUnitSelect} 
            disabled={!selectedItemName} 
            filterValue={selectedItemName || ""}/>
        </div>
      </div>
    </div>
  );
};

const VolunteerAddConfirmModule: React.FC = () => {
  return (
    <div>
      <div className="text-black crimson-bold flex text-4xl content-center justify-center text-center">
        This action will:
      </div>
      <div className="text-gray crimson-regular pt-10 flex text-4xl content-center justify-center text-center">
        Add [quantity] [units] of [itemName].
      </div>
      <div className="flex pt-[250px] crimson-regular text-2xl justify-center">
        <ButtonSubmit />
      </div>
    </div>
  );
};

export default VolunteerAddPages;
