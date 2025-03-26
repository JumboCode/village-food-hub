"use client"
import ProfileView from "@app/components/ProfileView";
import React, { useState, useEffect, useRef } from "react";
import NavBar from "@app/components/NavBar";
import Image from 'next/image';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProfileUnsavedModal from '@app/components/ProfileUnsavedModal'

const MyProfilePage: React.FC = () => {
    const router = useRouter();

    const [showEditProfileView, setShowEditProfileView] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [destinationPage, setDestinationPage] = useState("");
    
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
    const initialRender = useRef(true);

    useEffect(() => {
        window.preventNavigation = false;
      }, []);      

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const handleNavItemClicked = (e: Event) => {
            const customEvent = e as CustomEvent;
            const destPage = customEvent.detail.intendedPage;
          
            if (unsavedChanges) { 
                setDestinationPage(destPage);
                setShowUnsavedModal(true);
                window.preventNavigation = true; // Block navigation until confirmed
            } else {
                window.preventNavigation = false; // Allow navigation
                router.push(destPage);
            }
        };

        const confirmNavigation = () => {
            setShowUnsavedModal(false);
            window.preventNavigation = false;
            router.push(destinationPage);
        };

        document.addEventListener("demographicsClicked", handleNavItemClicked);
        document.addEventListener("inventoryClicked", handleNavItemClicked);
        document.addEventListener("categoriesClicked", handleNavItemClicked);
        document.addEventListener("manageUsersClicked", handleNavItemClicked);
        document.addEventListener("signOutClicked", handleNavItemClicked);

        // Cleanup the event listener on unmount
        return () => {
          document.removeEventListener("demographicsClicked", handleNavItemClicked);
          document.removeEventListener("inventoryClicked", handleNavItemClicked);
          document.removeEventListener("categoriesClicked", handleNavItemClicked);
            document.removeEventListener("manageUsersClicked", handleNavItemClicked);
            document.removeEventListener("signOutClicked", handleNavItemClicked);
        };
      }, [unsavedChanges]);

      useEffect(() => {
        if (!showEditProfileView && !unsavedChanges) {
          window.preventNavigation = false;
        }
      }, [showEditProfileView, unsavedChanges]);      

    // This function will be called when "Save Changes" is pressed.
    const handleSaveChange = async () => {
        
        const updatedData = {
          userId: user?.id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          pronouns: profileData.pronouns,
          role: profileData.role,
          phoneNumber: profileData.phoneNumber,
        };
        setShowEditProfileView(false);
        setUnsavedChanges(false);
        window.preventNavigation = false;

        try {
          const response = await fetch("/api/users", {
            method: "PUT",
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
        setUnsavedChanges(false);
        window.preventNavigation = false;
    }

    const handleCloseModal = () => {
        setShowUnsavedModal(false);
        setUnsavedChanges(false);
        window.preventNavigation = false;
    }

    return (
        <div>
            <NavBar/>
            {showEditProfileView ? (
            <div>
                <div className="p-[80px] pt-[50px]">
                    {showUnsavedModal && (<ProfileUnsavedModal closeUnsavedModal={handleCloseModal} redirectPage={destinationPage}/>)}
                    <p className="font-crimson text-[40px] mb-[20px]"> Edit Profile</p>
                    <ProfileView visible={showEditProfileView} mode="edit" onCancel={handleCancelProfileView} 
                        profileData={profileData} setProfileData={setProfileData} setUnsavedChanges={setUnsavedChanges}/>
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
                            <MdOutlineEdit
                                size={24}
                                className="cursor-pointer mr-3"
                            />
                            Edit Profile
                        </button>
                        <button className="bg-red hover:bg-red text-white text-[24px] font-crimson px-8 py-2 rounded-xl mt-[45px] flex items-center justify-center">
                            <MdDeleteOutline
                                size={24}
                                // TOOD: onClick
                                className="cursor-pointer mr-3"
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