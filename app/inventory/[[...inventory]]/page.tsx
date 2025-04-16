'use client';
import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import { SearchBar, FilterButton } from '@app/components/InternalViewButtons';
import { NavBar } from '@app/components/NavBar';

import LoadingAnimation from "@app/components/LoadingAnimation";
import { userIsAdmin, userIsStaff } from "@app/components/ProtectedUrls";

import { useUser } from "@clerk/nextjs";

// Utility function to format date to dd/mm/yyyy
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

type InventoryItem = (string | number)[];
interface InventoryRaw {
  itemName: string;
  categoryName: string;
  quantity: number;
  units: string;
  lastUpdated: string;
  history: unknown;
}

const fetchInventory = async (url: string): Promise<InventoryItem[]> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const jsonData = await response.json();
  const data = jsonData.data;

  if (!Array.isArray(data)) return [];

  return data.map((item: InventoryRaw) => {
    const formattedDate = item.lastUpdated ? formatDate(new Date(item.lastUpdated)) : "";
    const historyString = item.history ? JSON.stringify(item.history) : "";
    return [item.itemName, item.categoryName, item.quantity, item.units, formattedDate, historyString];
  });
};

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

  useEffect(() => {
    setSelectedCategories(initialSelectedCategories);
  }, [initialSelectedCategories]);

  const handleCheckboxChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => checked ? [...prev, category] : prev.filter(c => c !== category));
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(fetchUrl || '');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const fetchedCategories: FetchedCategory[] = await response.json();
        const categoryNames = fetchedCategories.map(item => item[filterName] as string);

        const filteredItems = filterValue
          ? fetchedCategories
              .filter(category => category[filterName] === filterValue)
              .flatMap(category => categoriesList && Array.isArray(category[categoriesList]) ? category[categoriesList] : [])
          : categoryNames;

        setCategories([...new Set(filteredItems)]);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    if (fetchUrl) fetchCategories();
  }, [fetchUrl, filterName, filterValue, categoriesList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[300px] bg-white py-6 shadow-lg rounded-lg">
        <button onClick={onClose} className="absolute top-2 right-2 pr-2 text-gray-500 hover:text-black">&times;</button>
        <div className="flex flex-col">
          {Categories.length > 0 ? (
            Categories.map(category => (
              <div key={category} className="flex items-center space-x-2 mb-3 pl-8 font-crimson">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={e => handleCheckboxChange(category, e.target.checked)}
                  className="w-4 h-4 focus:outline-none focus:ring-0"
                />
                <p className="text-lg cursor-pointer">{category}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-[20px] font-crimson py-4">
              No categories available
            </div>
          )}
          <div className="flex justify-evenly font-crimson pt-4">
            <button onClick={() => {
                      onReset(); 
                      onClose();
                    }}  
                    className="text-gray hover:text-black hover:bg-light-gray py-1.5 px-8 rounded-md text-[20px] border border-gray">Reset</button>
            <button onClick={() => {
                      onApply(selectedCategories); 
                      onClose();
                    }} 
                    className="bg-light-green hover:bg-dark-green text-white px-8 py-1.5 rounded-md text-[20px]">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InternalViewInventoryPage: React.FC = () => {
  const { data: inventory, error, isLoading } = useSWR("/api/inventory", fetchInventory);
  const [searchInput, setSearchInput] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const { user } = useUser(); // Get the current user from Clerk
  const hasAccess = userIsAdmin(user) || userIsStaff(user);

  const filteredInventory = useMemo(() => {
    if (!inventory) return [];
    let result = inventory;
    if (appliedFilters.length > 0) {
      result = result.filter(item => appliedFilters.includes(item[1] as string));
    }
    if (searchInput.trim()) {
      result = result.filter(item => String(item[0]).toUpperCase().includes(searchInput.toUpperCase()));
    }
    return result;
  }, [inventory, appliedFilters, searchInput]);

  if (isLoading) {
    return (
      <LoadingAnimation />
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p className="text-red-600 font-crimson text-[20px]">Error loading inventory. Please try again later.</p>
  //     </div>
  //   );
  // }

  return (
    hasAccess ? (
        <div>
        <NavBar />
        <div className="px-10">
            <div className="flex flex-row justify-between mt-10 mb-6">
            <div className="text-[40px] font-crimson font-bold">Inventory</div>
            <div className="flex items-center space-x-4">
                <SearchBar 
                input={searchInput}
                setInput={setSearchInput}
                placeholder="Search by item name..."
                />
                <FilterButton onClick={() => setFilterModalOpen(prev => !prev)} />
                <FilterModal
                isOpen={filterModalOpen}
                onApply={setAppliedFilters}
                onReset={() => setAppliedFilters([])}
                onClose={() => setFilterModalOpen(false)}
                fetchUrl="/api/categories"
                filterName="name"
                initialSelectedCategories={appliedFilters}
                />
            </div>
            </div>

            {filteredInventory.length > 0 ? (
            <InventorySpreadsheet inventoryItems={filteredInventory} />
            ) : (
            <div className="text-center text-gray-500 text-[20px] font-crimson py-4">
                {appliedFilters.length > 0 
                ? `There are no items under ${appliedFilters.join(', ')}.`
                : "There are currently no items in the inventory database matching the searched item."}
            </div>
            )}
        </div>
        
        {appliedFilters.length > 0 && (
          <button
            onClick={() => setAppliedFilters([])}
            className="bg-purple text-white px-4 py-2 rounded-md hover:bg-dark-purple transition-all"
          >
            Clear Filters
          </button>
        )}
        </div>
    ) : (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold">Unauthorized Access</h1>
            <p className="mt-4">You do not have permission to view this page.</p>
        </div>
    )
  );
};

export default InternalViewInventoryPage;