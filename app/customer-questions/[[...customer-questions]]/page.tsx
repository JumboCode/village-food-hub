'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit, NoDone, YesProceed } from '@app/components/SurveyButtons';
import DemographicsSurveyBanner from '@app/components/DemographicsSurveyBanner';
import PhoneNumberInput from '@app/components/PhoneNumberInput';
import YesOrNo from '@app/components/YesOrNo';
import ProgressBar from '@app/components/ProgressBar';
import { NameDropdown } from '@app/components/Dropdowns';

const CustomerAction: React.FC<{ onChange: (receiveValue: boolean, donateValue: boolean) => void }> = ({ onChange }) => {
  const [receive, setReceive] = useState(false);
  const [donate, setDonate] = useState(false);

  const handleReceive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isRChecked = e.target.checked;
    setReceive(isRChecked);
    onChange(isRChecked, donate);
  };

  const handleDonate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDChecked = e.target.checked;
    setDonate(isDChecked);
    onChange(receive, isDChecked);
  };

  return (
      <div>
          <div>
              {/* Text */}
              <div className="flex justify-center pt-[60px] text-black crimson-bold text-4xl">
                  Select all the actions you plan to do today.
              </div>

              {/* Checkboxes */}
              <div className="flex pt-[40px] text-black crimson-bold text-4xl justify-center">
                  <div>
                      {/* Receive */}
                      <div className="flex space-x-5">
                          <div className="flex items-center mb-4">
                              <input 
                                  id="default-checkbox" 
                                  type="checkbox" 
                                  value="" 
                                  className="w-8 h-8 bg-[#bdbdbd] border-[#bdbdbd] rounded checked:bg-banner-green text-3xl"
                                  checked={receive}
                                  onChange={handleReceive}
                              />
                          </div>
                          <div> Receive </div>
                      </div>
                      
                      {/* Donate */}
                      <div className="flex space-x-5">
                          <div className="flex items-center mb-4">
                              <input 
                                  id="default-checkbox" 
                                  type="checkbox" 
                                  value="" 
                                  className="w-8 h-8 bg-[#bdbdbd] border-[#bdbdbd] rounded checked:bg-banner-green text-3xl"
                                  checked={donate}
                                  onChange={handleDonate}
                              />
                          </div>
                          <div> Donate </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

// Phone Number Module
const PhoneNumber: React.FC<{ onChange: (value: string) => void }> = ({ onChange }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handlePhoneNumberChange = (newValue: string) => {
      setPhoneNumber(newValue);
      onChange(newValue);
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
const Name: React.FC<{
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}> = ({ onFirstNameChange, onLastNameChange }) => {
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
          onChange={(e) => onFirstNameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <p className="text-[24px] mt-4">Last Name</p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          onChange={(e) => onLastNameChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

// Address
const Address: React.FC<{
  onLine1Change: (value: string) => void;
  onLine2Change: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onZipChange: (value: string) => void;
}> = ({ onLine1Change, onLine2Change, onCityChange, onStateChange, onZipChange }) => {
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
              onChange={(e) => onLine1Change(e.target.value)}
              required
            />
        </div>

        <div className="w-2/3">
            <p className="text-[24px] mt-4">Address Line 2</p>
            <input
              type="text"
              className="bg-gray-50 w-full border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              onChange={(e) => onLine2Change(e.target.value)}
            />
        </div>

        <div className='flex flex-row w-2/3 justify-between gap-2'>
            <div className='flex-1 mr-3'>
            <p className="text-[24px] mt-4">City</p>
            <input
                type="text"
                className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
                onChange={(e) => onCityChange(e.target.value)}
                required
            />
            </div>
            <div className='flex-1 mr-3'>
            <p className="text-[24px] mt-4">State</p>
            <input
                type="text"
                className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
                onChange={(e) => onStateChange(e.target.value)}
                required
            />
            </div>
            <div className='flex-1'>
            <p className="text-[24px] mt-4">Zip Code</p>
            <input
                type="text"
                className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
                onChange={(e) => onZipChange(e.target.value)}
                required
            />
            </div>
        </div>
        </div>
    );
};



// Household Size
const HouseholdSize: React.FC<{ onChange: (value: number) => void }> = ({ onChange }) => {
  const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full max-w-lg">
        <p className="text-[36px] font-bold mb-10">Household Size</p>
        <div className="w-52">
          <NameDropdown options={sizes} onChange={(value) => onChange(Number(value))} />
        </div>
      </div>
    </div>
  );
};

const CustomerDonor: React.FC<{ onChange: (value: boolean) => void }> = ({ onChange }) => {
  return (
      <div>
        {/* Central text */}
        <div className="text-black crimson-bold flex pt-40 text-4xl content-center justify-center text-center">
            We have a demographic survey that is optional. 
        </div>
        <div className="text-black crimson-bold flex pt-5 text-4xl content-center justify-center text-center">
            Would you like to fill it out?
        </div>
        {/* Next Button */}
        <div className="flex pt-[100px] crimson-regular text-2xl content-center justify-center space-x-20">
            <YesProceed onClick={() => onChange(true)}/>
            <NoDone onClick={() => onChange(false)}/>
        </div>
      </div>
  );
};

// TODO: Confirmation Page
const Confirmation = () => {
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
  const [currentStep, setCurrentStep] = useState<'action' | 'donor' | 'phoneNum' | 'changes' | 'name' | 'address' | 'houseSize' | 'confirmation'>('action');
  const router = useRouter();

  const [responses, setResponses] = useState({
    receive: false,
    donate: false,
    phoneNumber: '',
    changes: '',
    name: { firstName: '', lastName: '' },
    address: { line1: '', line2: '', city: '', state: '', zip: '' },
    householdSize: 0,
  });

  const [receive, setReceive] = useState(false);
  const [donate, setDonate] = useState(false);

  const updateAction = (receiveValue: boolean, donateValue: boolean) => {
    setResponses((prev) => ({ ...prev, receive: receiveValue, donate: donateValue}));
    setReceive(receiveValue);
    setDonate(donateValue);
  };

  const redirectDonor = (fillSurvey: boolean) => {
    if (fillSurvey) {
      setCurrentStep('phoneNum');
    } else {
      router.push('/unsaved-thank-you');
    }
  };

  const updatePhoneNumber = (value: string) => {
    setResponses((prev) => ({ ...prev, phoneNumber: value }));
  };
  
  const updateChanges = (value: string) => {
    setResponses((prev) => ({ ...prev, changes: value }));
  };
  
  const updateName = (field: 'firstName' | 'lastName', value: string) => {
    setResponses((prev) => ({
      ...prev,
      name: { ...prev.name, [field]: value },
    }));
  };
  
  const updateAddress = (field: 'line1' | 'line2' | 'city' | 'state' | 'zip', value: string) => {
    setResponses((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };
  
  const updateHouseholdSize = (value: number) => {
    setResponses((prev) => ({ ...prev, householdSize: value }));
  };
  

  const handleNextClick = () => {
    switch (currentStep) {
      case 'action':
        if (!responses.receive) {
          setCurrentStep('donor');
        } else {
          setCurrentStep('phoneNum');
        }
        break;
      case 'phoneNum':
        setCurrentStep('changes');
        break;
      case 'changes':
        if (responses.changes == "yes") {
          setCurrentStep('name');
        } else {
          router.push('/saved-thank-you');
        }
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
      case 'action':
        router.push('/welcome-page');
        break;
      case 'donor':
        console
        setCurrentStep('action');
        break;
      case 'phoneNum':
        if (!responses.receive) {
          setCurrentStep('donor');
        } else {
          setCurrentStep('action');
        }
        break;
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

  const handleSubmit = () => {
    console.log('Survey Responses:', responses);
    router.push('/saved-thank-you');
  };

  const getProgress = () => {
    switch (currentStep) {
      case 'action':
        return 0;
      case 'donor':
        return 10;
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
        {currentStep === 'action'   && <CustomerAction onChange={updateAction} />}
        {currentStep === 'donor'    && <CustomerDonor onChange={redirectDonor}/>}
        {currentStep === 'phoneNum' && <PhoneNumber onChange={updatePhoneNumber} />}
        {currentStep === 'changes' && <Changes onChange={updateChanges} />}
        {currentStep === 'name' && <Name onFirstNameChange={(value) => updateName('firstName', value)}
                                          onLastNameChange={(value) => updateName('lastName', value)} />}
        {currentStep === 'address' && <Address onLine1Change={(value) => updateAddress('line1', value)}
                                                onLine2Change={(value) => updateAddress('line2', value)}
                                                onCityChange={(value) => updateAddress('city', value)}
                                                onStateChange={(value) => updateAddress('state', value)}
                                                onZipChange={(value) => updateAddress('zip', value)} />}
        {currentStep === 'houseSize' && <HouseholdSize onChange={updateHouseholdSize} />}
        {currentStep === 'confirmation' && <Confirmation />}
      </div>

      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2'>
        {(() => {
          if (currentStep === 'houseSize') {
            return <ButtonSubmit onClick={handleSubmit} />;
          } else if (currentStep === 'confirmation') {
            return <button className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]">
                      { "OK" }
                    </button>
          } else if (currentStep !== 'donor') {
            return <ButtonNext onClick={handleNextClick} />;
          }
        })()}
      </div>
    </div>
  );
};

export default DemographicsSurvey;