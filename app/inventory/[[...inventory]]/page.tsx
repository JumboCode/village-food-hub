"use client"
import React, { useEffect } from "react";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import Image from 'next/image';
import filterSymbol from "@app/images/filterSymbol.svg";
import searchSymbol from "@app/images/searchSymbol.svg";
import SearchBar from '@app/components/SearchBar';


// Utility function to format date to dd/mm/yyyy
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function getInventory() {
  try {
    return fetch("/../api/inventory", { method: 'GET' })
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then((jsonData: any) => jsonData.data)
      .then((inventoryObjects: any) => {
        const listOfLists = inventoryObjects.map((object: any) => {
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
      });
  } catch (error) { 
    console.error(error);
    return Promise.resolve([]);
  }
}

const InternalViewInventoryPage: React.FC = () => {
  const [inventory, setInventory] = React.useState<any>();

  React.useEffect(() => {
    getInventory()
      .then((items: any) => {
        setInventory(items);
      });
  }, []);

  return (
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
          <button className="border-2 border-[#D9D9D9] font-crimson rounded-xl ml-9 h-[54px]">
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
        </div>
      </div>
      <InventorySpreadsheet inventoryItems={inventory} />
    </div>
  );
};

export default InternalViewInventoryPage;

