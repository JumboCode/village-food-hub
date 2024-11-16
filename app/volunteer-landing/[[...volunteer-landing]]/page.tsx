// imports
import { ButtonAdd, ButtonRemove } from "../../components/SurveyButtons";
import UpdateInventoryBanner from "../../components/UpdateInventoryBanner";

const LandingPage: React.FC = () => {
    
    return (
        <div>
            {/* Imported Banner */}
            <div>
                <UpdateInventoryBanner/>
            </div>
            <div>
                {/* Central text */}
                <div className="text-black crimson-bold flex pt-40 text-4xl content-center justify-center text-center">
                    Are you adding or removing from the inventory?
                </div>
                
                {/* Buttons */}
                <div className="flex pt-20 crimson-regular text-2xl content-center justify-center space-x-20">
                    <ButtonAdd/>
                    <ButtonRemove/>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;