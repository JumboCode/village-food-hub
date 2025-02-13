// We are in ProfileView!
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@app/components/NavBar';


const ProfileView = () => {
    const router = useRouter();
    
    const handleCancel = () => {
        router.push('/manage-users');
      };
      
      
    return (
        <div>
            <NavBar/>
            <div className="p-[80px] pt-[50px]">
                <p
                    className="font-crimson text-[40px] mb-[20px]">
                    Create Profile
                </p>
            
            <div className="flex flex-row gap-[100px] mt-[25px]">
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">First Name 
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="Glen" 
                        required>
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Last Name 
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="Glen" 
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
                        placeholder="Glen" 
                        required>
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Role
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="Glen" 
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
                        placeholder="Glen" 
                        >
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Phone Number
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="Glen" 
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
                        placeholder="Glen" 
                        required>
                    </input>
                </div>
                <div>
                    <div className="font-crimson text-[24px] mb-[5px]">Password
                        <span className="text-red">*</span> 
                    </div>
                    <input
                        className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none border-[2px] border-[#E1E1E1] rounded-xl w-[452px] h-[65px] required"
                        placeholder="Glen" 
                        required>
                    </input>
                </div>
            </div>
            
            <div className="flex flex-row gap-[30px]">
                <button 
                    className="bg-light-green hover:bg-dark-green text-white text-[32px] font-crimson w-[245px] h-[65px] rounded-xl mt-[100px]"
                >
                    { "Create" }
                </button>
                <button 
                    className="bg-white hover:bg-light-gray text-gray text-[32px] font-crimson w-[245px] h-[65px] rounded-xl mt-[100px] border-[2px] border-gray"
                    onClick={handleCancel}
                >
                    { "Cancel" }
                </button>
            </div>
            
            
            
            </div>
        </div>
         
        );
    }

export default ProfileView