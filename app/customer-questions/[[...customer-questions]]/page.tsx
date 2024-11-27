'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit } from '@app/components/SurveyButtons';
import DemographicsSurveyBanner from '@app/components/DemographicsSurveyBanner';
import PhoneNumberInput from '@app/components/PhoneNumberInput';
import YesOrNo from '@app/components/YesOrNo';
import ProgressBar from '@app/components/ProgressBar';
import { Dropdown } from '@app/components/Dropdowns';

// Phone Number Module
const PhoneNumber: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

    const handlePhoneNumberChange = (newValue: string | undefined) => {
        setPhoneNumber(newValue);
    };

    return (
        <div className="flex flex-col justify-center items-center py-10">
            <div className="flex flex-col items-center w-full max-w-lg">
                <p className="text-[36px] font-bold mb-8">Phone Number</p>
                <PhoneNumberInput value={phoneNumber} onChange={handlePhoneNumberChange} />
            </div>
        </div>
    );
};

// Information Changed Module
const Changes: React.FC<{ onChange: (newValue: string) => void }> = ({onChange}) => {
    const [value, setValue] = useState<string>("");

    const handleYesNoChange = (newValue: string) => {
        setValue(newValue);
        onChange(newValue);
        
    };

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold">Has your information changed?</p>
        <p className="text-[28px] font-bold mb-4">(Name, Address, Household size)</p>
        <YesOrNo onChange={handleYesNoChange} />
      </div>
    </div>
  );
};


// Full Name
const Name: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold mb-4">Full Name</p>
      </div>

      <div>
        <p className="text-[24px] mt-4">First Name</p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          required
        />
      </div>

      <div>
        <p className="text-[24px] mt-4">Last Name</p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          required
        />
      </div>
    </div>
  );
};

// Address
const Address: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
        <div className="flex flex-col items-center w-full">
            <p className="text-[36px] font-bold mb-4">Address</p>
        </div>

        <div className="w-2/3">
            <p className="text-[24px] mt-4">Address Line 1</p>
            <input
            type="text"
            className="bg-gray-50 w-full border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            required
            />
        </div>

        <div className="w-2/3">
            <p className="text-[24px] mt-4">Address Line 2</p>
            <input
            type="text"
            className="bg-gray-50 w-full border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            required
            />
        </div>

        <div className='flex flex-row w-2/3 justify-between gap-2'>
            <div className='flex-1 mr-3'>
            <p className="text-[24px] mt-4">City</p>
            <input
                type="text"
                className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
                required
            />
            </div>
            <div className='flex-1 mr-3'>
            <p className="text-[24px] mt-4">State</p>
            <input
                type="text"
                className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
                required
            />
            </div>
            <div className='flex-1'>
            <p className="text-[24px] mt-4">Zip Code</p>
            <input
                type="text"
                className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
                required
            />
            </div>
        </div>
        </div>
    );
    };


// Household Size
const HouseholdSize: React.FC = () => {
  const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full max-w-lg">
        <p className="text-[36px] font-bold mb-10">Household Size</p>
        {/* Placeholder dropdown */}
        <div className="w-52">
            <Dropdown options={sizes} />
        </div>
      </div>
    </div>
  );
};


// TODO: Confirmation Page
const Confirmation: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full max-w-lg">
        <p className="text-[36px] font-bold mb-4">Confirmation</p>
        <p className="text-[24px] mb-4">TODO: add survey summary here</p>
      </div>
    </div>
  );
};

const DemographicsSurvey: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'phoneNum' | 'changes' | 'name' | 'address' | 'houseSize' | 'confirmation'>('phoneNum');
  const [changesValue, setChangesValue] = useState<string>('');
  const router = useRouter();

  const handleNextClick = () => {
    switch (currentStep) {
      case 'phoneNum':
        setCurrentStep('changes');
        break;
      case 'changes':
        setCurrentStep('name');
        break;
      case 'name':
        setCurrentStep('address');
        break;
      case 'address':
        setCurrentStep('houseSize');
        break;
      case 'houseSize':
        setCurrentStep('confirmation');
        break;
      case 'confirmation':
        console.log('Survey Completed');
        break;
      default:
        break;
    }
  };

  const handleBackClick = () => {
    switch (currentStep) {
      case 'confirmation':
        setCurrentStep('houseSize');
        break;
      case 'houseSize':
        setCurrentStep('address');
        break;
      case 'address':
        setCurrentStep('name');
        break;
      case 'name':
        setCurrentStep('changes');
        break;
      case 'changes':
        setCurrentStep('phoneNum');
        break;
      default:
        break;
    }
  };

  const getProgress = () => {
    switch (currentStep) {
      case 'phoneNum':
        return 16.67;
      case 'changes':
        return 33.33;
      case 'name':
        return 50;
      case 'address':
        return 66.67;
      case 'houseSize':
        return 83.33;
      case 'confirmation':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DemographicsSurveyBanner />
      <div className='flex justify-center items-center py-10'>
        <ProgressBar progress={getProgress()} />
      </div>

      <div className="flex flex-row h-full w-full justify-between px-32">
        <ButtonBack onClick={handleBackClick} />
        <ButtonExit />
      </div>

      <div className='w-full'>
        {currentStep === 'phoneNum' && <PhoneNumber />}
        {currentStep === 'changes' && <Changes onChange={setChangesValue} />}
        {currentStep === 'name' && <Name />}
        {currentStep === 'address' && <Address />}
        {currentStep === 'houseSize' && <HouseholdSize />}
        {currentStep === 'confirmation' && <Confirmation />}
      </div>

      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2'>
        {currentStep === 'confirmation' ? (
          <ButtonSubmit />
        ) : (
          <ButtonNext onClick={handleNextClick} />
        )}
      </div>
    </div>
  );
};

export default DemographicsSurvey;