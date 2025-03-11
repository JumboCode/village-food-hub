// We are in ProfileView!
'use client'

import React, {useState, useEffect} from 'react';
import { useUser } from '@clerk/nextjs';

interface ProfileViewProps {
    visible: boolean;
    mode: string;
    onCancel?: () => void;
    profileData: {
        firstName: string;
        lastName: string;
        username: string;
        emailAddress: string;
        pronouns: string;
        role: string;
        phoneNumber: string;
        password: string;
      };
      setProfileData?: React.Dispatch<React.SetStateAction<{
        firstName: string;
        lastName: string;
        username: string;
        emailAddress: string;
        pronouns: string;
        role: string;
        phoneNumber: string;
        password: string;
      }>>;
  }
  
const ProfileView : React.FC<ProfileViewProps> = ({ visible, mode, onCancel, profileData, setProfileData }) => {


    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    
    const [createProfileMode, setCreateProfileMode] = useState(false);
    const [editProfileMode, setEditProfileMode] = useState(false);
    const [viewProfileMode, setViewProfileMode] = useState(false);
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [role, setRole] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    
    const { user } = useUser();
    const clerkUsername = user?.username;
    
    
    
    useEffect(() => {
        if (mode === "create") {
            setCreateProfileMode(true);
            setEditProfileMode(false);
            setViewProfileMode(false);
            
            // Clear all fields for create mode
            setFirstName("");
            setLastName("");
            setUsername("");
            setEmailAddress("");
            setPronouns("");
            setRole("");
            setPhoneNumber("");
            setPassword("");
        } else if (mode === "edit") {
            setCreateProfileMode(false);
            setEditProfileMode(true);
            setViewProfileMode(false);
        } else if (mode === "view") {
            setCreateProfileMode(false);
            setEditProfileMode(false);
            setViewProfileMode(true);
        } else {
            setError("Invalid mode: " + mode + " Mode must be 'create', 'edit' or 'view'");
            console.log(error);
        }
    }, [mode]);
    
    // Fetch user data from your API when the component mounts
    useEffect(() => {
        async function fetchUserData() {
        try {
            if (clerkUsername) {
                const response = await fetch(`/api/users?username=${clerkUsername}`);
                if (response.ok) {
                    const result = await response.json();
                    const userData = result.data[0];

                    setFirstName(userData.firstName || "");
                    setLastName(userData.lastName || "");
                    setUsername(userData.username || "");
                    
                    const email = userData.emailAddresses[0].emailAddress
                    setEmailAddress(email);
                      
                    setPronouns(userData.publicMetadata?.pronouns || "");
                    setRole(userData.publicMetadata?.role || "");
                    setPhoneNumber(userData.publicMetadata?.phoneNumber || "");
                    
                    if (setProfileData) {
                        setProfileData({
                          firstName: userData.firstName || "",
                          lastName: userData.lastName || "",
                          username: userData.username || "",
                          emailAddress: email,
                          pronouns: userData.publicMetadata?.pronouns || "",
                          role: userData.publicMetadata?.role || "",
                          phoneNumber: userData.publicMetadata?.phoneNumber || "",
                          password: "",
                        });
                      }
                } else {
                    console.error("Failed to fetch user data");
                }
            }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        // Only fetch data if we're not in "create" mode
        if (mode !== "create") {
            fetchUserData();
        }
    }, [mode, clerkUsername]);
    
    const handleEditProfileModeOn = () => {
        setEditProfileMode(true);
        setViewProfileMode(false);
    }
    
    if (!visible) {
        return null;
    }
    
    const isView = viewProfileMode;
    const isEdit = editProfileMode;
    const isCreate = createProfileMode;
      
    return (
        <div>
            <div className="flex flex-row gap-[100px] mt-[25px]">
                {/* First Name */}
                <div className="mb-4">
                    <label className="block font-crimson text-[20px] mb-1">
                        First Name <span className="text-red">*</span>
                    </label>
                    <input
                        // value={firstName}
                        value={profileData.firstName}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        // onChange={(e) => setFirstName(e.target.value)}
                        placeholder=""
                        className="pl-3 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px]"
                        disabled={isView}
                    />
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label className="block font-crimson text-[20px] mb-1">
                        Last Name <span className="text-red">*</span>
                    </label>
                    <input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder=""
                        className="pl-3 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px]"
                        disabled={isView}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-[100px] mt-[25px]">
                {/* Username */}
                <div className="mb-4">
                    <label className="block font-crimson text-[20px] mb-1">
                        Username <span className="text-red">*</span>
                    </label>
                    <input
                        value={profileData.username}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder=""
                        className="pl-3 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px]"
                        // In edit and view modes, username should not be editable.
                        disabled={isView || isEdit}
                    />
                </div>

                {/* Role */}
                <div className="mb-4">
                    <label className="block font-crimson text-[20px] mb-1">
                        Role <span className="text-red">*</span>
                    </label>
                    <input
                        value={profileData.role}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, role: e.target.value }))}
                        placeholder=""
                        className="pl-3 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px]"
                        disabled={isView}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-[100px] mt-[25px]">
                {/* Pronouns */}
                <div className="mb-4">
                    <label className="block font-crimson text-[20px] mb-1">
                        Pronouns <span className="text-red">*</span>
                    </label>
                    <input
                        value={profileData.pronouns}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, pronouns: e.target.value }))}
                        placeholder=""
                        className="pl-3 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px]"
                        disabled={isView}
                    />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block font-crimson text-[20px] mb-1">
                        Phone Number <span className="text-red">*</span>
                    </label>
                    <input
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder=""
                        className="pl-3 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px]"
                        disabled={isView}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-[100px] mt-[25px]">
                {/* Email */}
                <div className="mb-4">
                    <label className="block font-crimson text-[20px] mb-1">
                        Email <span className="text-red">*</span>
                    </label>
                    <input
                        value={profileData.emailAddress}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, emailAddress: e.target.value }))}
                        placeholder=""
                        className="pl-3 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px]"
                        // In edit and view modes, email should not be editable.
                        disabled={isView || isEdit}
                    />
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <label className="block font-crimson text-[20px] mb-1">
                        Password <span className="text-red">*</span>
                    </label>
                    <input
                        value={profileData.password}
                        onChange={(e) => setProfileData && setProfileData(prev => ({ ...prev, password: e.target.value }))}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        className="pl-3 pr-10 font-crimson text-[20px] focus:outline-none border-2 border-[#E1E1E1] rounded-xl w-[452px] h-[50px] bg-[#fafafa]"
                        // In edit and view modes, password should not be editable.
                        disabled={isView || isEdit}
                    />
                <div className="flex w-full justify-end mt-[-44px] pr-[20px] cursor-pointer">
                    {showPassword ?
                    // shown eyeball icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="size-8" onClick={() => setShowPassword(false)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    : // hidden eyeball icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="size-8" onClick={() => setShowPassword(true)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    }
                </div>
            </div>
            </div>
        </div>
         
        );
    }

export default ProfileView