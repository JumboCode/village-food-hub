// imports
// import { ButtonAdd, ButtonRemove } from "../../components/SurveyButtons";
import UpdateInventoryBanner from "../components/UpdateInventoryBanner";

const CustomerDonor: React.FC = () => {
    
    return (
        <div>
            {/* Imported Banner */}
            <div>
                <UpdateInventoryBanner/>
            </div>
            <div>
                {/* Central text */}
                <div className="text-black crimson-bold flex pt-40 text-4xl content-center justify-center text-center">
                    You have removed 12 bags of bagels!
                </div>
            </div>
        </div>
    );
};

export default CustomerDonor;