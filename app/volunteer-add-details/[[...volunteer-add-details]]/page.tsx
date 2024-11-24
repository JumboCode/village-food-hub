import Banner from "../../components/UpdateInventoryBanner"
import { ButtonBack, ButtonExit, ButtonNext } from "../../components/SurveyButtons"
import { NameDropdown } from "../../components/Dropdowns";
import React from 'react'
import ExitModal from "../../components/ExitModal"


// This function returns the page that allows Volunteers to input data on the
// contents they are removing from the inventory
const VolunteerRemoveDetails: React.FC = () => {
    //const [showModal, setShowModal] = useState(false);
    
    //const openModal = (): void => {
    //    setShowModal(true);
    //};
    
    //const closeModal = (): void => {
    //    setShowModal(false);
    //};
    return (
        <div>
            <Banner/>
            {/* Back and Exit buttons */}
            <div className = "flex flex-row h-full w-full justify-between mt-10 px-40 py-18">
                <div className= "flex flex-2">
                    <ButtonBack/>
                </div>
                <ButtonExit/>
            </div>
            {/* Form Contents */}
            <div className = "flex flex-col h-1/2 w-3/5 justify-center font-crimson justify-self-center mt-5">
                <p className="justify-self-center text-[42px] font-bold">What are you adding?</p>
                <div className = "font-bold text-[30px] py-5">
                    {/* category name dropdown */}
                    <p>Category Name  </p>
                    <NameDropdown/>
                </div>
                <div className = "font-bold text-[30px]">
                    {/* item name dropdown */}
                    <p>Item Name  </p>
                    <NameDropdown/>
                </div>
                <div className = "flex flex-row w-full justify-between">
                <div className = "font-bold text-[30px] pt-10 -p-10">
                    {/* textbox for quantity */}
                        <p>Quantity</p>
                        <input
                            type="text"
                            placeholder=""
                            className="input input-bordered input-xs w-full max-w-xs rounded-xl" />
                    </div>
                    {/* dropdown for amount of units */}
                    <div className = "font-bold text-[30px] pt-10 -p-10">
                        <p>Units</p>
                        <NameDropdown/>
                    </div>
                </div>
                {/* Next button */}
                <div className = " flex justify-center mt-10">
                    <ButtonNext/>
                </div>
            </div>
        </div>
    );
};

export default VolunteerRemoveDetails;