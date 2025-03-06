import React from "react";
import { useState } from "react";
import Image from 'next/image';
import editIcon from '@app/images/edit.png';
import deleteIcon from '@app/images/delete.png';
import arrowsIcon from "@app/images/upAndDownArrows.png";
import EditUserModal from "@app/components/EditUserModal";


interface ManageUsersSpreadsheetProps {
    manageUsersItems: string[][];
}


export const ManageUsersSpreadsheet: React.FC<ManageUsersSpreadsheetProps> = ({ manageUsersItems = [] }) => {
    console.log("manageUsersItems:", manageUsersItems);

    const [showModal, setShowModal] = useState(false); 
    const [selectedUser, setSelectedUser] = useState<string[] | null>(null);

    const openModal = (userData: string[]) => {
        setSelectedUser(userData);
        setShowModal(true);
    }
    
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    }

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
                                    onClick={() => openModal(String(item[0]), String(item[1]))}
                                />
                                {showModal && selectedUser && (
                    <EditUserModal userData={selectedUser} onClose={closeModal} />
                            )}
                                <Image
                                    src={deleteIcon}
                                    width={18}
                                    height={18}
                                    alt="delete Icon"
                                    className=""
                                />
                            </td>
                        </tr>
                    ))}
            </tbody>
            </table>
        </div>
    )
}