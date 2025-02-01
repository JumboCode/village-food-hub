"use client"
import React, { useEffect } from "react";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import {SearchBar, FilterButton} from '@app/components/InternalViewButtons';
import NavBar from '@app/components/NavBar';

// Utility function to format date to dd/mm/yyyy
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

async function getInventory() {
  try {
    // NOT WORKING 
    const response = await fetch("/../api/inventory", { method: 'GET' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const jsonData = await response.json();
    const data = jsonData.data;

    if (!Array.isArray(data)) {
      console.log("not an array");
      return [];
    }

    const listOfLists = data.map((object: any) => {
      const fields = Object.values(object);
      // Remove the last field (history object) because it conflicts with the spreadsheet
      fields.pop();

      // Format the date field if it exists
      const dateFieldIndex = fields.length - 1;
      const dateField = fields[dateFieldIndex];
      const date = new Date(dateField as string);

      if (!isNaN(date.getTime())) {
        fields[dateFieldIndex] = formatDate(date);
      } else {
        fields[dateFieldIndex] = "";
      }

      return fields;
    });

    console.log("List of Lists:", listOfLists);
    return listOfLists;
  } catch (error) {
    console.error(error);
    return [];
  }
}

interface FilterModalProps {
    // visibility 
    isOpen: boolean; 
    categories?: string[];

    // buttons
    onApply: (selectedCategories: string[]) => void;
    onReset: () => void;
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  categories = [],
  onApply,
  onReset,
  onClose,
}) => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const handleCheckboxChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev: any[]) => {
      if (checked) {
        return [...prev, category];
      }
      return prev.filter(c => c !== category);
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedCategories([]);
    }
  }, [isOpen]);

  const handleApply = () => {
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
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <div key={category} className="flex items-center space-x-2 mb-3 pl-6">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <p className="text-lg cursor-pointer">
                    {category}
                  </p>
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
  const [inventory, setInventory] = React.useState<any>();
  const [FilterModalOpen, setFilterModalOpen] = React.useState(false);

  // TODO: populate with categories from API 
  const categories = ["Bakery", "Dairy", "ten", "nine", "eight"];

  React.useEffect(() => {
    getInventory()
      .then((items: any) => {
        setInventory(items);
      });
  }, []);
  
  const handleApplyFilters = (selectedCategories: string[]) => {
    console.log("Selected categories:", selectedCategories);
    setFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    console.log("Filters reset");
  };

  const handleCloseModal = () => {
    setFilterModalOpen(false);
  }

  return (    
    <div>
      <NavBar/>
      <div className="px-10">
        <div className="flex flex-row justify-between mt-10 mb-6">
          <div className="text-[40px] relative overflow-x-auto font-crimson font-bold">
            Inventory
          </div>
          
          <div className="flex flex-row items-center">
            <SearchBar />
            <FilterButton onClick={() => setFilterModalOpen(prev => !prev)} />
            <FilterModal
                isOpen={FilterModalOpen}
                categories={categories}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onClose={handleCloseModal}
            />
          </div>
        </div>
        <InventorySpreadsheet inventoryItems={inventory} />
      </div>
     </div>
     
  );
};

export default InternalViewInventoryPage;

