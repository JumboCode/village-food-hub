"use client"
import React, { useEffect } from "react";
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import Image from 'next/image';
import filterSymbol from "@app/images/filterSymbol.svg"
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

const InternalViewInventoryPage: React.FC = () => {
  const [inventory, setInventory] = React.useState<any[]>([]);
  useEffect(() => {
    getInventory()
      .then((items) => { setInventory(items) })
  }, []);
  return (
    <div>
      <NavBar/>
        
      <div className="px-20">
        <p className="font-crimson font-bold pt-10 pb-5 text-[40px] ">Inventory</p>
        <InventorySpreadsheet inventoryItems={inventory} />
      </div>
    </div>
  );
};

export default InternalViewInventoryPage;