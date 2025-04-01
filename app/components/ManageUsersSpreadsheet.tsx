'use client';

import React, { useState, useEffect } from "react";
import { TiArrowUnsorted } from "react-icons/ti";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import DeleteUserModal from "@app/components/DeleteUserModal";
import EditUserModal from "@app/components/EditUserModal";

interface ManageUsersSpreadsheetProps {
    manageUsersItems: string[][];
    isLoading?: boolean;
}

interface ClerkUser {
    id?: string;
    username?: string;
    publicMetadata?: {
        role?: string;
    };
}

export const ManageUsersSpreadsheet: React.FC<ManageUsersSpreadsheetProps> = ({ manageUsersItems = [], isLoading = false }) => {
    console.log("manageUsersItems:", manageUsersItems);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<string[][]>([]);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ClerkUser | null>(null);
    const [sortedItems, setSortedItems] = useState<string[][]>([]);
    const [topSorted, setTopSorted] = useState<boolean>(false);

    useEffect(() => {
        setSortedItems(manageUsersItems);
      }, [manageUsersItems]);      

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

    const sortAlphabetically = (columnIndex: number) => {
        const sorted = [...sortedItems].sort((a, b) =>
          topSorted
            ? a[columnIndex]?.localeCompare(b[columnIndex] || "")
            : b[columnIndex]?.localeCompare(a[columnIndex] || "")
        );
      
        setSortedItems(sorted);
        setTopSorted(!topSorted);
    };      

    const isLastAdmin = (username: string): boolean => {
        const selected = allUsers.find(user => user[1] === username);
        if (!selected) return false;
    
        const selectedUserRole = selected[2];
        const adminCount = allUsers.filter(user => user[2] === "Admin").length;
    
        return selectedUserRole === "Admin" && adminCount === 1;
    };    
    
    const openEditModal = (firstName: string, lastName: string, username: string, role: string) => {
        setFirstName(firstName);
        setLastName(lastName);
        setUsername(username);
    
        if (isLastAdmin(username)) {
            console.log("Cannot edit the last Admin - Showing Admin modal");
            setShowAdminModal(true);
            return;
        }
    
        const selected = allUsers.find(user => user[1] === username);
        if (!selected) return console.error("Error: Selected user not found in the user list.");
    
        setSelectedUser({
            id: selected[0],
            username: selected[1],
            publicMetadata: { role: selected[2] }
        });
    
        setShowEditModal(true);
    };
    
    const openDeleteModal = (firstName: string, lastName: string, username: string, role: string) => {
        setFirstName(firstName);
        setLastName(lastName);
        setUsername(username);
    
        if (isLastAdmin(username)) {
            console.log("Cannot delete the last Admin - Showing Admin modal");
            setShowAdminModal(true);
            return;
        }
    
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

    const handleSave = async (updatedRole: string, userId: string) => {
        try {
            if (!userId) {
                throw new Error("User ID is missing before making API request.");
            }
    
            const payload = {
                userId,
                firstName,
                lastName,
                role: updatedRole,
            };
    
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update user");
            }
            
            setSortedItems(prevItems =>
                prevItems.map(row =>
                    row[3] === username
                        ? [...row.slice(0, 5), updatedRole, ...row.slice(6)]
                        : row
                )
            );

            setAllUsers(prevUsers =>
                prevUsers.map(user =>
                    user[1] === username ? [user[0], user[1], updatedRole] : user
                )
            );
            closeModals();
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
                setShowAdminModal(true);
                return;
            }
    
            console.log("Deleting user:", deleteUser);
            
            console.log("id: " + deleteUser.id);
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

                // Update sortedItems and allUsers state to reflect the deletion
                setSortedItems(prevItems =>
                    prevItems.filter(row => row[3] !== username)
                );

                setAllUsers(prevUsers =>
                    prevUsers.filter(user => user[1] !== username)
                );
                closeModals();
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
                <thead className="font-crimson border-crimson-regular border-separate content-start">
                    <tr className="bg-dark-blue text-white text-lg align-left">
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                            First Name
                            <button onClick={() => sortAlphabetically(0)} className="ml-2">
                                <TiArrowUnsorted className="inline text-xl cursor-pointer" />
                            </button>
                        </th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                            Last Name
                            <button onClick={() => sortAlphabetically(1)} className="ml-2">
                                <TiArrowUnsorted className="inline text-xl cursor-pointer" />
                            </button>
                        </th> 
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                            Pronouns
                            <button onClick={() => sortAlphabetically(2)} className="ml-2">
                                <TiArrowUnsorted className="inline text-xl cursor-pointer" />
                            </button>
                        </th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                            Username
                            <button onClick={() => sortAlphabetically(3)} className="ml-2">
                                <TiArrowUnsorted className="inline text-xl cursor-pointer" />
                            </button>
                        </th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                            Email
                            <button onClick={() => sortAlphabetically(4)} className="ml-2">
                                <TiArrowUnsorted className="inline text-xl cursor-pointer" />
                            </button>
                        </th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                            Role
                            <button onClick={() => sortAlphabetically(5)} className="ml-2">
                                <TiArrowUnsorted className="inline text-xl cursor-pointer" />
                            </button>
                        </th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Phone Number</th>
                        <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson crimson-regular">
                    {isLoading ? (
                        <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-500">
                            Loading users…
                        </td>
                        </tr>
                    ) : (
                        sortedItems.map((row, rowIndex) => (
                        <tr key={rowIndex} className="py-2">
                        {row.map((cell, colIndex) => (
                            <td
                            key={colIndex}
                            className="border-collapse border-zinc-200 border-2 border-y-1 px-3"
                            >
                            {String(cell)}
                            </td>
                        ))}
                        <td className="border-collapse border-zinc-200 border-2 border-y-1 px-4 text-center">
                            <span className="inline-flex justify-center gap-4">
                            <MdOutlineEdit
                                size={24}
                                onClick={() => openEditModal(row[0], row[1], row[3], row[5])}
                                className="cursor-pointer"
                            />
                            <MdDeleteOutline
                                size={24}
                                onClick={() => openDeleteModal(row[0], row[1], row[3], row[5])}
                                className="cursor-pointer"
                            />
                            </span>
                        </td>
                        </tr>
                    )))}
                    </tbody>
            </table>
            {showEditModal && (
                <EditUserModal
                    userId={selectedUser?.id || ""}
                    userData={[firstName || "N/A", lastName || "N/A", username || "N/A", selectedUser?.publicMetadata?.role || "N/A"]}
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