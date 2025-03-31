"use client"
import React, {useState, useEffect} from "react";
import DeleteDemographicsModal from "@app/components/DeleteDemographicsModal";
import { TiArrowUnsorted } from "react-icons/ti";
import { MdDeleteOutline } from "react-icons/md";

interface DemographicsSpreadsheetProps {
    demographicsItems: (string | number)[][];
}

export const DemographicsSpreadsheet: React.FC<DemographicsSpreadsheetProps> = ({ demographicsItems = []}) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [sortedItems, setSortedItems] = useState<(string | number)[][]>([]);
    const [topSorted, setTopSorted] = useState(true);
    const [quantityAscending, setQuantityAscending] = useState(true);
    const [DateAscending, setDateAscending] = useState(false);
    
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
    
            return DateAscending ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        });
    
        setSortedItems(sortedList);
        setDateAscending(!DateAscending);
    };    

    const openModal = (data: string, name: string) => {
        setShowModal(true);
        setSelectedData(data); 
        setName(name)
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phoneNumber: selectedData }),
            });

            if (!response.ok) {
                throw new Error("Error fetching demographics data.");
            }
            //refreshPage();
            setSortedItems(sortedItems.filter((item) => (item[2] != name)))
            console.log("Deleted successfully!");
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <div className="relative overflow-x-auto crimson-regular font-crimson">
        <table className="table-auto w-full">
            <thead className ="font-crimson border- crimson-regular border-separate content-start">
                <tr className="bg-dark-blue text-white text-lg align-left">
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p>Date</p>
                        <button onClick={() => sortDate()}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="font-[20px] flex flex-row justify-between">
                        <p>Phone Number</p>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="font-[20px] flex flex-row justify-between">
                        <p>Name</p>
                        <button onClick={() => sortAlphabetically()}>
                            <TiArrowUnsorted />
                        </button>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                <div className="font-[20px] flex flex-row justify-between">
                        <p>Address</p>
                        </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p>House Size</p>
                        <button onClick={() => sortQuantity(4)}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p>Received</p>
                        <button onClick={() => sortQuantity(5)}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                    <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                    <div className="font-[20px] flex flex-row justify-between">
                        <p>Donated</p>
                        <button onClick={() => sortQuantity(6)}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className="font-[20px] border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson crimson-regular">
                {sortedItems.map((row, rowIndex) => (
                    <tr key={rowIndex} className="py-2">
                        {row.map((cell, colIndex) => (
                            <td
                                key={colIndex}
                                className="border-collapse border-zinc-200 border-2 border-y-1 px-3"
                            >
                                {colIndex === 4 && Number(cell) >= 10 ? "10+" : String(cell)}
                            </td>
                        ))}
                        <td className="border-collapse border-zinc-200 border-2 border-y-1 px-3 text-center">
                            <span className="inline-flex justify-center gap-3">
                                <MdDeleteOutline
                                    size={24}
                                    className="cursor-pointer" 
                                    onClick={() => openModal(String(row[1]), String(row[2]))}
                                />
                                {showModal && <DeleteDemographicsModal userName={String(name)} closeModal={closeModal} handleDelete={handleDelete} /> }
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}

export default DemographicsSpreadsheet;