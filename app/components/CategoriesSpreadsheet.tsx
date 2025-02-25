"use client"
import React, { useState, useEffect } from "react";

import Image from 'next/image';
import deleteIcon from '../images/delete.png';
import editIcon from "../images/edit.png";
import arrowsIcon from "../images/upAndDownArrows.png";
import EditModal from "./EditModal";
import { stringify } from "querystring";

interface CategoriesSpreadsheetProps {
    categoryItems: (string | number)[][];
    selectedCategory: string;
}

const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({ categoryItems = [], selectedCategory }) => {

    const [showEditModal, setShowModal] = useState(false); 
    const [currItemName, setItemName] = useState(''); 
    const [currUnits, setUnits] = useState(''); 

    const openModal = (itemName: string, units: string) => {
        setShowModal(true);
        setItemName(itemName); 
        setUnits(units);
    };

    const closeModal = (): void => {
        setShowModal(false);
        setItemName(''); 
        setUnits('');
    };

    const refreshPage = () => {
        window.location.reload();
    };

    const fetchCurrentInventory = async (itemName: string) => {
        try {
            const response = await fetch("/api/inventory");
            if (!response.ok) throw new Error("Failed to fetch inventory data");
            const data = await response.json();
            return data.data.filter((item: any) => 
                item.itemName === itemName 
            );
        } catch (error) {
            console.error("Error fetching inventory data:", error);
            return null;
        }
    };
    
    const handleSave = async (updatedName: string, updatedUnits: string, selectedCategory: String ) => {
        // if (!currItemName || !updatedName || !updatedUnits) return;

        console.log('IN HANDLE SAVE'); 

        if (updatedUnits.length == 0) {
            updatedUnits = currUnits;
        } 

        try {
            const requestDataCateogories = {
                itemName: updatedName,
                name: selectedCategory, 
                units: updatedUnits
            };
            
            console.log('Sending request with data:', requestDataCateogories);

            const response = await fetch("/api/categories", {
                method: "PUT", 
                body: JSON.stringify(requestDataCateogories)
            });

            if (!response.ok) throw new Error(`I fucked up: ${response.status}`);

            closeModal();
            refreshPage();

        } catch (error) {
            console.error("Error updating data:", error);
            closeModal();
        }
    };

    return (
        <div className="relative overflow-x-auto font-arial bg-slate-50">
            <table className="table-auto w-full">
                <thead className="font-crimson crimson-regular content-start">
                    <tr className="bg-dark-blue text-white text-lg align-left">
                        <th className="border-r-2 border-slate-400 border-y-1 py-2 px-3">
                            <div className="flex flex-row justify-between">
                                <p>Item Name</p>
                                <Image src={arrowsIcon} width={10} height={6} alt="arrows Icon" />
                            </div>
                        </th>
                        <th className="border-r-2 border-slate-400 py-2 px-3">Units</th>
                        <th className="py-2 px-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-slate-50 font-crimson crimson-regular">
                    {categoryItems.map((item, index) => (
                        <tr key={index} className="py-2">
                            {item.map((data, subIndex) => (
                                <td key={subIndex} className="border-r-2 border-slate-200 py-2 px-3">{data}</td>
                            ))}
                            <td key={`actions-${index}`} className="flex row justify-around py-2 px-3">
                                <Image
                                    src={editIcon}
                                    width={18}
                                    height={18}
                                    alt="edit Icon"
                                    className="cursor-pointer"
                                    onClick={() => openModal(String(categoryItems[index][0]), String(categoryItems[index][1]))}
                                />
                                <Image src={deleteIcon} width={18} height={18} alt="delete Icon" className="cursor-pointer" />
                                {showEditModal && <EditModal itemName={currItemName} units={currUnits} closeModal={closeModal} handleSave={handleSave} selectedCategory={selectedCategory} />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesSpreadsheet;

