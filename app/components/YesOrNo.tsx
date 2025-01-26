import React, { useState, useEffect } from 'react';

const YesOrNo: React.FC<{ value: string, onChange: (value: string) => void, setNextDisabled: (disabled: boolean) => void }> = ({ value, onChange, setNextDisabled }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(value || null);

  useEffect(() => {
    if (selectedValue === null) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [selectedValue, setNextDisabled]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };
  
  return (
    <div className="flex flex-col items-start">
      {/* Yes Option */}
      <div className="form-control mb-4">
        <label className="label cursor-pointer flex items-center">
          <input
            type="radio"
            name="info-changed"
            value="yes"
            className="radio checked:bg-light-green mr-4 w-8 h-8"
            onChange={() => handleChange("yes")} 
            checked={selectedValue === "yes"}
            required
          />
          <span className="text-[28px] font-bold">Yes</span>
        </label>
      </div>

      {/* No Option */}
      <div className="form-control">
        <label className="label cursor-pointer flex items-center">
          <input
            type="radio"
            name="info-changed"
            value="no"
            className="radio checked:bg-light-green mr-4 w-8 h-8"
            onChange={() => handleChange("no")} 
            checked={selectedValue === "no"}
            required
          />
          <span className="text-[28px] font-bold">No</span>
        </label>
      </div>
    </div>
  );
};

export default YesOrNo;