"use client"
import React, {useState, useEffect} from "react";
import Image from 'next/image';
import deleteIcon from '@app/images/delete.png';
import DeleteModal from "@app/components/DeleteModal";
import { TiArrowUnsorted } from "react-icons/ti";


interface DemographicsSpreadsheetProps {
    demographicsItems: (string | number)[][][][];
}

export const DemographicsSpreadsheet: React.FC<DemographicsSpreadsheetProps> = ({ demographicsItems = []}) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    const [sortedItems, setSortedItems] = useState<(string | number)[][][][]>([]);
    const [topSorted, setTopSorted] = useState(true);
    const [quantityAscending, setQuantityAscending] = useState(true);
    const [DateAscending, setDateAscending] = useState(false);
    
    useEffect(() => {
        setSortedItems([...demographicsItems]);
    }, [demographicsItems]);

    const sortAlphabetically = () => {
        const sortedList = [...sortedItems].sort((a,b) =>
            topSorted ? a[2][0].localeCompare(b[2][0].toString()) : b[2][0].localeCompare(a[2][0].toString())
    );
        setSortedItems(sortedList);
        setTopSorted(!topSorted);
    }

    const sortQuantity= (index: number) => {
        const sortedList = [...sortedItems].sort((a,b) =>
            quantityAscending ?  Number(b[index]) - Number(a[index]) : Number(a[index]) - Number(b[index]) 

    );
        console.log(sortedItems)
        setSortedItems(sortedList);
        setQuantityAscending(!quantityAscending);
    }

    const sortDate = () => {
        const sortedList = [...sortedItems].sort((a, b) => {
            const dateA = new Date(a[0]); 
            const dateB = new Date(b[0]);
    
            return DateAscending ? dateB.getTime() - dateA.getTime(): dateA.getTime() - dateB.getTime();
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
            refreshPage();
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
                <tr className="bg-dark-blue text-white text-lg align-left ">
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
            {sortedItems.map((item, index) => (
                        <tr key={index} className="py-2">
                            {item.map((data, subIndex) => (
                                <td
                                    key={subIndex}
                                    className="border-collapse border-zinc-200 border-2 border-y-1 py-2 px-3"
                                >
                                    {data}
                                </td>
                            ))}
                            <td
                                key={`actions-${index}`}
                                className="flex row justify-around border-collapse border-zinc-300 border-2 border-y-1 py-2 px-3"
                            >
                                <Image
                                    src={deleteIcon}
                                    width={18}
                                    height={18}
                                    alt="delete Icon"
                                    className="cursor-pointer" 
                                    // onClick={() => openModal(item[1])} /* get the phonenumber from this row in column 2*/
                                    onClick={() => openModal((String(demographicsItems[index][1])), (String(demographicsItems[index][2])))}
                                
                                    
                                />
                                {showModal && <DeleteModal userName={String(name)} closeModal={closeModal} handleDelete={handleDelete} /> }
                            </td>
                        </tr>
                    ))}
            </tbody>
            </table>
        </div>
    )
}

export default DemographicsSpreadsheet;