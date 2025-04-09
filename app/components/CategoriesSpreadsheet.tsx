'use client';
import React, { useState, useEffect } from "react";
import EditModal from "@app/components/EditModal";
import { TiArrowUnsorted } from "react-icons/ti";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { Snackbar } from "@mui/material";

// --- Types and Interfaces ---

// Props for the CategoriesSpreadsheet component.
interface CategoriesSpreadsheetProps {
  categoryName: string;
  categoryItems: (string | number)[][];
  loadData: () => Promise<void>;
}

// Define a type for a raw inventory item (as returned by the API in deletion functions).
interface RawInventoryItem {
  itemName: string;
  units: string;
}

// Define the structure of the API response when fetching inventory for deletion.
interface InventoryResponse {
  data: RawInventoryItem[];
}

// --- Component Start ---

const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({
  categoryName = "",
  categoryItems = [],
  loadData,
}) => {
  // SORTING functionality
  const [sortedItems, setSortedItems] = useState<(string | number)[][]>(categoryItems);
  const [topSorted, setTopSorted] = useState(true);

  useEffect(() => {
    setSortedItems([...categoryItems]);
  }, [categoryItems]);

  const sortAlphabetically = (columnIndex: number) => {
    const sortedList = [...sortedItems].sort((a, b) =>
      topSorted
        ? a[columnIndex]?.toString().localeCompare(b[columnIndex]?.toString())
        : b[columnIndex]?.toString().localeCompare(a[columnIndex]?.toString())
    );

    setSortedItems(sortedList);
    setTopSorted(!topSorted);
  };

  // EDIT functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [currItemName, setItemName] = useState("");
  const [currUnits, setCurrUnits] = useState<string[]>([]);

  // DELETION functionality
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const [modalItem, setModalItem] = useState<(string | number)[]>([]);
  // Removed modalItemIndex because it's not used.
  const [itemWarning, setItemWarning] = useState(false);
  const [unitWarning, setUnitWarning] = useState(-1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [lastUnitWarning, setLastUnitWarning] = useState(false);
  const [snackbarOpenEdit, setSnackbarOpenEdit] = useState(false);
  const [snackbarCatRename, setSnackBarCatRename] = useState(false);
  const [snackbarOpenDelete, setSnackbarOpenDelete] = useState(false);
  const [snackbarOpenRename, setSnackBarOpenRename] = useState(false);
  const [snackbarMessageDelete, setSnackbarMessageDelete] = useState("Item Deleted"); // There's a refresh :(
  const [snackbarMessageCatRename, setSnackbarMessageCatRename] = useState("Category Renamed");
  const [snackbarMessageEdit, setSnackbarMessageEdit] = useState("Item Edited");
  const [snackbarMessageRename, setSnackbarMessageRename] = useState("Item or Units Renamed");

  // ---------- EDIT FUNCTIONS ----------
  // Opens the edit modal, prepopulating with the item name and parsed units (from a comma-separated string)
  const openModal = (itemName: string, unitsStr: string) => {
    setShowEditModal(true);
    setItemName(itemName);
    const parsedUnits = unitsStr
      .split(",")
      .map((unit) => unit.trim())
      .filter(Boolean);
    setCurrUnits(parsedUnits);
  };

  const closeModal = (): void => {
    setShowEditModal(false);
    setItemName("");
    setCurrUnits([]);
  };

  // handleSave sends a PUT payload with:
  // - oldItemName (original item name),
  // - itemName (new/updated item name),
  // - name (category name, passed consistently),
  // - and units (an array of updated units)
  const handleSave = async (
    oldItemName: string,
    newItemName: string,
    updatedUnits: string[],
    categoryName: string
  ) => {
    try {
      const validUnits = updatedUnits.filter(unit => unit.trim() !== "");
      const trimmedOldName = oldItemName.trim();
      const trimmedNewName = newItemName.trim();
      const sortedOriginalUnits = [...currUnits].map(u => u.trim().toLowerCase()).sort();
      const sortedUpdatedUnits = [...validUnits].map(u => u.trim().toLowerCase()).sort();
  
      const nameChanged = trimmedOldName !== trimmedNewName;
      const unitsChanged = JSON.stringify(sortedOriginalUnits) !== JSON.stringify(sortedUpdatedUnits);
  
      const payload = {
        oldItemName: trimmedOldName,
        itemName: trimmedNewName,
        name: categoryName.trim(),
        units: validUnits,
      };
  
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        console.error("Error editing item; status:", response.status);
      } else {
        if (nameChanged) {
          setSnackbarMessageRename("Item Renamed");
          setSnackBarOpenRename(true);
        }
        if (unitsChanged) {
          setSnackbarMessageRename("Units Renamed");
          setSnackBarOpenRename(true);
        }
        await loadData();
      }
  
      closeModal();
    } catch (error) {
      console.error("Error updating data:", error);
      closeModal();
    }
  };  

  // ---------- DELETION FUNCTIONS ----------
  // Opens the delete modal for an entire row.
  const openDeleteModal = (
    catName: string,
    item: (string | number)[],
    index: number
  ) => {
    setIsDeleteModalVisible(true);
    setModalCategory(catName);
    setModalItem(item);
    // Removed setting modalItemIndex as it is unused.
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setModalCategory("");
    setItemWarning(false);
    setUnitWarning(-1);
    setDeleteConfirmation(false);
    setLastUnitWarning(false);
  };

  // Deletes the entire row (item) from both inventory and categories.
  const deleteItem = async () => {
    setSnackbarOpenDelete(true);
    closeDeleteModal();
  
    // First, fetch inventory data.
    let inventoryData: InventoryResponse | null = null;
    try {
      const invResponse = await fetch("../api/inventory");
      if (invResponse.ok) {
        inventoryData = (await invResponse.json()) as InventoryResponse;
        console.log("Fetched inventory data:", inventoryData);
      } else {
        console.error("Failed to fetch inventory data; status:", invResponse.status);
      }
    } catch (e) {
      console.error("Error fetching inventory data:", e);
    }
  
    // Convert modalItem[1] (units) into an array.
    const unitsArray = modalItem[1]
      .toString()
      .split(", ")
      .filter((u) => u.trim() !== "");
  
    // For each unit, check if an inventory record exists. If it does, then delete.
    for (const unit of unitsArray) {
      try {
        let exists = false;
        if (inventoryData && inventoryData.data) {
          exists = inventoryData.data.some(
            (invItem: RawInventoryItem) =>
              invItem.itemName === modalItem[0] &&
              invItem.units.trim() === unit.trim()
          );
        }
        if (exists) {
          console.log(`Inventory record exists for unit "${unit}"; attempting deletion.`);
          const invDeleteResponse = await fetch("../api/inventory", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deleteItem: modalItem[0], units: unit }),
          });
          console.log(`Inventory deletion response for unit "${unit}":`, invDeleteResponse.status);
          if (!invDeleteResponse.ok) {
            console.error(`Error deleting inventory record for unit "${unit}"; status: ${invDeleteResponse.status}`);
          }
        } else {
          console.info(`No inventory record found for unit "${unit}"; skipping inventory deletion.`);
        }
      } catch (e) {
        console.error("Error during inventory deletion for unit:", unit, e);
      }
    }
  
    // Now, delete the entire item from the categories database.
    try {
      const catDeleteResponse = await fetch("../api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: modalItem[0], name: modalCategory }),
      });
      console.log("Categories deletion response status:", catDeleteResponse.status);
      if (!catDeleteResponse.ok) {
        throw new Error(`Deleting item from categories error; status: ${catDeleteResponse.status}`);
      }
      await catDeleteResponse.json();
    } catch (e) {
      console.error("Error deleting category record:", e);
    }
  
    setDeleteConfirmation(true);
    await loadData();
  };  

  // Deletes a single unit from an item.
  const deleteUnit = async (unit: string) => {
    setSnackbarOpenDelete(true);
    setUnitWarning(-1);
  
    // Check if this is the last unit
    if (modalItem[1].toString().split(", ").length === 1) {
      setLastUnitWarning(true);
      return;
    }
  
    try {
      // Step 1: Fetch inventory to check if this unit exists
      const inventoryResponse = await fetch("../api/inventory");
      if (!inventoryResponse.ok) throw new Error("Failed to fetch inventory");
  
      const inventoryData = (await inventoryResponse.json()) as InventoryResponse;
      const inventoryItemsToDelete = inventoryData.data.filter(
        (invItem) =>
          invItem.itemName === modalItem[0] && invItem.units.trim() === unit.trim()
      );
  
      // Step 2: Delete all matching inventory records for this unit
      for (const inventoryItem of inventoryItemsToDelete) {
        await fetch("../api/inventory", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemName: inventoryItem.itemName, units: unit }),
        });
      }
  
      console.log(`Deleted ${inventoryItemsToDelete.length} inventory items using unit "${unit}"`);
  
      // Step 3: Update the category to remove the deleted unit
      const updatedUnits = modalItem[1]
        .toString()
        .split(", ")
        .filter((elt) => elt !== unit);
  
      const categoryResponse = await fetch("../api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldItemName: modalItem[0],
          itemName: modalItem[0],
          name: modalCategory,
          units: updatedUnits,
        }),
      });
  
      if (!categoryResponse.ok) {
        throw new Error(`Deleting unit from categories error; status: ${categoryResponse.status}`);
      }
  
      await categoryResponse.json();
      console.log(`Unit "${unit}" removed from category "${modalCategory}"`);
  
      // Refresh data
      await loadData();
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };  

  return (
    <>
      {/* Table */}
      <div className="relative overflow-x-auto font-arial bg-slate-50">
        <table className="table-auto w-full">
          <thead className="font-crimson crimson-regular content-start">
            <tr className="bg-dark-blue text-white text-lg align-left">
              <th className="border-r-2 border-slate-400 border-y-1 py-2 px-3">
                <div className="flex flex-row justify-between items-center">
                  <p>Item Name</p>
                  {/* Sorting button */}
                  <button onClick={() => sortAlphabetically(0)}>
                    <TiArrowUnsorted />
                  </button>
                </div>
              </th>
              <th className="border-r-2 border-slate-400 py-2 px-3">
                <div className="flex flex-row justify-between items-center">
                  <p>Units</p>
                  <button onClick={() => sortAlphabetically(1)}>
                    <TiArrowUnsorted />
                  </button>
                </div>
              </th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-slate-50 font-crimson crimson-regular">
            {sortedItems.map((item, index) => (
              <tr key={index} className="py-2">
                {item.map((data, subIndex) => (
                  <td key={subIndex} className="border-r-2 border-slate-200 py-2 px-3">
                    {data}
                  </td>
                ))}
                <td className="flex row justify-around py-2 px-3">
                  <MdOutlineEdit
                    size={24}
                    className="cursor-pointer"
                    onClick={() =>
                      openModal(
                        String(categoryItems[index][0]),
                        String(categoryItems[index][1])
                      )
                    }
                  />
                  <MdDeleteOutline 
                    size={24}
                    className="cursor-pointer"
                    onClick={() => openDeleteModal(categoryName, item, index)}
                  />
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

      {/* Delete Modal */}
      {isDeleteModalVisible && (
        <div className="flex absolute top-0 left-0 justify-center items-center w-full h-full z-20 bg-black bg-opacity-50">
          <div className="flex flex-col justify-center space-y-3 w-[470px] py-[30px] px-[36px] bg-white rounded-[7px] border-[2px] border-[#EB2B0C] z-50">
            <p className="text-[32px] font-crimson text-[#EB2B0C]">
              Delete Menu
            </p>
            {itemWarning && (
              <div className="flex flex-row items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="#EB2B0C"
                  className="size-6 pb-[1px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                <p className="font-crimson font-bold text-[#EB2B0C] text-[14px]">
                  All inventory entries with this item will be deleted.
                </p>
              </div>
            )}
            <div className="flex flex-row w-full justify-center items-center">
              <p className="text-[28px] flex w-[15%] font-crimson crimson-semibold justify-center items-center">
                Item
              </p>
              <div className="flex w-[60%] px-[30px]">
                <div className={`overflow-x-auto flex text-[24px] items-center w-full pl-[5px] h-[50px] font-crimson rounded-[13px] border-[3px] border-[#E1E1E1] ${
                  itemWarning && "border-[#EB2B0C]"
                }`}>
                  {modalItem[0]}
                </div>
              </div>
              <div className={`flex w-[25%] justify-center items-center pr-1`}>
                {!itemWarning ? (
                  <MdDeleteOutline
                      size={24}
                      className="cursor-pointer"
                      onClick={() => setItemWarning(true)}
                  />
                ) : (
                  <div className="flex flex-col">
                    <p className="font-crimson crimson-bold text-[#EB2B0C] text-[20px] text-center">
                      Are you sure?
                    </p>
                    <div className="flex flex-row space-x-2">
                      <button onClick={() => setItemWarning(false)}>
                        <div className="w-[65px] h-[25px] rounded-[8px] border-[#828282] border-[1px]">
                          <p className="font-crimson text-[#828282] text-[16px] crimson-semibold">
                            Cancel
                          </p>
                        </div>
                      </button>
                      <button onClick={() => deleteItem()}>
                        <div className="w-[65px] h-[25px] rounded-[8px] bg-[#EB2B0C]">
                          <p className="font-crimson text-[#FFFFFF] text-[16px] crimson-semibold">
                            Delete
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map of Units */}
            <div>
              {modalItem[1]
                .toString()
                .split(", ")
                .map((unitItem, index) => (
                  <div key={index} className="flex flex-col justify-center space-y-3">
                    {unitWarning === index && (
                      <div className="flex flex-row items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="#EB2B0C"
                          className="size-6 pb-[1px]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                          />
                        </svg>
                        <p className="font-crimson font-bold text-[#EB2B0C] text-[16px]">
                          All inventory entries with this unit will be deleted.
                        </p>
                      </div>
                    )}
                    {lastUnitWarning && (
                      <div className="flex flex-row items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="#EB2B0C"
                          className="size-6 pb-[1px]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                          />
                        </svg>
                        <p className="font-crimson font-bold text-[#EB2B0C] text-[20px]">
                          Cannot delete the last unit of an item.
                        </p>
                      </div>
                    )}
                    <div className="flex flex-row w-full justify-center items-center pb-3">
                      <p className="text-[28px] w-[15%] flex justify-center items-center font-crimson crimson-semibold">
                        Units
                      </p>
                      <div className="flex w-[60%] px-[30px]">
                        <div className={`overflow-x-auto text-[24px] items-center w-full pl-[5px] h-[50px] font-crimson rounded-[13px] border-[3px] border-[#E1E1E1] ${
                          unitWarning === index && "border-[#EB2B0C]"
                        }`}>
                          {unitItem}
                        </div>
                      </div>
                      <div className={`flex w-[25%] justify-center items-center pr-1`}>
                        {unitWarning !== index ? (
                          <MdDeleteOutline
                              size={24}
                              className="cursor-pointer"
                              onClick={() => setUnitWarning(index)}
                          />
                        ) : (
                          <div className="flex flex-col">
                            <p className="font-crimson crimson-bold text-[#EB2B0C] text-[20px] text-center">
                              Are you sure?
                            </p>
                            <div className="flex flex-row space-x-2">
                              <button onClick={() => setUnitWarning(-1)}>
                                <div className="w-[65px] h-[25px] rounded-[8px] border-[#828282] border-[1px]">
                                  <p className="font-crimson text-[#828282] text-[16px] crimson-semibold">
                                    Cancel
                                  </p>
                                </div>
                              </button>
                              <button onClick={() => deleteUnit(unitItem)}>
                                <div className="w-[65px] h-[25px] rounded-[8px] bg-[#EB2B0C]">
                                  <p className="font-crimson text-[#FFFFFF] text-[16px] crimson-semibold">
                                    Delete
                                  </p>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-center items-center">
              <button
                className="w-[117px] h-[46px] rounded-[8px] border-[1px] border-[#828282] hover:bg-light-gray"
                onClick={() => closeDeleteModal()}
              >
                <p className="text-[#828282] text-[24px] font-crimson">
                  Close
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {deleteConfirmation && (
        <div className="flex absolute top-0 left-0 justify-center items-center w-full h-full z-20 bg-black bg-opacity-50">
          <div className="flex flex-col w-[533px] max-w-[90vw] bg-white rounded-[7px] border-[2px] border-[#EB2B0C] z-50 px-6 py-6 space-y-6">
          <p className="text-[32px] font-crimson crimson-bold text-[#EB2B0C] break-words">
            Delete Menu
          </p>
          <p className="text-[24px] font-crimson crimson-semibold break-words">
            {`${modalItem[0]} deleted.`}
          </p>
          <div className="flex justify-center pt-4">
            <button
              className="w-[117px] h-[46px] rounded-[8px] border-[1px] border-[#828282] hover:bg-light-gray"
              onClick={() => closeDeleteModal()}
            >
              <p className="text-[#828282] text-[24px] font-crimson">
                Close
              </p>
            </button>
          </div>
        </div>
      </div>
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
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackbarOpenRename}
          autoHideDuration={4000}
          onClose={() => setSnackBarOpenRename(false)}
          message={snackbarMessageRename}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackbarCatRename}
          autoHideDuration={4000}
          onClose={() => setSnackBarCatRename(false)}
          message={snackbarMessageCatRename}
        />
    </>
  );
};

export default CategoriesSpreadsheet;