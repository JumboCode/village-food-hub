'use client';

import React, { useState } from 'react';
import { CategoriesSpreadsheet } from '@app/components/CategoriesSpreadsheet';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NameDropdown } from '@app/components/Dropdowns';
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';


// export default function Categories()  {
// FOR TESTING:

const Categories: React.FC<{ onChange: (value: string) => void }> = ({ onChange }) => {

    const optionsArr = ["Bakery", "Dairy & Eggs", "Dry Goods", "Meat", "Prepared Foods", "Produce"]
    const categoryItems = [["bread", "100"], ["cupcake", "100"]]

    const [showTable, setShowTable] = useState(false);

    const switchState = () => {
        setShowTable(true)
    }


    
    return (
        <div> 
            <p className="font-bold pl-20 pt-10 text-[40px] ">Categories</p>
           
            <div className='flex justify-center items-center'> 
                <div className="w-3/5 h-4/5 ">
                    <div className='flex flex-col'>
                    <p className="crimson-bold text-[24px] pt-5 ">Edit Category</p>
                        <div className='flex justify-between items-center py-4 w-full'>
                        <div className='flex flex-col w-1/2'>
                            <div className="pt-">
                                <NameDropdown options={optionsArr} onSelect={switchState} />
                            </div>
                        </div>

                        {showTable && (<button className="bg-light-green hover:bg-dark-green text-white font-serif py-[5px] px-[20px] rounded text-[20px]">
                            { "Item "} <FontAwesomeIcon className='' icon={faPlus} style={{ fontSize: '14px' }}/>
                        </button>)}
                    
                        <button className="bg-light-green hover:bg-dark-green text-white font-serif py-[5px] px-[20px] rounded text-[20px]">
                            { "Category "} <FontAwesomeIcon className='' icon={faPlus} style={{ fontSize: '14px' }}/>
                        </button>


                    </div>
                </div>
                    <div className="bg-slate-50 items-center h-full">
                       {showTable && (<CategoriesSpreadsheet categoryItems={categoryItems} />)}
                        {!showTable && (<p className="flex-center py-[250px] text-[20px] text-center">Select a category.</p>)}

                    </div> 
                </div>
            </div>
        </div>
    
        );
}

export default Categories; 

