'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit, NoDone, YesProceed } from '@app/components/SurveyButtons';
import DemographicsSurveyBanner from '@app/components/DemographicsSurveyBanner';
import PhoneNumberInput from '@app/components/PhoneNumberInput';
import YesOrNo from '@app/components/YesOrNo';
import ProgressBar from '@app/components/ProgressBar';
import { NameDropdown } from '@app/components/Dropdowns';

const CustomerAction: React.FC<{ onChange: (receiveValue: boolean, donateValue: boolean) => void, setNextDisabled: (disabled: boolean) => void, receive: boolean, donate: boolean }> = ({ onChange, setNextDisabled, receive, donate }) => {
  const handleReceive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isRChecked = e.target.checked;
    onChange(isRChecked, donate);
  };

  const handleDonate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDChecked = e.target.checked;
    onChange(receive, isDChecked);
  };

  useEffect(() => {
    setNextDisabled(!receive && !donate);
  }, [receive, donate, setNextDisabled]);

  return (
    <div>
      <div className="flex justify-center pt-[60px] text-black font-crimson crimson-bold text-4xl">
        Select all the actions you plan to do today. <span className="text-red">*</span>
      </div>
      <div className="flex pt-[40px] text-black font-crimson crimson-bold text-4xl justify-center">
        <div>
          <div className="flex space-x-5">
            <div className="flex items-center mb-4">
              <input 
                id="default-checkbox" 
                type="checkbox" 
                className="w-8 h-8 bg-[#bdbdbd] border-[#bdbdbd] rounded checked:bg-banner-green text-3xl"
                checked={receive}
                onChange={handleReceive}
              />
            </div>
            <div> Receive </div>
          </div>
          <div className="flex space-x-5">
            <div className="flex items-center mb-4">
              <input 
                id="default-checkbox" 
                type="checkbox" 
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
  );
};

// Phone Number Module
const PhoneNumber: React.FC<{ value: string, onChange: (value: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ value, onChange, setNextDisabled }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(value);

  const handlePhoneNumberChange = (newValue: string | undefined) => {
    const value = newValue || "";
    setPhoneNumber(value);
    onChange(value);
  };

  useEffect(() => {
    // Remove any country code prefix (e.g., +1, +44, etc.)
    const phoneNumberWithoutCountryCode = phoneNumber.replace(/^\+\d+/, '');
    setNextDisabled(phoneNumberWithoutCountryCode === "");
  }, [phoneNumber, setNextDisabled]);

  return (
    <div className="flex flex-col justify-center items-center py-10">
        <div className="flex flex-col items-center w-full max-w-lg font-crimson">
            <p className="text-[36px] font-bold mb-8">Phone Number <span className="text-red">*</span></p>
            <PhoneNumberInput value={phoneNumber} onChange={handlePhoneNumberChange} />
        </div>
    </div>
  );
};

// Information Changed Module
const Changes: React.FC<{ value: string, onChange: (newValue: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ value, onChange, setNextDisabled }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);

  const handleYesNoChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    setNextDisabled(selectedValue === "");
  }, [selectedValue, setNextDisabled]);

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full font-crimson">
        <p className="text-[36px] font-bold">Has your information changed? <span className="text-red">*</span></p>
        <p className="text-[28px] font-bold mb-4">(Name, Address, Household size)</p>
        <YesOrNo value={selectedValue} onChange={handleYesNoChange} setNextDisabled={setNextDisabled} />
      </div>
    </div>
  );
};

// Full Name
const Name: React.FC<{ firstName: string, lastName: string, onFirstNameChange: (value: string) => void, onLastNameChange: (value: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ firstName, lastName, onFirstNameChange, onLastNameChange, setNextDisabled }) => {
  const [firstNameState, setFirstNameState] = useState<string>(firstName);
  const [lastNameState, setLastNameState] = useState<string>(lastName);

  const handleFirstNameChange = (value: string) => {
    setFirstNameState(value);
    onFirstNameChange(value);
  };

  const handleLastNameChange = (value: string) => {
    setLastNameState(value);
    onLastNameChange(value);
  };

  useEffect(() => {
    setNextDisabled(firstNameState === "" || lastNameState === "");
  }, [firstNameState, lastNameState, setNextDisabled]);

  return (
    <div className="flex flex-col items-center font-crimson">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold mb-4">Full Name</p>
      </div>

      <div>
        <p className="text-[24px] mt-4">First Name <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          onChange={(e) => handleFirstNameChange(e.target.value)}
          value={firstNameState}
          required
        />
      </div>

      <div>
        <p className="text-[24px] mt-4">Last Name <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          onChange={(e) => handleLastNameChange(e.target.value)}
          value={lastNameState}
          required
        />
      </div>
    </div>
  );
};

