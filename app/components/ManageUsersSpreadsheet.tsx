'use client'; 

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import editIcon from '@app/images/edit.png';
import deleteIcon from '@app/images/delete.png';
import EditUserModal from "@app/components/EditUserModal";

interface ManageUsersSpreadsheetProps {
    manageUsersItems: string[][];
}

interface ClerkUser {
    id?: string;
    username?: string;
}

export const ManageUsersSpreadsheet: React.FC<ManageUsersSpreadsheetProps> = ({ manageUsersItems = [] }) => {
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<string[][]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
    
                const formattedUsers: string[][] = data.data.map((user: ClerkUser) => [
                    user.id || "N/A", 
                    user.username || "N/A", 
                    user.firstName || "N/A", 
                    user.lastName || "N/A",
                    user.pronouns || "N/A", 
                    user.role || "N/A",
                    user.phoneNumber || "N/A", 
                ]);
                setAllUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const openModal = (firstName: string, lastName: string, username: string) => {
        setFirstName(firstName);
        setLastName(lastName);
        setUsername(username);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFirstName(null);
        setLastName(null);
        setUsername(null);
    };

    const handleSave = async (updatedRole: string) => {
        try {
            const selectedUser = allUsers.find(user => user[1] === username); 
            if (!selectedUser) {
                throw new Error("User not found.");
            }
    
            const userId = selectedUser[0]; 
            const firstName = selectedUser[2]; 
            const lastName = selectedUser[3]; 
            const pronouns = selectedUser[4]; 
            const phoneNumber = selectedUser[6];
    
            const payload = {
                userId,
                firstName,
                lastName,
                pronouns,
                role: updatedRole,
                phoneNumber,
            };
    
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update user");
            }
            
            closeModal();
            window.location.reload();  
    
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user. Please try again.");
        }
    };
    
    return (
        <div className="relative overflow-x-auto crimson-regular font-crimson">
            <table className="table-auto w-full">
                <thead className="font-crimson border-crimson-regular border-separate content-start">
                    <tr className="bg-dark-blue text-white text-lg align-left">
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">First Name</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Last Name</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Pronouns</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Username</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Email</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Role</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Phone Number</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson crimson-regular">
                    {manageUsersItems.map((item, index) => (
                        <tr key={index} className="py-2">
                            {item.map((data, subIndex) => (
                                <td
                                    key={subIndex}
                                    className="border-collapse border-zinc-200 border-2 border-y-1 py-2 px-3"
                                >
                                    {data}
                                </td>
                            ))}
                            <td className="flex row justify-around border-collapse border-zinc-300 border-2 border-y-1 py-2 px-3">
                                <Image
                                    src={editIcon}
                                    width={18}
                                    height={18}
                                    alt="edit Icon"
                                    onClick={() => openModal(item[0], item[1], item[3])} 
                                    className="cursor-pointer"
                                />
                                <Image
                                    src={deleteIcon}
                                    width={18}
                                    height={18}
                                    alt="delete Icon"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <EditUserModal
                    userData={[
                        firstName || "N/A", 
                        lastName || "N/A", 
                        "N/A", 
                        username || "N/A", 
                        "N/A", 
                        allUsers.find(user => user[1] === username)?.[5] || "N/A", 
                        "N/A", 
                    ]}
                    closeModal={closeModal}
                    handleSave={handleSave}
                />
            )}
        </div>
    );
};