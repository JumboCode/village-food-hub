'use client';

// imports
import { ButtonAdd, ButtonRemove } from "@app/components/SurveyButtons";
import UpdateInventoryBanner from "@app/components/UpdateInventoryBanner";

function redirect(path : string) {
    window.location.href = path;
}

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
                    <ButtonAdd
                      onClick={() => redirect("../volunteer-add-pages/page")}
                    />
                    <ButtonRemove
                      onClick={() => redirect("../volunteer-remove-pages/page")}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;