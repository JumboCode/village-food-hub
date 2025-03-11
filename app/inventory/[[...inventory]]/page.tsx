'use client';
import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import { SearchBar, FilterButton } from '@app/components/InternalViewButtons';
import NavBar from '@app/components/NavBar';

// Utility function to format date to dd/mm/yyyy
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Define the structure of the inventory data item.
// Here each inventory item is represented as an array.
type InventoryItem = (string | number)[];

// Define the structure of the raw inventory object returned by the API.
interface InventoryRaw {
  itemName: string;
  categoryName: string;
  quantity: number;
  units: string;
  lastUpdated: string;
  history: unknown;
}

// SWR fetcher function to fetch and transform inventory data.
const fetchInventory = async (url: string): Promise<InventoryItem[]> => {
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const jsonData = await response.json();
  const data = jsonData.data;
  if (!Array.isArray(data)) {
    console.log("not an array");
    return [];
  }
  const listOfLists = data.map((object: InventoryRaw) => {
    const { itemName, categoryName, quantity, units, lastUpdated, history } = object;
    const formattedDate = lastUpdated ? formatDate(new Date(lastUpdated)) : "";
    const historyString = history ? JSON.stringify(history) : "";
    return [itemName, categoryName, quantity, units, formattedDate, historyString];
  });
  return listOfLists;
};

// Define a type for the fetched category objects.
interface FetchedCategory {
  [key: string]: string | string[];
}

interface FilterModalProps {
  isOpen: boolean;
  categoriesList?: string;
  onApply: (selectedCategories: string[]) => void;
  onReset: () => void;
  onClose: () => void;
  fetchUrl?: string;
  filterName: string;
  filterValue?: string;
  initialSelectedCategories: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  categoriesList,
  onApply,
  onReset,
  onClose,
  fetchUrl,
  filterName,
  filterValue,
  initialSelectedCategories
}) => {
  const [Categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);

  // Update local state if the parent's selected filters change.
  useEffect(() => {
    setSelectedCategories(initialSelectedCategories);
  }, [initialSelectedCategories]);

  const handleCheckboxChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev: string[]) => {
      if (checked) {
        return [...prev, category];
      }
      return prev.filter(c => c !== category);
    });
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(fetchUrl || '');
        if (response.ok) {
          const fetchedCategories: FetchedCategory[] = await response.json();
          const categoryNames = fetchedCategories.map((item) => item[filterName] as string);
          
          const filteredItems = filterValue
            ? fetchedCategories
                .filter((category) => category[filterName] === filterValue)
                .flatMap((category) => categoriesList && Array.isArray(category[categoriesList]) ? category[categoriesList] : [])
            : categoryNames;

          const uniqueItemName: string[] = Array.from(new Set(filteredItems));
          setCategories(uniqueItemName);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    if (fetchUrl) {
      fetchCategories();
    }
  }, [fetchUrl, filterName, filterValue, categoriesList]);

  const handleApply = () => {
    // If no filters are checked, treat it as cancel and simply close the modal.
    if (selectedCategories.length === 0) {
      onClose();
      return;
    }
    onApply(selectedCategories);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    onReset();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[300px] bg-white py-6 shadow-lg rounded-lg">
        <button
          className="absolute top-2 right-2 pr-2 text-gray-500 hover:text-black"
          onClick={handleClose}
        >
          &times;
        </button>
        <div className="flex flex-col">
          <div>
            {Categories && Categories.length > 0 ? (
              Categories.map((category) => (
                <div key={category} className="flex items-center space-x-2 mb-3 pl-8 font-crimson">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <p className="text-lg cursor-pointer">{category}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-[20px] font-crimson py-4">
                No categories available
              </div>
            )}
          </div>

          <div className="flex flex-row justify-evenly font-crimson pt-4">
            <button
              onClick={handleReset}
              className="bg-transparent text-gray hover:text-black hover:bg-light-gray py-1.5 px-8 rounded-md text-[20px] border border-gray"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="bg-light-green hover:bg-dark-green text-white px-8 py-1.5 rounded-md text-[20px]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InternalViewInventoryPage: React.FC = () => {
  // Use SWR to fetch the inventory data.
  const { data: inventory, error } = useSWR("/../api/inventory", fetchInventory);

  // Local state for search input, applied filters, and modal state.
  const [searchInput, setSearchInput] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Derive filtered inventory using useMemo.
  const filteredInventory = useMemo(() => {
    if (!inventory) return [];
    let filtered = inventory;
    if (appliedFilters.length > 0) {
      filtered = filtered.filter(item =>
        appliedFilters.includes(item[1] as string)
      );
    }
    if (searchInput.trim() !== "") {
      filtered = filtered.filter(item =>
        String(item[0]).toUpperCase().includes(searchInput.toUpperCase())
      );
    }
    return filtered;
  }, [inventory, appliedFilters, searchInput]);

  // Handlers for the filter modal.
  const handleApplyFilters = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilterModalOpen(false);
      return;
    }
    setAppliedFilters(selectedCategories);
    setFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setAppliedFilters([]);
    setFilterModalOpen(false);
  };

  const handleCloseModal = () => {
    setFilterModalOpen(false);
  };

  return (
    <div>
      <NavBar />
      <div className="px-10">
        <div className="flex flex-row justify-between mt-10 mb-6">
          <div className="text-[40px] relative overflow-x-auto font-crimson font-bold">
            Inventory
          </div>
          <div className="flex flex-row items-center">
            <SearchBar 
              input={searchInput}
              setInput={setSearchInput}
              placeholder={"Search by item name..."}
            />
            <FilterButton onClick={() => setFilterModalOpen(prev => !prev)} />
            <FilterModal
              isOpen={filterModalOpen}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              onClose={handleCloseModal}
              fetchUrl="/api/categories"
              filterName="name"
              initialSelectedCategories={appliedFilters}
            />
          </div>
        </div>
        {error && (
          <div className="text-center text-red-600">
            Error loading inventory.
          </div>
        )}
        {inventory ? (
          filteredInventory.length > 0 ? (
            <InventorySpreadsheet inventoryItems={filteredInventory} />
          ) : (
            <div className="text-center text-gray-500 text-[20px] font-crimson py-4">
              {appliedFilters.length > 0 
                ? `There are currently no items under the category ${appliedFilters.join(', ')} in the inventory database.` 
                : "There are currently no items in the inventory database."}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default InternalViewInventoryPage;