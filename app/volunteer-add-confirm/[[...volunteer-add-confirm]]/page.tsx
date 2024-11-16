// imports
import { ButtonExit, ButtonSubmit, ButtonEdit } from "../../components/SurveyButtons";
import UpdateInventoryBanner from "../../components/UpdateInventoryBanner";

const AddConfirmPage: React.FC = () => {
    
    return (
        <div>
            {/* Imported Banner */}
            <div>
                <UpdateInventoryBanner/>
            </div>
            <div>
                {/* Top Buttons */}
                <div className="flex p-20 crimson-regular text-2xl content-center justify-between">
                    <ButtonEdit/>
                    <ButtonExit/>
                </div>

                {/* Central text */}
                <div className="text-black crimson-bold flex text-4xl content-center justify-center text-center">
                    This action will:
                </div>

                {/* Placeholder text */}
                <div className="text-gray crimson-regular pt-10 flex text-4xl content-center justify-center text-center">
                    Add [quantity] [units] of [itemName].
                </div>
                
                {/* Bottom Buttons */}
                <div className="flex pt-[250px] crimson-regular text-2xl justify-center">
                    <ButtonSubmit/>
                </div>
            </div>
        </div>
    );
};

export default AddConfirmPage;