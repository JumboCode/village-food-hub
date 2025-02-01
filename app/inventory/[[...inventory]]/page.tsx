"use client"
import React, { useEffect } from "react";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import Image from 'next/image';
import filterSymbol from "@app/images/filterSymbol.svg";
import searchSymbol from "@app/images/searchSymbol.svg";
import SearchBar from '@app/components/SearchBar';
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

}

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen, 
    categories = [], 
    onApply, 
    onReset,
}) => {
    // empty array
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

      if (!isOpen) return null;


      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                className="w-[550px] bg-white font-crimson
                fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pt-8 shadow-lg rounded-lg, p-3">
                <div className="flex flex-col">
                    <div>
                    {categories && categories.length > 0 ? (
                        categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2 mb-3">
                            <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                            className="w-4 h-4"
                            />
                            <p 
                            className="text-lg font-crimson cursor-pointer"
                            >
                            {category}
                            </p>
                        </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                        No categories available
                        </div>
                    )}
                
    
    
                        
                    </div>
    
                    <div className="flex flex-row justify-evenly">
                        <button
                            onClick={handleReset}
                            className="bg-transparent text-gray hover:text-black crimson py-3 px-8 rounded-full text-[20px] border-gray"
                        >
                        Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="bg-light-green text-white hover:bg-light-green crimson py-3 px-8 rounded-full text-[20px] border-none"
                        >
                        Apply
                        </button>
                    </div>
                   
                    
                </div>
    
             </div>
        </div>
      )
    
}



const InternalViewInventoryPage: React.FC = () => {
  const [inventory, setInventory] = React.useState<any>();
  const [FilterModalOpen, setFilterModalOpen] = React.useState(false); 


//   TODO: populate with categories from API 
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

  return (    
    <div>
      <NavBar/>
      <div className="px-10">
        <div className="flex flex-row justify-between mt-10 mb-6">
          <div className="text-[40px] relative overflow-x-auto font-crimson font-bold">
            Inventory
          </div>
          
          <div className="flex flex-row items-center">
            <div className="border-2 border-[#D9D9D9] rounded-xl w-[400px] h-[54px]">
              <div className="flex flex-row py-2 px-2 items-center">
                <Image
                  src={searchSymbol}
                  alt="search button"
                  className="pl-2"
                  width={24}
                  height={29.14}
                />
                <input
                  className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none"
                  placeholder="Search.."
                >
                </input>
              </div>
            </div>
            <button className="border-2 border-[#D9D9D9] font-crimson rounded-xl ml-9 h-[54px]"
                onClick={() => setFilterModalOpen(prev => !prev)}                    >
                <div className="flex flex-row py-2 px-3">
                    <Image
                    src={filterSymbol}
                    alt="filter button"
                    width={24}
                    height={29.14}
                    
                    />
                <div className="text-[20px] relative overflow-x-auto crimson-bold font-crimson pl-2">
                  Filter
                </div>
              </div>
            </button>
            <FilterModal
                isOpen={FilterModalOpen}
                categories={categories}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />
          </div>
        </div>
        <InventorySpreadsheet inventoryItems={inventory} />
      </div>
     </div>
     
  );
};

export default InternalViewInventoryPage;

