'use client';
import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from "swr";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NameDropdown } from '@app/components/Dropdowns';
import { NavBar } from '@app/components/NavBar';
import CategoriesSpreadsheet from '@app/components/CategoriesSpreadsheet';
import UnitBoxes from '@app/components/UnitBoxes';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import addIcon from '@app/images/Vector.png';
import DeleteCategoryModal from '@app/components/DeleteCategoryModal';

interface CategoryData {
  [key: string]: [string, string][];
}

const Categories: React.FC = () => {
  const fetchCategories = async (): Promise<CategoryData> => {
    const response = await fetch("/api/categories");
    if (!response.ok) throw new Error("Failed to fetch categories");
  
    const raw = await response.json();
    const rearrangedData = raw.reduce((acc: CategoryData, record: { name: string, itemName: string, units: string[] }) => {
      const catName = record.name;
      const trimmedItemName = record.itemName.trim();
      const validUnits = (record.units || [])
        .map(u => u.trim())
        .filter(u => u !== "");
  
      if (trimmedItemName !== "" || validUnits.length > 0) {
        if (!acc[catName]) acc[catName] = [];
        const unitsString = validUnits.join(', ');
        acc[catName].push([trimmedItemName, unitsString]);
      }
  
      return acc;
    }, {} as CategoryData);
  
    return rearrangedData;
  };
  
  const { data: categoriesData, error, isLoading, mutate: mutateCategories } = useSWR("/api/categories", fetchCategories);

  // State variables
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTable, setShowTable] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [showRetrievalError, setShowRetrievalError] = useState(false);
  const [units, setUnits] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // Open delete category modal.
  const openModal = (categoryName: string, itemName: string) => {
    console.log("openModal called with categoryName:", categoryName, "itemName:", itemName);
    setShowModal(true);
    setCategoryName(categoryName);
    setItemName(itemName);
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setShowTable(true);
  };

  const categoryButtonClicked = () => {
    setShowCategoryModal(true);
  };

  const cancelButtonClicked = () => {
    setShowCategoryModal(false);
    setShowEmptyError(false);
    setShowRetrievalError(false);
    setShowEditModal(false);
    setShowDuplicateError(false);
  };

  const itemButtonClicked = () => {
    setShowItemModal(true);
  };

  const editButtonClicked = () => {
    setEditCategoryName(selectedCategory);
    setShowEditModal(true);
    console.log("Edit category button was clicked.")
  };

  useEffect(() => {
    if (!showItemModal) {
      mutateCategories();
    }
  }, [showItemModal]);

  useEffect(() => {
    if (!showCategoryModal) {
      mutateCategories();
    }
  }, [showCategoryModal]);

  const itemModalClosed = () => {
    setShowItemModal(false);
    setShowEmptyError(false);
    setShowRetrievalError(false);
  };
    
  const refreshCategories = async (newCategory: string = "") => {
    const updated = await mutateCategories(undefined, true);
  
    if (
      newCategory &&
      updated &&
      typeof updated === "object" &&
      Object.keys(updated).includes(newCategory)
    ) {
      setSelectedCategory(newCategory);
      setShowTable(true);
    } else {
      setSelectedCategory("");
      setShowTable(false);
    }
  };  
  
  // Save new category.
  const saveButtonClicked = async () => {
    if (categoryName.trim() === "") {
      setShowEmptyError(true);
      setShowRetrievalError(false);
      return;
    }
  
    setShowEmptyError(false);
  
    try {
      const response = await fetch("../api/categories", {
        method: "POST",
        body: JSON.stringify({
          itemName: "",
          name: categoryName,
          units: [],
        }),
      });
  
      if (!response.ok) {
        setShowRetrievalError(true);
        return;
      }

      setShowCategoryModal(false);
      setShowRetrievalError(false);

      await refreshCategories(categoryName);
    } catch (err) {
      setShowRetrievalError(true);
      console.error("Error saving category:", err);
    }
  };  

  const saveCategories = async () => {
    try {
      const trimmedItemName = itemName.trim();
      const validUnits = units.filter(unit => unit && unit.trim() !== "");
  
      if (trimmedItemName === "" || validUnits.length < 1) {
        setShowEmptyError(true);
        return;
      }
  
      setShowEmptyError(false);
  
      const payload = {
        itemName: trimmedItemName,
        name: selectedCategory.trim(),
        units: validUnits,
      };
  
      console.log("Sending payload:", payload);
  
      const response = await fetch("../api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        console.log("Server error response:", response);
        setShowRetrievalError(true);
        return;
      }
  
      // instead of refreshing, reload categories and reselect
      await mutateCategories();
      setSelectedCategory(payload.name); // ensure dropdown persists
      setShowTable(true); // ensure table stays visible
      itemModalClosed(); // close the modal
  
    } catch (err) {
      console.log("Error in saveCategories:", err);
      setShowRetrievalError(true);
    }
  };  

  const saveEditCategory = async () => {
    setShowEmptyError(false);
    setShowRetrievalError(false);
    setShowDuplicateError(false);
  
    if (editCategoryName.trim() === "") {
      setShowEmptyError(true);
      return;
    }
  
    if (categoriesData && Object.keys(categoriesData).includes(editCategoryName)) {
      setShowDuplicateError(true);
      return;
    }
  
    try {
      const items = categoriesData?.[selectedCategory] ?? [];
      const firstItemName = items?.[0]?.[0]?.trim() ?? "";
      const unitString = items?.[0]?.[1] ?? "";
      const units = unitString.split(",").map((u) => u.trim()).filter(Boolean);
  
      // if no item exists, use placeholders to satisfy backend requirements
      const payload = {
        oldItemName: firstItemName || "placeholder",
        itemName: firstItemName || "placeholder",
        name: selectedCategory,
        units: units.length > 0 ? units : ["placeholder"],
        oldCategoryName: selectedCategory,
        newCategoryName: editCategoryName,
      };
  
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        console.error("Failed to update category:", response.status);
        setShowRetrievalError(true);
        return;
      }
  
      setShowEditModal(false);
      await refreshCategories(editCategoryName);
    } catch (err) {
      console.error("Error editing category:", err);
      setShowRetrievalError(true);
    }
  };   

  interface InventoryItem {
    itemName: string;
    categoryName: string;
    units: string[];
  }  

  // Define selectedCategoryData once.
  const selectedCategoryData = categoriesData?.[selectedCategory] || [];

  // handleDelete: if itemName is provided, delete that specific record; otherwise, delete all records for the category.
  const handleDelete = async () => {
    console.log("handleDelete triggered");
    console.log("categoryName:", categoryName);
    console.log("itemName:", itemName);
    if (!categoryName) {
      console.warn("No categoryName provided; aborting deletion.");
      return;
    }
    // Prepare payload for categories deletion.
    const payload = { name: categoryName, itemName: itemName ? itemName : "", units: units.join(', ') };
    console.log("DELETE payload for categories:", payload);
    try {
      if (itemName && itemName.trim() !== "") {
        // Check inventory for record existence.
        try {
          const invResponse = await fetch("/api/inventory");
          if (invResponse.ok) {
            const invData: { data: InventoryItem[] } = await invResponse.json();
            const exists = invData.data.some(
              (invItem: InventoryItem) => invItem.itemName === itemName
            );
            if (exists) {
              console.log("Inventory record exists; attempting inventory deletion.");
              const invDeleteResponse = await fetch("/api/inventory", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemName, units: units.join(', ') }),
              });              
              console.log("Inventory deletion response status:", invDeleteResponse.status);
            } else {
              console.log("No inventory record found; skipping inventory deletion.");
            }
          } else {
            console.error("Failed to fetch inventory data; status:", invResponse.status);
          }
        } catch (e) {
          console.error("Error checking inventory:", e);
        }
  
        // Delete specific category record.
        console.log("Deleting specific category record for:", payload);
        const response = await fetch("../api/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log("Categories deletion response status:", response.status);
        if (!response.ok) {
          throw new Error("Error deleting specific category record.");
        }
        const resData = await response.json();
        console.log("Categories deletion response data:", resData);
      } else {
        // Delete all records for the category by calling the DELETE endpoint with an empty itemName.
        console.log("Deleting all records for category:", categoryName);
        const response = await fetch("../api/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName, itemName: "" }),
        });
        console.log("Categories deletion response status:", response.status);
        if (!response.ok) {
          throw new Error("Error deleting categories by name.");
        }
        const result = await response.json();
        console.log("deleteCategoriesByName response:", result);
      }
      closeModal();
      await refreshCategories();
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <p className="font-crimson font-bold pl-20 pt-10 text-[40px]">Categories</p>
      <div className="flex justify-center items-center">
        <div className="w-3/5 h-4/5">
          <div className="flex flex-col">
            <p className="font-crimson crimson-bold text-[24px] pt-5">Edit Category</p>
            <div className="flex justify-between items-center py-4 w-full">
              <div className="flex flex-row items-center w-1/2">
                <div className="w-full">
                  <NameDropdown
                    fetchUrl="/api/categories"
                    filterName="name"
                    onSelect={handleCategoryChange}
                    defaultValue={selectedCategory}
                  />
                </div>
                {showTable && (
                  <>
                  <div className="flex items-center pl-4 space-x-4">
                    <MdDeleteOutline
                        size={24}
                        className="cursor-pointer"
                        onClick={() =>
                          openModal(
                            String(selectedCategory),
                            String(selectedCategoryData[0]?.[0] || "")
                          )
                        }
                    />
                    {showModal && (
                      <DeleteCategoryModal
                        categoryName={String(selectedCategory)}
                        itemName={String(itemName)}
                        closeModal={closeModal}
                        handleDelete={handleDelete}
                      />
                    )}
                    <MdOutlineEdit
                        size={24}
                        className="cursor-pointer"
                        onClick={editButtonClicked}
                    />
                  </div>
                </>
              )}
              </div>
              <div className="flex justify-end w-full">
                {showTable && (
                  <button
                    className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 ml-36 rounded text-[20px]"
                    onClick={itemButtonClicked}
                  >
                    {"Item "}
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '14px' }} />
                  </button>
                )}
                <button
                  className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 ml-4 rounded text-[20px]"
                  onClick={categoryButtonClicked}
                >
                  {"Category "}
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: '14px' }} />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 items-center h-full">
            {showTable ? (
              <>
                <CategoriesSpreadsheet 
                  categoryName={selectedCategory}
                  categoryItems={categoriesData?.[selectedCategory] || []}
                  loadData={async () => { await mutateCategories(); }} 
                />
                {selectedCategoryData.length === 0 && (
                  <p className="flex-center py-4 font-crimson text-[20px] text-center">
                    No entries for this category.
                  </p>
                )}
              </>
            ) : (
              <p className="flex-center py-[250px] font-crimson text-[20px] text-center">
                Select a category.
              </p>
            )}
          </div>
        </div>
      </div>
      {showItemModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[450px] bg-[#FFFFFF] font-crimson py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
            <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Add Item</div>
            <div className="flex flex-col ml-[15px] mb-[30px]">
              <div className="flex mb-2">
                <div className="text-[28px] w-24 ml-[5%]">Name</div>
                <input
                  type="text"
                  onChange={(e) => setItemName(e.target.value)}
                  className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1]"
                />
              </div>
              <UnitBoxes 
                icon={addIcon}
                onUnitsChange={setUnits}
              />
            </div>
            {showEmptyError && (
              <p className="text-red text-center mb-4">
                Please enter an item name and at least one unit.
              </p>
            )}
            {showRetrievalError && (
              <p className="text-red text-center mb-4">
                Failed to add item.
              </p>
            )}
            <div className="flex w-full justify-center space-x-[15px] items-center">
              <button
                className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-gray text-[20px] justify-center"
                onClick={itemModalClosed}
              >
                Cancel
              </button>
              <button
                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[117px] h-[40px] pt-1 rounded-[8px] border border-gray text-[20px] justify-center"
                onClick={saveCategories}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="h-[230px] w-[412px] bg-[#FFFFFF] font-crimson py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green relative">
          <p className="text-center text-[32px] pb-[15px] text-light-green">Category Name</p>
      
          {/* Input Field */}
          <div className="flex w-full justify-center items-center pb-[20px]">
            <input
              type="text"
              onChange={(e) => setCategoryName(e.target.value)}
              className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] justify-center"
            />
          </div>
      
          {/* Error Messages */}
          <div className="absolute top-[135px] left-0 right-0 flex flex-col items-center h-[20px]">
            {showEmptyError && (
              <p className="text-red text-center">
                Please enter a category name.
              </p>
            )}
            {showRetrievalError && (
              <p className="text-red text-center">
                Category name already exists.
              </p>
            )}
          </div>
      
          {/* Buttons */}
          <div className="absolute bottom-[20px] left-0 right-0 flex justify-center space-x-[15px]">
            <button
              className="text-gray hover:bg-light-gray font-serif w-[117px] h-[40px] rounded-[8px] border border-gray text-[20px] justify-center"
              onClick={cancelButtonClicked}
            >
              Cancel
            </button>
            <button
              className="bg-light-green hover:bg-dark-green text-white font-serif w-[117px] h-[40px] rounded-[8px] border border-gray text-[20px] justify-center"
              onClick={saveButtonClicked}
            >
              Save
            </button>
          </div>
        </div>
      </div>      
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="h-[230px] w-[412px] bg-[#FFFFFF] font-crimson py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green flex flex-col justify-between">
            <p className="text-center text-[32px] font-bold">Edit Name</p>
            
            <div className="flex flex-col items-center px-4 space-y-2">
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] px-2 mt-4"
              />

              {/* Reserved space for error messages */}
              <div className="h-[10px] flex items-center">
                {showEmptyError && (
                  <p className="text-red text-center text-sm">
                    Please enter a category name.
                  </p>
                )}
                {showDuplicateError && (
                  <p className="text-red text-center text-sm">
                    Category already exists.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-[15px] mt-4">
              <button
                className="text-gray hover:bg-light-gray font-serif w-[117px] h-[40px] rounded-[8px] border border-gray text-[20px]"
                onClick={cancelButtonClicked}
              >
                Cancel
              </button>
              <button
                className="bg-light-green hover:bg-dark-green text-white font-serif w-[117px] h-[40px] rounded-[8px] border border-gray text-[20px]"
                onClick={saveEditCategory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;