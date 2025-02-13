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
    
    return (
        <div>
            <NavBar />
            {/* <ProfileView/> */}
            <div className="py-4 px-10">
                <div className="flex flex-row justify-between mt-10 mb-6">
                    <h1 className="font-crimson text-3xl text-[40px] font-bold">Manage Users</h1>
                    <div className="flex flex-row">
                        <NewUserButton onClick={() => console.log("Button clicked")} />
                        {/* <NewUserButton/> */}
                    </div>
                </div>
                {/* Pass the correctly typed manageUsers data to ManageUsersSpreadsheet */}
                <ManageUsersSpreadsheet manageUsersItems={users} />
            </div>
        </div>
    );
};

export default InternalViewManageUsersPage