// Address
const Address: React.FC<{ line1: string, line2: string, city: string, state: string, zip: string, onAddressLineChange: (value: string) => void, onCityChange: (value: string) => void, onStateChange: (value: string) => void, onZipChange: (value: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ line1, line2, city, state, zip, onAddressLineChange, onCityChange, onStateChange, onZipChange, setNextDisabled }) => {
  const [line, setLine] = useState<string>(line1);
  const [cityState, setCityState] = useState<string>(city);
  const [stateState, setStateState] = useState<string>(state);
  const [zipState, setZipState] = useState<string>(zip);

  const handleLineChange = (value: string) => {
    setLine(value);
    onAddressLineChange(value);
  };

  const handleCityChange = (value: string) => {
    setCityState(value);
    onCityChange(value);
  };

  const handleStateChange = (value: string) => {
    setStateState(value);
    onStateChange(value);
  };

  const handleZipChange = (value: string) => {
    setZipState(value);
    onZipChange(value);
  };

  useEffect(() => {
    setNextDisabled(line === "" || cityState === "" || stateState === "" || zipState === "");
  }, [line, cityState, stateState, zipState, setNextDisabled]);

  return (
    <div className="flex flex-col items-center font-crimson">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold mb-4">Address</p>
      </div>

      <div className="w-2/3">
        <p className="text-[24px] mt-4">Address Line <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 w-full border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          onChange={(e) => handleLineChange(e.target.value)}
          value={line}
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
            value={cityState}
            required
          />
        </div>
        <div className='flex-1 mr-3'>
          <p className="text-[24px] mt-4">State <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => handleStateChange(e.target.value)}
            value={stateState}
            required
          />
        </div>
        <div className='flex-1'>
          <p className="text-[24px] mt-4">Zip Code <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => handleZipChange(e.target.value)}
            value={zipState}
            required
          />
        </div>
      </div>
    </div>
  );
};

// Household Size
const HouseholdSize: React.FC<{ onChange: (value: number | null) => void, setSubmitDisabled: (disabled: boolean) => void }> = ({ onChange, setSubmitDisabled }) => {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const sizeValue = value === "" ? null : Number(value);
    setSelectedSize(value);
    onChange(sizeValue);
    setSubmitDisabled(sizeValue === null);
  };

  const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full max-w-lg font-crimson">
        <p className="text-[36px] font-bold mb-10">Household Size <span className="text-red">*</span></p>
        <div className="w-52">
          <NameDropdown options={sizes} onChange={handleSizeChange} value={selectedSize} />
        </div>
      </div>
    </div>
  );
};

const CustomerDonor: React.FC<{ onChange: (value: boolean) => void }> = ({ onChange }) => {
  return (
      <div className="font-crimson">
        {/* Central text */}
        <div className="text-black crimson-bold flex pt-[80px] text-4xl content-center justify-center text-center">
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

  // For routing
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
  
  // For disabling empty inputs
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
  
  const updateHouseholdSize = (value: number | null) => {
    setResponses((prev) => ({ ...prev, householdSize: value ?? 0 }));
  };

  const handleNextClick = () => {
    if (nextDisabled) return;

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
      {/* Banner */}
      <DemographicsSurveyBanner />

      {/* Progress Bar */}
      <div className="flex py-10 pl-[100px] pr-[100px] items-center">
          <div></div>
          <ProgressBar progress={getProgress()}/>   
          <div className="pl-5 text-2xl">
            {`${getProgress().toFixed(0)}%`}
          </div>
      </div>

      {/* Back and Exit Buttons */}
      <div className="flex flex-row h-full w-full justify-between px-32">
        <ButtonBack onClick={handleBackClick} />
        <ButtonExit />
      </div>

      {/* Modules */}
      <div className='w-full'>
        {currentStep === 'action'   && <CustomerAction onChange={updateAction} setNextDisabled={setNextDisabled} receive={responses.receive} donate={responses.donate} />}
        {currentStep === 'donor'    && <CustomerDonor onChange={redirectDonor}/>}
        {currentStep === 'phoneNum' && <PhoneNumber value={responses.phoneNumber} onChange={updatePhoneNumber} setNextDisabled={setNextDisabled} />}
        {currentStep === 'changes' && <Changes value={responses.changes} onChange={updateChanges} setNextDisabled={setNextDisabled} />}
        {currentStep === 'name' && <Name firstName={responses.name.firstName} lastName={responses.name.lastName} onFirstNameChange={(value) => updateName('firstName', value)}
                                          onLastNameChange={(value) => updateName('lastName', value)} 
                                          setNextDisabled={setNextDisabled} />}
        {currentStep === 'address' && <Address line1={responses.address.line1} line2={responses.address.line2} city={responses.address.city} state={responses.address.state} zip={responses.address.zip}
                                                onAddressLineChange={(value) => updateAddress('line1', value)}
                                                onCityChange={(value) => updateAddress('city', value)}
                                                onStateChange={(value) => updateAddress('state', value)}
                                                onZipChange={(value) => updateAddress('zip', value)} 
                                                setNextDisabled={setNextDisabled} />}
        {currentStep === 'houseSize' && <HouseholdSize value={responses.householdSize} onChange={updateHouseholdSize} 
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
          } else if (currentStep !== 'donor') {
            return <ButtonNext onClick={handleNextClick} disabled={nextDisabled} />;
          }
        })()}
      </div>
    </div>
  );
};

export default DemographicsSurvey;