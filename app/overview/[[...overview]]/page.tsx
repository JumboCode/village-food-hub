'use client';
import React from "react";
import useSWR from "swr";
import NavBar from '@app/components/NavBar';
import { useUser } from "@clerk/nextjs";

// // Utility function to format date to dd/mm/yyyy
// function formatDate(date: Date): string {
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${month}/${day}/${year}`;
// }

// // Define the structure of the inventory data item.
// // Here each inventory item is represented as an array.
// type InventoryItem = (string | number)[];

// // Define the structure of the raw inventory object returned by the API.
// interface InventoryRaw {
//   itemName: string;
//   categoryName: string;
//   quantity: number;
//   units: string;
//   lastUpdated: string;
//   history: unknown;
// }

// // SWR fetcher function to fetch and transform inventory data.
// const fetchInventory = async (url: string): Promise<InventoryItem[]> => {
//   const response = await fetch(url, { method: "GET" });
//   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//   const jsonData = await response.json();
//   const data = jsonData.data;
//   if (!Array.isArray(data)) {
//     console.log("not an array");
//     return [];
//   }
//   const listOfLists = data.map((object: InventoryRaw) => {
//     const { itemName, categoryName, quantity, units, lastUpdated, history } = object;
//     const formattedDate = lastUpdated ? formatDate(new Date(lastUpdated)) : "";
//     const historyString = history ? JSON.stringify(history) : "";
//     return [itemName, categoryName, quantity, units, formattedDate, historyString];
//   });
//   return listOfLists;
// };

// // Define a type for the structure of each record returned by the API
// interface DemographicsRecord {
//         lastVisitDate: string;
//         phoneNumber: string;
//         name: string;
//         address: string;
//         householdSize: number;
//         takeCount: number;
//         donateCount: number;
//         previousVisitDates: string[];
// }

// // A simple fetcher function for SWR
// const fetchDemographics = (url: string) =>
//         fetch(url).then((res) => {
//         if (!res.ok) throw new Error("Error fetching data");
//         return res.json();
// });

const OverviewPage: React.FC = () => {
  // Use SWR to fetch the inventory data.
//   const { data: inventory, error: inventoryError } = useSWR("/../api/inventory", fetchInventory);
//   const { data: demographics, error: demographicsError } = useSWR<DemographicsRecord[]>('/api/demographics', fetchDemographics);

  const { user, isLoaded } = useUser();

  return (
    <div>
      <NavBar />
      <div className="px-10">
        <div className="flex flex-row justify-between mt-10 mb-6">
        {user && isLoaded && 
        <div className="text-[40px] relative overflow-x-auto font-crimson font-bold">
          Welcome back, {user.firstName}! Here is an overview of this month!
        </div>}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;