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
    // State variables
    const [categoriesData, setCategoriesData] = useState<CategoryData>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showTable, setShowTable] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [categoryName, setCategoryName] = useState("");
    const [itemName, setItemName] = useState("");
    const [showEmptyError, setShowEmptyError] = useState(false);
    const [showRetrievalError, setRetrievalError] = useState(false);
    const [units, setUnits] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    
    const openModal = (categoryName: string, itemName: string) => {
        setShowModal(true);
        setCategoryName(categoryName);
        setItemName(itemName);
    };

    const closeModal = (): void => {
        setShowModal(false);
        setName(null);
    };

    // Get data for the selected category
    const selectedCategoryData = categoriesData[selectedCategory] || [];

    const handleDelete = async () => {
        if (!categoryName) return; // Must have a category name
      
        // Prepare payload:
        // If itemName is empty, this will delete all records with the categoryName.
        // Otherwise, it will delete the specific pair.
        const payload = { name: categoryName, itemName: itemName || "" };
      
        try {
          const response = await fetch("../api/categories", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
      
          if (!response.ok) {
            throw new Error("Error deleting records.");
          }
          console.log("Deleted successfully!");
          closeModal();
          refreshPage();
        } catch (error) {
          console.error(error);
        }
    };      


    // Fetch categories data on component mount
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const rearrangedData = data.reduce((acc: CategoryData, record: { name: string, itemName: string, units: string[] }) => {
                    const categoryName = record.name;
                    const itemName = record.itemName;
                    const units = record.units || [];
                    if (!acc[categoryName]) {
                        acc[categoryName] = [];
                    }
                    // Join the units array into a comma-separated string
                    const unitsString = units.join(', ');
                    acc[categoryName].push([itemName, unitsString]);
                    return acc;
                }, {});
                setCategoriesData(rearrangedData);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // Handle category selection change
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setShowTable(true);
    };

    // Open modal to add a new category
    const categoryButtonClicked = () => {
        setShowCategoryModal(true);
    };

    // Close modal and reset error states
    const cancelButtonClicked = () => {
        setShowCategoryModal(false);
        setShowEmptyError(false);
        setRetrievalError(false);

    };

    // Open modal to add a new item
    const itemButtonClicked = () => {
        setShowItemModal(true);
    };

    // Close modal and reset error states
    const itemModalClosed = () => {
        setShowItemModal(false);
        setShowEmptyError(false);
        setRetrievalError(false);
    };
    
    const refreshPage = () => {
        window.location.reload();
    };

   
    // Save new category
    const saveButtonClicked = async () => {
        if (categoryName === "") {
            setShowEmptyError(true);
            setRetrievalError(false);
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
                    setRetrievalError(false);
                    setShowCategoryModal(false);
                    refreshPage();
                } else {
                    setRetrievalError(true);
                }
            } catch (err) {
                setRetrievalError(true);
            }
        }
    };

    const saveCategories = async () => {
        try {

            // Filter out empty values and make sure units is never null
            const validUnits = units.filter(unit => unit && unit.trim() !== "");
            
            const payload = {
                itemName: itemName.trim(),
                name: selectedCategory.trim(),
                units: validUnits
            };
    
            console.log("Sending payload:", payload);
            const response = await fetch("../api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                // Set error state?
                console.log("Server error response:", response);
            }
    
            itemModalClosed();
        } catch (err) {
            console.log("Error in saveCategories:", err);
            
            // Set error state?
        }
    };


    return (
        <div>
            {/* Navigation Bar */}
            <NavBar />
            <p className="font-crimson font-bold pl-20 pt-10 text-[40px]">Categories</p>
            <div className="flex justify-center items-center">
                <div className="w-3/5 h-4/5">
                    <div className="flex flex-col">
                        <p className="font-crimson crimson-bold text-[24px] pt-5">Edit Category</p>
                        <div className="flex justify-between items-center py-4 w-full">
                            <div className="flex flex-row items-center w-1/2">
                                <div className="w-full">
                                    {/* Dropdown to select category */}
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
                                        {/* <button onClick={() => DeleteCategoryModal()}> */}
                                        <Image
                                            src={deleteIcon}
                                            width={18}
                                            height={18}
                                            alt="delete Icon"
                                            className="m-4 ml-6 mt-2"
                                            onClick={() => openModal((String(selectedCategory)), (String(selectedCategoryData[0][0])))}
                                        />
                                        {showModal && <DeleteCategoryModal categoryName={String(selectedCategory)} itemName={String(itemName)} closeModal={closeModal} handleDelete={handleDelete} /> }
                                        {/* </button> */}
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
                                        {"Item "} <FontAwesomeIcon className="" icon={faPlus} style={{ fontSize: '14px' }} 
                                    />
                                    </button>
                                )}
                                <button
                                    className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 ml-4 rounded text-[20px]"
                                    onClick={categoryButtonClicked}
                                >
                                    {"Category "} <FontAwesomeIcon className="" icon={faPlus} style={{ fontSize: '14px' }}
                                />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 items-center h-full">
                        {showTable ? (
                            <CategoriesSpreadsheet categoryItems={selectedCategoryData} />
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
                    <div className="w-[412px] bg-[#FFFFFF] font-crimson justify-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
                        <div className="text-[32px] text-[#7EB672] ml-[5%] mb-2">Add Item</div>
                        <div className="flex-col mb-[30px] font-crimson">
                            <div className='flex mb-2'>
                                <div className="text-[30px] w-24 ml-[5%]">Name</div>
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
                            <p className="absolute w-[412px] text-center top-1/2 pt-5 text-red">
                                Please enter an item name.
                            </p>
                        )}
                        {showRetrievalError && (
                            <p className="absolute w-[412px] text-center top-1/2 pt-5 text-red">
                                Failed to add item.
                            </p>
                        )}
                        <div className="flex w-full justify-center space-x-[15px] items-center">
                            <button
                                className="flex text-gray hover:bg-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                onClick={itemModalClosed}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
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
                    <div className="h-[230px] w-[412px] bg-[#FFFFFF] font-crimson justify-center items-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green">
                        <p className="text-center text-[32px] font-bold pb-[15px]">Category Name</p>
                        <div className="flex w-full justify-center items-center pb-[30px]">
                            <input
                                type="text"
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] justify-center"
                            />
                        </div>
                        {showEmptyError && (
                            <p className="absolute w-[412px] text-center top-1/2 pt-5 text-red">
                                Please enter a category name.
                            </p>
                        )}
                        {showRetrievalError && (
                            <p className="absolute w-[412px] text-center top-1/2 pt-5 text-red">
                                Category name already exists.
                            </p>
                        )}
                        <div className="flex w-full justify-center space-x-[15px] items-center">
                            <button
                                className="flex text-gray hover:bg-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                onClick={cancelButtonClicked}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                onClick={saveButtonClicked}
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