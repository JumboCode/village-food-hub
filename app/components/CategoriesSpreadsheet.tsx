"use client"
import React, { useState, useEffect } from "react";

import Image from 'next/image';
import deleteIcon from '../images/delete.png';
import editIcon from "../images/edit.png";
import arrowsIcon from "../images/upAndDownArrows.png";
import EditModal from "./EditModal";

interface CategoriesSpreadsheetProps {
    categoryItems: (string | number)[][];
}

const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({ categoryItems = [] }) => {
    const [showEditModal, setShowModal] = useState(false); 
    const [currItemName, setItemName] = useState<string | null>(null);
    const [currUnits, setUnits] = useState<string | null>(null);

    const openModal = (itemName: string, units: string) => {
        setShowModal(true);
        setItemName(itemName); 
        setUnits(units);
        console.log("Item to edit:", itemName); 
        console.log("Unit to edit:", units); 
    };

    const closeModal = (): void => {
        setShowModal(false);
        setItemName(null); 
        setUnits(null);
    };

    const refreshPage = () => {
        window.location.reload();
    };

    const fetchCurrentInventory = async () => {
        try {
            const response = await fetch("/api/inventory");
            if (!response.ok) throw new Error("Failed to fetch inventory data");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching inventory data:", error);
            return null;
        }
    };

    const handleSave = async (updatedName: string, updatedUnits: string) => {
        if (!currItemName || !updatedName || !updatedUnits) return;

        try {
            console.log("Fetching current inventory...");
            const inventoryData = await fetchCurrentInventory();
            if (!inventoryData) return;

            const requestData = {
                itemName: currItemName,
                name: updatedName, // TODO: Are we updating the category name? Do we want this here?
                units: [updatedUnits]
            };
            
            console.log('Sending request with data:', requestData);

            const response = await fetch("/api/categories", {
                method: "PUT", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            console.log("Checking for unit renaming...");
            if (currUnits !== updatedUnits) {
                console.log("Updating units in inventory...");
                await fetch("/api/inventory", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ oldUnit: currUnits, newUnit: updatedUnits })
                });
            }

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
                                {showEditModal && <EditModal itemName={String(currItemName)} units={String(currUnits)} closeModal={closeModal} handleSave={handleSave} />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesSpreadsheet;


// "use client"
// import React, {useState, useEffect} from "react";

// import Image from 'next/image';
// import deleteIcon from '../images/delete.png';
// import editIcon from "../images/edit.png";
// import arrowsIcon from "../images/upAndDownArrows.png";
// import EditModal from "./EditModal";

// interface CategoriesSpreadsheetProps {
//     categoryItems: (string | number)[][];
// }

// const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({ categoryItems = [] }) => {

//     const [showEditModal, setShowModal] = useState(false); 
//     const [curritemName, setItemName] = useState<string | null>(null);
//     const [units, setUnits] = useState<string | null>(null);

//     const openModal = (itemName: string, units: string) => {
//         setShowModal(true);
//         setItemName(itemName); 
//         setUnits(units);
//         console.log("Item to edit:", itemName); 
//         console.log("Unit to edit:", units); 
//       };

//       const closeModal = (): void => {
//         setShowModal(false);
//         setItemName(null); 
//         setUnits(null);
//       };

//       const refreshPage = () => {
//         window.location.reload();
//       };


//     const handleSave = async (updatedName: string, updatedUnits: string) => {
//         if (!curritemName || !updatedName || !updatedUnits) return;

//         const requestData = {
//             itemName: curritemName,
//             name: updatedName,
//             units: [updatedUnits]
//         };
        
//         console.log('Sending request with data:', requestData);


//         try {
//             console.log("FETCH CALL")
//             const response = await fetch("/api/categories", {
//                 method: "PUT", 
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(requestData)
//             }); 

//             console.log("response recieved in spreadhseet", response.status);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             closeModal();
//             refreshPage();


//         } catch (error) {
//             console.error(error)
//             closeModal();
//         }
//     }


//     console.log("categoryItems:", categoryItems);

//     return(
//         <div className="relative overflow-x-auto font-arial bg-slate-50">
//         <table className="table-auto w-full">
//             <thead className ="font-crimson crimson-regular content-start">
//                 <tr className="bg-dark-blue text-white text-lg align-left ">
//                 <th className="border-r-2 border-slate-400 border-y-1 py-2 px-3">
//                     <div className="flex flex-row justify-between">
//                         <p>Item Name</p>
//                         <Image src={arrowsIcon}
//                                     width={10}
//                                     height={6}
//                                     alt="arrows Icon"
//                                     className="">
//                                     </Image>
//                         </div>
//                     </th>
//                 <th className="border-r-2 border-slate-400 py-2 px-3">Units</th>
//                 <th className=" py-2 px-3">Actions</th>
//                 </tr>
//             </thead>
//             <tbody className="bg-slate-50 font-crimson crimson-regular">
//             {categoryItems.map((item, index) => (
//                         <tr key={index} className="py-2">
//                             {item.map((data, subIndex) => (
//                                 <td
//                                     key={subIndex}
//                                     className="border-r-2 border-slate-200 py-2 px-3"
//                                 >
//                                     {data}
//                                 </td>
//                             ))}
//                             <td
//                                 key={`actions-${index}`}
//                                 className="flex row justify-around py-2 px-3"
//                             >
//                                 <Image
//                                     src={editIcon}
//                                     width={18}
//                                     height={18}
//                                     alt="edit Icon"
//                                     className=""
//                                     onClick={() => openModal((String(categoryItems[index][0])), (String(categoryItems[index][1])))}
//                                     // onClick={() => openModal()}
//                                 />
//                                 <Image
//                                     src={deleteIcon}
//                                     width={18}
//                                     height={18}
//                                     alt="delete Icon"
//                                     className=""
//                                 />
//                                 {showEditModal && <EditModal itemName={String(curritemName)}  units={String(units)} closeModal={closeModal} handleSave={handleSave}/> }
//                             </td>
//                         </tr>
//                     ))}
//             </tbody>
//             </table>
//         </div>

//     )
// }

// export default CategoriesSpreadsheet;