'use client';

// imports
import { ButtonAdd, ButtonRemove } from "@app/components/SurveyButtons";
import UpdateInventoryBanner from "@app/components/UpdateInventoryBanner";
import { userIsCustomer } from "@app/components/ProtectedUrls";
import { useUser } from "@clerk/nextjs";

function redirect(path : string) {
    window.location.href = path;
}

const LandingPage: React.FC = () => {
    const { user } = useUser();
    const hasAccess = !userIsCustomer(user);

    return (
        hasAccess ? (
            <div>
                {/* Imported Banner */}
                <div>
                    <UpdateInventoryBanner/>
                </div>
                <div>
                    {/* Central text */}
                    <div className="text-black font-crimson crimson-bold flex pt-40 text-4xl content-center justify-center text-center">
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
        ) : (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold">Unauthorized Access</h1>
                <p className="mt-4">You do not have permission to view this page.</p>
            </div>
        )
    );
};

export default LandingPage;