'use client';

import React, { useState, useEffect } from 'react';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit } from '@app/components/SurveyButtons';
import UpdateInventoryBanner from '@app/components/UpdateInventoryBanner';
import { NameDropdown } from '@app/components/Dropdowns';
import ExitModal from "@app/components/ExitModal"
import { userIsCustomer } from "@app/components/ProtectedUrls";
import { useUser } from "@clerk/nextjs";

type Step = 'details' | 'confirm';

interface Inventory {
    categoryName: string;
    itemName: string;
    quantity: number;
    units: string;
    lastUpdated: Date;
}

const VolunteerRemovePages: React.FC = () => {
  const [itemToRemove, setItemToRemove] = useState<Inventory>({
    itemName: '',
    categoryName: '',
    quantity: -1,
    units: '',
    lastUpdated: new Date(),
  });
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [showModal, setShowModal] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [itemExists, setItemExists] = useState("");
  const [validQuantity, setValidQuantity] = useState("");
  const [nextAttempted, setNextAttempted] = useState(false);

  const handleNext = () => {
    console.log('Next clicked, transitioning to confirm');
    setCurrentStep('confirm');
    setNextAttempted(true);
  };

  const handleBack = () => {
    setNextAttempted(false);
    console.log('Back clicked, currentStep:', currentStep);
    if (currentStep === 'confirm')
      setCurrentStep('details');
    else 
      window.location.href = "../volunteer-landing";
  };

  const openModal = (): void => {
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  const { user } = useUser();
  const hasAccess = !userIsCustomer(user);

  return (
    hasAccess ? (
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
            {showModal && <ExitModal closeModal={closeModal} redirectPage={'/volunteer-unsaved'} translations={["Warning!", "Your changes will not be saved."]}/>}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex justify-center w-full h-full">
          {currentStep === 'details' && (
            <div className="w-4/5 h-4/5">
              <VolunteerRemoveDetailsModule 
                itemToRemove={itemToRemove} 
                setItemToRemove={setItemToRemove} 
                setNextDisabled={setNextDisabled}
                itemExists={itemExists}
                validQuantity={validQuantity}
                setItemExists={setItemExists}
                setValidQuantity={setValidQuantity}
              />
            </div>
          )}
          {currentStep === 'confirm' && (
            <div className="w-4/5 h-4/5">
              <VolunteerRemoveConfirmModule 
                itemToRemove={itemToRemove} 
              />
            </div>
          )}
        </div>

        {/* Next Button */}
        {currentStep === 'details' && (
          <div className="flex flex-col items-center mt-8 space-y-2">
            {nextDisabled && nextAttempted && (
              <div className="text-red text-sm font-medium">
                {itemToRemove.quantity == 0 
                  ? "Quantity should be a value bigger than 0." 
                  : "Please fill out all required fields to proceed."}
              </div>
            )}
            <div className="relative w-fit">
            {/* Actual Button */}
              <ButtonNext 
                disabled={nextDisabled}
                onClick={() => {
                  setItemExists("");
                  setValidQuantity("");
                  setItemToRemove({ ...itemToRemove, lastUpdated: new Date() });
                  fetch("../api/inventory", { method: 'GET' })
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                      }
                      return response.json();
                    })
                    .then((jsonData) => jsonData.data)
                    .then((items) => {
                      const inventoryItem = items.find((item: Inventory) => 
                        item.itemName === itemToRemove.itemName && 
                        item.units === itemToRemove.units
                      );
                      const exists = inventoryItem !== undefined;

                      if (exists) {
                        if ((inventoryItem.quantity >= itemToRemove.quantity) && (itemToRemove.quantity > 0)) {
                          handleNext();
                        } else {
                          setNextDisabled(false);
                          setValidQuantity("The quantity you are removing is greater than the quantity in the inventory");
                        } 
                      } else {
                        console.log(itemToRemove);
                        setItemExists("Item does not exist in inventory");
                      }
                      console.log(items);
                    })
                    .catch((error) => {
                      console.error('Error fetching inventory:', error);
                    });
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
    ) : (
      <div className="p-10 text-center">
          <h1 className="text-2xl font-bold">Unauthorized Access</h1>
          <p className="mt-4">You do not have permission to view this page.</p>
      </div>
    )
  );
};

// Subcomponents
interface VolunteerRemoveDetailsModuleProps{
  itemToRemove: Inventory,
  setItemToRemove: React.Dispatch<React.SetStateAction<Inventory>>,
  setNextDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  itemExists : string,
  validQuantity : string,
  setItemExists : React.Dispatch<React.SetStateAction<string>>,
  setValidQuantity : React.Dispatch<React.SetStateAction<string>>,
}

const VolunteerRemoveDetailsModule: React.FC<VolunteerRemoveDetailsModuleProps> = ({ itemToRemove, setItemToRemove, setNextDisabled, itemExists, validQuantity, setItemExists, setValidQuantity }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const { categoryName, itemName, quantity, units } = itemToRemove;
    setNextDisabled(categoryName === '' || itemName === '' || quantity <= 0 || units === '');
  }, [itemToRemove, setNextDisabled]);

  return (
    <div className="flex flex-col h-1/2 w-3/5 pt-10 justify-center font-crimson justify-self-center">
      <p className="justify-self-center text-[36px] font-bold">What are you removing?</p>
      <div className="font-bold text-[20px] py-4">
        <p className="mb-2">Category Name <span className="text-red">*</span></p>
        <NameDropdown 
          fetchUrl="/api/categories"
          filterName="name"
          onSelect={(selected) => { 
            setItemExists("");
            setSelectedCategory(selected);
            setItemToRemove({ ...itemToRemove, categoryName: selected, itemName: "", units: "" }); 
          }}
          defaultValue={itemToRemove.categoryName}
        />
      </div>
      <div className="font-bold text-[20px]">
        <p className="mb-2">
          Item Name <span className="text-red">*</span>
          <span className='text-[16px] text-red'> {itemExists}</span>
        </p>
        <NameDropdown 
          fetchUrl="/api/categories" 
          filterName="name" 
          currentDropdown="itemName"
          onSelect={(selected) => {
            setItemToRemove({ ...itemToRemove, itemName: selected, units:"" });
          }} 
          disabled={!itemToRemove.categoryName} 
          filterValue={itemToRemove.categoryName || ""}
          defaultValue={(itemToRemove.itemName)}
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
              setItemToRemove({ ...itemToRemove, quantity: Number(e.target.value) });
              setValidQuantity("");
              setNextDisabled(Number(e.target.value) <= 0);
            }}
            defaultValue={itemToRemove.quantity > 0 ? itemToRemove.quantity : ''}
          />
        </div>
        <div className="font-bold text-[20px] w-1/3 pt-6">
          <p className="mb-2">Units <span className="text-red">*</span></p>
          <NameDropdown 
            fetchUrl="/api/categories" 
            filterName="itemName" 
            currentDropdown="units"
            onSelect={(selected) => {
              setItemToRemove({ ...itemToRemove, units: selected });
            }} 
            disabled={!itemToRemove.itemName} 
            filterValue={itemToRemove.itemName || ""}
            defaultValue={itemToRemove.units}
          />
        </div>
      </div>
      <span className='text-[16px] text-red'>{validQuantity}&nbsp;</span>
    </div>
  );
};

