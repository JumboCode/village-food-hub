import React from "react";
import Image from 'next/image';
import deleteIcon from '../images/delete.png';
import editIcon from "../images/edit.png";
import arrowsIcon from "../images/upAndDownArrows.png";

interface CategoriesSpreadsheetProps {
    categoryItems: (string | number)[][];
}

export const CategoriesSpreadsheet: React.FC<CategoriesSpreadsheetProps> = ({ categoryItems = [] }) => {
    console.log("categoryItems:", categoryItems);

    return(
        <div className="relative overflow-x-auto font-arial bg-slate-50">
        <table className="table-auto w-full">
            <thead className ="font-crimson crimson-regular content-start">
                <tr className="bg-dark-blue text-white text-lg align-left ">
                <th className="border-r-2 border-slate-400 border-y-1 py-2 px-3">
                    <div className="flex flex-row justify-between">
                        <p>Item Name</p>
                        <Image src={arrowsIcon}
                                    width={10}
                                    height={6}
                                    alt="arrows Icon"
                                    className="">
                                    </Image>
                        </div>
                    </th>
                <th className="border-r-2 border-slate-400 py-2 px-3">Units</th>
                <th className=" py-2 px-3">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-slate-50 font-crimson crimson-regular">
            {categoryItems.map((item, index) => (
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