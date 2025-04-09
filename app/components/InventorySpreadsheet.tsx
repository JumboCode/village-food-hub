import React, { useEffect, useState } from "react";
import { TiArrowUnsorted } from "react-icons/ti";
import { MdOutlineEdit, MdDeleteOutline, MdOutlineFileDownload } from "react-icons/md";
import DeleteInventoryModal from "@app/components/DeleteInventoryModal";
import QuantityModal from "@app/components/QuantityModal";
import Snackbar from '@mui/material/Snackbar';

interface InventorySpreadsheetProps {
    inventoryItems: (string | number)[][];
}

interface InventoryItem {
  itemName: string;
  units: string;
  history: Record<string, InventoryHistoryRecord[]>;
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
    // State for quantity update modal
    const [showQuantityModal, setShowQuantityModal] = useState(false); 
    // State for delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // Shared item details
    const [itemName, setItemName] = useState<string | null>(null);
    const [units, setUnits] = useState<string | null>(null);
    const [currCategoryName, setCurrCategoryName] = useState<string | null>(null);
    const [currentQuantity, setCurrentQuantity] = useState<number>(0);
    const [snackbarOpenEdit, setSnackbarOpenEdit] = useState(false);
    const [snackbarOpenDelete, setSnackbarOpenDelete] = useState(false);
    const [snackbarMessageDelete, setSnackbarMessageDelete] = useState("Item Deleted");
    const [snackbarMessageEdit, setSnackbarMessageEdit] = useState("Item Edited");


    

    const closeQuantityModal = (): void => {
        setShowQuantityModal(false);
        setItemName(null);
        setUnits(null);
        setCurrCategoryName(null);
    };

    const openQuantityModal = (itemName: string, units: string, category: string, quantity: number): void => {
      setShowQuantityModal(true);
      setItemName(itemName);
      setUnits(units);
      setCurrCategoryName(category);
      setCurrentQuantity(quantity);
    };

    const closeDeleteModal = (): void => {
        setShowDeleteModal(false);
        setItemName(null);
        setUnits(null);
    };

    const openDeleteModal = (item: (string | number)[]) => {
        // Assuming column 0 is the item name and column 3 is the units
        setShowDeleteModal(true);
        setItemName(String(item[0]));
        setUnits(String(item[3]));
    };

    const [sortedItems, setSortedItems] = useState<(string | number)[][]>(inventoryItems);
    const [topSorted, setTopSorted] = useState(true);
    const [quantityAscending, setQuantityAscending] = useState(true);
    const [DateAscending, setDateAscending] = useState(false);

    useEffect(() => {
        setSortedItems([...inventoryItems]);
    }, [inventoryItems]);

    const sortAlphabetically = (columnIndex: number) => {
      const sortedList = [...sortedItems].sort((a, b) =>
        topSorted
          ? a[columnIndex]?.toString().localeCompare(b[columnIndex]?.toString())
          : b[columnIndex]?.toString().localeCompare(a[columnIndex]?.toString())
      );

      setSortedItems(sortedList);
      setTopSorted(!topSorted);
    };

    const sortQuantity = () => {
        const sortedList = [...sortedItems].sort((a, b) =>
            quantityAscending 
                ? Number(b[2]) - Number(a[2]) 
                : Number(a[2]) - Number(b[2])
        );
        setSortedItems(sortedList);
        setQuantityAscending(!quantityAscending);
    };

    const sortDate = () => {
        const sortedList = [...sortedItems].sort((a, b) => {
            const dateA = new Date(a[4]); 
            const dateB = new Date(b[4]);
    
            return DateAscending 
                ? dateB.getTime() - dateA.getTime() 
                : dateA.getTime() - dateB.getTime();
        });
        
        setSortedItems(sortedList);
        setDateAscending(!DateAscending); 
    };

