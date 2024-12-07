// imports
import { ButtonBack,ButtonExit, NoDone, YesProceed} from "../components/SurveyButtons";
import UpdateInventoryBanner from "../components/UpdateInventoryBanner";
import ProgressBar from "@app/components/ProgressBar";

const CustomerDonor: React.FC = () => {
    
    // TODO: Unsure what to do about where to send after pressing a button

    return (
        <div>
            {/* Imported Banner */}
            <div>
                <UpdateInventoryBanner/>
                {/* Unsure how to change to demographic survey*/}
            </div>
            {/* Progress Bar */}
            <div className="flex pt-[50px] pl-[100px] pr-[100px] items-center">
                    <div></div>
                    <ProgressBar progress={20}/>   
                    <div className="pl-5 text-2xl">
                        20%
                    </div>
                </div>
            <div>
                {/* Exit Button and Back Button */}
                <div className="flex pt-[40px] pl-[100px] pr-[100px] crimson-regular text-2xl justify-between">
                    <ButtonBack/>
                    <ButtonExit/>
                </div>
                {/* Central text */}
                <div className="text-black crimson-bold flex pt-40 text-4xl content-center justify-center text-center">
                    We have a demographic survey that is optional. 
                </div>
                <div className="text-black crimson-bold flex pt-5 text-4xl content-center justify-center text-center">
                    Would you like to fill it out?
                </div>
                {/* Next Button */}
                <div className="flex pt-[100px] crimson-regular text-2xl content-center justify-center space-x-20">
                    <YesProceed/>
                    <NoDone/>
                </div>
            </div>
        </div>
    );
};

export default CustomerDonor;