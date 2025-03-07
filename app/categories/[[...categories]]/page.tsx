'use client';
import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
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
import DeleteCategoryModal from '@app/components/DeleteCategoryModal';

// Define a type for the transformed categories data.
// Each category key maps to an array of rows where each row is a tuple of [itemName, units].
interface CategoryData {
  [key: string]: [string, string][];
}

// A simple fetcher for SWR.
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Error fetching data, status: ${res.status}`);
    return res.json();
  });

const Categories: React.FC = () => {
  // Use SWR to fetch the raw categories data from your API.
  const { data: categoriesRawData, error, mutate } = useSWR('/api/categories', fetcher);

  // Transform the raw data into the CategoryData format.
  // Assuming each record has: name, itemName, and units (an array of strings).
  const categoriesData: CategoryData = useMemo(() => {
    if (!categoriesRawData) return {};
    return categoriesRawData.reduce((acc: CategoryData, record: { name: string; itemName: string; units: string[] }) => {
      const catName = record.name;
      const trimmedItemName = record.itemName.trim();
      const validUnits = (record.units || [])
        .map(u => u.trim())
        .filter(u => u !== '');
      // Only include record if either the item name or at least one unit is non-empty.
      if (trimmedItemName !== '' || validUnits.length > 0) {
        if (!acc[catName]) {
          acc[catName] = [];
        }
        const unitsString = validUnits.join(', ');
        acc[catName].push([trimmedItemName, unitsString]);
      }
      return acc;
    }, {} as CategoryData);
  }, [categoriesRawData]);

  // Local UI state.
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTable, setShowTable] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [itemName, setItemName] = useState('');
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [showRetrievalError, setShowRetrievalError] = useState(false);
  const [units, setUnits] = useState<string[]>([]);
  const [showDuplicateError, setShowDuplicateError] = useState(false);

  // Delete modal state.
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Open delete category modal.
  const openModal = (catName: string, itemName: string) => {
    console.log("openModal called with category:", catName, "item:", itemName);
    setShowDeleteModal(true);
    setCategoryName(catName);
    setItemName(itemName);
  };

  const closeModal = (): void => {
    setShowDeleteModal(false);
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

  // Instead of reloading the whole page, use SWR's mutate to revalidate the data.
  const refreshPage = () => {
    mutate();
  };

  // Save new category.
  const saveButtonClicked = async () => {
    if (categoryName === '') {
      setShowEmptyError(true);
      setShowRetrievalError(false);
    } else {
      setShowEmptyError(false);
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify({
            itemName: '',
            name: categoryName,
            units: [],
          }),
        });
        if (response.ok) {
          console.log("Successfully added " + categoryName);
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
      const validUnits = units.filter(unit => unit && unit.trim() !== '');
      if (trimmedItemName === '' || validUnits.length < 1) {
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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.log("Server error response:", response);
      }
      setShowItemModal(false);
      refreshPage();
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
    if (editCategoryName === '') {
      setShowEmptyError(true);
    } else if (Object.keys(categoriesData).includes(editCategoryName)) {
      setShowDuplicateError(true);
    } else {
      try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        const nameExists = categories.some((category: any) => category.name === editCategoryName);
        if (nameExists && editCategoryName !== selectedCategory) {
          setShowDuplicateError(true);
          return;
        }
        const updateCatRes = await fetch('/api/categories/', {
          method: 'PUT',
          body: JSON.stringify({
            oldName: selectedCategory,
            newName: editCategoryName,
          }),
        });
        const updateInvRes = await fetch('/api/inventory/', {
          method: 'PATCH',
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

  // Get the data for the selected category.
  const selectedCategoryData = categoriesData[selectedCategory] || [];

  // Render the page.
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
                    <Image
                      src={deleteIcon}
                      width={18}
                      height={18}
                      alt="delete Icon"
                      className="m-4 ml-6 mt-2"
                      onClick={() =>
                        openModal(
                          String(selectedCategory),
                          String(selectedCategoryData[0]?.[0] || '')
                        )
                      }
                    />
                    {showDeleteModal && (
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
                  <button
                    className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 ml-36 rounded text-[20px]"
                    onClick={itemButtonClicked}
                  >
                    Item <FontAwesomeIcon icon={faPlus} style={{ fontSize: '14px' }} />
                  </button>
                )}
                <button
                  className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 ml-4 rounded text-[20px]"
                  onClick={categoryButtonClicked}
                >
                  Category <FontAwesomeIcon icon={faPlus} style={{ fontSize: '14px' }} />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 items-center h-full">
            {showTable ? (
              <>
                <CategoriesSpreadsheet 
                  categoryName={selectedCategory}
                  categoryItems={categoriesData[selectedCategory] || []}
                  loadData={mutate}
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
      {/* Additional modals for adding/editing items or categories follow... */}
      {showItemModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal content for adding an item */}
        </div>
      )}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal content for adding a category */}
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal content for editing a category name */}
        </div>
      )}
    </div>
  );
};

export default Categories;