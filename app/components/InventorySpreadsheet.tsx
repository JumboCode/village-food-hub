import React, { useEffect, useState } from "react";
import Image from 'next/image';
import deleteIcon from '@app/images/delete.png';
import downloadIcon from "@app/images/download.png";
import editIcon from "@app/images/edit.png";
import { TiArrowUnsorted } from "react-icons/ti";

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

    const [sortedItems, setSortedItems] = useState<(string | number)[][]>(inventoryItems);
    const [topSorted, setTopSorted] = useState(true);
    const [quantityAscending, setQuantityAscending] = useState(true);
    const [DateAscending, setDateAscending] = useState(false);

    useEffect(() => {
        setSortedItems([...inventoryItems]);
    }, [inventoryItems]);

    const sortAlphabetically = () => {
        const sortedList = [...sortedItems].sort((a,b) =>
            topSorted ? a[0].localeCompare(b[0].toString()) : b[0].localeCompare(a[0].toString())
    );
    
        setSortedItems(sortedList);
        setTopSorted(!topSorted);
    }

    const sortQuantity= () => {
        const sortedList = [...sortedItems].sort((a,b) =>
            quantityAscending ?  Number(b[2]) - Number(a[2]) : Number(a[2]) - Number(b[2])
    );
        setSortedItems(sortedList);
        setQuantityAscending(!quantityAscending);
    }

    const sortDate = () => {
    
        const sortedList = [...sortedItems].sort((a, b) => {
            const dateA = new Date(a[4]); 
            const dateB = new Date(b[4]);
    
            return DateAscending ? dateB.getTime() - dateA.getTime(): dateA.getTime() - dateB.getTime();
        });
        
        setSortedItems(sortedList);
        setDateAscending(!DateAscending); 
    };

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
            <thead className ="font-crimson crimson-regular border-separate content-start">
                <tr className="bg-dark-blue text-white text-lg align-left ">
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Item Name</p>
                        <button onClick={() => sortAlphabetically()}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                            <p>Category</p>
                            <button onClick={() => sortAlphabetically()}>
                                <TiArrowUnsorted />
                            </button>
                    </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Quantity</p>
                        <button onClick={() => sortQuantity()}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Units</p>
                        <button onClick={() => sortAlphabetically()}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="flex flex-row justify-between">
                    <p>Last Updated</p>
                    <button onClick={sortDate}>
                        <TiArrowUnsorted />
                    </button>
                </div>
            </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson crimson-regular">
            {sortedItems.map((item, index) => (
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