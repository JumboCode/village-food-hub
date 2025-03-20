"use client"
import ProfileView from "@app/components/ProfileView";
import React, { useState } from "react";
import NavBar from "@app/components/NavBar";
import Image from 'next/image';
import deleteIcon from '@app/images/deleteIcon.svg';
import pencilIcon from '@app/images/pencil.svg';
import { useUser } from '@clerk/nextjs';

const MyProfilePage: React.FC = () => {
    const [showEditProfileView, setShowEditProfileView] = useState(false);
    
    // Store profile data in parent
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        emailAddress: "",
        pronouns: "",
        role: "",
        phoneNumber: "",
        password: ""
    });
    const { user } = useUser();

    // This function will be called when "Save Changes" is pressed.
    const handleSaveChange = async () => {
        
        const updatedData = {
          userId: user?.id, // Ensure you have the user id here from Clerk.
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          pronouns: profileData.pronouns,
          role: profileData.role,
          phoneNumber: profileData.phoneNumber,
        };
        setShowEditProfileView(false);
      
        try {
          const response = await fetch("/api/users", {
            method: "PUT", // Or if you added the handler in your existing route, use "/api/users"
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });
      
          if (response.ok) {
            console.log("User updated successfully");
            setShowEditProfileView(false);
          } else {
            console.error("Failed to update user data");
          }
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      };

  
    function handleEditProfileView() {
        setShowEditProfileView(true);
    }

    function handleCancelProfileView() {
        setShowEditProfileView(false);
    }

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showDeleteFail, setShowDeleteFail] = useState(false);

    const handleDeleteUser = async () => {
        
        try {
            await fetch("/api/users", {
                method: "GET"
            })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();

                    // for (i = 0; i < data.data.length;)
                    let adminCount = 0;
                    data.data.forEach((user: any) => {
                        if (user.publicMetadata.role === "Admin") { adminCount = adminCount + 1; }
                    })
                    console.log("count: " + adminCount)

                    console.log(user?.username)
                    if (user?.username === "customer" || user?.username === "volunteer" || adminCount === 1) {
                        setShowDeleteFail(true);
                        setShowDeleteSuccess(false);
                        setShowDeleteModal(false);
                    } else {
                        // delete here! likely use user.id

                        const client = await clerkClient();
                        const response = await clerkClient.users.deleteUser(userId)
                        setShowDeleteFail(false);
                        setShowDeleteSuccess(true);
                        setShowDeleteModal(false);
                    }
                } else {
                    console.error("Failed to update user data");
                }
            } )
        
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }
    
    return (
        <div>
            <NavBar/>
            {showEditProfileView ? (
            <div>
                <div className="p-[80px] pt-[50px]">

                    <p className="font-crimson text-[40px] mb-[20px]"> Edit Profile</p>
                    <ProfileView visible={showEditProfileView} mode="edit" onCancel={handleCancelProfileView} 
                        profileData={profileData} setProfileData={setProfileData}/>
                    <div>
                    <button className="bg-light-green hover:bg-dark-green text-white text-[24px] font-crimson px-8 py-2 rounded-xl mt-[45px] mr-[30px]"
                        onClick={handleSaveChange}
                        >
                        Save Changes
                    </button>
                    <button 
                        className="bg-white hover:bg-light-gray text-gray text-[24px] font-crimson px-8 py-2 rounded-xl mt-[45px] border-[2px] border-gray"
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
                        <ProfileView visible={!showEditProfileView} mode="view" profileData={profileData} setProfileData={setProfileData}/>
                    <div>
                    <div className="flex flex-row justify-between">
                        <button className="bg-light-green hover:bg-dark-green text-white text-[24px] font-crimson px-8 py-2 rounded-xl mt-[45px] mr-[30px] flex items-center justify-center "
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
                        <button 
                            className="bg-red hover:bg-red text-white text-[24px] font-crimson px-8 py-2 rounded-xl mt-[45px] flex items-center justify-center"
                            onClick={() => setShowDeleteModal(true)}    
                        >
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

                {showDeleteModal &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className="w-[412px] bg-white font-crimson
                                fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                pt-2 shadow-lg rounded-lg"
                    >
                        <div className="flex flex-col px-5 pt-2">
                            <p className="flex justify-center text-[36px] crimson-semibold text-center leading-[1.4]">Are you sure you want to delete your account?</p>
                            <p className="flex justify-center text-[24px] crimson-semibold text-[#EB2B0C] text-center">
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-row justify-center space-x-5 py-5 mb-2">
                            <button 
                                className="flex text-gray hover:bg-light-gray font-serif w-[117px] h-[46px] rounded-[8px] border border-gray text-[24px] justify-center items-center" 
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="flex text-white bg-[#EB2B0C] font-serif w-[117px] h-[46px] rounded-[8px] border border-[#EB2B0C] text-[24px] justify-center items-center"
                                onClick={() => handleDeleteUser()}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                }

                {showDeleteSuccess && !showDeleteFail &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className="w-[441px] bg-white font-crimson
                                fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                pt-2 shadow-lg rounded-lg"
                    >
                        <div className="flex flex-col px-5 pt-6 space-y-4">
                            <p className="flex justify-center text-[32px] crimson text-[#EB2B0C] text-center ">Your account has been deleted.</p>
                            <p className="flex justify-center text-[24px] crimson text-black leading-[1.4] pl-2">
                                In ten seconds, you will be redirected to the login page of this site. 
                            </p>
                        </div>
                        <div className="flex flex-row justify-center space-x-5 py-5 my-3">
                            <button 
                                className="flex text-white bg-[#EB2B0C] font-serif w-[117px] h-[46px] rounded-[8px] border border-[#EB2B0C] text-[24px] justify-center items-center"
                                // onClick={() => handleRedirection(redirectPage)}
                            >
                                Exit Now
                            </button>
                        </div>
                    </div>
                </div>
                }

                {showDeleteFail && !showDeleteSuccess &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className="w-[412px] bg-white font-crimson
                                fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                pt-2 shadow-lg rounded-lg"
                    >
                        <div className="flex flex-col px-5 pt-4">
                            <p className="flex justify-center text-[36px] crimson-semibold text-center leading-[1.4]">The system has to have at least one admin.</p>
                            <p className="flex justify-center text-[24px] crimson-semibold text-[#7EB672] text-center mt-[-4px]">
                                Your account was not deleted.
                            </p>
                        </div>
                        <div className="flex flex-row justify-center space-x-5 py-2 mb-4">
                            <button 
                                className="flex text-white bg-[#7EB672] font-serif w-[117px] h-[46px] rounded-[8px] border border-[#7EB672] text-[24px] justify-center items-center"
                                // onClick={() => handleRedirection(redirectPage)}
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
                }
            </div>
        )}
        </div>
    );
};

export default MyProfilePage;
      
        