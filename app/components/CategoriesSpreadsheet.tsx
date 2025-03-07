import React, { useEffect, useState } from "react";
import Image from 'next/image';
import deleteIcon from '@app/images/delete.png';
import editIcon from "@app/images/edit.png";
import { TiArrowUnsorted } from "react-icons/ti";

interface CategoriesSpreadsheetProps {
    categoryItems: (string | number)[][];
}

const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({ categoryItems = [] }) => {
    const [sortedItems, setSortedItems] = useState<(string | number)[][]>(categoryItems);
    const [topSorted, setTopSorted] = useState(true);

    useEffect(() => {
        setSortedItems([...categoryItems]);
    }, [categoryItems]);

    const sortAlphabetically = () => {
        const sortedList = [...sortedItems].sort((a,b) =>
            topSorted ? a[0].localeCompare(b[0].toString()) : b[0].localeCompare(a[0].toString())
    );
    
        setSortedItems(sortedList);
        setTopSorted(!topSorted);
    }

    return(
        <div className="relative overflow-x-auto font-arial bg-slate-50">
        <table className="table-auto w-full">
            <thead className ="font-crimson crimson-regular content-start">
                <tr className="bg-dark-blue text-white text-lg align-left ">
                <th className="border-r-2 border-slate-400 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Item Name</p>
                        <button onClick={() => sortAlphabetically()}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className="border-r-2 border-slate-400 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Units</p>
                        <button onClick={() => sortAlphabetically()}>
                            <TiArrowUnsorted />
                        </button>
                    </div>
                </th>
                <th className=" py-2 px-3">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-slate-50 font-crimson crimson-regular">
            {sortedItems.map((item, index) => (
                        <tr key={index} className="py-2">
                            {item.map((data, subIndex) => (
                                <td
                                    key={subIndex}
                                    className="border-r-2 border-slate-200 py-2 px-3"
                                >
                                    {data}
                                </td>
                            ))}
                            <td
                                key={`actions-${index}`}
                                className="flex row justify-around py-2 px-3"
                            >
                                <Image
                                    src={editIcon}
                                    width={18}
                                    height={18}
                                    alt="edit Icon"
                                    className=""
                                />
                                <Image
                                    src={deleteIcon}
                                    width={18}
                                    height={18}
                                    alt="delete Icon"
                                    className=""
                                />

                            </td>
                        </tr>
                    ))}
            </tbody>
            </table>
        </div>

    )
}

export default CategoriesSpreadsheet;