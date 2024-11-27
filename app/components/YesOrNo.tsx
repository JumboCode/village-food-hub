import React from "react";

interface YesOrNoProps {
  onChange: (value: string) => void; 
}
const YesOrNo: React.FC<YesOrNoProps> = ({ onChange }) => {
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
            onChange={() => onChange("yes")} 
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
            onChange={() => onChange("no")} 
            required
          />
          <span className="text-[28px] font-bold">No</span>
        </label>
      </div>
    </div>
  );
};

export default YesOrNo;
