'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import Image from 'next/image';
import headerLogo from '../../images/headerLogo.png';
import irlPantry from '../../images/irl_pantry.png';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();

  // state variables
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const [showTypeEmail, setShowTypeEmail] = useState(false);
  const [showTypeCode, setShowTypeCode] = useState(false);
  const [showTypeResentCode, setShowTypeResentCode] = useState(false);
  const [showTypeNewPassword, setShowTypeNewPassword] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  // for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // handler function to display the inventory after the sign-in button has been pressed
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleSignIn = async () => {
    console.log([username, password])
    setUsernameError(false)
    setPasswordError(false)
    const response = await fetch('api/users', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username: username,
          password: password
      })
    });
    const responseData = await response.json();

    switch (response.status) {
      case 200: 
        console.log("Success")
        router.push('/inventory'); 
        break;
      
      case 401:
        setPasswordError(true)
        break;

      case 403:
        setUsernameError(true)
        break;
    }

  }

  // handler function to show the forgot password module
  const handleForgotPassword = () => {
    setShowWelcomeBack(false);
    setShowTypeEmail(true);
  } 
  
  // handler function to send a code for resetting a password
  const handleSendCode = () => {
    setShowTypeEmail(false);
    setShowTypeCode(true);
  } 
  
  // handler function to submit the code from the email that was sent
  const handleSubmitCode = () => {
    setShowTypeCode(false);
    setShowTypeNewPassword(true);
  }

  // handler function to resend the code for resetting a password
  const handleResendCode = () => {
    setShowTypeCode(false);
    setShowTypeResentCode(true);
  }

  // handler function to finish resetting a password
  const handleResetSubmit = () => {
    setShowTypeCode(false);
    setShowTypeResentCode(false);
    setShowTypeNewPassword(true);
  }

  // handler function to enter in the new password
  const handleNewPassSubmit = () => {
    setShowTypeNewPassword(false);
    setShowResetSuccess(true);
  }
  
  // handler function that redirects to WelcomeBack
  const handleLogin = () => {
    setShowResetSuccess(false);
    setShowWelcomeBack(true);
  }


  return (
    <div className="bg-banner-green h-screen w-screen grid grid-cols-5 gap-3 justify-center items-center">
        
        <div className="flex w-full h-full col-span-2 justify-center items-center py-5 font-crimson">
          
          {/* Small Header Logo Image */}
          <Image
            src={headerLogo}
            width={125}
            height={125}
            alt="header logo"
            className="absolute top-0 left-0 pt-[30px] pl-5"
          />


          {/* SHOW WELCOME BACK MODULE */}
          { showWelcomeBack ?
          <div>
            {/* Welcome Back prompt */}
            <div className="text-5xl text-white py-8">
              Welcome Back!
            </div>

            {/* Username Input */}
            <div className="py-5">
            <div className="flex justify-between text-l align-bottom">
                <label className="block mb-2 text-2xl text-white"> Username </label>
                { usernameError ? <div style={{ color: '#8B0000' }} className="flexalign-bottom">Username not found</div> : null }
            </div>
       
                <input type="text" id="username" className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400" onChange={(e) => setUsername(e.target.value)} placeholder="Username" required/>
            </div>

            {/* Password Input */}
            <div className="pt-5">
              <div className="flex justify-between text-l align-bottom">
                <label className="block mb-2 text-2xl text-white">Password</label>
                { passwordError ? <div style={{ color: '#8B0000' }} className="flexalign-bottom">Incorrect Password</div> : null }
              </div>
              <input id="password" type={showPassword ? "text" : "password"} className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />    
              
              {/* Show / Hide Password */}
              <div className="flex w-full justify-end mt-[-35px] pr-[10px]">
                {showPassword ?
                  // shown eyeball icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6" onClick={() => setShowPassword(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                : // hidden eyeball icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6" onClick={() => setShowPassword(true)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                }
              </div>
            </div>

            {/* Forgot Password Button */}
            <div className="mt-[10px] mb-5">
              <Button className="font-crimson left-0 text-neutral-300 ml-[-6px] normal-case" onClick={handleForgotPassword}>
                  Forgot Password?
              </Button>
            </div>
          
            {/* Sign In Button */}
            <div className="mt-[35px]">
              <Button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </div>
          : null }


          {/* SHOW EMAIL MODULE */}
          {showTypeEmail ?

          // Small Header Logo Image
          <div className="flex w-full h-full col-span-2 justify-center items-center py-5">
            <Image
              src={headerLogo}
              width={125}
              height={125}
              alt="header logo"
              className="absolute top-0 left-0 pt-[30px] pl-5"
            />

            <div>

              {/* Title */}
              <div className="text-5xl text-white py-8">
                Reset Password
              </div>

              {/* Text */}
              <div className="py-5">
                  <label className="block mb-2 text-2xl text-white"> Please enter your email address so </label>
                  <label className="block mb-2 text-2xl text-white"> we can send you a reset code. </label>
              </div>

              {/* Email Input */}
              <div className="pt-5">
                <label className="block mb-2 text-2xl text-white">Email</label>
                <input type="text" id="password-reset" className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400" placeholder="Email" required />    
              </div>

              {/* Send Code Button */}
              <div className="pt-5">
                <Button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl" onClick={handleSendCode}>
                  Send Code
                </Button>
              </div>
            </div>
          </div>
          : null }

          {/* SHOW SEND CODE MODULE */}
          { showTypeCode ?
          <div>
            <div className="flex w-full h-full col-span-2 justify-center items-center py-5">
            <Image
              src={headerLogo}
              width={125}
              height={125}
              alt="header logo"
              className="absolute top-0 left-0 pt-[30px] pl-5"
            />

            <div>

              {/* Title */}
              <div className="text-5xl text-white py-8">
                Reset Password
              </div>

              {/* Text */}
              <div className="py-5">
                  <label className="block mb-2 text-2xl text-white"> A code has been sent to your email, please</label>
                  <label className="block mb-2 text-2xl text-white"> check and put in the code below.</label>
              </div>

              {/* Reset Code Input */}
              <div className="pt-5">
                <label className="block mb-2 text-2xl text-white">Reset Code</label>
                <input type="text" id="reset-code" className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400" placeholder="Reset Code" required />    
              </div>

              {/* Resend Buttons */}
              <div className="mt-[10px] mb-5">
              <Button className="left-0 font-crimson text-neutral-300 ml-[-6px] normal-case" onClick={handleResendCode}>
                Didn&rsquo;t receive a code?
              </Button>
              <Button className="left-0 font-crimson text-neutral-300 ml-[-6px] normal-case font-bold" onClick={handleResendCode}>
                  Resend Code
              </Button>
            </div>

              {/* Submit Button */}
              <div className="pt-5">
                <Button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl" onClick={handleResetSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
          </div>
          : null }


          
          {/* SHOW RESET PASSWORD MODULE */}
          { showTypeResentCode ?
          <div>
            <div className="flex w-full h-full col-span-2 justify-center items-center py-5">
            <Image
              src={headerLogo}
              width={125}
              height={125}
              alt="header logo"
              className="absolute top-0 left-0 pt-[30px] pl-5"
            />

            <div>

              {/* Reset password prompt */}
              <div className="text-5xl text-white py-8">
                Reset Password
              </div>

              {/* Text */}
              <div className="py-5">
                  <label className="block mb-2 text-2xl text-white"> A new code has been sent to your email,</label>
                  <label className="block mb-2 text-2xl text-white"> please check and put in the code below.</label>
              </div>

              {/* Reset Code Input */}
              <div className="pt-5">
                <label className="block mb-2 text-2xl text-white">Reset Code</label>
                <input type="text" id="reset-code" className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400" placeholder="Reset Code" required />    
              </div>

              <div className="mt-[10px] mb-5">
              <Button className="left-0 text-neutral-300 ml-[-10px] font-crimson normal-case" onClick={handleResendCode}>
                Didn&rsquo;t receive a code?
              </Button>
              <Button className="left-0 text-neutral-300 ml-[-10px] normal-case font-crimson font-bold" onClick={handleResendCode}>
                  Resend Code
              </Button>
            </div>

              {/* Submit Button */}
              <div className="pt-5">
                <Button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl" onClick={handleResetSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
          </div>
          : null }
          
          
          { showTypeNewPassword ?
          <div>
            {/* Welcome Back prompt */}
            <div className="text-5xl text-white py-8">
              Reset Password
            </div>

            {/* new password input */}
            <div className="py-5">
                <label className="block mb-2 text-2xl text-white"> New Password </label>
                <input type="text" id="username" className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400" placeholder="Username" required />
            </div>

            {/* confirm new password Input */}
            <div className="pt-5">
              <label className="block mb-2 text-2xl text-white"> Confirm New Password</label>
              <input id="password" type="text" className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400" placeholder="Password" required />    
            </div>

            {/* submit new password button */}
            <div className="mt-[35px]">
              <Button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl" onClick={handleNewPassSubmit}>
                Submit
              </Button>
            </div>
          </div>
          : null }


          {/* SHOW RESET SUCCESS */}
          { showResetSuccess ?
          <div>
              {/* Reset password title */}
              <div className="text-5xl text-white py-8">
                Reset Password
              </div>

              {/* Text */}
              <div className="py-5">
                  <label className="block mb-2 text-2xl text-white"> Your password has been successfully reset! </label>
                  <label className="block mb-2 text-2xl text-white"> Return to login page to enter your account. </label>
              </div>

              {/* Login Button */}
              <div className="pt-5">
                <Button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl" onClick={handleLogin}>
                  Log In
                </Button>
              </div>
          </div>
          : null }

        </div>
        
        {/* Pantry Image */}
        <div className="my-[20px] flex h-full px-7 py-7 justify-center items-center col-span-3">
          <Image
            src={irlPantry}
            width={468}
            height={587.2}
            alt="welcome BW Logo"
            className="flex border border-banner-green rounded-[10px] object-contain"
          />
        </div>
    </div>
  );
};

export default LoginPage;