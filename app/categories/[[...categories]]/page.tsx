'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { CategoriesSpreadsheet } from '@app/components/CategoriesSpreadsheet';
import { faPlus} from '@fortawesome/free-solid-svg-icons'
import deleteIcon from "../../images/delete.png"
import editIcon from "../../images/edit.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NameDropdown } from '@app/components/Dropdowns';
import { InventorySpreadsheet } from '@app/components/InventorySpreadsheet';
import NavBar from '@app/components/NavBar';


// export default function Categories()  {
// FOR TESTING:

const Categories: React.FC<{ onChange: (value: string) => void }> = ({ onChange }) => {

    // variables
    const optionsArr = ["Bakery", "Dairy & Eggs", "Dry Goods", "Meat", "Prepared Foods", "Produce"]
    const categoryItems = [["bread", "100"], ["cupcake", "100"]]

    // to show the table
    const [showTable, setShowTable] = useState(false);

    const switchState = () => {
        setShowTable(true)
    }

    // when clicking the categories button
    const [showModal, setShowModal] = useState(false);

    const categoryButtonClicked = () => {
        setShowModal(true);
    }

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
                                {/* TODO: we will eventually have to add "value" here as the selected option so it shows up in the selected dropdown text */}
                                <NameDropdown options={optionsArr} onChange={switchState} /> 
                            </div>
                            {showTable && (
                                <Image
                                src={deleteIcon}
                                width={18}
                                height={18}
                                alt="delete Icon"
                                className="m-4 ml-6 mt-2"
                            />
                            )}
                            {showTable && (
                                <Image
                                src={editIcon}
                                width={18}
                                height={18}
                                alt="delete Icon"
                                className="m-2 mb-3.5"
                            />
                            )}
                        </div>

                        <div>

                            {showTable && 
                                (<button className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mr-2 mb-2 rounded text-[20px]">
                                    { "Item "} <FontAwesomeIcon className='' icon={faPlus} style={{ fontSize: '14px' }}/>
                                </button>)
                            }
                        
                            {/* Button to open the add category modal */}
                            <button 
                                className="bg-light-green hover:bg-dark-green text-white font-serif pt-1 pb-1 px-4 mb-2 rounded text-[20px]"
                                onClick={categoryButtonClicked}
                            >
                                { "Category "} <FontAwesomeIcon className='' icon={faPlus} style={{ fontSize: '14px' }}/>
                            </button>


                            {/* Add Category Modal */}
                            {showModal &&
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    
                                    <div className="h-[207px] w-[412px] bg-[#FFFFFF] font-crimson justify-center items-center py-[20px] shadow-lg rounded-[7px] border-[2px] border-light-green space-y-[15px]">
                                        {/* Title */}
                                        <p className="text-center text-[32px] font-bold">
                                           Category Name
                                        </p>

                                        {/* Text Input */}
                                        <div className="flex w-full justify-center items-center">
                                            <input 
                                                type="text"
                                                className="flex w-[242px] h-[50px] bg-inherit rounded-[13px] border-[3px] border-[#E1E1E1] justify-center"
                                            >
                                            </input>
                                        </div>

                                        <div className="flex w-full justify-center space-x-[15px] items-center">

                                            {/* Cancel Button */}
                                            <button 
                                                className="flex text-gray hover:bg-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                                onClick={categoryButtonClicked}
                                            >
                                                Cancel
                                            </button>

                                            {/* Save Button */}
                                            <button 
                                                className="flex bg-light-green hover:bg-dark-green text-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                                onClick={categoryButtonClicked}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>


                    </div>
                </div>
                    <div className="bg-slate-50 items-center h-full">
                       {showTable && (
                            <CategoriesSpreadsheet categoryItems={categoryItems} />
                        )}

                        {!showTable && (
                            <p className="flex-center py-[250px] font-crimson text-[20px] text-center">
                                Select a category.
                            </p>
                        )}
                    </div> 
                </div>
            </div>
        </div>
    
        );
}

export default Categories; 


/*
pt-1 pb-1 px-1 mb-2 */