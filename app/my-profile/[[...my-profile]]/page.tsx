"use client"
import ProfileView from "@app/components/ProfileView";
import React, { useState } from "react";
import NavBar from "@app/components/NavBar";
import Image from 'next/image';
import deleteIcon from '@app/images/deleteIcon.svg';
import pencilIcon from '@app/images/pencil.svg';

const MyProfilePage: React.FC = () => {
  const [showEditProfileView, setShowEditProfileView] = useState(false);

  
    function handleEditProfileView() {
        setShowEditProfileView(true);
    }

    function handleCancelProfileView() {
        setShowEditProfileView(false);
    }

    function handleSaveChange() {
        setShowEditProfileView(false);
    }
    
    return (
        <div>
            <NavBar/>
            {showEditProfileView ? (
            <div>
                <div className="p-[80px] pt-[50px]">

                    <p className="font-crimson text-[40px] mb-[20px]"> Edit Profile</p>
                    <ProfileView visible={showEditProfileView} mode="edit" onCancel={handleCancelProfileView} />
                    <div>
                    <button className="bg-light-green hover:bg-dark-green text-white text-[24px] font-crimson w-[200px] h-[50px] rounded-xl mt-[40px] mr-[30px]"
                        onClick={handleSaveChange}
                        >
                        Save Changes
                    </button>
                    <button 
                        className="bg-white hover:bg-light-gray text-gray text-[24px] font-crimson w-[200px] h-[50px] rounded-xl mt-[40px] border-[2px] border-gray"
                        onClick={handleCancelProfileView}
                    >
                        Cancel
                    </button>
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <div className="p-[80px] pt-[50px]">
                    <p className="font-crimson text-[40px] mb-[20px]"> My Profile</p>
                        <ProfileView visible={!showEditProfileView} mode="view" />
                    <div>
                    <div className="flex flex-row justify-between">
                        <button className="bg-light-green hover:bg-dark-green text-white text-[32px] font-crimson w-[257px] h-[50px] rounded-xl mt-[100px] mr-[30px] flex items-center justify-center "
                                onClick={handleEditProfileView}
                        > 
                            <Image
                                src={pencilIcon}
                                alt="pencil button"
                                className="mr-5"
                                width={24}
                                height={24}
                            />
                            Edit Profile
                        </button>
                        <button className="bg-red hover:bg-red text-white text-[32px] font-crimson w-[250px] h-[50px] rounded-xl mt-[100px] flex items-center justify-center pr-1">
                            <Image
                                src={deleteIcon}
                                alt="search button"
                                className="mr-2 ml-1"
                                width={29}
                                height={29}
                            />
                            Delete Account
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default MyProfilePage;
      
        