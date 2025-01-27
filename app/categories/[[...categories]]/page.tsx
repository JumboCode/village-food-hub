'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { CategoriesSpreadsheet } from '@app/components/CategoriesSpreadsheet';
import { faPlus} from '@fortawesome/free-solid-svg-icons'
import deleteIcon from "../../images/delete.png"
import editIcon from "../../images/edit.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NameDropdown } from '@app/components/Dropdowns';
import NavBar from '@app/components/NavBar';

interface Category {
    name: string;
    itemName: string;
    units: string[];
}

async function getCategories(): Promise<Record<string, [string, string][]>> {
    try {
        const response = await fetch("/../api/categories", { method: 'GET' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data: Category[] = await response.json();

        const rearrangedData: Record<string, [string, string][]> = data.reduce((acc, record) => {
            const categoryName = record.name;
            const itemName = record.itemName;
            const units = record.units?.join(", ") || "";

            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push([itemName, units]);
            return acc;
        }, {});

        return rearrangedData;
    } catch (error) {
        console.error(error);
        return {};
    }
}

const Categories: React.FC = () => {
    const [categoriesData, setCategoriesData] = useState<{ [key: string]: any[] }>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getCategories();
                const categoryNames = Object.keys(data);
                console.log("Category Names:", categoryNames);
                setCategoriesData(data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setShowTable(true);
    };

    const selectedCategoryData = categoriesData[selectedCategory] || [];

    return (
        <div> 
            <NavBar/>
            <p className="font-crimson font-bold pl-20 pt-10 text-[40px] ">Categories</p>
           
            <div className='flex justify-center items-center'> 
                <div className="w-3/5 h-4/5 ">
                    <div className='flex flex-col'>
                        <p className="font-crimson crimson-bold text-[24px] pt-5 ">Edit Category</p>
                        <div className='flex justify-between items-center py-4 w-full'>
                            <div className='flex flex-row items-center w-1/2'>
                                <div className='w-full'>
                                    <NameDropdown 
                                        fetchUrl="/api/categories"
                                        filterName="name"
                                        onSelect={handleCategoryChange}
                                    />
                                </div>
                                {showTable && (
                                    <>
                                        <Image
                                            src={deleteIcon}
                                            width={18}
                                            height={18}
                                            alt="delete Icon"
                                            className="m-4 ml-6 mt-2"
                                        />
                                        <Image
                                            src={editIcon}
                                            width={18}
                                            height={18}
                                            alt="edit Icon"
                                            className="m-2 mb-3.5"
                                        />
                                    </>
                                )}
                            </div>
                            <div>
                                {showTable && (
                                    <button className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mr-2 mb-2 rounded text-[20px]">
                                        {"Item "} <FontAwesomeIcon className='' icon={faPlus} style={{ fontSize: '14px' }} />
                                    </button>
                                )}
                                <button className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 rounded text-[20px]">
                                    {"Category "} <FontAwesomeIcon className='' icon={faPlus} style={{ fontSize: '14px' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 items-center h-full">
                        {showTable ? (
                            <CategoriesSpreadsheet categoryItems={selectedCategoryData} />
                        ) : (
                            <p className="flex-center py-[250px] font-crimson text-[20px] text-center">
                                Select a category.
                            </p>
                        )}
                    </div> 
                </div>
            </div>
        </div>
    );
};

export default Categories; 


/*
pt-1 pb-1 px-1 mb-2 */