interface VolunteerRemoveConfirmModuleProps {
  itemToRemove: Inventory
}

const VolunteerRemoveConfirmModule: React.FC<VolunteerRemoveConfirmModuleProps> = ({ itemToRemove }) => {
  return (
    <div className="font-crimson">
      <div className="text-black crimson-bold pt-10 flex text-4xl content-center justify-center text-center">
        This action will:
      </div>
      <div className="text-gray crimson-regular pt-10 flex text-4xl content-center justify-center text-center">
        Remove {itemToRemove.quantity} {itemToRemove.units} of {itemToRemove.itemName}.
      </div>
      <div className="flex pt-[250px] crimson-regular text-2xl justify-center">
      <ButtonSubmit onClick={() => {
          fetch("../api/inventory", { method: 'GET' })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((jsonData) => jsonData.data)
            .then((items) => {
              const inventoryItem = items.find((item: Inventory) => 
                item.itemName === itemToRemove.itemName && 
                item.units === itemToRemove.units
              )
              if (inventoryItem.quantity > itemToRemove.quantity) {
                  const newQuantity = inventoryItem.quantity - itemToRemove.quantity
                  fetch('../api/inventory', {
                      method : 'PUT',
                      body : JSON.stringify({ ...itemToRemove, quantity : newQuantity})
                  })
              } else if (inventoryItem.quantity === itemToRemove.quantity) {
                  fetch('../api/inventory', {
                    method : 'DELETE',
                    body : JSON.stringify({
                      deleteItem : itemToRemove.itemName, 
                      units : itemToRemove.units
                    })
                  })
              }
              console.log(items)
              window.location.href = "../volunteer-saved";
            })
            .catch((error) => {
              console.error('Error fetching inventory:', error);
            });
      }}/>
      </div>
    </div>
  );
};

export default VolunteerRemovePages;