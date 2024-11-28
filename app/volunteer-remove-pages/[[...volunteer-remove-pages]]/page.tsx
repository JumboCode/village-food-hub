'use client';

import React, { useState } from 'react';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit } from '@app/components/SurveyButtons';
import UpdateInventoryBanner from '@app/components/UpdateInventoryBanner';
import { NameDropdown } from '@app/components/Dropdowns';

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
  const [nextDisabled, setNextDisabled] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <UpdateInventoryBanner />

      {/* Back and Exit buttons */}
      <div className="flex flex-row h-full w-full justify-between px-32 py-10">
        <ButtonBack onClick={handleBack} />
        <ButtonExit />
      </div>

      {/* Page Content */}
      <div className="flex justify-center w-full h-full">
        {currentStep === 'details' && (
          <div className="w-4/5 h-4/5">
            <VolunteerRemoveDetailsModule 
              currItem={currItem} 
              setCurrItem={setCurrItem} 
              setNextDisabled={setNextDisabled}
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
            disabled={ nextDisabled }
            onClick={() => {
              console.log(currItem);
              setCurrItem({ ...currItem, lastUpdated: new Date() })
              fetch("../api/inventory", {method : 'GET'})
                .then((response) => response.json())
                .then((jsonData) => jsonData.data )
                .then((items) => {
                  const requestedItem = items.find((item : Inventory) => 
                    item.itemName == currItem.itemName && 
                    item.units    == currItem.units
                  )
                  const exists = requestedItem != undefined

                  if (exists) {
                    if ((requestedItem.quantity >= currItem.quantity) && (currItem.quantity > 0)) {
                      handleNext();
                    } else {
                      setNextDisabled(true)
                      throw new Error("Can't remove " + currItem.quantity + " " + requestedItem.units + " of " + requestedItem.itemName + ", only " + requestedItem.quantity + " in inventory");
                    }
                  } else {
                    throw new Error('Item with name' + currItem.itemName + ' and units ' + currItem.units + 'does not exist');
                  }
                  console.log(items)
                })
              }}
            />
        </div>
      )}
    </div>
  );
};

// Subcomponents
interface VolunteerRemoveDetailsModuleProps{
  currItem: Inventory,
  setCurrItem: React.Dispatch<React.SetStateAction<Inventory>>,
  setNextDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

const VolunteerRemoveDetailsModule: React.FC<VolunteerRemoveDetailsModuleProps> = ({ currItem,  setCurrItem, setNextDisabled}) => {
  return (
    <div className="flex flex-col h-1/2 w-3/5 justify-center font-crimson justify-self-center">
      <p className="justify-self-center text-[36px] font-bold">What are you removing?</p>
      <div className="font-bold text-[20px] py-4">
        <p className="mb-2">Category Name</p>
        <NameDropdown 
          onChange={(e) => { setCurrItem({ ...currItem, categoryName: e.target.value }); }}
        />
      </div>
      <div className="font-bold text-[20px]">
        <p className="mb-2">Item Name</p>
        <NameDropdown
          onChange={(e) => { setCurrItem({ ...currItem, itemName: e.target.value }); }}
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
              setCurrItem({ ...currItem, quantity: Number(e.target.value) })
              setNextDisabled(false)
            }}
          />
        </div>
        <div className="font-bold text-[20px] pt-6">
          <p className="mb-2">Units</p>
          <NameDropdown onChange={(e) => { setCurrItem({ ...currItem, units: e.target.value }); }}
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
        Remove [quantity] [units] of [itemName].
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
                  let newQuantity = requestedItem.quantity - currItem.quantity
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
            })
      }}/>
      </div>
    </div>
  );
};

export default VolunteerRemovePages;
