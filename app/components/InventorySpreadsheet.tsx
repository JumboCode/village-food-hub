import React, { useEffect, useState } from "react";
import Image from 'next/image';
import deleteIcon from '@app/images/delete.png';
import downloadIcon from "@app/images/download.png";
import editIcon from "@app/images/edit.png";
import { TiArrowUnsorted } from "react-icons/ti";
import DeleteInventoryModal from "@app/components/DeleteInventoryModal";
import QuantityModal from "@app/components/QuantityModal";

interface InventorySpreadsheetProps {
    inventoryItems: (string | number)[][];
}

interface InventoryHistoryRecord {
    date: string; // or Date if preferred, but string is used for formatting
    quantityChanged: number;
    action: string;
}

function formatDate(date: string | Date): string {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

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
    const [showModal, setShowModal] = useState(false);
    const [itemName, setItemName] = useState<string | null>(null);
    const [units, setUnits] = useState<string | null>(null);
    const [currCategoryName, setCurrCategoryName] = useState<string | null>(null);


    const [showQuantityModal, setShowQuantityModal] = useState(false); 


    const closeQuantityModal = (): void => {
        setShowQuantityModal(false);
        setItemName(null);
        setUnits(null);
        setCurrCategoryName(null);
    };

    const openQuantityModal = (itemName: string, units: string, category: string): void => {
        setShowQuantityModal(true);
        setItemName(itemName);
        setUnits(units);
        setCurrCategoryName(category);
    };

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
    
    const openModal = (itemName: string, units: string) => {
        setShowModal(true);
        setItemName(itemName);
        setUnits(units);
    };

    const closeModal = (): void => {
        setShowModal(false);
        setItemName(null);
        setUnits(null);
    };
    
    const refreshPage = () => {
        window.location.reload();
    };
    
    const handleUpdateQuantity = async (itemName: string, units: string, quantityChange: number, categoryName: string) => {
        if (!itemName || !units) return;

        const updatedData = {
            categoryName,
            itemName,
            quantity: Number(quantityChange),
            units,
            lastUpdated: new Date(),
        }
        try {
            const response = await fetch("/../api/inventory", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...updatedData,
                    quantity: quantityChange,
                  }),
            });
            if (!response.ok) {
                throw new Error("Error updating inventory data.");
            }
            closeQuantityModal();
            refreshPage();
            console.log("Updated successfully!");
          
        } catch (error) {
            console.log(error);
            closeQuantityModal();

        }
    };

    const handleDelete = async () => {
        if (!itemName || !units) return;
        const deleteItem = { itemName, units };

        try {
            const response = await fetch("/../api/inventory", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: deleteItem }),
            });

            if (!response.ok) {
                throw new Error("Error fetching inventory data.");
            }
            refreshPage();
            console.log("Deleted successfully!");
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const downloadCSV = (item: (string | number)[]) => {
        console.log(item);
        const itemName = item[0];
        const unitData = item[3];
        const historyData = item[5];
        
        // Build a key to extract the relevant history records
        const key = `${itemName}_${unitData}`;
        let historyRecords: InventoryHistoryRecord[] = [];
        try {
            // Parse historyData as a JSON object whose keys map to arrays of InventoryHistoryRecord
            const parsedData = JSON.parse(historyData as string) as Record<string, InventoryHistoryRecord[]>;
            historyRecords = parsedData?.[key] ?? [];
        } catch (e) {
            console.error("Error parsing history data:", e);
        }

        const headers = ["date", "quantity-change", "action-of-change"];
        const rows = [
            headers.join(","), 
            ...historyRecords.map((record: InventoryHistoryRecord) =>
                [
                    formatDate(record.date),
                    record.quantityChanged,
                    record.action
                ].map(field => `"${field}"`).join(",")
            )
        ].join("\r\n");
    
        const fileName = `${itemName}_${unitData}_inventory.csv`;
    
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative overflow-x-auto crimson-regular font-crimson">
          <table className="table-auto w-full">
            <thead className="font-crimson border-crimson-regular border-separate content-start">
              <tr className="bg-dark-blue text-white text-lg align-left">
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Item Name</p>
                    <button onClick={sortAlphabetically}>
                      <TiArrowUnsorted />
                    </button>
                    <Image
                      src={arrowsIcon}
                      width={15}
                      height={15}
                      alt="arrows Icon"
                      className=""
                    />
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Category</p>
                    <button onClick={sortAlphabetically}>
                      <TiArrowUnsorted />
                    </button>
                    <Image
                      src={arrowsIcon}
                      width={15}
                      height={15}
                      alt="arrows Icon"
                      className=""
                    />
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Quantity</p>
                    <button onClick={sortQuantity}>
                      <TiArrowUnsorted />
                    </button>
                    <Image
                      src={arrowsIcon}
                      width={15}
                      height={15}
                      alt="arrows Icon"
                      className=""
                    />
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Units</p>
                    <button onClick={sortAlphabetically}>
                      <TiArrowUnsorted />
                    </button>
                    <Image
                      src={arrowsIcon}
                      width={15}
                      height={15}
                      alt="arrows Icon"
                      className=""
                    />
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Last Updated</p>
                    <button onClick={sortDate}>
                      <TiArrowUnsorted />
                    </button>
                    <Image
                      src={arrowsIcon}
                      width={15}
                      height={15}
                      alt="arrows Icon"
                      className=""
                    />
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson">
              {sortedItems.map((item, index) => (
                <tr key={index} className="py-2">
                  {item.map((data, subIndex) => (
                    <td
                      key={subIndex}
                      className={`border-collapse border-zinc-200 border-2 py-2 px-3 ${
                        subIndex === item.length - 1 ? "hidden" : ""
                      }`}
                    >
                      {data}
                    </td>
                  ))}
                  <td className="flex row justify-around border-collapse border-zinc-300 border-2 py-2 px-3">
                    <Image
                      src={editIcon}
                      width={18}
                      height={18}
                      alt="edit Icon"
                      className="cursor-pointer"
                      onClick={() =>
                        openModal(
                          String(sortedItems[index][0]),
                          String(sortedItems[index][1])
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        openDeleteModal(categoryName, sortedItems[index], index)
                      }
                    >
                      <Image
                        src={deleteIcon}
                        width={18}
                        height={18}
                        alt="delete Icon"
                      />
                    </button>
                    {showEditModal && (
                      <EditModal
                        itemNameOld={currItemName}
                        initialUnits={currUnits}
                        closeModal={closeModal}
                        handleSave={handleSave}
                        selectedCategory={categoryName}
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