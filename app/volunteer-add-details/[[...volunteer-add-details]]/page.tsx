import Banner from "../../components/UpdateInventoryBanner"
import { ButtonBack, ButtonExit, ButtonNext } from "../../components/SurveyButtons"
import { NameDropdown } from "../../components/Dropdowns";
import React from 'react'

// This function returns the page that allows Volunteers to input data on the
// contents they are removing from the inventory
const VolunteerAddDetails: React.FC = () => {
    return (
        <div>
            <Banner/>
            {/* Back and Exit buttons */}
            <div className="flex flex-row h-full w-full justify-between px-32 py-10">
                <div className="flex flex-2">
                    <ButtonBack/>
                </div>
                <ButtonExit/>
            </div>

            {/* Form Contents */}
            <div className="flex flex-col h-1/2 w-3/5 justify-center font-crimson justify-self-center">
                <p className="justify-self-center text-[36px] font-bold">What are you adding?</p>
                <div className="font-bold text-[20px] py-4">
                    {/* category name dropdown */}
                    <p className="mb-2">Category Name</p>
                    <NameDropdown/>
                </div>
                <div className="font-bold text-[20px]">
                    {/* item name dropdown */}
                    <p className="mb-2">Item Name</p>
                    <NameDropdown/>
                </div>
                <div className="flex flex-row w-full justify-between">
                    <div className="font-bold text-[20px] pt-6 -p-8">
                        {/* textbox for quantity */}
                        <p className="mb-2">Quantity</p>
                        <input
                            type="text"
                            placeholder=""
                            className="input input-bordered input-xs w-full max-w-xs rounded-xl border-light-gray" />
                    </div>
                    {/* dropdown for amount of units */}
                    <div className="font-bold text-[20px] pt-6 -p-8">
                        <p className="mb-2">Units</p>
                        <NameDropdown/>
                    </div>
                </div>
                {/* Next button */}
                <div className="flex justify-center mt-8">
                    <ButtonNext/>
                </div>
            </div>
        </div>
    );
};

export default VolunteerAddDetails;