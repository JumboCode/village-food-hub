"use client"
import ProfileView from "@app/components/ProfileView";
import React, { useState, useEffect, useRef } from "react";
import { NavBar } from "@app/components/NavBar";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProfileUnsavedModal from '@app/components/ProfileUnsavedModal';
import { Snackbar } from "@mui/material";

import LoadingAnimation from "@app/components/LoadingAnimation";
import { userIsAdmin, userIsStaff } from "@app/components/ProtectedUrls";

interface User {
    id: string;
    username: string;
    publicMetadata: {
      role: string;
    };
}

const MyProfilePage: React.FC = () => {
    const router = useRouter();

    const [showEditProfileView, setShowEditProfileView] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [destinationPage, setDestinationPage] = useState("");
    const [savedChanges, setSavedChanges] = useState(false);
    const [validationError, setValidationError] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("Edited User Info");
    
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
    const { user, isLoaded } = useUser();
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
        if (!validateProfileData()) return;
        
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
        setSavedChanges(true);
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
            setSnackbarOpen(true);
            setShowEditProfileView(false);
          } else {
            console.error("Failed to update user data");
            setValidationError("Failed to update user data.");
          }
        } catch (error) {
          console.error("Error updating user data:", error);
          setValidationError("Unexpected error occurred.");
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

    // for the delete modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showDeleteFail, setShowDeleteFail] = useState(false);
    const [adminFail, setAdminFail] = useState(false);
    const [customerVolunteerFail, setCustomerVolunteerFail] = useState(false);

    // when the button to delete a user is clicked
    const handleDeleteUser = async () => {        
        
        try {
            // gets all users to do error checking
            await fetch("/api/users", {
                method: "GET"
            })  
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    
                    // determines number of "Admin" accounts
                    // count number of admins left
                    let adminCount = 0;
                    data.data.forEach((user: User) => {
                        if (user.publicMetadata.role === "Admin") { adminCount = adminCount + 1; }
                    })
                    
                    // error checking
                    if (user?.publicMetadata?.role === "Customer" || user?.publicMetadata?.role === "Volunteer" || adminCount === 1) {
                        // error if user is customer or volunteer
                        if (user?.publicMetadata?.role === "Customer" || user?.publicMetadata?.role === "Volunteer") { setCustomerVolunteerFail(true); }
                        // error if user is the only admin
                        if (adminCount === 1) { setAdminFail(true); }
                        // show failure modal
                        setShowDeleteFail(true);
                        setShowDeleteSuccess(false);
                        setShowDeleteModal(false);
                    // if no errors
                    } else {
                        deleteUser(user?.id || "");
                    }
                } else {
                    console.error("Failed to delete user data");
                }
            } )
        
        } catch (error) {
            console.error("Error deleting user data:", error);
        }
    }

    // function to call DELETE API
    const deleteUser = async (id: string) => {
        try {
            // ensures id is a string
            if (!id && id !== "") {
                console.error("No id provided for deletion");
                return;
            }
            
            // sends DELETE request to backend
            const response = await fetch("/api/users", {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json", 
                    "Accept": "application/json" 
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            // if success
            if (response.ok) {
                // show success modal
                setShowDeleteSuccess(true);
                setShowDeleteFail(false);
                setShowDeleteModal(false);
                
                // closes in 10 seconds
                // exit after 10 seconds if "exit now" not clicked
                setTimeout(() => {
                    handleExit();
                }, 10000);
                
            // if fail, show fail modal
            } else {
                console.error("Error deleting user:", result.error);
                setShowDeleteFail(true);
                setShowDeleteSuccess(false);
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error("User deletion failed:", error);
        }
    };   
    
    const validateProfileData = (): boolean => {
        const requiredFields = [
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'username', label: 'Username' },
          { key: 'emailAddress', label: 'Email Address' },
          { key: 'role', label: 'Role' },
          { key: 'phoneNumber', label: 'Phone Number' },
        ];
      
        for (const field of requiredFields) {
          const value = profileData[field.key as keyof typeof profileData];
          if (!value.trim()) {
            setValidationError(`${field.label} is required.`);
            return false;
          }
        }
      
        if (!profileData.password.trim() && !showEditProfileView) {
          setValidationError("Password is required.");
          return false;
        }
      
        setValidationError("");
        return true;
    };           
    
    // signs user out and redirects to login page
    const { signOut } = useClerk();
    const handleExit = () => {   
        signOut({ redirectUrl: '/login' });
    }
    
    const handleCloseModal = () => {
        setShowUnsavedModal(false);
        setUnsavedChanges(false);
        window.preventNavigation = false;
    }

    if (!isLoaded) {
        return <LoadingAnimation />;
    }

    const hasAccess = userIsAdmin(user) || userIsStaff(user);
    
    return (
        hasAccess ? (
            <div>
                <NavBar savedChanges={savedChanges}/>
                {showEditProfileView ? (
                <div>
                    <div className="p-[80px] pt-[50px]">
                        {showUnsavedModal && (<ProfileUnsavedModal closeUnsavedModal={handleCloseModal} redirectPage={destinationPage}/>)}
                        <p className="font-crimson text-[40px] mb-[20px]"> Edit Profile</p>
                        <ProfileView visible={showEditProfileView} mode="edit" onCancel={handleCancelProfileView} 
                            profileData={profileData} setProfileData={setProfileData} setUnsavedChanges={setUnsavedChanges}/>
                        <div>
                        
                        {/* Save Changes Button */}
                        {validationError && (
                        <p className="text-red font-crimson text-[18px] mt-4 mb-[-15px]">{validationError}</p>
                        )}
                        <button className="bg-light-green hover:bg-dark-green text-white text-[24px] font-crimson px-8 py-2 rounded-xl mt-[45px] mr-[30px]"
                            onClick={handleSaveChange}
                            >
                            Save Changes
                        </button>

                        {/* Cancel Button */}
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
                            {/* Button to Delete the Current Account */}
                            <button 
                                className="bg-red hover:bg-red text-white text-[24px] font-crimson px-8 py-2 rounded-xl mt-[45px] flex items-center justify-center"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                {/* trashcan */}
                                <MdDeleteOutline
                                    size={24}
                                    className="cursor-pointer mr-3"
                                />
                                Delete Account
                            </button>
                        </div>
                        </div>
                    </div>

                    {/* Modal to Delete Current User */}
                    {showDeleteModal &&
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div
                            className="w-[412px] bg-white font-crimson
                                    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    pt-2 shadow-lg rounded-lg"
                        >
                            {/* warning */}
                            <div className="flex flex-col px-5 pt-2">
                                <p className="flex justify-center text-[36px] crimson-semibold text-center leading-[1.4]">Are you sure you want to delete your account?</p>
                                <p className="flex justify-center text-[24px] crimson-semibold text-[#EB2B0C] text-center">
                                    This action cannot be undone.
                                </p>
                            </div>
                            {/* buttons */}
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

                    {/* Delete Success Modal */}
                    {showDeleteSuccess && !showDeleteFail &&
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div
                            className="w-[441px] bg-white font-crimson
                                    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    pt-2 shadow-lg rounded-lg"
                        >
                            {/* explanation of redirecting in 10 seconds */}
                            <div className="flex flex-col px-5 pt-6 space-y-4">
                                <p className="flex justify-center text-[32px] crimson text-[#EB2B0C] text-center ">Your account has been deleted.</p>
                                <p className="flex justify-center text-[24px] crimson text-black leading-[1.4] pl-2">
                                    In ten seconds, you will be redirected to the login page of this site. 
                                </p>
                            </div>
                            {/* option to redirect now */}
                            <div className="flex flex-row justify-center space-x-5 py-5 my-3">
                                <button 
                                    className="flex text-white bg-[#EB2B0C] font-serif w-[117px] h-[46px] rounded-[8px] border border-[#EB2B0C] text-[24px] justify-center items-center"
                                    onClick={() => handleExit()}
                                >
                                    Exit Now
                                </button>
                            </div>
                        </div>
                    </div>
                    }

                    {/* Delete Failure Modal */}
                    {showDeleteFail && !showDeleteSuccess &&
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div
                            className="w-[412px] bg-white font-crimson
                                    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    pt-2 shadow-lg rounded-lg"
                        >
                            <div className="flex flex-col px-5 pt-4">
                                {/* one admin left error */}
                                {adminFail &&
                                    <p className="flex justify-center text-[36px] crimson-semibold text-center leading-[1.4]">
                                        The system has to have at least one admin.
                                    </p>
                                }
                                {/* deleting customer or volunteer error */}
                                {customerVolunteerFail &&
                                    <p className="flex justify-center text-[36px] crimson-semibold text-center leading-[1.4]">
                                        Only admins can delete the customer and volunteer accounts.
                                    </p>
                                }
                                {/* general error */}
                                {(!adminFail && !customerVolunteerFail) &&
                                    <p className="flex justify-center text-[36px] crimson-semibold text-center leading-[1.4]">
                                        Something went wrong.
                                    </p>
                                }
                                <p className="flex justify-center text-[24px] crimson-semibold text-[#7EB672] text-center mt-[-4px]">
                                    Your account was not deleted.
                                </p>
                            </div>
                            {/* close button */}
                            <div className="flex flex-row justify-center space-x-5 py-2 mb-4">
                                <button 
                                    className="flex text-white bg-[#7EB672] font-serif w-[117px] h-[46px] rounded-[8px] border border-[#7EB672] text-[24px] justify-center items-center"
                                    onClick={() => {
                                        setShowDeleteFail(false);
                                        setCustomerVolunteerFail(false);
                                        setAdminFail(false);
                                    }}
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            </div>
        ) : (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold">Unauthorized Access</h1>
                <p className="mt-4">You do not have permission to view this page.</p>
            </div>
        )
    );
};

export default MyProfilePage;