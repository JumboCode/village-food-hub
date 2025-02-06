"use client"
import React, { useEffect, useState } from "react";
import NavBar from "@app/components/NavBar";
import { ManageUsersSpreadsheet } from "@app/components/ManageUsersSpreadsheet";
import { NewUserButton } from "@app/components/InternalViewButtons";

// Define a type for the structure of each record in manageUsersData
interface User {
    firstName: string;
    lastName: string;
    pronouns: string;
    username: string;
    email: string;
    role: string;
    phoneNumber: number;
}

const InternalViewManageUsersPage: React.FC = () => {
    
    const [users, setUsers] = useState<string[][]>([]);

    useEffect(() => {
        fetch("/../api/manageUsers", { method: 'GET' })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Error fetching users:", err));
    }, []);
    
    return (
        <div>
            <NavBar />
            <div className="py-4 px-10">
                <div className="flex flex-row justify-between mt-10 mb-6">
                    <h1 className="font-crimson text-3xl text-[40px] font-bold">Manage Users</h1>
                    <div className="flex flex-row">
                        <NewUserButton onClick={() => console.log("Button clicked")} />
                    </div>
                </div>
                {/* Pass the correctly typed manageUsers data to ManageUsersSpreadsheet */}
                <ManageUsersSpreadsheet manageUsersItems={users} />
            </div>
        </div>
    );
};

export default InternalViewManageUsersPage;