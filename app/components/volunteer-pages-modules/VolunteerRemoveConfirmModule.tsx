import React from "react";
import { ButtonExit, ButtonSubmit, ButtonEdit } from "@app/components/SurveyButtons";
import UpdateInventoryBanner from "@app/components/Dropdowns";

const RemoveConfirmPageModule: React.FC = () => {
  return (
    <div>
      {/* Central Text */}
      <div className="text-black crimson-bold flex text-4xl content-center justify-center text-center">
        This action will:
      </div>

      {/* Placeholder text */}
      <div className="text-gray crimson-regular pt-10 flex text-4xl content-center justify-center text-center">
        Remove [quantity] [units] of [itemName].
      </div>

      {/* Bottom Buttons */}
      <div className="flex pt-[250px] crimson-regular text-2xl justify-center">
        <ButtonSubmit />
      </div>
    </div>
  );
};

export default RemoveConfirmPageModule;
