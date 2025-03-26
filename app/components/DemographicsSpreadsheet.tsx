"use client"
import React, { useState, useEffect } from "react";
import DeleteDemographicsModal from "@app/components/DeleteDemographicsModal";
import { TiArrowUnsorted } from "react-icons/ti";
import { MdDeleteOutline } from "react-icons/md";

interface DemographicsSpreadsheetProps {
  demographicsItems: (string | number)[][];
}

export const DemographicsSpreadsheet: React.FC<DemographicsSpreadsheetProps> = ({ demographicsItems = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [sortedItems, setSortedItems] = useState<(string | number)[][]>([]);
  const [topSorted, setTopSorted] = useState(true);
  const [quantityAscending, setQuantityAscending] = useState(true);
  const [dateAscending, setDateAscending] = useState(false);

  useEffect(() => {
    setSortedItems([...demographicsItems]);
  }, [demographicsItems]);

  const sortAlphabetically = () => {
    const sortedList = [...sortedItems].sort((a, b) => {
      const valueA = String(a[2]); 
      const valueB = String(b[2]); 
      return topSorted ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
    setSortedItems(sortedList);
    setTopSorted(!topSorted);
  };

  const sortQuantity = (index: number) => {
    const sortedList = [...sortedItems].sort((a, b) =>
      quantityAscending ? Number(b[index]) - Number(a[index]) : Number(a[index]) - Number(b[index])
    );
    setSortedItems(sortedList);
    setQuantityAscending(!quantityAscending);
  };

  const sortDate = () => {
    const sortedList = [...sortedItems].sort((a, b) => {
      const dateA = new Date(String(a[0]));  
      const dateB = new Date(String(b[0]));  
      return dateAscending ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
    setSortedItems(sortedList);
    setDateAscending(!dateAscending);
  };

  const openModal = (data: string, name: string) => {
    setShowModal(true);
    setSelectedData(data); 
    setName(name);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setSelectedData(null); 
    setName(null);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleDelete = async () => {
    if (!selectedData) return;
    try {
      const response = await fetch("/../api/demographics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: selectedData }),
      });
      if (!response.ok) throw new Error("Error fetching demographics data.");
      refreshPage();
      console.log("Deleted successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-black bg-light-gray bg-opacity-70">
          <tr>
            <th className="px-6 py-3">
              <div className="flex items-center justify-between">
                <span>Date</span>
                <button onClick={sortDate} className="ml-2 text-gray-500 hover:text-gray-900">
                  <TiArrowUnsorted />
                </button>
              </div>
            </th>
            <th className="px-6 py-3">Phone Number</th>
            <th className="px-6 py-3">
              <div className="flex items-center justify-between">
                <span>Name</span>
                <button onClick={sortAlphabetically} className="ml-2 text-gray-500 hover:text-gray-900">
                  <TiArrowUnsorted />
                </button>
              </div>
            </th>
            <th className="px-6 py-3">Address</th>
            <th className="px-6 py-3">
              <div className="flex items-center justify-between">
                <span>House Size</span>
                <button onClick={() => sortQuantity(4)} className="ml-2 text-gray-500 hover:text-gray-900">
                  <TiArrowUnsorted />
                </button>
              </div>
            </th>
            <th className="px-6 py-3">
              <div className="flex items-center justify-between">
                <span>Received</span>
                <button onClick={() => sortQuantity(5)} className="ml-2 text-gray-500 hover:text-gray-900">
                  <TiArrowUnsorted />
                </button>
              </div>
            </th>
            <th className="px-6 py-3">
              <div className="flex items-center justify-between">
                <span>Donated</span>
                <button onClick={() => sortQuantity(6)} className="ml-2 text-gray-500 hover:text-gray-900">
                  <TiArrowUnsorted />
                </button>
              </div>
            </th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b border-light-gray">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {String(cell)}
                </td>
              ))}
              <td className="px-6 text-center">
                <span className="inline-flex items-center gap-3">
                  <MdDeleteOutline
                    size={24}
                    className="cursor-pointer hover:text-red"
                    onClick={() => openModal(String(row[1]), String(row[2]))}
                  />
                  {showModal && (
                    <DeleteDemographicsModal
                      userName={String(name)}
                      closeModal={closeModal}
                      handleDelete={handleDelete}
                    />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DemographicsSpreadsheet;