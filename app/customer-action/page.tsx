"use client";

// imports
import { useState } from "react";
import { useRouter } from "next/navigation";
import Checkbox from "../components/Checkbox";
import { ButtonNext,ButtonExit } from "../components/SurveyButtons";
import ProgressBar from "../components/ProgressBar";
import UpdateInventoryBanner from "../components/UpdateInventoryBanner";

const CustomerAction: React.FC = () => {

    // used to visit a new page
    const router = useRouter();

    // state variables to store if a checkbox is clicked
    const [recieve, setRecieve] = useState(false);
    const [donate, setDonate] = useState(false);

    // function to visit the next page depending on the checkboxes clicked
    function nextPage() {

        // if the recieve checkbox is not clicked, visit the donor page
        if (!recieve) {
            router.push('/customer-donor');
        } else {
            router.push('/customer-questions');
        }
    }
    
    return (
        <div>
            <div>

                {/* Imported Banner */}
                <UpdateInventoryBanner/>

                {/* Progress Bar */}
                <div className="flex pt-[50px] pl-[100px] pr-[100px] items-center">
                    <div></div>
                    <ProgressBar progress={5}/>   
                    <div className="pl-5 text-2xl">
                        5%
                    </div>
                </div>
                
                {/* Exit Button */}
                <div className="flex pt-[40px] pl-[100px] pr-[100px] crimson-regular text-2xl justify-end">
                    <ButtonExit/>
                </div>

                {/* Text */}
                <div className="flex justify-center pt-[60px] text-black crimson-bold text-4xl">
                    Select all the actions you plan to do today.
                </div>

                {/* Checkboxes */}
                <div className="flex pt-[40px] text-black crimson-bold text-4xl justify-center">
                    <div>
                        {/* Recieve */}
                        <div className="flex space-x-5">
                            <Checkbox state={recieve} setState={setRecieve}/>
                            <div> Recieve </div>
                        </div>
                        
                        {/* Donate */}
                        <div className="flex space-x-5">
                            <Checkbox state={donate} setState={setDonate}/>
                            <div> Donate </div>
                        </div>
                    </div>
                </div>
                
                {/* Next Button */}
                <div className="flex pt-[200px] crimson-regular text-2xl content-center justify-center space-x-20">
                    <ButtonNext onClick={nextPage}/>
                </div>
            </div>
        </div>
    );
};

export default CustomerAction;