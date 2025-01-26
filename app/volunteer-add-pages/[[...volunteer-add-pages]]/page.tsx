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
  const [currItem, setCurrItem] = useState<Inventory>({
    itemName: '',
    categoryName: '',
    quantity: 0,
    units: '',
    lastUpdated: new Date(),
  });
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [showModal, setShowModal] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);

  const handleNext = () => {
    console.log('Next clicked, transitioning to confirm');
    setCurrentStep('confirm');
  };

  const handleBack = () => {
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
          {showModal && <ExitModal closeModal={closeModal} />}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex justify-center w-full h-full">
        {currentStep === 'details' && (
          <div className="w-4/5 h-4/5">
            <VolunteerAddDetailsModule 
              currItem={currItem} 
              setCurrItem={setCurrItem} 
              setNextDisabled={setNextDisabled}
            />
          </div>
        )}
        {currentStep === 'confirm' && (
          <div className="w-4/5 h-4/5">
            <VolunteerAddConfirmModule 
              currItem={currItem} 
              setCurrItem={setCurrItem} 
            />
          </div>
        )}
      </div>

      {/* Next Button */}
      {currentStep === 'details' && (
        <div className="flex justify-center mt-8">
          <ButtonNext 
            disabled={nextDisabled} 
            onClick={() => {
              console.log(currItem);
              handleNext();
            }} 
          />
        </div>
      )}
    </div>
  );
};

// Subcomponents

interface VolunteerAddDetailsModuleProps{
    currItem: Inventory,
    setCurrItem: React.Dispatch<React.SetStateAction<Inventory>>,
    setNextDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const VolunteerAddDetailsModule: React.FC<VolunteerAddDetailsModuleProps> = ({ currItem, setCurrItem, setNextDisabled }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const { categoryName, itemName, quantity, units } = currItem;
    setNextDisabled(categoryName === '' || itemName === '' || quantity <= 0 || units === '');
  }, [currItem, setNextDisabled]);

  return (
    <div className="flex flex-col h-1/2 w-3/5 pt-10 justify-center font-crimson justify-self-center">
      <p className="justify-self-center text-[36px] font-bold">What are you adding?</p>
      <div className="font-bold text-[20px] py-4">
        <p className="mb-2">Category Name</p>
        <NameDropdown 
          fetchUrl="/api/categories" 
          filterName="name" 
          onSelect={(selected) => {
            setSelectedCategory(selected);
            setCurrItem({ ...currItem, categoryName: selected });
          }}
        />
      </div>
      <div className="font-bold text-[20px]">
        <p className="mb-2">Item Name</p>
        <NameDropdown 
          fetchUrl="/api/categories" 
          filterName="name" 
          currentDropdown="itemName"
          onSelect={(selected) => {
            setCurrItem({ ...currItem, itemName: selected });
          }} 
          disabled={!selectedCategory} 
          filterValue={selectedCategory || ""}
        />
      </div>
      <div className="flex flex-row w-full justify-between">
        <div className="font-bold text-[20px] pt-6">
          <p className="mb-2">Quantity</p>
          <input
            type="text"
            placeholder=""
            className="input input-bordered input-xs w-full max-w-xs rounded-xl border-light-gray"
            onBlur={(e) => {
              setCurrItem({ ...currItem, quantity: Number(e.target.value) });
            }}
            defaultValue={currItem.quantity > 0 ? currItem.quantity : ''}
          />
        </div>
        <div className="font-bold text-[20px] w-1/3 pt-6">
          <p className="mb-2">Units</p>
          <NameDropdown 
            fetchUrl="/api/categories" 
            filterName="itemName" 
            currentDropdown="units"
            onSelect={(selected) => {
              setCurrItem({ ...currItem, units: selected });
            }} 
            disabled={!currItem.itemName} 
            filterValue={currItem.itemName || ""}
          />
        </div>
      </div>
    </div>
  );
};

interface VolunteerAddConfirmModuleProps {
    currItem: Inventory
    setCurrItem: React.Dispatch<React.SetStateAction<Inventory>>
}

const VolunteerAddConfirmModule: React.FC<VolunteerAddConfirmModuleProps> = ({ currItem, setCurrItem }) => {
  return (
    <div className="font-crimson">
      <div className="text-black crimson-bold pt-10 flex text-4xl content-center justify-center text-center">
        This action will:
      </div>
      <div className="text-gray crimson-regular pt-10 flex text-4xl content-center justify-center text-center">
        Add {currItem.quantity} {currItem.units} of {currItem.itemName}.
      </div>
      <div className="flex pt-[250px] crimson-regular text-2xl justify-center">
        <ButtonSubmit
          onClick={() => {
            setCurrItem({ ...currItem, lastUpdated: new Date() });

            // Fetch the current inventory data
            fetch("../api/inventory", { method: "GET" })
              .then((response) => response.json())
              .then((jsonData) => jsonData.data)
              .then((items) => {
                const existingItem = items.find(
                  (item: Inventory) =>
                    item.itemName === currItem.itemName &&
                    item.units === currItem.units
                );

                if (existingItem) {
                  // If item exists, update the quantity
                  const updatedQuantity = existingItem.quantity + currItem.quantity;

                  fetch("../api/inventory", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...currItem,
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
                    body: JSON.stringify(currItem),
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