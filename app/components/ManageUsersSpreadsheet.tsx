import React, {useState, useEffect} from "react";
import Image from 'next/image';
import editIcon from '@app/images/edit.png';
import deleteIcon from '@app/images/delete.png';
import arrowsIcon from "@app/images/upAndDownArrows.png";
import DeleteUserModal from "@app/components/DeleteUserModal";
// import { NextRequest, NextResponse } from 'next/server';
// import { clerkClient } from '@clerk/nextjs/server';
// import { constants } from "node:buffer";

interface ManageUsersSpreadsheetProps {
    manageUsersItems: string[][];
}

export const ManageUsersSpreadsheet: React.FC<ManageUsersSpreadsheetProps> = ({ manageUsersItems = [] }) => {
    console.log("manageUsersItems:", manageUsersItems);
    const [showModal, setShowModal] = useState(false);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [showAdminModal, setShowAdminModal] = useState(false);

    const openModal = (firstName: string, lastName: string, username: string) => {
        setShowModal(true);
        setFirstName(firstName); 
        setLastName(lastName)
        setUsername(username); 
    };

    const closeModal = (): void => {
        setShowModal(false);
        setFirstName(null);
        setLastName(null);
        setUsername(null); 
    };

    const openAdminModal = (): void => {
        setShowAdminModal(true);
    }

    const closeAdminModal = (): void => {
        setShowAdminModal(false);
    }

    const refreshPage = () => {
        window.location.reload();
    };

    const handleDelete = async () => {
        // Check that there's enough admins:
        // Try to delete user
        if (!username) return;


    
        try {

            console.log("trying to delete user", username);

            // GET USER  ID 
            const response = await fetch('/../api/users/', {
                method: 'GET', 
                // body: JSON.stringify({username})
            })
            const result = await response.json()

            console.log(result)

            const user = result.filter(
                user => user.publicMetadatausername === username
            );

            console.log(user.id)

            // if (user.ok) {
            //     const userid = user.id
            // }
            // MAKE CALL TO DELETE USING THE USERID

            // const response = await fetch('/../api/users', {
            //     method: 'DELETE', 
            //     body: JSON.stringify({username})
            // })


            // if (response.ok) {
            //     if (result.showAdminModal) {
            //         setShowAdminModal(true);
            //         return; 
            //     }
            // }
         
        } catch (error) {
            console.error('User not deleted: ', error);
           
        }

        closeModal(); 
        closeAdminModal(); 
        // refreshPage();

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
                                    className=""
                                    onClick={() => openModal((String(manageUsersItems[index][0])), (String(manageUsersItems[index][1])), (String(manageUsersItems[index][3])))}
                                    />

                                {showModal && <DeleteUserModal userName={String(firstName) + " " + String(lastName)} closeModal={closeModal} handleDelete={handleDelete}/> }
                                {showAdminModal && 
                                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                                 <div
                                   className="h-[260px] w-[400px] bg-modal-gray font-crimson
                                              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                              pt-8 shadow-lg rounded-lg"
                                 >
                                   <div className="flex flex-col">
                                    <p className="flex justify-center text-[28px] crimson-bold">The system has to have at least one admin.</p>
                                
                                    
                                    <p className='flex justify-center text-[18px] crimson-bold text-green-100'>Your account was not deleted</p>
                                   </div>
                                   <div className="flex flex-row justify-around pt-8">

                                   <button 
                                            className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]"
                                            onClick={() => (setShowAdminModal(false))}
                                        >
                                            { "Okay" }
                                        </button>
                                    </div>
                                 </div>
                               </div>
                               }
                            </td>
                        </tr>
                    ))}
            </tbody>
            </table>
        </div>
    )
}