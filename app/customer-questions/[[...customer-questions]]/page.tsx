'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonExit, ButtonBack, ButtonNext, ButtonSubmit, NoDone, YesProceed } from '@app/components/SurveyButtons';
import DemographicsSurveyBanner from '@app/components/DemographicsSurveyBanner';
import PhoneNumberInput from '@app/components/PhoneNumberInput';
import YesOrNo from '@app/components/YesOrNo';
import ProgressBar from '@app/components/ProgressBar';
import Image from 'next/image';
import logo from '@app/images/Logo 300x263.png';
import arrow from '@app/images/arrow.png';
import ExitModal from '@app/components/ExitModal';
import TimeoutModal from '@app/components/TimeoutModal';
import ErrorModal from '@app/components/ErrorModal';
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength
} from 'libphonenumber-js';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import {  
  GeoapifyGeocoderAutocomplete,
   GeoapifyContext 
} from '@geoapify/react-geocoder-autocomplete';
import LoadingAnimation from '@app/components/LoadingAnimation';

const DEFAULT_TRANSLATIONS = {
  customerActions: ["Select all the actions you plan to do today. ", " Receive ", " Donate "],
  phoneNumber: ["Phone Number"],
  changes: ["Has your information changed? ", "Name:", "Address:",  "Household size:"],
  name: ["Full Name", "First Name", "Last Name"],
  address: ["Address", "Address Line", "City", "State", "Zip Code", "Enter address here"],
  householdSize: ["Household Size"],
  customerDonor: ["We have a demographic survey that is optional.", "Would you like to fill it out?"],
  confirmation: ["Household size:", "THANK YOU FOR VISITING!", "Village Food Hub will be able to grow with your help!", "Your Information", "Full Name:", "Phone Number:", "Address:", "Return home"],
  exitModal: ["Warning!", "Your changes will not be saved."],
  timeoutModal: ["Click to remain on survey", "Stay", "Leave", " seconds left..."],
  errorMessage: ["Phone Number is Not Valid"],
};

interface Details {
  name: string;
  address: string;
  householdSize: number;
}

