"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import deleteIcon from "@app/images/delete.png";
import editIcon from "@app/images/edit.png";
import arrowsIcon from "@app/images/upAndDownArrows.png";
import EditModal from "@app/components/EditModal";

interface CategoriesSpreadsheetProps {
  categoryName: string;
  categoryItems: (string | number)[][];
  loadData: any;
}

const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({
  categoryName = "",
  categoryItems = [],
  loadData,
}) => {
  // EDIT functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [currItemName, setItemName] = useState("");
  const [currUnits, setCurrUnits] = useState<string[]>([]);

  // DELETION functionality
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const [modalItem, setModalItem] = useState<(string | number)[]>([]);
  const [modalItemIndex, setModalItemIndex] = useState(-1);
  const [itemWarning, setItemWarning] = useState(false);
  const [unitWarning, setUnitWarning] = useState(-1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [lastUnitWarning, setLastUnitWarning] = useState(false);

  // ---------- EDIT FUNCTIONS ----------
  // Opens the edit modal and prepopulates with the item name and its units (parsed from a comma‐separated string)
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

  // handleSave accepts four parameters:
  // - oldItemName (original item name),
  // - newItemName (updated item name),
  // - updatedUnits (array of updated units),
  // - and categoryName (passed consistently from props)
  const handleSave = async (
    oldItemName: string,
    newItemName: string,
    updatedUnits: string[],
    categoryName: string
  ) => {
    try {
      const validUnits = updatedUnits.filter(
        (unit) => unit && unit.trim() !== ""
      );
      const payload = {
        oldItemName: oldItemName.trim(),
        itemName: newItemName.trim(),
        name: categoryName.trim(),
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

  // ---------- DELETION FUNCTIONS ----------
  // Open the delete modal for an entire row
  const openDeleteModal = (
    catName: string,
    item: (string | number)[],
    index: number
  ) => {
    setIsDeleteModalVisible(true);
    setModalCategory(catName);
    setModalItem(item);
    setModalItemIndex(index);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setModalCategory("");
    setModalItemIndex(-1);
    setItemWarning(false);
    setUnitWarning(-1);
    setDeleteConfirmation(false);
    setLastUnitWarning(false);
  };

  // Delete the entire row (item) from both inventory and categories.
  const deleteItem = async () => {
    closeDeleteModal();

    // Deleting from inventory: for each unit in the row
    modalItem[1]
      .toString()
      .split(", ")
      .forEach(async (unit) => {
        try {
          await fetch("../api/inventory", {
            method: "DELETE",
            body: JSON.stringify({ deleteItem: modalItem[0], units: unit }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(
                `Deleting item from inventory error; status: ${response.status}`
              );
            }
            return response.json();
          });
        } catch (e) {
          console.error(e);
        }
      });

    // Deleting from categories
    try {
      await fetch("../api/categories", {
        method: "DELETE",
        body: JSON.stringify({ itemName: modalItem[0], name: modalCategory }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Deleting item from categories error; status: ${response.status}`
          );
        }
        return response.json();
      });
    } catch (e) {
      console.error(e);
    }

    setDeleteConfirmation(true);
    if (typeof loadData === "function") {
      await loadData();
    } else {
      console.error("loadData is not a function");
    }
  };

  // Delete a single unit from an item.
  const deleteUnit = async (unit: string) => {
    setUnitWarning(-1);

    if (modalItem[1].toString().split(", ").length === 1) {
      setLastUnitWarning(true);
    } else {
      // Delete from inventory
      try {
        const inventoryResponse = await fetch("../api/inventory", {
          method: "DELETE",
          body: JSON.stringify({ deleteItem: modalItem[0], units: unit }),
        });

        if (!inventoryResponse.ok) {
          if (inventoryResponse.status === 500) {
            console.warn("Received 500 from inventory deletion; ignoring error.");
          } else {
            const responseText = await inventoryResponse.text();
            let errorData = {};
            try {
              errorData = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
              console.error("Error parsing inventory error response:", parseError);
            }
            throw new Error(
              `Deleting unit from inventory error; status: ${inventoryResponse.status}`
            );
          }
        } else {
          await inventoryResponse.json();
        }
      } catch (e) {
        console.warn("Error during inventory deletion (ignored):", e);
      }

      // Delete unit from categories.
      // For unit deletion, we use a PUT payload that includes oldItemName (set equal to itemName) because the primary key remains unchanged.
      try {
        const newUnits = modalItem[1]
          .toString()
          .split(", ")
          .filter((elt) => elt !== unit);

        await fetch("../api/categories", {
          method: "PUT",
          body: JSON.stringify({
            oldItemName: modalItem[0],
            itemName: modalItem[0],
            name: modalCategory,
            units: newUnits,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Deleting unit from categories error; status: ${response.status}`
            );
          }
          return response.json();
        });
      } catch (e) {
        console.error(e);
      }

      if (typeof loadData === "function") {
        const newData = await loadData();
        setTimeout(() => setIsDeleteModalVisible(false), 500);
        setTimeout(
          () =>
            openDeleteModal(
              categoryName,
              newData[categoryName][modalItemIndex],
              modalItemIndex
            ),
          1000
        );
      } else {
        console.error("loadData is not a function");
      }
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
                <div className="flex flex-row justify-between">
                  <p>Item Name</p>
                  <Image
                    src={arrowsIcon}
                    width={10}
                    height={6}
                    alt="arrows Icon"
                  />
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
                <td className="flex row justify-around py-2 px-3">
                  <Image
                    src={editIcon}
                    width={18}
                    height={18}
                    alt="edit Icon"
                    className="cursor-pointer"
                    // Pass both item name and its associated units (assumed to be in the second column)
                    onClick={() =>
                      openModal(
                        String(categoryItems[index][0]),
                        String(categoryItems[index][1])
                      )
                    }
                  />
                  <button onClick={() => openDeleteModal(categoryName, item, index)}>
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

      {/* Delete Modal */}
      {isDeleteModalVisible && (
        <div className="flex absolute top-0 left-0 justify-center items-center w-full h-full z-20 bg-black bg-opacity-50">
          <div className="flex flex-col justify-center space-y-3 w-[533px] py-[20px] px-[27px] bg-white rounded-[7px] border-[2px] border-[#EB2B0C] z-50">
            <p className="text-[32px] font-crimson crimson-bold text-[#EB2B0C]">
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
                <p className="font-crimson font-bold text-[#EB2B0C] text-[20px]">
                  All inventory entries with this item will be deleted.
                </p>
              </div>
            )}
            <div className="flex flex-row w-full justify-center items-center">
              <p className="text-[32px] flex w-[15%] font-crimson crimson-semibold justify-center items-center">
                Item
              </p>
              <div className="flex w-[60%] px-[30px]">
                <p className={`flex text-[24px] items-center w-full pl-[20px] h-[50px] font-crimson ${
                  itemWarning && "rounded-[13px] border-[3px] border-[#EB2B0C]"
                }`}>
                  {modalItem[0]}
                </p>
              </div>
              <div className={`flex w-[25%] ${!itemWarning ? "justify-end" : "justify-center"} items-center pr-1`}>
                {!itemWarning ? (
                  <button onClick={() => setItemWarning(true)}>
                    <Image
                      src={deleteIcon}
                      width={18}
                      height={18}
                      alt="delete Icon"
                      className="h-4/5"
                    />
                  </button>
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
              {modalItem[1].toString().split(", ").map((item, index) => (
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
                      <p className="font-crimson font-bold text-[#EB2B0C] text-[20px]">
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
                    <p className="text-[32px] w-[15%] flex justify-center items-center font-crimson crimson-semibold">
                      Units
                    </p>
                    <div className="flex w-[60%] px-[30px]">
                      <p className={`flex text-[24px] items-center w-full pl-[20px] h-[50px] font-crimson ${
                        unitWarning === index && "rounded-[13px] border-[3px] border-[#EB2B0C]"
                      }`}>
                        {item}
                      </p>
                    </div>
                    <div className={`flex w-[25%] ${unitWarning !== index ? "justify-end" : "justify-center"} items-center pr-1`}>
                      {unitWarning !== index ? (
                        <button onClick={() => setUnitWarning(index)}>
                          <Image
                            src={deleteIcon}
                            width={18}
                            height={18}
                            alt="delete Icon"
                            className="h-4/5"
                          />
                        </button>
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
                            <button onClick={() => deleteUnit(item)}>
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
                className="w-[117px] h-[46px] rounded-[8px] border-[1px] border-[#828282]"
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
          <div className="flex flex-col justify-center space-y-3 w-[533px] py-[20px] px-[27px] bg-white rounded-[7px] border-[2px] border-[#EB2B0C] z-50">
            <p className="text-[32px] font-crimson crimson-bold text-[#EB2B0C]">
              Delete Menu
            </p>
            <p className="text-[32px] flex font-crimson crimson-semibold items-center justify-start">
              {`${modalItem[0]} deleted.`}
            </p>
            <div className="flex justify-center items-center">
              <button
                className="w-[117px] h-[46px] rounded-[8px] border-[1px] border-[#828282]"
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
    </>
  );
};

export default CategoriesSpreadsheet;