    const handleUpdateQuantity = async (itemName: string, units: string, quantityChange: number, categoryName: string) => {
        setSnackbarOpenEdit(true);
        if (!itemName || !units) return;

        const updatedData = {
            categoryName,
            itemName,
            quantity: Number(quantityChange),
            units,
            lastUpdated: new Date(),
        };
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
            
              setSortedItems(prevItems =>
                prevItems.map(row => {
                    const nameMatch = row[0] === itemName;
                    const unitMatch = row[3] === units;
                    const categoryMatch = row[1] === categoryName;
    
                    if (nameMatch && unitMatch && categoryMatch) {
                        const updatedRow = [...row];
                        updatedRow[2] = Number(quantityChange);
                        updatedRow[4] = formatDate(new Date());
                        return updatedRow;
                    }
                    return row;
                })
            );
            
            closeQuantityModal();
            
            console.log("Updated successfully!");
          
        } catch (error) {
            console.log(error);
            closeQuantityModal();
        }
    };

    const handleDelete = async () => {
      setSnackbarOpenDelete(true);
      if (!itemName || !units) return;
  
      try {
          const response = await fetch("/api/inventory", {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ itemName, units }),
          });
  
          if (!response.ok) {
              const errorMessage = await response.json();
              throw new Error(`Error deleting inventory: ${errorMessage.message}`);
          }
  
          console.log(`Deleted inventory item: ${itemName} (${units})`);
          closeDeleteModal();
          setSortedItems(sortedItems.filter((item) => (item[0] != itemName) && (item[3] != units)))
          
      } catch (error) {
          console.error("Inventory delete failed:", error);
      }
    };      

    const downloadCSV = async (item: (string | number)[]) => { 
      const itemName = item[0];
      const unitData = item[3];
      
      try {
        const response = await fetch("/api/inventory", { method: "GET" });

        if (!response.ok) {
            throw new Error("Failed to fetch inventory data");
        }

        const { data } = await response.json(); // Extract data from response
        if (!Array.isArray(data)) {
            throw new Error("Invalid inventory data format");
        }

        // Filter to find the matching item
        const matchedItem = data.find(
            (item: InventoryItem) => item.itemName === itemName && item.units === unitData
        );

        // Build a key to extract the relevant history records
        const key = `${itemName}_${unitData}`;
        const historyRecords = matchedItem["history"][key];

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
    } catch (error) {
        console.error("Error fetching inventory item:", error);
        return null;
    }
    };

    return (
        <div className="relative overflow-x-auto crimson-regular font-crimson">
          <table className="table-auto w-full">
            <thead className="font-crimson border-crimson-regular border-separate content-start">
              <tr className="bg-dark-blue text-white text-lg align-left">
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Item Name</p>
                    <button onClick={() => sortAlphabetically(0)}>
                      <TiArrowUnsorted />
                    </button>
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Category</p>
                    <button onClick={() => sortAlphabetically(1)}>
                      <TiArrowUnsorted />
                    </button>
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Quantity</p>
                    <button onClick={sortQuantity}>
                      <TiArrowUnsorted />
                    </button>
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Units</p>
                    <button onClick={() => sortAlphabetically(3)}>
                      <TiArrowUnsorted />
                    </button>
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  <div className="flex flex-row justify-between items-center">
                    <p>Last Updated</p>
                    <button onClick={sortDate}>
                      <TiArrowUnsorted />
                    </button>
                  </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson">
              { sortedItems.map((item, index) => (
                <tr key={index} className="py-2">
                  {item.map((data, subIndex) => (
                    <td
                      key={subIndex}
                      className={`border-collapse border-zinc-200 border-2 px-3 ${
                        subIndex === item.length - 1 ? "hidden" : ""
                      }`}
                    >
                      {data}
                    </td>
                  ))}
                  <td className="border-collapse border-zinc-200 border-2 border-y-1 text-center">
                    <span className="inline-flex justify-center gap-6">
                      {/* Edit Icon: Opens the QuantityModal */}
                      <MdOutlineEdit
                        size={24}
                        className="cursor-pointer"
                        onClick={() =>
                          openQuantityModal(
                            String(sortedItems[index][0]),
                            String(sortedItems[index][3]),
                            String(sortedItems[index][1]),
                            Number(sortedItems[index][2])
                          )
                        }
                      />

                      {/* Delete Icon: Opens the DeleteInventoryModal */}
                      <MdDeleteOutline
                        size={24}
                        className="cursor-pointer"
                        onClick={() => openDeleteModal(sortedItems[index])}
                      />

                      {/* Quantity Modal */}
                      {showQuantityModal && (
                          <QuantityModal
                              itemName={String(itemName)}
                              units={String(units)}
                              closeModal={closeQuantityModal}
                              handleUpdate={handleUpdateQuantity}
                              categoryName={String(currCategoryName)}
                              currentQuantity={currentQuantity}
                          />
                      )}
                      <MdOutlineFileDownload
                          size={24}
                          className="cursor-pointer"
                          onClick={() => downloadCSV(item)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Delete Inventory Modal */}
          {showDeleteModal && (
              <DeleteInventoryModal
                itemName={String(itemName)}
                units={String(units)}
                closeModal={closeDeleteModal}
                handleDelete={handleDelete}
              />
          )}
           <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpenEdit}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpenEdit(false)}
                message={snackbarMessageEdit}
            />
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpenDelete}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpenDelete(false)}
                message={snackbarMessageDelete}
            />
        </div>
    );
};