import React, { useState, useEffect } from "react";
import Image from 'next/image';
import deleteIcon from '../images/delete.png';
import editIcon from "../images/edit.png";
import arrowsIcon from "../images/upAndDownArrows.png";

interface CategoriesSpreadsheetProps {
    categoryName: string;
    categoryItems: (string | number)[][];
}

const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({ categoryName = "", categoryItems = [] }) => {
    console.log("categoryItems:", categoryItems);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [modalCategory, setModalCategory] = useState("");
    const [modalItem, setModalItem] = useState<(string | number)[]>([]);
    const [itemWarning, setItemWarning] = useState(false);
    const [unitWarning, setUnitWarning] = useState(-1);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    
    // to open the modal to delete parts of an item
    const openDeleteModal = (categoryName: string, item: (string | number)[]) => {
        setIsDeleteModalVisible(true);
        setModalCategory(categoryName);
        setModalItem(item);
    }

    // to close the modal that deletes parts of an item
    const closeDeleteModal = () => {
        setIsDeleteModalVisible(false);
        setModalCategory("");
        setModalItem([]);
        setItemWarning(false);
        setUnitWarning(-1);
        setDeleteConfirmation(false);
    }

    // deleting the specific item
    const deleteItem = () => {
        closeDeleteModal();
        setDeleteConfirmation(true);
    }

    // deleting the item's unit
    const deleteUnit = () => {
        setUnitWarning(-1);
        // TODO: BACKEND
    }

    return (
        <>
        {/* Table */}
        <div className="relative overflow-x-auto font-arial bg-slate-50">
        <table className="table-auto w-full">
            <thead className ="font-crimson crimson-regular content-start">
                <tr className="bg-dark-blue text-white text-lg align-left ">
                <th className="border-r-2 border-slate-400 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Item Name</p>
                        <Image src={arrowsIcon}
                            width={10}
                            height={6}
                            alt="arrows Icon"
                            className="">
                        </Image>
                        </div>
                    </th>
                <th className="border-r-2 border-slate-400 py-2 px-3">Units</th>
                <th className=" py-2 px-3">Actions</th>
                </tr>
            </thead>
                <tbody className="bg-slate-50 font-crimson crimson-regular">
                {categoryItems.map((item, index) => (
                        <tr key={index} className="py-2">
                            {item.map((data, subIndex) => (
                                <td
                                    key={subIndex}
                                    className="border-r-2 border-slate-200 py-2 px-3"
                                >
                                    {data}
                                </td>
                            ))}
                            <td
                                key={`actions-${index}`}
                                className="flex row justify-around py-2 px-3"
                            >
                                <Image
                                    src={editIcon}
                                    width={18}
                                    height={18}
                                    alt="edit Icon"
                                    className=""
                                />
                                <button onClick={() => openDeleteModal(categoryName, item)}>
                                    <Image
                                        src={deleteIcon}
                                        width={18}
                                        height={18}
                                        alt="delete Icon"
                                        className=""
                                    />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modal */}
        {isDeleteModalVisible &&
            <div className="flex absolute top-0 left-0 justify-center items-center w-full h-full z-20 bg-black bg-opacity-50">
                <div className="flex flex-col justify-center space-y-3 w-[533px] py-[20px] px-[27px] bg-white rounded-[7px] border-[2px] border-[#EB2B0C] z-50">
                    <p className="text-[32px] font-crimson crimson-bold text-[#EB2B0C]">
                        Delete Menu
                    </p>

                    {/* Warning if deleting an item */}
                    {itemWarning && 
                        <div className="flex flex-row items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-Width="2" stroke="#EB2B0C" className="size-6 pb-[1px]">
                                <path stroke-Linecap="round" stroke-Linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>

                            <p className="font-crimson font-bold text-[#EB2B0C] text-[20px]">All inventory entries with this item will be deleted.</p>
                        </div>
                    }
                    
                    {/* Item Row */}
                    <div className="flex flex-row w-full justify-center items-center">
                        <p className="text-[32px] flex w-[15%] font-crimson crimson-semibold justify-center items-center">
                            Item
                        </p>
                        <div className="flex w-[60%] px-[30px]">
                            <p className={`flex text-[24px] items-center w-full pl-[20px] h-[50px] font-crimson ${itemWarning && "rounded-[13px] border-[3px] border-[#EB2B0C]"}`}>
                                {modalItem[0]}
                            </p>
                        </div>
                        <div className={`flex w-[25%] ${!itemWarning ? "justify-end" : "justify-center"} items-center pr-1`}>                            
                            {!itemWarning 
                            ?
                                // Trashcan
                                <button onClick={() => setItemWarning(true)}>
                                    <Image
                                        src={deleteIcon}
                                        width={18}
                                        height={18}
                                        alt="delete Icon"
                                        className="h-4/5"
                                    />
                                </button>
                            :
                                // Decision
                                <div className="flex flex-col">
                                    <p className="font-crimson crimson-bold text-[#EB2B0C] text-[20px] text-center">Are you sure?</p>
                                    <div className="flex flex-row space-x-2">
                                        <button onClick={() => setItemWarning(false)}>
                                            <div className="w-[65px] h-[25px] rounded-[8px] border-[#828282] border-[1px]">
                                                <p className="font-crimson text-[#828282] text-[16px] crimson-semibold">Cancel</p>
                                            </div>
                                        </button>
                                        <button onClick={() => deleteItem()}>
                                            <div className="w-[65px] h-[25px] rounded-[8px] bg-[#EB2B0C]">
                                                <p className="font-crimson text-[#FFFFFF] text-[16px] crimson-semibold">Delete</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    {/* Map of Units */}
                    <div>
                        {modalItem[1].toString().split(", ").map((item, index) => (
                            <div key={index} className="flex flex-row w-full justify-center items-center pb-3">
                                <p className="text-[32px] w-[15%] flex justify-center items-center font-crimson crimson-semibold">
                                    Units
                                </p>
                                <div className="flex w-[60%] px-[30px]">
                                    <p className={`flex text-[24px] items-center w-full pl-[20px] h-[50px] font-crimson ${unitWarning === index && "rounded-[13px] border-[3px] border-[#EB2B0C]"}`}>
                                        {item}
                                    </p>
                                </div>
                                <div className={`flex w-[25%] ${unitWarning !== index ? "justify-end" : "justify-center"} items-center pr-1`}>
                                    {unitWarning !== index
                                    ?
                                        <button onClick={() => setUnitWarning(index)}>
                                            <Image
                                                src={deleteIcon}
                                                width={18}
                                                height={18}
                                                alt="delete Icon"
                                                className="h-4/5"
                                            />
                                        </button>
                                        :
                                            // Decision
                                            <div className="flex flex-col">
                                                <p className="font-crimson crimson-bold text-[#EB2B0C] text-[20px] text-center">Are you sure?</p>
                                                <div className="flex flex-row space-x-2">
                                                    <button onClick={() => setUnitWarning(-1)}>
                                                        <div className="w-[65px] h-[25px] rounded-[8px] border-[#828282] border-[1px]">
                                                            <p className="font-crimson text-[#828282] text-[16px] crimson-semibold">Cancel</p>
                                                        </div>
                                                    </button>
                                                    <button onClick={() => deleteUnit()}>
                                                        <div className="w-[65px] h-[25px] rounded-[8px] bg-[#EB2B0C]">
                                                            <p className="font-crimson text-[#FFFFFF] text-[16px] crimson-semibold">Delete</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center">
                        <button className="w-[117px] h-[46px] rounded-[8px] border-[1px] border-[#828282]" onClick={() => closeDeleteModal()}>
                            <p className="text-[#828282] text-[24px] font-crimson">
                                Close
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        }

        {/* Confirmation Modal */}
        {deleteConfirmation &&
            <div className="flex absolute top-0 left-0 justify-center items-center w-full h-full z-20 bg-black bg-opacity-50">
                <div className="flex flex-col justify-center space-y-3 w-[533px] py-[20px] px-[27px] bg-white rounded-[7px] border-[2px] border-[#EB2B0C] z-50">
                    <p className="text-[32px] font-crimson crimson-bold text-[#EB2B0C]">
                        Delete Menu
                    </p>
                    <p className="text-[32px] flex font-crimson crimson-semibold items-center justify-start">
                        Item deleted.
                    </p>
                    <div className="flex justify-center items-center">
                        <button className="w-[117px] h-[46px] rounded-[8px] border-[1px] border-[#828282]" onClick={() => closeDeleteModal()}>
                            <p className="text-[#828282] text-[24px] font-crimson">
                                Close
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        }
    </>

    )
}

export default CategoriesSpreadsheet;