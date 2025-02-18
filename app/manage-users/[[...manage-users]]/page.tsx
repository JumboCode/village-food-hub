"use client"
import React, { useEffect, useState } from "react";
import NavBar from "@app/components/NavBar";
import { ManageUsersSpreadsheet } from "@app/components/ManageUsersSpreadsheet";
import { NewUserButton } from "@app/components/InternalViewButtons";
import ProfileView from "@app/components/ProfileView"

// Define a type for the structure of each record in manageUsersData
interface User {
    firstName: string;
    lastName: string;
    pronouns: string;
    username: string;
    email: string;
    role: string;
    phoneNumber: string;
}

const InternalViewManageUsersPage: React.FC = () => {
    const [users, setUsers] = useState<string[][]>([]);
    const [showCreateProfileView, setShowCreateProfileView] = useState(false);

    useEffect(() => {
        fetch("../api/users", { method: 'GET' })
        .then((res) => res.json())
        .then((data) => {
            if (data?.data) {
                const formattedUsers: string[][] = data.data.map((user: any) => [
                    user.firstName || "N/A",
                    user.lastName || "N/A",
                    user.publicMetadata?.pronouns || "N/A",
                    user.username || "N/A",
                    user.emailAddresses?.[0]?.emailAddress || "N/A",
                    user.publicMetadata?.role || "N/A",
                    user.publicMetadata?.phoneNumber || "N/A",
                ]);
                setUsers(formattedUsers);
            }
        })
        .catch((err) => console.error("Error fetching users:", err));
    }, []);
    
    function handleProfileView () {
        setShowCreateProfileView(true);
    }
    
    function handleCancelProfileView () {
        setShowCreateProfileView(false);
    }
    
    return (
        
        <div>
            <NavBar />
            {showCreateProfileView ? (
                <div>    
                    <div className="p-[80px] pt-[50px]">
                        <p className="font-crimson text-[40px] mb-[20px]"> Create Profile</p>
                        <ProfileView visible={showCreateProfileView} mode="create" onCancel={handleCancelProfileView}/>
                        <div>
                            <button className="bg-light-green hover:bg-dark-green text-white text-[24px] font-crimson w-[200px] h-[50px] rounded-xl mt-[40px] mr-[30px]"> Create </button>
                            <button 
                                className="bg-white hover:bg-light-gray text-gray text-[24px] font-crimson w-[200px] h-[50px] rounded-xl mt-[40px] border-[2px] border-gray"
                                onClick={handleCancelProfileView}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div> 
                    <div className="py-4 px-10">
                        <div className="flex flex-row justify-between mt-10 mb-6">
                            <h1 className="font-crimson text-3xl text-[40px] font-bold">Manage Users</h1>
                            <div className="flex flex-row">
                                <NewUserButton onClick={(handleProfileView)} />
                            </div>
                        </div>
                        {/* Pass the correctly typed manageUsers data to ManageUsersSpreadsheet */}
                        <ManageUsersSpreadsheet manageUsersItems={users} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternalViewManageUsersPage