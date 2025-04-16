'use client'
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { NavBar } from "@app/components/NavBar";
import { ManageUsersSpreadsheet } from "@app/components/ManageUsersSpreadsheet";
import { NewUserButton } from "@app/components/InternalViewButtons";
import ProfileView from "@app/components/ProfileView";

import LoadingAnimation from "@app/components/LoadingAnimation";
import { userIsAdmin } from "@app/components/ProtectedUrls";

import { useUser } from "@clerk/nextjs";

// Define a type for the structure of each user record from the API.
interface ClerkUser {
  firstName?: string;
  lastName?: string;
  username?: string;
  publicMetadata?: {
    pronouns?: string;
    role?: string;
    phoneNumber?: string;
  };
  emailAddresses?: { emailAddress: string }[];
}

// Define a fetcher function that retrieves and formats the users.
const fetchUsers = async (url: string): Promise<string[][]> => {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  if (data?.data) {
    const formattedUsers: string[][] = data.data.map((user: ClerkUser) => [
      user.firstName || "N/A",
      user.lastName || "N/A",
      user.publicMetadata?.pronouns || "N/A",
      user.username || "N/A",
      user.emailAddresses?.[0]?.emailAddress || "N/A",
      user.publicMetadata?.role || "N/A",
      user.publicMetadata?.phoneNumber || "N/A",
    ]);
    return formattedUsers;
  }
  return [];
};

const InternalViewManageUsersPage: React.FC = () => {
  // Use SWR to fetch users. SWR will cache and revalidate data automatically.
  const { data: users, error, mutate } = useSWR("/api/users", fetchUsers);
  const isLoading = !users && !error;

  // Local state for managing the create profile view.
  const [showCreateProfileView, setShowCreateProfileView] = useState(false);
  const [createUserError, setCreateUserError] = useState("\u00A0");

  const { user } = useUser(); // Get the current user from Clerk
  const isAdmin = userIsAdmin(user);
  
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

  function handleProfileView() {
    setShowCreateProfileView(true);
  }

  async function createUser() {
    setCreateUserError("\u00A0");

    console.log("Creating user with data:", profileData);
    
    const trimmedData = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        username: profileData.username.trim(),
        emailAddress: profileData.emailAddress.trim(),
        pronouns: profileData.pronouns.trim() || "N/A",
        role: profileData.role.trim() == "" ? "Staff" : profileData.role.trim(),
        phoneNumber: profileData.phoneNumber.trim(),
        password: profileData.password.trim()
    };

    console.log("Trimmed Data:", trimmedData);
    
    if (trimmedData.role === "Volunteer") {
      if (
        !trimmedData.username ||
        !trimmedData.emailAddress ||
        !trimmedData.role ||
        !trimmedData.password
      ) {
        setCreateUserError("Please enter all required fields");
        return;
      }
    } else if (trimmedData.role === "Customer") {
      if (
        !trimmedData.username ||
        !trimmedData.emailAddress ||
        !trimmedData.role ||
        !trimmedData.password
      ) {
        setCreateUserError("Please enter all required fields");
        return;
      }
    } else {
      // For non-Volunteer roles, require all fields
      if (
        !trimmedData.firstName ||
        !trimmedData.lastName ||
        !trimmedData.username ||
        !trimmedData.emailAddress ||
        !trimmedData.pronouns ||
        !trimmedData.role ||
        !trimmedData.phoneNumber ||
        !trimmedData.password
      ) {
        setCreateUserError("Please enter all required fields");
        return;
      }
    }
  

    if (trimmedData.username.includes('@')) {
        setCreateUserError("Username must not contain '@'");
        return;
    }

    try {
        // Make POST request to create user API endpoint
        const response = await fetch("../../api/users", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trimmedData)
        });
        
        const data = await response.json();
        if (response.ok) {
            setShowCreateProfileView(false);
            
            // reset fields
            setProfileData({
              firstName: "",
              lastName: "",
              username: "",
              emailAddress: "",
              pronouns: "",
              role: "",
              phoneNumber: "",
              password: ""
          });

          await mutate(undefined, true);
        } else {
            setCreateUserError(data.error == "email_address must be a valid email address." ? "Email address must be a valid email address." : data.error || "Error creating user");
        }
    } catch (error) {
        // Handle any network or unexpected errors
        console.error("Error creating user:", error);
        setCreateUserError("An unexpected error occurred. Please try again.");
    }
  }

  function handleCancelProfileView() {
    setCreateUserError("\u00A0");
    setProfileData({
        firstName: "",
        lastName: "",
        username: "",
        emailAddress: "",
        pronouns: "",
        role: "",
        phoneNumber: "",
        password: ""
    });
    setShowCreateProfileView(false);
  }

  return (
    isLoading ? (
        <LoadingAnimation />
    ) : isAdmin ? (
        <div>
        <NavBar />
        {showCreateProfileView ? (
            <div>
            <div className="p-[80px] pt-[50px]">
                <p className="font-crimson text-[40px] mb-[5px]"> Create Profile</p>
                <ProfileView 
                    visible={showCreateProfileView} 
                    mode="create" 
                    onCancel={handleCancelProfileView} 
                    profileData={profileData}
                    setProfileData={setProfileData}
                />
                <div className="text-red">{createUserError}</div>
                <div>
                <button 
                    className="bg-light-green hover:bg-dark-green text-white text-[24px] font-crimson w-[200px] h-[50px] rounded-xl mt-[20px] mr-[30px]"
                    onClick={createUser}
                >
                    Create
                </button>
                <button 
                    className="bg-white hover:bg-light-gray text-gray text-[24px] font-crimson w-[200px] h-[50px] rounded-xl mt-[20px] border-[2px] border-gray"
                    onClick={handleCancelProfileView}
                >
                    Cancel
                </button>
                </div>
            </div>
            </div>
        ) : (
            <div>
            <div className="py-4 px-10">
                <div className="flex flex-row justify-between mt-10 mb-6">
                <h1 className="font-crimson text-3xl text-[40px] font-bold">Manage Users</h1>
                <div className="flex flex-row">
                    <NewUserButton onClick={handleProfileView} />
                </div>
                </div>
                {error && (
                <div className="text-center text-red-600">
                    Error loading users.
                </div>
                )}
                {isLoading ? (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-transparent">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                </div>
                ) : error ? (
                <div className="text-center text-red-600">Error loading users.</div>
                ) : (
                <ManageUsersSpreadsheet manageUsersItems={users ?? []} />
                )}
            </div>
            </div>
        )}
        </div>
    ) : (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold">Unauthorized Access</h1>
            <p className="mt-4">You do not have permission to view this page.</p>
        </div>
    )
  );
};

export default InternalViewManageUsersPage;