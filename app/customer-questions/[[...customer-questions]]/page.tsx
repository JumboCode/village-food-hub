'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit } from '@app/components/SurveyButtons';
import DemographicsSurveyBanner from '@app/components/DemographicsSurveyBanner';
import PhoneNumberInput from '@app/components/PhoneNumberInput';
import YesOrNo from '@app/components/YesOrNo';
import ProgressBar from '@app/components/ProgressBar';
import { NameDropdown } from '@app/components/Dropdowns';

// Phone Number Module
const PhoneNumber: React.FC<{ onChange: (value: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ onChange, setNextDisabled }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handlePhoneNumberChange = (newValue: string) => {
    setPhoneNumber(newValue);
    onChange(newValue);
    if (newValue === "" || newValue === "+1") {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  };

  return (
      <div className="flex flex-col justify-center items-center py-10">
          <div className="flex flex-col items-center w-full max-w-lg">
              <p className="text-[36px] font-bold mb-8">Phone Number <span className="text-red">*</span></p>
              <PhoneNumberInput value={phoneNumber} onChange={handlePhoneNumberChange} />
          </div>
      </div>
  );
};


// Information Changed Module
const Changes: React.FC<{ onChange: (newValue: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({onChange, setNextDisabled}) => {
    const [value, setValue] = useState<string>("");

    const handleYesNoChange = (newValue: string) => {
        setValue(newValue);
        onChange(newValue);
        
    };

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold">Has your information changed? <span className="text-red">*</span></p>
        <p className="text-[28px] font-bold mb-4">(Name, Address, Household size)</p>
        <YesOrNo onChange={handleYesNoChange} setNextDisabled={setNextDisabled} />
      </div>
    </div>
  );
};


// Full Name
const Name: React.FC<{ onFirstNameChange: (value: string) => void, onLastNameChange: (value: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ onFirstNameChange, onLastNameChange, setNextDisabled }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    onFirstNameChange(value);
    setNextDisabled(value === "" || lastName === "");
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    onLastNameChange(value);
    setNextDisabled(firstName === "" || value === "");
  };

  useEffect(() => {
    setNextDisabled(firstName === "" || lastName === "");
  }, [firstName, lastName, setNextDisabled]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold mb-4">Full Name</p>
      </div>

      <div>
        <p className="text-[24px] mt-4">First Name <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          onChange={(e) => handleFirstNameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <p className="text-[24px] mt-4">Last Name <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          onChange={(e) => handleLastNameChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

// Address
const Address: React.FC<{ onAddressLineChange: (value: string) => void, onCityChange: (value: string) => void, onStateChange: (value: string) => void, onZipChange: (value: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ onAddressLineChange, onCityChange, onStateChange, onZipChange, setNextDisabled }) => {
  const [line, setLine] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");

  const handleLineChange = (value: string) => {
    setLine(value);
    onAddressLineChange(value);
    // setNextDisabled(value === "" || city === "" || state === "" || zip === "");
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onCityChange(value);
    // setNextDisabled(line === "" || value === "" || state === "" || zip === "");
  };

  const handleStateChange = (value: string) => {
    setState(value);
    onStateChange(value);
    // setNextDisabled(line === "" || city === "" || value === "" || zip === "");
  };

  const handleZipChange = (value: string) => {
    setZip(value);
    onZipChange(value);
    // setNextDisabled(line === "" || city === "" || state === "" || value === "");
  };

  useEffect(() => {
    setNextDisabled(line === "" || city === "" || state === "" || zip === "");
  }, [line, city, state, zip, setNextDisabled]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold mb-4">Address</p>
      </div>

      <div className="w-2/3">
        <p className="text-[24px] mt-4">Address Line <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 w-full border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          onChange={(e) => handleLineChange(e.target.value)}
          required
        />
      </div>

      <div className='flex flex-row w-2/3 justify-between gap-2'>
        <div className='flex-1 mr-3'>
          <p className="text-[24px] mt-4">City <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => handleCityChange(e.target.value)}
            required
          />
        </div>
        <div className='flex-1 mr-3'>
          <p className="text-[24px] mt-4">State <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => handleStateChange(e.target.value)}
            required
          />
        </div>
        <div className='flex-1'>
          <p className="text-[24px] mt-4">Zip Code <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => handleZipChange(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

// Household Size
const HouseholdSize: React.FC<{ onChange: (value: number) => void, setSubmitDisabled: (disabled: boolean) => void }> = ({ onChange, setSubmitDisabled }) => {
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const sizeValue = value === "" ? null : Number(value);
    onChange(sizeValue);
    setSubmitDisabled(sizeValue === null);
  };

  const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full max-w-lg">
        <p className="text-[36px] font-bold mb-10">Household Size <span className="text-red">*</span></p>
        <div className="w-52">
          <NameDropdown options={sizes} onChange={handleSizeChange} />
        </div>
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
  const [currentStep, setCurrentStep] = useState<'phoneNum' | 'changes' | 'name' | 'address' | 'houseSize' | 'confirmation'>('phoneNum');
  // const [changesValue, setChangesValue] = useState<string>('');
  const router = useRouter();

  const [responses, setResponses] = useState({
    phoneNumber: '',
    changes: '',
    name: { firstName: '', lastName: '' },
    address: { line1: '', line2: '', city: '', state: '', zip: '' },
    householdSize: 0,
  });

  const [nextDisabled, setNextDisabled] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);

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
    if (nextDisabled) return;

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

  const handleSubmit = () => {
    console.log('Survey Responses:', responses);
    setCurrentStep('confirmation')
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
        {currentStep === 'phoneNum' && <PhoneNumber onChange={updatePhoneNumber} setNextDisabled={setNextDisabled} />}
        {currentStep === 'changes' && <Changes onChange={updateChanges} setNextDisabled={setNextDisabled} />}
        {currentStep === 'name' && <Name onFirstNameChange={(value) => updateName('firstName', value)}
                                          onLastNameChange={(value) => updateName('lastName', value)} 
                                          setNextDisabled={setNextDisabled} />}
        {currentStep === 'address' && <Address onAddressLineChange={(value) => updateAddress('line1', value)}
                                                onCityChange={(value) => updateAddress('city', value)}
                                                onStateChange={(value) => updateAddress('state', value)}
                                                onZipChange={(value) => updateAddress('zip', value)} 
                                                setNextDisabled={setNextDisabled} />}
        {currentStep === 'houseSize' && <HouseholdSize onChange={updateHouseholdSize} 
                                                       setSubmitDisabled={setSubmitDisabled} />}
        {currentStep === 'confirmation' && <Confirmation />}
      </div>

      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2'>
        {(() => {
          if (currentStep === 'houseSize') {
            return <ButtonSubmit onClick={handleSubmit} disabled={submitDisabled} />;
          } else if (currentStep === 'confirmation') {
            return <button className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]">
                      { "OK" }
                    </button>
          } else {
            return <ButtonNext onClick={handleNextClick} onClick={handleNextClick} disabled={nextDisabled} />;
          }
        })()}
      </div>
    </div>
  );
};

export default DemographicsSurvey;