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

const VolunteerRemovePages: React.FC = () => {
  const [currItem, setCurrItem] = useState<Inventory>({
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

  const handleNext = () => {
    console.log('Next clicked, transitioning to confirm');
    setCurrentStep('confirm');
  };

  const handleBack = () => {
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
            <VolunteerRemoveDetailsModule 
              currItem={currItem} 
              setCurrItem={setCurrItem} 
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
              currItem={currItem} 
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
              setItemExists("");
              setValidQuantity("");
              console.log(currItem);
              setCurrItem({ ...currItem, lastUpdated: new Date() });
              fetch("../api/inventory", {method : 'GET'})
                .then((response) => response.json())
                .then((jsonData) => jsonData.data )
                .then((items) => {
                  const requestedItem = items.find((item : Inventory) => 
                    item.itemName == currItem.itemName && 
                    item.units    == currItem.units
                  );
                  const exists = requestedItem != undefined;

                  if (exists) {
                    if ((requestedItem.quantity >= currItem.quantity) && (currItem.quantity > 0)) {
                      handleNext();
                    } else {
                      setNextDisabled(true);
                      setValidQuantity("Please input a valid number to remove from the inventory");
                    }
                  } else {
                    setItemExists("Item does not exist in inventory");
                  }
                  console.log(items);
                });
              }}
            />
        </div>
      )}
    </div>
  );
};

// Subcomponents

// TODO: THESE ARE DUMMY VALUES
const categoryNames = ['Bakery', 'Dairy', 'Frozen', 'Grocery', 'Meat', 'Produce'];
const itemNames = ['Apples', 'Bananas', 'Bread', 'Butter', 'Carrots', 'Cheese', 'Chicken', 'Eggs', 'Flour', 'Ground Beef', 'Milk', 'Oranges', 'Pasta', 'Pork', 'Potatoes', 'Rice', 'Salmon', 'Spinach', 'Sugar', 'Tomatoes', 'Turkey', 'Yogurt'];
const units = ['lbs', 'g', 'kg', 'oz', 'gallon', 'quart', 'pint'];

interface VolunteerRemoveDetailsModuleProps{
  currItem: Inventory,
  setCurrItem: React.Dispatch<React.SetStateAction<Inventory>>,
  setNextDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  itemExists : string,
  validQuantity : string,
  setItemExists : React.Dispatch<React.SetStateAction<string>>,
  setValidQuantity : React.Dispatch<React.SetStateAction<string>>,
}

const VolunteerRemoveDetailsModule: React.FC<VolunteerRemoveDetailsModuleProps> = ({ currItem, setCurrItem, setNextDisabled, itemExists, validQuantity, setItemExists, setValidQuantity }) => {
  useEffect(() => {
    const { categoryName, itemName, quantity, units } = currItem;
    setNextDisabled(categoryName === '' || itemName === '' || quantity <= 0 || units === '');
  }, [currItem, setNextDisabled]);

  return (
    <div className="flex flex-col h-1/2 w-3/5 justify-center font-crimson justify-self-center">
      <p className="justify-self-center text-[36px] font-bold">What are you removing?</p>
      <div className="font-bold text-[20px] py-4">
        <p className="mb-2">Category Name <span className="text-red">*</span></p>
        <NameDropdown 
          options={categoryNames}
          onChange={(e) => { 
            setItemExists("");
            setCurrItem({ ...currItem, categoryName: e.target.value }); 
          }}
          value={currItem.categoryName}
        />
      </div>
      <div className="font-bold text-[20px]">
        <p className="mb-2">
          Item Name <span className="text-red">*</span>
          <span className='text-[16px] text-red'> {itemExists}</span>
        </p>
        <NameDropdown
          options={itemNames}
          onChange={(e) => { 
            setItemExists("");
            setCurrItem({ ...currItem, itemName: e.target.value }); 
          }}
          value={currItem.itemName}
        />
      </div>
      <div className="flex flex-row w-full justify-between">
        <div className="font-bold text-[20px] pt-6 flex flex-col">
          <p className="mb-2">Quantity <span className="text-red">*</span></p>
          <input
            type="text"
            placeholder=""
            className="input input-bordered input-xs w-full max-w-xs rounded-xl border-light-gray"
            onBlur={(e) => {
              setCurrItem({ ...currItem, quantity: Number(e.target.value) });
              setValidQuantity("");
              setNextDisabled(false);
            }}
            defaultValue={currItem.quantity > 0 ? currItem.quantity : ''}
          />
          <span className='text-[16px] text-red'>{validQuantity}&nbsp;</span>
        </div>
        <div className="font-bold text-[20px] pt-6">
          <p className="mb-2">Units <span className="text-red">*</span></p>
          <NameDropdown 
            options={units}
            onChange={(e) => { setCurrItem({ ...currItem, units: e.target.value }); }}
            value={currItem.units}
          />
        </div>
      </div>
    </div>
  );
};

interface VolunteerRemoveConfirmModuleProps {
  currItem: Inventory
}

const VolunteerRemoveConfirmModule: React.FC<VolunteerRemoveConfirmModuleProps> = ({ currItem }) => {
  return (
    <div>
      <div className="text-black crimson-bold flex text-4xl content-center justify-center text-center">
        This action will:
      </div>
      <div className="text-gray crimson-regular pt-10 flex text-4xl content-center justify-center text-center">
        Remove {currItem.quantity} {currItem.units} of {currItem.itemName}.
      </div>
      <div className="flex pt-[250px] crimson-regular text-2xl justify-center">
      <ButtonSubmit onClick={() => {
          fetch("../api/inventory", {method : 'GET'})
            .then((response) => response.json())
            .then((jsonData) => jsonData.data )
            .then((items) => {
              const requestedItem = items.find((item : Inventory) => 
                item.itemName == currItem.itemName && 
                item.units    == currItem.units
              )
              if (requestedItem.quantity > currItem.quantity) {
                  const newQuantity = requestedItem.quantity - currItem.quantity
                  fetch('../api/inventory', {
                      method : 'PUT',
                      body : JSON.stringify({ ...currItem, quantity : newQuantity})
                  })
              } else if (requestedItem.quantity == currItem.quantity) {
                  fetch('../api/inventory', {
                    method : 'DELETE',
                    body : JSON.stringify({
                      deleteItem : currItem.itemName, 
                      units : currItem.units
                    })
                  })
              }
              console.log(items)
              window.location.href = "../volunteer-saved";
            })
      }}/>
      </div>
    </div>
  );
};

export default VolunteerRemovePages;
