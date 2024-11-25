import React, { useState } from 'react';

export default function PhoneNumberInput() {
  const [countryCode, setCountryCode] = useState('+1');

  const handleChange = (event: any) => {
    setCountryCode(event.target.value);
  };

  return (
    <div className='flex flex-row '>
      <select
        id="country-code"
        value={countryCode}
        onChange={handleChange}
        className="flex-shrink-0 z-10 mr-2 inline-flex items-center py-2.5 text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-gray-100"
        
      >
        <option value="+1">(+1) United States</option>
        <option value="+52">(+52) Mexico</option>
        <option value="+58">(+58) Venezuela</option>
        <option value="+57">(+57) Colombia</option>
        <option value="+51">(+51) Peru</option>
        <option value="+593">(+593) Ecuador</option>
      </select>

      <input
        type="text"
        id="phone-input"
        aria-describedby="helper-text-explanation"
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        placeholder="xxx-xxx-xxxx"
        required
      />
    </div>
  );
}
