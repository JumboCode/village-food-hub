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
  const [itemToAdd, setItemToAdd] = useState<Inventory>({
    itemName: '',
    categoryName: '',
    quantity: 0,
    units: '',
    lastUpdated: new Date(),
  });
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [showModal, setShowModal] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [nextAttempted, setNextAttempted] = useState(false);

  const handleNext = () => {
    console.log('Next clicked, transitioning to confirm');
    setCurrentStep('confirm');
  };

  const handleBack = () => {
    setNextAttempted(false);
    console.log('Back clicked, currentStep:', currentStep);
    if (currentStep === 'confirm') setCurrentStep('details');
    else window.location.href = "../volunteer-landing";
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
      <div className="flex flex-row h-full w-full justify-between mt-10 px-40 py-18">
        <div className="flex flex-2">
          <ButtonBack onClick={handleBack} />
        </div>
        <div className="">
          <ButtonExit onClick={openModal} />
          {showModal && <ExitModal closeModal={closeModal} redirectPage={'/volunteer-unsaved'} translations={["Warning!", "Your changes will not be saved."]}/> }
        </div>
      </div>

      {/* Page Content */}
      <div className="flex justify-center w-full h-full">
        {currentStep === 'details' && (
          <div className="w-4/5 h-4/5">
            <VolunteerAddDetailsModule 
              itemToAdd={itemToAdd} 
              setItemToAdd={setItemToAdd} 
              setNextDisabled={setNextDisabled}
            />
          </div>
        )}
        {currentStep === 'confirm' && (
          <div className="w-4/5 h-4/5">
            <VolunteerAddConfirmModule 
              itemToAdd={itemToAdd} 
              setItemToAdd={setItemToAdd} 
            />
          </div>
        )}
      </div>

      {/* Next Button */}
      {currentStep === 'details' && (
        <div className="flex flex-col items-center mt-8 space-y-2">
          {nextDisabled && nextAttempted && (
            <div className="text-red text-sm font-medium">
              {itemToAdd.quantity == 0
                ? "Quantity should be a value bigger than 0."
                : "Please fill out all required fields to proceed."}
            </div>
          )}

          <div className="relative w-fit">
            {/* Actual Button */}
            <ButtonNext
              disabled={nextDisabled}
              onClick={() => {
                console.log(itemToAdd);
                handleNext();
              }}
            />

            {/* Overlay only when disabled */}
            {nextDisabled && (
              <div
                className="absolute inset-0 z-10 cursor-not-allowed"
                onClick={() => {
                  setNextAttempted(true);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponents

interface VolunteerAddDetailsModuleProps{
    itemToAdd: Inventory,
    setItemToAdd: React.Dispatch<React.SetStateAction<Inventory>>,
    setNextDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const VolunteerAddDetailsModule: React.FC<VolunteerAddDetailsModuleProps> = ({ itemToAdd, setItemToAdd, setNextDisabled }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(itemToAdd.categoryName || null);

  useEffect(() => {
    const { categoryName, itemName, quantity, units } = itemToAdd;
    setNextDisabled(categoryName === '' || itemName === '' || quantity <= 0 || units === '');
  }, [itemToAdd, setNextDisabled]);

  return (
    <div className="flex flex-col h-1/2 w-3/5 pt-10 justify-center font-crimson justify-self-center">
      <p className="justify-self-center text-[36px] font-bold">What are you adding?</p>
      <div className="font-bold text-[20px] py-4">
        <p className="mb-2">Category Name <span className="text-red">*</span></p>
        <NameDropdown 
          fetchUrl="/api/categories" 
          filterName="name" 
          onSelect={(selected) => {
            setSelectedCategory(selected);
            setItemToAdd({ ...itemToAdd, categoryName: selected });
          }}
          defaultValue={itemToAdd.categoryName}
        />
      </div>
      <div className="font-bold text-[20px]">
        <p className="mb-2">Item Name <span className="text-red">*</span></p>
        <NameDropdown 
          fetchUrl="/api/categories" 
          filterName="name" 
          currentDropdown="itemName"
          onSelect={(selected) => {
            setItemToAdd({ ...itemToAdd, itemName: selected });
          }} 
          disabled={!selectedCategory} 
          filterValue={selectedCategory || ""}
          defaultValue={itemToAdd.itemName}
        />
      </div>
      <div className="flex flex-row w-full justify-between">
        <div className="font-bold text-[20px] pt-6">
          <p className="mb-2">Quantity <span className="text-red">*</span></p>
          <input
            type="number"
            min="1"
            step="1"
            placeholder=""
            className="input input-bordered input-xs w-full max-w-xs rounded-xl border-light-gray"
            onBlur={(e) => {
              setItemToAdd({ ...itemToAdd, quantity: Number(e.target.value) });
              setNextDisabled(Number(e.target.value) <= 0);
            }}
            defaultValue={itemToAdd.quantity > 0 ? itemToAdd.quantity : ''}
          />
        </div>
        <div className="font-bold text-[20px] w-1/3 pt-6">
          <p className="mb-2">Units <span className="text-red">*</span></p>
          <NameDropdown 
            fetchUrl="/api/categories" 
            filterName="itemName" 
            currentDropdown="units"
            onSelect={(selected) => {
              setItemToAdd({ ...itemToAdd, units: selected });
            }} 
            disabled={!itemToAdd.itemName} 
            filterValue={itemToAdd.itemName || ""}
            defaultValue={itemToAdd.units}
          />
        </div>
      </div>
    </div>
  );
};

interface VolunteerAddConfirmModuleProps {
    itemToAdd: Inventory
    setItemToAdd: React.Dispatch<React.SetStateAction<Inventory>>
}

const VolunteerAddConfirmModule: React.FC<VolunteerAddConfirmModuleProps> = ({ itemToAdd, setItemToAdd }) => {
  return (
    <div className="font-crimson">
      <div className="text-black crimson-bold pt-10 flex text-4xl content-center justify-center text-center">
        This action will:
      </div>
      <div className="text-gray crimson-regular pt-10 flex text-4xl content-center justify-center text-center">
        Add {itemToAdd.quantity} {itemToAdd.units} of {itemToAdd.itemName}.
      </div>
      <div className="flex pt-[250px] crimson-regular text-2xl justify-center">
        <ButtonSubmit
          onClick={() => {
            setItemToAdd({ ...itemToAdd, lastUpdated: new Date() });

            // Fetch the current inventory data
            fetch("../api/inventory", { method: "GET" })
              .then((response) => response.json())
              .then((jsonData) => jsonData.data)
              .then((items) => {
                const existingItem = items.find(
                  (item: Inventory) =>
                    item.itemName === itemToAdd.itemName &&
                    item.units === itemToAdd.units
                );

                if (existingItem) {
                  // If item exists, update the quantity
                  const updatedQuantity = existingItem.quantity + itemToAdd.quantity;

                  fetch("../api/inventory", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...itemToAdd,
                      quantity: updatedQuantity,
                    }),
                  }).then(() => {
                    console.log("Quantity updated successfully");
                    window.location.href = "../volunteer-saved";
                  });
                } else {
                  // If item doesn't exist, create a new entry
                  fetch("../api/inventory", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(itemToAdd),
                  }).then(() => {
                    console.log("Item created successfully");
                    window.location.href = "../volunteer-saved";
                  });
                }
              });
          }}
        />
      </div>
    </div>
  );
};


export default VolunteerAddPages;