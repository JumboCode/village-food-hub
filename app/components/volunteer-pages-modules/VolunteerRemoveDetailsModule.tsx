import React from "react";
import Banner from "@app/components/UpdateInventoryBanner";
import { ButtonBack, ButtonExit, ButtonNext } from "@app/components/SurveyButtons";
import { NameDropdown } from "@app/components/Dropdowns";

const VolunteerRemoveDetails: React.FC = () => {
  return (
    <div>
      {/* Form Contents */}
      <div className="flex flex-col h-1/2 w-3/5 justify-center font-crimson justify-self-center">
        <p className="justify-self-center text-[36px] font-bold">What are you Removing?</p>
        <div className="font-bold text-[20px] py-4">
          {/* Category Name Dropdown */}
          <p className="mb-2">Category Name</p>
          <NameDropdown />
        </div>
        <div className="font-bold text-[20px]">
          {/* Item Name Dropdown */}
          <p className="mb-2">Item Name</p>
          <NameDropdown />
        </div>
        <div className="flex flex-row w-full justify-between">
          <div className="font-bold text-[20px] pt-6 -p-8">
            {/* Textbox for quantity */}
            <p className="mb-2">Quantity</p>
            <input
              type="text"
              placeholder=""
              className="input input-bordered input-xs w-full max-w-xs rounded-xl border-light-gray"
            />
          </div>
          {/* Dropdown for units */}
          <div className="font-bold text-[20px] pt-6 -p-8">
            <p className="mb-2">Units</p>
            <NameDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRemoveDetails;
