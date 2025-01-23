"use client"
import React, { useEffect } from "react";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import Image from 'next/image';
import filterSymbol from "@app/images/filterSymbol.svg"


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
  useEffect(() => {
    getInventory()
      .then((items: any) => { setInventory(items) })
  }, []);
  return (
    <div className= "px-10">
      <div className= "text-[40px] relative overflow-x-auto crimson-regular font-crimson" > Inventory </div>
      <button className = "flex flex-row border-2 border-grey rounded-l">
            <Image
                  src={filterSymbol}
                  alt="filter button"
                  width={24}
                  height={29.14}
              />
        <div className= "text-[20px] relative overflow-x-auto crimson-regular font-crimson pl-2" > Filter
        </div>
      </button>
      <InventorySpreadsheet inventoryItems={inventory} />
    </div>
  );
};

export default InternalViewInventoryPage;