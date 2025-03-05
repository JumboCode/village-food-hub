"use client"
import React, { useState } from "react";
import Image from 'next/image';
import deleteIcon from '@app/images/delete.png';
import editIcon from "@app/images/edit.png";
import arrowsIcon from "@app/images/upAndDownArrows.png";
import EditModal from "@app/components/EditModal";

interface CategoriesSpreadsheetProps {
    categoryItems: (string | number)[][];
    selectedCategory: string;
}

const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({ categoryItems = [], selectedCategory }) => {
    const [showEditModal, setShowModal] = useState(false);
    const [currItemName, setItemName] = useState(''); 
    const [currUnits, setCurrUnits] = useState<string[]>([]);

    // Modify openModal to also accept a units string from the row
    const openModal = (itemName: string, unitsStr: string) => {
        setShowModal(true);
        setItemName(itemName);
        // Assuming units are stored as a comma-separated string, parse it into an array.
        const parsedUnits = unitsStr.split(',').map(unit => unit.trim()).filter(Boolean);
        setCurrUnits(parsedUnits);
    };

    const closeModal = (): void => {
        setShowModal(false);
        setItemName(''); 
        setCurrUnits([]);
    };

    const handleSave = async (
        oldItemName: string,
        newItemName: string,
        updatedUnits: string[],
        selectedCategory: string
      ) => {
        try {
          const validUnits = updatedUnits.filter(
            (unit) => unit && unit.trim() !== ""
          );
          const payload = {
            oldItemName: oldItemName.trim(),
            itemName: newItemName.trim(),
            name: selectedCategory.trim(),
            units: validUnits,
          };
          console.log("Sending request with payload:", payload);
          const response = await fetch("/api/categories", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            console.log(
              `Error editing category with server response: ${response.status}`
            );
          }
          closeModal();
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
                                <td key={subIndex} className="border-r-2 border-slate-200 py-2 px-3">
                                    {data}
                                </td>
                            ))}
                            <td key={`actions-${index}`} className="flex row justify-around py-2 px-3">
                                <Image
                                    src={editIcon}
                                    width={18}
                                    height={18}
                                    alt="edit Icon"
                                    className="cursor-pointer"
                                    // Pass both item name and its associated units (assumed to be in the second column)
                                    onClick={() => openModal(String(categoryItems[index][0]), String(categoryItems[index][1]))}
                                />
                                <Image
                                    src={deleteIcon}
                                    width={18}
                                    height={18}
                                    alt="delete Icon"
                                    className="cursor-pointer"
                                />
                                {showEditModal && (
                                    <EditModal 
                                        itemNameOld={currItemName} 
                                        initialUnits={currUnits}
                                        closeModal={closeModal} 
                                        handleSave={handleSave} 
                                        selectedCategory={selectedCategory} 
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesSpreadsheet;