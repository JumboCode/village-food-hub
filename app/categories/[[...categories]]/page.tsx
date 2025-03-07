'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NameDropdown } from '@app/components/Dropdowns';
import NavBar from '@app/components/NavBar';
import CategoriesSpreadsheet from '@app/components/CategoriesSpreadsheet';
import UnitBoxes from '@app/components/UnitBoxes';
import deleteIcon from '@app/images/delete.png';
import editIcon from '@app/images/edit.png';
import addIcon from '@app/images/Vector.png';
import DeleteCategoryModal from "@app/components/DeleteCategoryModal";

interface CategoryData {
  [key: string]: [string, string][];
}

const Categories: React.FC = () => {
  // State variables from fullstack/111-delete-a-category branch plus dev additions.
  const [categoriesData, setCategoriesData] = useState<CategoryData>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTable, setShowTable] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(''); // (currently not used)
  const [categoryName, setCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [showRetrievalError, setShowRetrievalError] = useState(false);
  const [units, setUnits] = useState<string[]>([]);
  // Delete category modal states:
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  // Open delete category modal.
  const openModal = (categoryName: string, itemName: string) => {
    console.log("openModal called with categoryName:", categoryName, "itemName:", itemName);
    setShowModal(true);
    setCategoryName(categoryName);
    setItemName(itemName);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setName(null);
  };

  // Get data for the selected category.
  const selectedCategoryData = categoriesData[selectedCategory] || [];

  // DELETE logic: if itemName exists and is non-empty, delete that specific record;
  // otherwise, delete all records for that category.
  const handleDelete = async () => {
    console.log("handleDelete triggered");
    console.log("categoryName:", categoryName);
    console.log("itemName:", itemName);
    const payload = { name: categoryName, itemName: itemName ? itemName : "" };
    console.log("DELETE payload:", payload);

    try {
      if (itemName && itemName.trim() !== "") {
        console.log("Deleting specific record for:", payload);
        const response = await fetch("../api/categories", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Error deleting specific record.");
        }
        const resData = await response.json();
        console.log("Deletion response data:", resData);
      } else {
        console.log("Deleting all records for category:", categoryName);
        const result = await deleteCategoriesByName(categoryName);
        console.log("deleteCategoriesByName response:", result);
      }
      refreshPage();
      console.log("Deleted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  // Helper for deleting all records by category name.
  async function deleteCategoriesByName(name: string) {
    console.log("deleteCategoriesByName called with:", name);
    try {
      const response = await fetch("../api/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, itemName: "" }),
      });
      if (!response.ok) {
        throw new Error("Error deleting categories by name.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in deleteCategoriesByName:", error);
      throw error;
    }
  }

  // Fetch categories data.
  const loadCategoriesData = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const rearrangedData = data.reduce((acc: CategoryData, record: { name: string, itemName: string, units: string[] }) => {
        const catName = record.name;
        const trimmedItemName = record.itemName.trim();
        const validUnits = (record.units || []).map(u => u.trim()).filter(u => u !== "");
        if (trimmedItemName !== "" || validUnits.length > 0) {
          if (!acc[catName]) {
            acc[catName] = [];
          }
          const unitsString = validUnits.join(', ');
          acc[catName].push([trimmedItemName, unitsString]);
        }
        return acc;
      }, {} as CategoryData);
      setCategoriesData(rearrangedData);
      console.log("rearrangedData:", rearrangedData);
      return rearrangedData;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadCategoriesData();
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    })();
  }, []);

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

  useEffect(() => {
    if (!showItemModal) {
      loadCategoriesData();
    }
  }, [showItemModal]);

  useEffect(() => {
    if (!showCategoryModal) {
      loadCategoriesData();
    }
  }, [showCategoryModal]);

  const itemModalClosed = () => {
    setShowItemModal(false);
    setShowEmptyError(false);
    setShowRetrievalError(false);
  };
    
  const refreshPage = () => {
    window.location.reload();
  };

  // Save new category.
  const saveButtonClicked = async () => {
    if (categoryName === "") {
      setShowEmptyError(true);
      setShowRetrievalError(false);
    } else {
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
        if (response.ok) {
          console.log("Successfully Added " + categoryName);
          setShowRetrievalError(false);
          setShowCategoryModal(false);
          refreshPage();
        } else {
          setShowRetrievalError(true);
        }
      } catch (err) {
        setShowRetrievalError(true);
      }
    }
  };

  // Save a new item for the selected category.
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
        units: validUnits
      };
      console.log("Sending payload:", payload);
      const response = await fetch("../api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.log("Server error response:", response);
      }
      itemModalClosed();
    } catch (err) {
      console.log("Error in saveCategories:", err);
    }
  };

  // Save edit for category name change.
  const saveEditCategory = async () => {
    setShowEmptyError(false);
    setShowRetrievalError(false);
    setShowDuplicateError(false);
    console.log(categoriesData);
    if (editCategoryName === "") {
      setShowEmptyError(true);
    } else if (Object.keys(categoriesData).includes(editCategoryName)) {
      setShowDuplicateError(true);
    } else {
      try {
        const response = await fetch("../api/categories");
        const categories = await response.json();
        const nameExists = categories.some((category) => 
          category.name === editCategoryName
        );
        if (nameExists && editCategoryName !== selectedCategory) {
          setShowDuplicateError(true);
          return;
        }
        const oldCategories = categories.filter((category) => 
          category.name === selectedCategory
        );
        if (!oldCategories) {
          setShowRetrievalError(true);
          return;
        }
        const updateCatRes = await fetch("../api/categories/", {
          method: "PUT",
          body: JSON.stringify({
            oldName: selectedCategory,
            newName: editCategoryName,
          }),
        });
        const updateInvRes = await fetch("../api/inventory/", {
          method: "PATCH",
          body: JSON.stringify({
            oldName: selectedCategory,
            newName: editCategoryName,
          }),
        });
        if (!updateCatRes.ok || !updateInvRes.ok) {
          setShowRetrievalError(true);
        }
        console.log(`Updated ${selectedCategory} to be ${editCategoryName}`);
        setShowEditModal(false);
        setSelectedCategory(editCategoryName);
        refreshPage();
      } catch (err) {
        setShowRetrievalError(true);
      }
    }
  };

  const selectedCategoryData = categoriesData[selectedCategory] || [];

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
                    value={selectedCategory}
                  />
                </div>
                {showTable && (
                  <>
                    {/* Delete and Edit Icons */}
                    <Image
                      src={deleteIcon}
                      width={18}
                      height={18}
                      alt="delete Icon"
                      className="m-4 ml-6 mt-2"
                      onClick={() => openModal(String(selectedCategory), String(selectedCategoryData[0]?.[0] || ""))}
                    />
                    {showModal && (
                      <DeleteCategoryModal 
                        categoryName={String(selectedCategory)}
                        itemName={String(itemName)}
                        closeModal={closeModal}
                        handleDelete={handleDelete}
                      />
                    )}
                    <Image
                      src={editIcon}
                      width={18}
                      height={18}
                      alt="edit Icon"
                      className="m-2 mb-3.5"
                    />
                  </>
                )}
              </div>
              <div className="flex justify-end w-full">
                {showTable && (
                  <button className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 ml-36 rounded text-[20px]"
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
                  categoryItems={selectedCategoryData}
                  loadData={loadCategoriesData}
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
              <p className="text-red-600 text-center mb-4">
                Please enter an item name and at least one unit.
              </p>
            )}
            {showRetrievalError && (
              <p className="text-red-600 text-center mb-4">
                Failed to add item.
              </p>
            )}
            <div className="flex w-full justify-center space-x-[15px] items-center">
              <button
                className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[36px] rounded-[8px] border border-gray text-[20px] justify-center"
                onClick={itemModalClosed}
              >
                Cancel
              </button>
              <button
                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[117px] h-[36px] rounded-[8px] border border-gray text-[20px] justify-center"
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
          <div className="h-[230px] w-[412px] bg-[#FFFFFF] font-crimson py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
            <p className="text-center text-[32px] font-bold pb-[15px]">Category Name</p>
            <div className="flex w-full justify-center items-center pb-[30px]">
              <input
                type="text"
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] justify-center"
              />
            </div>
            {showEmptyError && (
              <p className="text-red-600 text-center mb-4">
                Please enter a category name.
              </p>
            )}
            {showRetrievalError && (
              <p className="text-red-600 text-center mb-4">
                Category name already exists.
              </p>
            )}
            <div className="flex w-full justify-center space-x-[15px] mt-2 items-center">
              <button
                className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[36px] rounded-[8px] border border-gray text-[20px] justify-center"
                onClick={cancelButtonClicked}
              >
                Cancel
              </button>
              <button
                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[117px] h-[36px] rounded-[8px] border border-gray text-[20px] justify-center"
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
          <div className="h-[230px] w-[412px] bg-[#FFFFFF] font-crimson py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
            <p className="text-center text-[32px] font-bold pb-[15px]">Edit Name</p>
            <div className="flex w-full justify-center items-center pb-[30px]">
              <input
                type="text"
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] justify-center"
              />
            </div>
            {showEmptyError && (
              <p className="text-red-600 text-center mb-4">
                Please enter a category name.
              </p>
            )}
            {showDuplicateError && (
              <p className="text-red-600 text-center mb-4">
                Category already exists.
              </p>
            )}
            <div className="flex w-full justify-center space-x-[15px] items-center">
              <button
                className="flex text-gray hover:bg-light-gray font-serif pt-[6px] w-[117px] h-[36px] rounded-[8px] border border-gray text-[20px] justify-center"
                onClick={cancelButtonClicked}
              >
                Cancel
              </button>
              <button
                className="flex bg-light-green hover:bg-dark-green text-white font-serif pt-[6px] w-[117px] h-[36px] rounded-[8px] border border-gray text-[20px] justify-center"
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