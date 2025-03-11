'use client';

import React, {useState, useEffect} from "react";
import Image from 'next/image';
import editIcon from '@app/images/edit.png';
import deleteIcon from '@app/images/delete.png';
import arrowsIcon from "@app/images/upAndDownArrows.png";
import DeleteUserModal from "@app/components/DeleteUserModal";

interface ManageUsersSpreadsheetProps {
    manageUsersItems: string[][];
}

interface ClerkUser {
    id?: string;
    username?: string;
  }

export const ManageUsersSpreadsheet: React.FC<ManageUsersSpreadsheetProps> = ({ manageUsersItems = [] }) => {
    console.log("manageUsersItems:", manageUsersItems);
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null); // might be unused
    const [allUsers, setAllUsers] = useState<string[][]>([]);
    const [showAdminModal, setShowAdminModal] = useState(false);

    const openModal = (firstName: string, lastName: string, username: string) => {
        setShowModal(true);
        setFirstName(firstName); 
        setLastName(lastName)
        setUsername(username); 
    };

    const closeModal = () => {
        setShowModal(false);
        setFirstName(null);
        setLastName(null);
        setUsername(null); 
    };

    const openAdminModal = () => {
        console.log("Cannot delete last Admin")
        setShowAdminModal(true);
        setShowModal(false);
    }

    const closeAdminModal = () => {
        setShowAdminModal(false);
    }

    const refreshPage = () => {
        window.location.reload();
    };

    const handleDelete = async () => {
        try {
            if (!username) {
                console.error("No username provided for deletion");
                return;
            }
    
            // Fetch all users
            const res = await fetch("/api/users", { method: "GET" });
            const data = await res.json();
    
            if (!data?.data || data.data.length === 0) {
                console.error("Error: No users found in the database");
                return;
            }
    
            // Find the user to be deleted
            const deleteUser = data.data.find((user: ClerkUser) => user.username === username);
    
            if (!deleteUser) {
                console.error("User not found:", username);
                return;
            }
    
            // Check the number of remaining admins
            const adminUsers = data.data.filter((user: ClerkUser) => user.publicMetadata?.role === "Admin");
    
            console.log(`Number of admins remaining: ${adminUsers.length}`);
    
            if (adminUsers.length <= 1 && deleteUser.publicMetadata?.role === "Admin") {
                console.log("Cannot delete the last admin - Showing modal");
                openAdminModal();
                return; // Prevent deletion from proceeding
            }
    
            console.log("Deleting user:", deleteUser);
    
            // Send DELETE request to backend
            const response = await fetch("/api/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteUser.id })
            });
    
            const result = await response.json();
            console.log("Delete Response:", result);
    
            if (response.ok) {
                console.log("User deleted successfully:", result);
                closeModal();
                refreshPage();
            } else {
                console.error("Error deleting user:", result.error);
            }
        } catch (error) {
            console.error("User deletion failed:", error);
        }
    };     
    
    return(
        <div className="relative overflow-x-auto crimson-regular font-crimson">
        <table className="table-auto w-full">
            <thead className ="font-crimson border- crimson-regular border-separate content-start">
                <tr className="bg-dark-blue text-white text-lg align-left ">
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p className="pl-[10px]">First Name</p>
                        </div>
                    </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="font-[20px] flex flex-row justify-between">
                        <p className="pl-[10px]">Last Name</p>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="font-[20px] flex flex-row justify-between">
                        <p className="pl-[10px]">Pronouns</p>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="font-[20px] flex flex-row justify-between">
                        <p className="pl-[10px]">Username</p>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p className="pl-[10px]">Email</p>
                        </div>
                    </th>
                    <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p className="pl-[10px]">Role</p>
                        </div>
                    </th>
                    <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p className="pl-[10px]">Phone Number</p>
                        </div>
                    </th>
                <th className="font-[20px] border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Actions</th>
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
                            <td
                                key={`actions-${index}`}
                                className="flex row justify-around border-collapse border-zinc-300 border-2 border-y-1 py-2 px-3"
                            >
                                <Image
                                    src={editIcon}
                                    width={18}
                                    height={18}
                                    alt="edit Icon"
                                    className=""
                                />
                                <Image
                                    src={deleteIcon}
                                    width={18}
                                    height={18}
                                    alt="delete Icon"
                                    className="cursor-pointer"
                                    onClick={() => openModal((String(manageUsersItems[index][0])), (String(manageUsersItems[index][1])), (String(manageUsersItems[index][3])))}
                                    />
                            </td>
                        </tr>
                    ))}
            </tbody>
            </table>
            {showModal && (
                <DeleteUserModal
                    userName={`${firstName} ${lastName}`}
                    closeModal={closeModal}
                    handleDelete={handleDelete}
                />
            )}
            {showAdminModal && 
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                <div className="h-[220px] w-[450px] bg-modal-gray font-crimson fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-8 shadow-lg rounded-lg">
                <div className="flex flex-col">
                    <p className="flex justify-center text-[28px] crimson-bold px-12">
                    The system must have at least one admin.
                    </p>
                    <p className="flex justify-center text-[18px] crimson-bold text-green-100">
                    Your account was not deleted.
                    </p>
                </div>
                <div className="flex flex-row justify-around">
                    <button 
                    className="bg-light-green hover:bg-dark-green text-white font-serif py-2 px-8 rounded-full text-[20px]"
                    onClick={() => setShowAdminModal(false)}
                    >
                    OK
                    </button>
                </div>
                </div>
            </div>
            }
        </div>
    )
}