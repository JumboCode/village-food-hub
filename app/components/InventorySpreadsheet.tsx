import React from "react";
import Image from 'next/image';
import deleteIcon from '../images/delete.png';
import downloadIcon from "../images/download.png";
import editIcon from "../images/edit.png";
import arrowsIcon from "../images/upAndDownArrows.png";

interface InventorySpreadsheetProps {
    inventoryItems: (string | number)[][];
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
        const itemName = item[0];
        const headers = ["date", "quantity-change", "action-of-change"];
        const rows = [
            headers.join(","), 
            ...filteredData.map(record => [
                record.phoneNumber, 
                record.name, 
                record.address, 
                record.householdSize.toString(), 
                record.visitCount.toString()
            ].map(field => `"${field}"`).join(","))
        ].join("\r\n");
    
        const fileName = `inventory.csv`;
    
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
                                />
                                <button onClick={handleClick} >
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