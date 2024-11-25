'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit } from '@app/components/SurveyButtons';
import DemographicsSurveyBanner from '@app/components/DemographicsSurveyBanner';
import PhoneNumberInput from '@app/components/PhoneNumberInput';
import YesOrNo from '@app/components/YesOrNo';
import ProgressBar from '@app/components/ProgressBar';
import SavedThankYou from '@app/saved-thank-you/[[...saved-thank-you]]/page';
import { NameDropdown } from '@app/components/Dropdowns';

// Phone Number Module
const PhoneNumber: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-10">
        <div className="flex flex-col items-center w-full max-w-lg">
            <p className="text-[40px] font-bold mb-4">Phone Number</p>
            <PhoneNumberInput />
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
                <p className="text-[40px] font-bold">Has your information changed?</p>
                <p className="text-[32px] font-bold mb-4">(Name, Address, Household size)</p>
                <YesOrNo onChange={handleYesNoChange} />
            </div>
        </div>
    );
  };

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
                    className="bg-gray-50 border border-gray-300 text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
                    required
                />
            </div>

            <div>
            <p className="text-[24px] mt-4">Last Name</p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
                    required
                />
            </div>

        </div>
    );
};

const Address: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center w-full">
                <p className="text-[36px] font-bold mb-4">Address</p>
            </div>

            <div>
            <p className="text-[24px] mt-4">Address Line 1</p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
                    required
                />
            </div>

            <div>
            <p className="text-[24px] mt-4">Address Line 2</p>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
                    required
                />
            </div>

            <div className='flex flex-row justify-between gap-2'>
                <div className='mr-3'>
                    <p className="text-[24px] mt-4">City</p>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-32"
                        required
                    />
                </div>
                <div className='mr-3'>
                    <p className="text-[24px] mt-4">State</p>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-32"
                        required
                    />
                </div>
                <div>
                    <p className="text-[24px] mt-4">Zip Code</p>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-20"
                        required
                    />
                </div>
            </div>

    </div>
    );
};

const HouseholdSize: React.FC = () => {
    const sizes = ['1', '2,', '3', '4', '5', '6', '7', '8', '9', '10+']
    return (
      <div className="flex flex-col justify-center items-center py-10">
        <div className="flex flex-col items-center w-full max-w-lg">
          <p className="text-[40px] font-bold mb-10">Household Size</p>
          {/* Placeholder dropdown */}
          <NameDropdown options={sizes} />
        </div>
      </div>
    );
  };
  

const DemographicsSurvey: React.FC = () => {

    const [currentStep, setCurrentStep] = useState<'phoneNum' | 'changes' | 'name' | 'address' | 'houseSize'>('phoneNum');
    const [changesValue, setChangesValue] = useState<string>('');
    const router = useRouter();



    const handleNextClick = () => {
        switch (currentStep) {
            case 'phoneNum':
                setCurrentStep('changes');
                break;
            case 'changes':
                // setCurrentStep('name');
                if (changesValue == "yes") {
                    setCurrentStep('name')
                } else {
                    // setCurrentStep('name')
                    router.push('/saved-thank-you')
                }
                break;
            case 'name':
                setCurrentStep('address');
                break;
            case 'address':
                setCurrentStep('houseSize');
                break;
            case 'houseSize':
                console.log('Survey Completed');
                break;
            default:
                break;
        }
    };
    
    // Switch back state
    const handleBackClick = () => {
        switch (currentStep) {
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

    // quantities for progress bar
    const getProgress = () => {
        switch (currentStep) {
            case 'phoneNum':
                return 20; 
            case 'changes':
                return 40;
            case 'name':
                return 60;
            case 'address':
                return 80; 
            case 'houseSize':
                return 100; 
            default:
                return 0;
        }
    };
    
      return (

        // banner constant for all pages
        <div className="min-h-screen bg-gray-100 flex flex-col">
        <DemographicsSurveyBanner />
        <div className='flex justify-center items-center py-10'>
            <ProgressBar progress={getProgress()} />
        </div>
      
        <div className="flex flex-row h-full w-full justify-between px-32 py-10">
            <ButtonBack onClick={handleBackClick}/>
            <ButtonExit />
        </div>

        {/* switch modules */}
        <div className=' w-full'>
            {currentStep === 'phoneNum' && <PhoneNumber />}
            {currentStep === 'changes' && <Changes onChange={setChangesValue} />}
            {currentStep === 'name' && <Name />}
            {currentStep === 'address' && <Address />}
            {currentStep === 'houseSize' && <HouseholdSize />}
        </div>

        <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2'>
            <ButtonNext onClick={handleNextClick}/>
        </div>

    </div>
      );
}


export default DemographicsSurvey;



