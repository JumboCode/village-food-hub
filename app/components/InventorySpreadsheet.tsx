import React from "react";
import Image from 'next/image';
import deleteIcon from '../images/delete.png';
import downloadIcon from "../images/download.png";
import editIcon from "../images/edit.png";
import arrowsIcon from "../images/upAndDownArrows.png";

interface InventorySpreadsheetProps {
    inventoryItems: (string | number)[][];
}

function formatDate(date: string | Date): string {
    // If date is a string, convert it to a Date object
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    // Ensure the date is valid
    if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date:", date);
        return "Invalid Date";
    }
    
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${month}/${day}/${year}`;
}

export const InventorySpreadsheet: React.FC<InventorySpreadsheetProps> = ({ inventoryItems = [] }) => {
    console.log("inventoryItems:", inventoryItems);

    /*interface DownloadButtonProps {
        onClick?: () => void;
    }*/

    const handleClick = () => {
        console.log('Button clicked');
    };

    const downloadCSV = (item: (string | number)[]) => {
        console.log(item);
        const itemName = item[0];
        console.log("itemName:", itemName);

        const unitData = item[3];
        console.log("unitData:", unitData);
        
        let historyData = item[5];
        let parsedHistory: any = historyData;
        parsedHistory = JSON.parse(historyData as string);
        const key = `${itemName}_${unitData}`;
        parsedHistory = parsedHistory?.[key] ?? [];

        const headers = ["date", "quantity-change", "action-of-change"];
        const rows = [
            headers.join(","), 
            ...parsedHistory.map((record: any) => [
                formatDate(record.date), 
                record.quantityChanged, 
                record.action, 
            ].map(field => `"${field}"`).join(","))
        ].join("\r\n");
    
        const fileName = `${itemName}_${unitData}_inventory.csv`;
    
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return(
        <div className="relative overflow-x-auto crimson-regular font-crimson">
        <table className="table-auto w-full">
            <thead className ="font-crimson border- crimson-regular border-separate content-start">
                <tr className="bg-dark-blue text-white text-lg align-left ">
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Item Name</p>
                        <Image src={arrowsIcon}
                                    width={15}
                                    height={15}
                                    alt="arrows Icon"
                                    className="">
                                    </Image>
                        </div>
                    </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="flex flex-row justify-between">
                        <p>Category</p>
                        <Image src={arrowsIcon}
                                    width={15}
                                    height={15}
                                    alt="arrows Icon"
                                    className="">
                                    </Image>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="flex flex-row justify-between">
                        <p>Quantity</p>
                        <Image src={arrowsIcon}
                                    width={15}
                                    height={15}
                                    alt="arrows Icon"
                                    className="">
                                    </Image>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="flex flex-row justify-between">
                        <p>Units</p>
                        <Image src={arrowsIcon}
                                    width={15}
                                    height={15}
                                    alt="arrows Icon"
                                    className="">
                                    </Image>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Last Updated</th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson crimson-regular">
            {inventoryItems.map((item, index) => (
                        <tr key={index} className="py-2">
                            {item.map((data, subIndex) => (
                                <td
                                    key={subIndex}
                                    className={`border-collapse border-zinc-200 border-2 py-2 px-3 ${subIndex === item.length - 1 ? 'hidden' : ''}`}
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
                                />
                                <button onClick={() => downloadCSV(item)} >
                                    <Image
                                        src={downloadIcon}
                                        width={18}
                                        height={18}
                                        alt="download Icon"
                                        className=""
                                    />
                                </button>
                                
                            </td>
                        </tr>
                    ))}
            </tbody>
            </table>
        </div>

    )

}