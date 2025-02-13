// We are in ProfileView!
'use client'

import React, {useState, useEffect} from 'react';
import deleteIcon from '@app/images/deleteIcon.svg';
import NavBar from '@app/components/NavBar';
import Image from 'next/image';

interface ProfileViewProps {
    visible: boolean;
    mode: string;
    onCancel: () => void;
  }
  
const ProfileView : React.FC<ProfileViewProps> = ({ visible, mode, onCancel }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    
    const [createProfileMode, setCreateProfileMode] = useState(false);
    const [editProfileMode, setEditProfileMode] = useState(false);
    const [viewProfileMode, setViewProfileMode] = useState(false);
    
    const [error, setError] = useState("");
    
    useEffect(() => {
        if (mode === "create") {
            setCreateProfileMode(true);
            setEditProfileMode(false);
            setViewProfileMode(false);
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
        }
    }, [mode]);
    console.log(mode)
    console.log("createProfileMode: " + createProfileMode)
    console.log("editProfileMode: " + editProfileMode)
    console.log("viewProfileMode: " + viewProfileMode)
    
    const handleEditProfileModeOn = () => {
        setEditProfileMode(true);
        setViewProfileMode(false);
    }
    
    if (!visible) {
        return null;
    }
      
    return (
        <div>
            <div className="p-[80px] pt-[50px]">
                { createProfileMode ? (
                    <p className="font-crimson text-[40px] mb-[20px]"> Create Profile</p>
                ) : 
                ( editProfileMode ? (
                    <p className="font-crimson text-[40px] mb-[20px]"> Edit Profile</p>
                ) : 
                ( viewProfileMode ? (
                        <p className="font-crimson text-[40px] mb-[20px]"> My Profile</p>
                ): null
                )) }
            <div className="flex flex-row gap-[100px] mt-[25px]">
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">First Name 
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="" 
                        required>
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Last Name 
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="" 
                        required>
                    </input>
                </div>
            </div>
            <div className="flex flex-row gap-[100px] mt-[25px]">
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Username 
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="" 
                        required>
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Role
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="" 
                        required>
                    </input>
                </div>
            </div>
            <div className="flex flex-row gap-[100px] mt-[25px]">
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Pronouns 
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="" 
                        >
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Phone Number
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="" 
                        required>
                    </input>
                </div>
            </div>
            <div className="flex flex-row gap-[100px] mt-[25px]">
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Email
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="" 
                        required>
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Password
                        <span className="text-red">*</span> 
                    </div>
                    <input id="password" type={showPassword ? "text" : "password"} className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required" onChange={(e) => setPassword(e.target.value)} required />    
                    
                    <div className="flex w-full justify-end mt-[-48px] pr-[20px] cursor-pointer">
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
            
            <div className="flex flex-row gap-[30px]">
                { createProfileMode ? (
                    <button className="bg-light-green hover:bg-dark-green text-white text-[32px] font-crimson w-[245px] h-[65px] rounded-xl mt-[100px]"> Create </button>
                ) : (
                    editProfileMode ? (
                        <button className="bg-light-green hover:bg-dark-green text-white text-[32px] font-crimson w-[245px] h-[65px] rounded-xl mt-[100px]" onClick={handleEditProfileModeOn}> Save Changes</button>
                    ) : (
                        viewProfileMode ? (
                            <button className="bg-light-green hover:bg-dark-green text-white text-[32px] font-crimson w-[245px] h-[65px] rounded-xl mt-[100px]"> Edit Profile</button>
                        ) : null
                    )
                ) }
                        
                <button 
                    className="bg-white hover:bg-light-gray text-gray text-[32px] font-crimson w-[245px] h-[65px] rounded-xl mt-[100px] border-[2px] border-gray"
                    onClick={onCancel}
                >
                    { "Cancel" }
                </button>
                
                { editProfileMode ? (
                    <button
                        className="bg-red hover:bg-red text-white text-[32px] font-crimson w-[245px] h-[65px] rounded-xl mt-[100px]"
                    >
                        <Image
                            src={deleteIcon}
                            alt="search button"
                            className="pl-2"
                            width={24}
                            height={29.14}
                        />
                        Delete Account
                    </button>
                ) : null }
            </div>
            </div>
        </div>
         
        );
    }

export default ProfileView