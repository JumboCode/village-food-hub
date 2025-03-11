'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import editIcon from '@app/images/edit.png';
import deleteIcon from '@app/images/delete.png';
import EditUserModal from "@app/components/EditUserModal";
import DeleteUserModal from "@app/components/DeleteUserModal";

interface ManageUsersSpreadsheetProps {
    manageUsersItems: string[][];
}

interface ClerkUser {
    id?: string;
    username?: string;
    publicMetadata?: {
        role?: string;
    };
}

export const ManageUsersSpreadsheet: React.FC<ManageUsersSpreadsheetProps> = ({ manageUsersItems = [] }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
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
                    user.publicMetadata?.role || "N/A"
                ]);
                setAllUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const openEditModal = (firstName: string, lastName: string, username: string) => {
        setFirstName(firstName);
        setLastName(lastName);
        setUsername(username);
        setShowEditModal(true);
    };

    const openDeleteModal = (firstName: string, lastName: string, username: string) => {
        setFirstName(firstName);
        setLastName(lastName);
        setUsername(username);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShowAdminModal(false);
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
            const payload = {
                userId,
                firstName,
                lastName,
                role: updatedRole,
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
            
            closeModals();
            window.location.reload();  
    
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            if (!username) {
                console.error("No username provided for deletion");
                return;
            }

            const res = await fetch("/api/users", { method: "GET" });
            const data = await res.json();

            if (!data?.data || data.data.length === 0) {
                console.error("Error: No users found in the database");
                return;
            }

            const deleteUser = data.data.find((user: ClerkUser) => user.username === username);

            if (!deleteUser) {
                console.error("User not found:", username);
                return;
            }

            const adminUsers = data.data.filter((user: ClerkUser) => user.publicMetadata?.role === "Admin");

            if (adminUsers.length <= 1 && deleteUser.publicMetadata?.role === "Admin") {
                console.log("Cannot delete the last admin - Showing modal");
                setShowAdminModal(true);
                return;
            }

            console.log("Deleting user:", deleteUser);

            const response = await fetch("/api/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteUser.id })
            });

            const result = await response.json();

            if (response.ok) {
                console.log("User deleted successfully:", result);
                closeModals();
                window.location.reload();
            } else {
                console.error("Error deleting user:", result.error);
            }
        } catch (error) {
            console.error("User deletion failed:", error);
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
                                    onClick={() => openEditModal(item[0], item[1], item[3])} 
                                    className="cursor-pointer"
                                />
                                <Image
                                    src={deleteIcon}
                                    width={18}
                                    height={18}
                                    alt="delete Icon"
                                    onClick={() => openDeleteModal(item[0], item[1], item[3])}
                                    className="cursor-pointer"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showEditModal && (
                <EditUserModal
                    userData={[firstName || "N/A", lastName || "N/A", username || "N/A"]}
                    closeModal={closeModals}
                    handleSave={handleSave}
                />
            )}
            {showDeleteModal && (
                <DeleteUserModal
                    userName={`${firstName} ${lastName}`}
                    closeModal={closeModals}
                    handleDelete={handleDelete}
                />
            )}
            {showAdminModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                    <div className="h-[220px] w-[450px] bg-modal-gray font-crimson fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-8 shadow-lg rounded-lg">
                        <p className="flex justify-center text-[28px] crimson-bold">Cannot delete the last admin.</p>
                        <button className="bg-light-green text-white rounded-lg p-2" onClick={closeModals}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};