// -------------------- CustomerAction --------------------
const CustomerAction: React.FC<{ 
  onChange: (receiveValue: boolean, donateValue: boolean) => void; 
  setNextDisabled: (disabled: boolean) => void; 
  receive: boolean; 
  donate: boolean; 
  translations: string[];
  timeoutTranslations: string[];
  showText: boolean;
}> = ({ onChange, setNextDisabled, receive, donate, translations, timeoutTranslations, showText }) => {

  const handleReceive = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked, donate);
  };

  const handleDonate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(receive, e.target.checked);
  };

  useEffect(() => {
    setNextDisabled(!receive && !donate);
  }, [receive, donate, setNextDisabled]);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timer, setTimer] = useState(15);

  const handleCloseModal = () => {
    setShowTimeoutModal(false);
    window.preventNavigation = false;
    setTimer(15); // Optionally reset the timer
  };

  // sets up 15 second timer on open
  useEffect(() => {
  
    // sets up interval to decrement timer
    setInterval(() => {
      setTimer(prev => {
        if (prev === 1) { setShowTimeoutModal(true); }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // tracks when a click occurs
  const handleClick = useCallback(() => {
    setTimer(15);
  }, []);

  // after a click occurs
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => { 
      document.removeEventListener("click", handleClick); 
    };
  }, [handleClick]);

  return (
    <div>
      {/* only shows when translations are done */}
      {showText
      ?
      <>
        <div className="flex justify-center pt-[60px] text-black font-crimson crimson-bold text-4xl">
          {translations[0]}<span className="text-red">*</span>
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
              <div>{translations[1]}</div>
            </div>
            <div className="flex space-x-5 onClick={() => setTimer(15)}">
              <div className="flex items-center mb-4">
                <input 
                  id="default-checkbox" 
                  type="checkbox" 
                  className="w-8 h-8 bg-[#bdbdbd] border-[#bdbdbd] rounded checked:bg-banner-green text-3xl"
                  checked={donate}
                  onChange={handleDonate}
                />
              </div>
              <div>{translations[2]}</div>
            </div>
          </div>
        </div>
      </>
      :
        <LoadingAnimation/>
      }

      {/* timeout modal after 15 seconds of inactivity */}
      {showTimeoutModal &&
        <TimeoutModal
          closeTimeoutModal={handleCloseModal}
          translations={timeoutTranslations}
        />
      }
    </div>
  );
};

// -------------------- PhoneNumber --------------------
const PhoneNumber: React.FC<{ 
  value: string; 
  onChange: (value: string) => void; 
  setNextDisabled: (disabled: boolean) => void; 
  translations: string[];
  timeoutTranslations: string[];
}> = ({ value, onChange, setNextDisabled, translations, timeoutTranslations }) => {

  const [phoneNumber, setPhoneNumber] = useState<string>(value);
 
  const handlePhoneNumberChange = (newValue: string | undefined) => {
    const val = newValue || "";
    // if (!isValidPhoneNumber(phoneNumber)) {
    //   setShowErrorModal(true);
    //   return;
    // }
    setPhoneNumber(val);
    onChange(val);
  };

  useEffect(() => {
    const phoneNumberWithoutCountryCode = phoneNumber.replace(/^\+\d+/, '');
    setNextDisabled(phoneNumberWithoutCountryCode === "");
  
  }, [phoneNumber, setNextDisabled]);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timer, setTimer] = useState(15);

  const handleCloseModal = () => {
    setShowTimeoutModal(false);
    window.preventNavigation = false;
    setTimer(15); // Optionally reset the timer
  };

  // sets up 15 second timer on open
  useEffect(() => {
  
    // sets up interval to decrement timer
    setInterval(() => {
      setTimer(prev => {
        if (prev === 1) { setShowTimeoutModal(true); }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // tracks when a click occurs
  const handleClick = useCallback(() => {
    setTimer(15);
  }, []);

  // after a click occurs
  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleClick);
    return () => { 
      document.removeEventListener("click", handleClick); 
      document.removeEventListener("keydown", handleClick); 
    };
  }, [handleClick]);

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full max-w-lg font-crimson">
        <p className="text-[36px] font-bold mb-8">{translations[0]} <span className="text-red">*</span></p>
        <PhoneNumberInput value={phoneNumber} onChange={handlePhoneNumberChange} />
        {/* {showErrorModal && <ErrorModal errorMsg='Phone Number is Invalid' closeModal={closeErrorModal}/>} */}
      </div>

      {/* timeout modal after 15 seconds of inactivity */}
      {showTimeoutModal &&
        <TimeoutModal
          closeTimeoutModal={handleCloseModal}
          translations={timeoutTranslations}
        />
      }
    </div>
  );
};

// -------------------- Changes --------------------
interface ChangesProps {
  value: string;
  onChange: (newValue: string) => void;
  setNextDisabled: (disabled: boolean) => void;
  details: Details;
  translations: string[];
  timeoutTranslations: string[];
}
const Changes: React.FC<ChangesProps> = ({ value, onChange, setNextDisabled, details, translations, timeoutTranslations }) => {

  const [selectedValue, setSelectedValue] = useState<string>(value);

  const handleYesNoChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    setNextDisabled(selectedValue === "");
  }, [selectedValue, setNextDisabled]);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timer, setTimer] = useState(15);

  const handleCloseModal = () => {
    setShowTimeoutModal(false);
    window.preventNavigation = false;
    setTimer(15); // Optionally reset the timer
  };

  // sets up 15 second timer on open
  useEffect(() => {
  
    // sets up interval to decrement timer
    setInterval(() => {
      setTimer(prev => {
        if (prev === 1) { setShowTimeoutModal(true); }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // tracks when a click occurs
  const handleClick = useCallback(() => {
    setTimer(15);
  }, []);

  // after a click occurs
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => { 
      document.removeEventListener("click", handleClick); 
    };
  }, [handleClick]);

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full font-crimson">
        <p className="text-[36px] font-bold">{translations[0]} <span className="text-red">*</span></p>
        <div className="text-[20px] font-bold mb-4">
          <p>{translations[1]} <span className="font-normal">{details.name}</span></p>
          <p>{translations[2]} <span className="font-normal">{details.address}</span></p>
          <p>{translations[3]} <span className="font-normal">{details.householdSize === 11 ? "10+" : details.householdSize}</span></p>
        </div>

        <YesOrNo value={selectedValue} onChange={handleYesNoChange} setNextDisabled={setNextDisabled} />
      </div>

      {/* timeout modal after 15 seconds of inactivity */}
      {showTimeoutModal &&
        <TimeoutModal
          closeTimeoutModal={handleCloseModal}
          translations={timeoutTranslations}
        />
      }
    </div>
  );
};

// -------------------- Name --------------------
interface NameProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  setNextDisabled: (disabled: boolean) => void;
  translations: string[];
  timeoutTranslations: string[];
}
const Name: React.FC<NameProps> = ({ firstName, lastName, onFirstNameChange, onLastNameChange, setNextDisabled, translations, timeoutTranslations }) => {

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

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timer, setTimer] = useState(15);

  const handleCloseModal = () => {
    setShowTimeoutModal(false);
    window.preventNavigation = false;
    setTimer(15); // Optionally reset the timer
  };

  // sets up 15 second timer on open
  useEffect(() => {
  
    // sets up interval to decrement timer
    setInterval(() => {
      setTimer(prev => {
        if (prev === 1) { setShowTimeoutModal(true); }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // tracks when a click occurs
  const handleClick = useCallback(() => {
    setTimer(15);
  }, []);

  // after a click occurs
  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleClick);
    return () => { 
      document.removeEventListener("click", handleClick); 
      document.removeEventListener("keydown", handleClick); 
    };
  }, [handleClick]);

  return (
    <div className="flex flex-col items-center font-crimson">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold mb-4">{translations[0]}</p>
      </div>
      <div>
        <p className="text-[24px] mt-4">{translations[1]} <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          onChange={(e) => handleFirstNameChange(e.target.value)}
          value={firstNameState}
          required
        />
      </div>
      <div>
        <p className="text-[24px] mt-4">{translations[2]} <span className="text-red">*</span></p>
        <input
          type="text"
          className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-96"
          onChange={(e) => handleLastNameChange(e.target.value)}
          value={lastNameState}
          required
        />
      </div>

      {/* timeout modal after 15 seconds of inactivity */}
      {showTimeoutModal &&
        <TimeoutModal
          closeTimeoutModal={handleCloseModal}
          translations={timeoutTranslations}
        />
      }
    </div>
  );
};

// -------------------- Address --------------------
interface AddressProps {
  line1: string;
  onAddressLineChange: (value: string) => void;
  setNextDisabled: (disabled: boolean) => void;
  translations: string[];
  timeoutTranslations: string[];
}
const Address: React.FC<AddressProps> = ({ line1, onAddressLineChange, setNextDisabled, translations, timeoutTranslations }) => {

  const [line, setLine] = useState<string>(line1);

  const handleLineChange = (value: string) => {
    console.log(value)
    setLine(value);
    onAddressLineChange(value);
    setNextDisabled(false);

  };

  const [cityState, setCityState] = useState<string>("");
  const [stateState, setStateState] = useState<string>("");
  const [zipState, setZipState] = useState<string>("");


  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timer, setTimer] = useState(15);

  const handleCloseModal = () => {
    setShowTimeoutModal(false);
    window.preventNavigation = false;
    setTimer(15); // Optionally reset the timer
  };

  // sets up 15 second timer on open
  useEffect(() => {
  
    // sets up interval to decrement timer
    setInterval(() => {
      setTimer(prev => {
        if (prev === 1) { setShowTimeoutModal(true); }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // tracks when a click occurs
  const handleClick = useCallback(() => {
    setTimer(15);
  }, []);

  // after a click occurs
  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleClick);
    return () => { 
      document.removeEventListener("click", handleClick); 
      document.removeEventListener("keydown", handleClick); 
    };
  }, [handleClick]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Incase no autocomplete option was given, capture manual input
  useEffect(() => {
    const input = document.querySelector('.geoapify-autocomplete-input') as HTMLInputElement;
    if (input) {
      inputRef.current = input;
      const handleInput = () => {
        handleLineChange(input.value); 
      };
      input.addEventListener('input', handleInput);
  
      return () => input.removeEventListener('input', handleInput);
    }
  }, []);

  return (
    <div className="flex flex-col items-center font-crimson">
      <div className="flex flex-col items-center w-full">
        <p className="text-[36px] font-bold mb-4">{translations[0]}</p>
      </div>
      <div className="w-2/3">
        <p className="text-[24px] mt-4">{translations[1]} <span className="text-red">*</span></p>
      
          {/* autofill component  -- should api key be here??*/}
         <GeoapifyContext apiKey="64e958fc3aa74f4bb4aa34c3d7d3dff4">
            <GeoapifyGeocoderAutocomplete
              placeholder={translations[5]}
              type={'amenity'}
              limit={7}
              filterByCountryCode={['us']}
              placeSelect={(place) => {
                handleLineChange(place?.properties?.formatted.trim()); 
              }}
            />
          </GeoapifyContext>
      </div>
      <div className='flex flex-row w-2/3 justify-between gap-2'>
        <div className='flex-1 mr-3'>
          <p className="text-[24px] mt-4">{translations[2]} <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => setCityState(e.target.value)}
            value={cityState}
            required
          />
        </div>
        <div className='flex-1 mr-3'>
          <p className="text-[24px] mt-4">{translations[3]} <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => setStateState(e.target.value)}
            value={stateState}
            required
          />
        </div>
        <div className='flex-1'>
          <p className="text-[24px] mt-4">{translations[4]} <span className="text-red">*</span></p>
          <input
            type="text"
            className="bg-gray-50 border border-light-gray text-[24px] text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
            onChange={(e) => setZipState(e.target.value)}
            value={zipState}
            required
          />
        </div>
      </div>

      {/* timeout modal after 15 seconds of inactivity */}
      {showTimeoutModal &&
        <TimeoutModal
          closeTimeoutModal={handleCloseModal}
          translations={timeoutTranslations}
        />
      }
    </div>
  );
};

// -------------------- HouseholdSize --------------------
const HouseholdSize: React.FC<{ 
  value: number; 
  onChange: (value: number | null) => void; 
  setSubmitDisabled: (disabled: boolean) => void; 
  translations: string[];
  timeoutTranslations: string[];
}> = ({ value, onChange, setSubmitDisabled, translations, timeoutTranslations }) => {

  const [selectedSize, setSelectedSize] = useState<string>(value ? value.toString() : "");

  const handleSizeChange = (value: string) => {
    const sizeValue = value === "10+" ? 11 : value === "" ? null : Number(value);
    setSelectedSize(value);
    onChange(sizeValue);
    setSubmitDisabled(sizeValue === null);
  };

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timer, setTimer] = useState(15);

  const handleCloseModal = () => {
    setShowTimeoutModal(false);
    window.preventNavigation = false;
    setTimer(15);
  };

  // sets up 15 second timer on open
  useEffect(() => {
  
    // sets up interval to decrement timer
    setInterval(() => {
      setTimer(prev => {
        if (prev === 1) { setShowTimeoutModal(true); }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // tracks when a click occurs
  const handleClick = useCallback(() => {
    setTimer(15);
  }, []);

  // after a click occurs
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => { 
      document.removeEventListener("click", handleClick); 
    };
  }, [handleClick]);

  const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="flex flex-col items-center w-full max-w-lg font-crimson">
        <p className="text-[36px] font-bold mb-10">{translations[0]} <span className="text-red">*</span></p>
        <div className="w-52">
        <select
          className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray"
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value)}
        >
          <option value="" disabled></option>
          {sizes.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </select>
        </div>
      </div>

      {/* timeout modal after 15 seconds of inactivity */}
      {showTimeoutModal &&
        <TimeoutModal
          closeTimeoutModal={handleCloseModal}
          translations={timeoutTranslations}
        />
      }
    </div>
  );
};

// -------------------- CustomerDonor -------------------- //
const CustomerDonor: React.FC<{ 
  onChange: (value: boolean) => void;
  translations: string[]; 
  timeoutTranslations: string[];
}> = ({ onChange, translations, timeoutTranslations }) => {

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timer, setTimer] = useState(15);

  const handleCloseModal = () => {
    setShowTimeoutModal(false);
    window.preventNavigation = false;
    setTimer(15); // Optionally reset the timer
  };

  // sets up 15 second timer on open
  useEffect(() => {
  
    // sets up interval to decrement timer
    setInterval(() => {
      setTimer(prev => {
        if (prev === 1) { setShowTimeoutModal(true); }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // tracks when a click occurs
  const handleClick = useCallback(() => {
    setTimer(15);
  }, []);

  // after a click occurs
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => { 
      document.removeEventListener("click", handleClick); 
    };
  }, [handleClick]);

  return (
    <div className="font-crimson">
      <div className="text-black crimson-bold flex pt-[80px] text-4xl content-center justify-center text-center">
        {translations[0]}
      </div>
      <div className="text-black crimson-bold flex pt-5 text-4xl content-center justify-center text-center">
        {translations[1]}
      </div>
      <div className="flex pt-[100px] crimson-regular text-2xl content-center justify-center space-x-20">
        <YesProceed onClick={() => onChange(true)}/>
        <NoDone onClick={() => onChange(false)}/>
      </div>

      {/* timeout modal after 15 seconds of inactivity */}
      {showTimeoutModal &&
        <TimeoutModal
          closeTimeoutModal={handleCloseModal}
          translations={timeoutTranslations}
        />
      }
    </div>
  );
};

// -------------------- Confirmation --------------------
interface NewResponse {
  phoneNumber: string;
  name: string;
  address: string;
  householdSize: number | null;
  lastVisitDate: string;
}
const Confirmation: React.FC<{ 
  phoneNumber: string;
  translations: string[];
}> = ({ phoneNumber, translations }) => {

  const [newRecord, setNewRecord] = useState<NewResponse | null>(null);

  const fetchNewRecord = useCallback(async () => {
    try {
      const response = await fetch("../api/demographics", { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newResponses: NewResponse[] = await response.json();
      const matchedRecords = newResponses.filter(
        (record) => record.phoneNumber === phoneNumber
      );
      const latestRecord = matchedRecords.sort((a, b) =>
        new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime()
      )[0];
      console.log("Latest Record:", latestRecord);
      setNewRecord(latestRecord || null);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  }, [phoneNumber]);

  useEffect(() => {
    (async () => {
      await fetchNewRecord();
    })();
  }, [fetchNewRecord]);

  return (
    <div className="background-white font-black">
      <div className="font-crimson flex flex-col items-center text-black">
        <h1 className="font-bold text-[36px] mt-12">{translations[1]}</h1>
        <p className="font-bold text-[36px] mt-6 mb-2">{translations[2]}</p>
        <div className="flex col-2 items-center mt-8">
          <div className="flex flex-row mx-10 content-start text-[30px] break-all">
            <div className="flex flex-col">
              <div className="text-[30px]">{translations[3]}</div>
              <div className="text-[21px] mt-1">
                {translations[4]} <span className="text-[24px]" style={{ color: "#828282" }}>{newRecord?.name}</span>
              </div>
              <div className="text-[21px] mt-1">
                {translations[5]} <span className="text-[24px]" style={{ color: "#828282" }}>{newRecord?.phoneNumber}</span>
              </div>
              <div className="text-[21px] mt-1">
                {translations[6]} <span className="text-[24px]" style={{ color: "#828282" }}>{newRecord?.address}</span>
              </div>
              <div className="text-[21px] mt-1">
                {translations[0]} <span className="text-[24px]" style={{ color: "#828282" }}>
                  {newRecord?.householdSize === 11 ? "10+" : newRecord?.householdSize}
                </span>
              </div>
            </div>
            <div className="flex items-center ml-10">
              <Image src={logo} alt="logo" width={300} height={263} />
            </div>
          </div>
        </div>
        <div className="mt-10 mb-15">
          <button
            className="bg-purple hover:bg-dark-purple text-white font-bold py-4 px-11 rounded-full text-[28px] flex my-15"
            onClick={() => window.location.href = "../welcome-page"}
          >
            {translations[7]}
            <div className="relative bottom-0 left-5">
              <Image src={arrow} alt="arrow" width={42} height={42} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------- DemographicsSurvey (Main) --------------------
interface SurveyResponse {
  phoneNumber: string;
  takeCount: number;
  donateCount: number;
  changes: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: {
    line1: string;
  };
  householdSize: number | null;
  lastVisitDate: Date;
  previousVisitDates: Date[];
}

const DemographicsSurvey: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'action' | 'donor' | 'phoneNum' | 'changes' | 'name' | 'address' | 'houseSize' | 'confirmation'>('action');
  const router = useRouter();

  const [responses, setResponses] = useState({
    receive: false,
    donate: false,
    phoneNumber: '',
    changes: '',
    name: { firstName: '', lastName: '' },
    address: { line1: ''},

    householdSize: 0,
  });

  const [receive, setReceive] = useState(false);
  const [donate, setDonate] = useState(false);

  const updateAction = (receiveValue: boolean, donateValue: boolean) => {
    setResponses((prev) => ({ ...prev, receive: receiveValue, donate: donateValue }));
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

  const updateAddress = (value: string) => {

    setResponses((prev) => ({
      ...prev,
      address: { ...prev.address, ['line1']: value },
    }));
  };

  const updateHouseholdSize = (value: number | null) => {
    setResponses((prev) => ({ ...prev, householdSize: value ?? 0 }));
  };

  const [prevRecord, setPrevRecord] = useState<SurveyResponse | null>(null);

  const fetchPrevRecord = async () => {
    try {
      const response = await fetch("../api/demographics", { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const surveyResponses: SurveyResponse[] = await response.json();
      console.log("Fetched responses:", surveyResponses);
      const filteredRecord = surveyResponses.find(
        (response) => response.phoneNumber === responses.phoneNumber
      );
      console.log("Filtered Record:", filteredRecord);
      setPrevRecord(filteredRecord || null);
      return filteredRecord || null;
    } catch (error) {
      console.error("Error fetching responses:", error);
      setPrevRecord(null);
      return null;
    }
  };

  useEffect(() => {
    if (responses.phoneNumber) {
      fetchPrevRecord();
    }
  }, [responses.phoneNumber]);

  const handleNextClick = async () => {
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
        if (!responses.phoneNumber) {
          console.error("Phone number is missing before fetching records.");
          return;
        }
        const record = await fetchPrevRecord();
        if (!isValidPhoneNumber('+' + responses.phoneNumber)) {
          setShowErrorModal(true);
          setErrorMsg(translationArray.errorMessage[0]);
          return;

        }
        console.log("Fetched record before transition:", record);
        if (record !== null) {
          setCurrentStep('changes');
        } else {
          setCurrentStep('name');
        }
        break;
      case 'changes':
        if (responses.changes === "yes") {
          setCurrentStep('name');
        } else {
          handleSubmit();
          setCurrentStep('confirmation');
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
        console.log("previous record", prevRecord);
        if (prevRecord !== null) {
          setCurrentStep('changes');
        } else {
          setCurrentStep('phoneNum');
        }
        break;
      case 'changes':
        setCurrentStep('phoneNum');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    console.log('Survey Responses:', responses);
    console.log("Previous record before submission:", prevRecord);
    if (!responses.phoneNumber) {
      console.error("Error: Phone number is required.");
      return;
    }
    const currentDate = new Date();
    const recordData = {
      phoneNumber: responses.phoneNumber,
      takeCount: responses.receive ? 1 : 0,
      donateCount: responses.donate ? 1 : 0,
      name: `${responses.name.firstName} ${responses.name.lastName}`,
      address: `${responses.address.line1}`,

      householdSize: responses.householdSize,
      lastVisitDate: responses.receive ? currentDate : null,
      previousVisitDates: [currentDate],
    };
    console.log("Record data for submission:", recordData);
    try {
      if (prevRecord) {
        const updatedRecordData = {
          ...prevRecord,
          phoneNumber: responses.phoneNumber,
          takeCount: (prevRecord.takeCount || 0) + (responses.receive ? 1 : 0),
          donateCount: (prevRecord.donateCount || 0) + (responses.donate ? 1 : 0),
          name: responses.changes === "yes" ? `${responses.name.firstName} ${responses.name.lastName}` : prevRecord.name,
          address: responses.changes === "yes" ? `${responses.address.line1}` : prevRecord.address,
          householdSize: responses.changes === "yes" ? responses.householdSize : prevRecord.householdSize,
          lastVisitDate: responses.receive ? new Date().toISOString() : prevRecord.lastVisitDate,
          previousVisitDates: Array.isArray(prevRecord.previousVisitDates)
            ? [...prevRecord.previousVisitDates, currentDate]
            : [currentDate],
        };
        console.log("Updated record data for PUT request:", updatedRecordData);
        const updateResponse = await fetch("/api/demographics", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRecordData),
        });
        if (!updateResponse.ok) {
          throw new Error(`Failed to update record: ${await updateResponse.text()}`);
        }
        console.log("Record updated successfully.");
      } else {
        console.log("Creating a new record...");
        const createResponse = await fetch("/api/demographics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recordData),
        });
        if (!createResponse.ok) {
          throw new Error(`Failed to create record: ${await createResponse.text()}`);
        }
        const data = createResponse.json()
        console.log("Record created successfully.");
      }
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };


  const [showErrorModal, setShowErrorModal] = useState(false);
  const closeErrorModal = (): void => setShowErrorModal(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showModal, setShowModal] = useState(false);
  const openModal = (): void => setShowModal(true);
  const closeModal = (): void => setShowModal(false);

  const getProgress = () => {
    switch (currentStep) {
      case 'action': return 0;
      case 'donor': return 10;
      case 'phoneNum': return 16.67;
      case 'changes': return 33.33;
      case 'name': return 50;
      case 'address': return 66.67;
      case 'houseSize': return 83.33;
      case 'confirmation': return 100;
      default: return 0;
    }
  };

  // for the translations, a set of arrays organized by page
  const [translationArray, setTranslationArray] = useState(DEFAULT_TRANSLATIONS);
  const [translationsDone, setTranslationsDone] = useState(false);

  // translates all text for the questions on open
  useEffect(() => {
    
    // when translations are not finished
    setTranslationsDone(false);
    
    // only translates non-english
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {

        // makes a copy of the default translations to change them
        const newTranslations = {...DEFAULT_TRANSLATIONS};

        // translates only if the language is not the default (english)
        if (language !== "en") {

          // loops over each page
          for (const key of Object.keys(DEFAULT_TRANSLATIONS) as (keyof typeof DEFAULT_TRANSLATIONS)[]) {
            const translatedStrings: string[] = [];
        
            // loops over each string in the current page to translate it
            for (const str of DEFAULT_TRANSLATIONS[key]) {
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(str)}`;
              const response = await fetch(url);
              const data = await response.json();
              const translationArray = data[0] as string[][];
              translatedStrings.push(translationArray.map(t => t[0]).join(''));
            }
        
            newTranslations[key] = translatedStrings;
          }
        }

        // stores the new translations
        setTranslationArray(newTranslations);
    
        // when translations are finished
        setTranslationsDone(true);

      // error catching
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DemographicsSurveyBanner />
      {currentStep !== 'confirmation' && (
        <>
          <div className="flex py-10 pl-[100px] pr-[100px] items-center">
            <div></div>
            <ProgressBar progress={getProgress()}/>   
            <div className="pl-5 text-2xl">
              {`${getProgress().toFixed(0)}%`}
            </div>
          </div>
          <div className="flex flex-row h-full w-full justify-between px-32">
            <ButtonBack onClick={handleBackClick} />
            <div>
              <ButtonExit onClick={openModal} />
              {showModal && <ExitModal closeModal={closeModal} redirectPage={'/unsaved-thank-you'} translations={translationArray.exitModal}/>}
            </div>
          </div>
        </>
      )}
      <div className='w-full'>
        {currentStep === 'action'   && <CustomerAction onChange={updateAction} setNextDisabled={setNextDisabled} receive={responses.receive} donate={responses.donate} translations={translationArray.customerActions} timeoutTranslations={translationArray.timeoutModal} showText={translationsDone} />}
        {currentStep === 'donor'    && <CustomerDonor onChange={redirectDonor} translations={translationArray.customerDonor} timeoutTranslations={translationArray.timeoutModal}/>}
        {currentStep === 'phoneNum' && <PhoneNumber value={responses.phoneNumber} onChange={updatePhoneNumber} setNextDisabled={setNextDisabled} translations={translationArray.phoneNumber} timeoutTranslations={translationArray.timeoutModal}/>}
        {showErrorModal && <ErrorModal errorMsg={errorMsg} closeModal={closeErrorModal} />}
        {currentStep === 'changes' && (
          <Changes
            value={responses.changes}
            onChange={updateChanges}
            setNextDisabled={setNextDisabled}
            details={{
              name: typeof prevRecord?.name === "string" 
                ? prevRecord.name 
                : prevRecord?.name 
                ? `${prevRecord.name.firstName} ${prevRecord.name.lastName}` 
                : "N/A",            
              address: typeof prevRecord?.address === "string"
                ? prevRecord.address
                : prevRecord?.address
                ? `${prevRecord.address.line1}`

                : "N/A",                  
              householdSize: prevRecord?.householdSize ?? 0
            }}    
            translations={translationArray.changes}   
            timeoutTranslations={translationArray.timeoutModal}      
          />
        )}
        {currentStep === 'name' && 
          <Name 
            firstName={responses.name.firstName} 
            lastName={responses.name.lastName} 
            onFirstNameChange={(value) => updateName('firstName', value)}
            onLastNameChange={(value) => updateName('lastName', value)} 
            setNextDisabled={setNextDisabled} 
            translations={translationArray.name}
            timeoutTranslations={translationArray.timeoutModal}
          />
        }
        {currentStep === 'address' && 
          <Address 
            line1={responses.address.line1} 
            onAddressLineChange={(value) => updateAddress(value)}
            setNextDisabled={setNextDisabled} 
            translations={translationArray.address}
            timeoutTranslations={translationArray.timeoutModal}
          />
        }
        {currentStep === 'houseSize' && 
          <HouseholdSize 
            value={responses.householdSize} 
            onChange={updateHouseholdSize} 
            setSubmitDisabled={setSubmitDisabled} 
            translations={translationArray.householdSize}
            timeoutTranslations={translationArray.timeoutModal}
          />
        }
        {currentStep === 'confirmation' && <Confirmation phoneNumber={responses.phoneNumber} translations={translationArray.confirmation}/>}
      </div>
      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2'>
        {(() => {
          if (currentStep === 'houseSize') {
            return <ButtonSubmit onClick={handleSubmit} disabled={submitDisabled} />;
          } else if (currentStep !== 'donor' && currentStep !== 'confirmation') {
            return <ButtonNext onClick={handleNextClick} disabled={nextDisabled} />;
          }
        })()}
      </div>
    </div>
  );
};

export default DemographicsSurvey;