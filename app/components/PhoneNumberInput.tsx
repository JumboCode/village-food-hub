import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (newValue: string | undefined) => void;
}

export default function PhoneNumberInput({ value, onChange }: PhoneNumberInputProps) {
  const handleChange = (newValue: string | undefined) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <PhoneInput
        country="us"
        value={value}
        onChange={handleChange}
        placeholder=""
        inputClass="bg-gray-50 border border-light-gray text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-6 text-8xl"
      />
    </div>
  );
}
