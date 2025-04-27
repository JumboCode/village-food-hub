'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import headerLogo from '@app/images/non-blank headerLogo 125x125.png';
import irlPantry from '@app/images/irl_pantry.png';
import { useRouter } from 'next/navigation';
import { useSignIn, useAuth, useUser } from "@clerk/nextjs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi"; // eye icons for password visibility

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { signIn, setActive } = useSignIn();
  const { isSignedIn, signOut, isLoaded } = useAuth();

  // Track logout & login states
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginCompleted, setLoginCompleted] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);
  
  const { user, isLoaded: isUserLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isUserLoaded) return;
  
    const rawRole = user?.publicMetadata?.role;
    const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : undefined;

    // Wait until we have the user AND role before redirecting
    if (!isSignedIn || !role) return;
  
    if (role === 'volunteer') {
      router.push('/volunteer-landing');
    } else if (role === 'admin' || role === 'staff') {
      router.push('/overview');
    } else if (role === 'customer') {
      router.push('/welcome-page');
    }
  }, [isSignedIn, isLoaded, isUserLoaded, user?.publicMetadata?.role]);  

  // state variables
  const [showWelcomeBack, setShowWelcomeBack] = useState(true);
  const [showTypeEmail, setShowTypeEmail] = useState(false);
  const [showTypeCode, setShowTypeCode] = useState(false);
  const [showTypeResentCode, setShowTypeResentCode] = useState(false);
  const [showTypeNewPassword, setShowTypeNewPassword] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [showNewPasswordVisible, setShowNewPasswordVisible] = useState(false);
  const [showConfirmPasswordVisible, setShowConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // frontend messages
  const [errorMsg, setErrorMsg] = useState('\u00A0');
  const [confirmationMsg, setConfirmationMsg] = useState('');

  // for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // login credentials state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // error handling states
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emptyUsernameError, setEmptyUsernameError] = useState(false)
  const [emptyPasswordError, setEmptyPasswordError] = useState(false)

  const handleGoBack = () => {
    setErrorMsg('\u00A0');
    if (showTypeEmail) {
      setShowTypeEmail(false);
      setShowWelcomeBack(true);
    } else if (showTypeCode) {
      setShowTypeCode(false);
      setShowTypeEmail(true);
    } else if (showTypeResentCode) {
      setShowTypeResentCode(false);
      setShowTypeCode(true);
    } else if (showTypeNewPassword) {
      setShowTypeNewPassword(false);
      setShowTypeCode(true);
    }
  };

  const handleSignIn = async () => {
    setUsernameError(false);
    setPasswordError(false);
    setEmptyUsernameError(false);
    setEmptyPasswordError(false);
    setIsLoggingIn(true);
  
    if (!signIn) {
      console.error("signIn is undefined. Clerk may not be initialized yet.");
      setIsLoggingIn(false);
      return;
    }
  
    // Validate input
    if (!username.trim()) setEmptyUsernameError(true);
    if (!password.trim()) setEmptyPasswordError(true);
  
    if (!username.trim() || !password.trim()) {
      setIsLoggingIn(false);
      return;
    }
  
    if (username.includes('@')) {
      setUsernameError(true);
      setIsLoggingIn(false);
      return;
    }
  
    try {
      const result = await signIn.create({ identifier: username, password });
  
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setLoginCompleted(true);
      } else {
        console.warn("Unexpected sign-in status:", result.status);
        setIsLoggingIn(false);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setIsLoggingIn(false);
  
      if (
        error &&
        typeof error === "object" &&
        "errors" in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        const firstError = (error as { errors: { code: string; longMessage?: string }[] }).errors[0];
  
        if (firstError?.longMessage?.includes("You're currently in single session mode")) {
          console.warn("Single session mode error. Please try again after sign out.");
          return;
        }
  
        // Specific error handling
        (error as { errors: { code: string }[] }).errors.forEach((err) => {
          if (err.code === 'form_identifier_not_found') setUsernameError(true);
          if (err.code === 'form_password_incorrect') setPasswordError(true);
        });
      }
    }
  };  

  // handler function to show the forgot password module
  const handleForgotPassword = () => {
    setShowWelcomeBack(false);
    setShowTypeEmail(true);
  };

  // handler function to send a code for resetting a password
  const handleSendCode = async () => {
    setErrorMsg('\u00A0')
    try {  
      const response = await signIn
        ?.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        })
      setShowTypeEmail(false);
      setShowTypeCode(true);
    } catch (error : unknown) { 
      setErrorMsg("No account found with that email.")
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    }
  };

  // handler function to resend the code for resetting a password
  const handleResendCode = async () => {
    setErrorMsg('\u00A0');
    setConfirmationMsg('');

    try {
      await signIn
        ?.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        });
      setShowTypeCode(false);
      setShowTypeResentCode(true);
      setConfirmationMsg("A new reset code has been sent to your email.");
    } catch (error : unknown) {
      setErrorMsg("Error resending code. Please try again.");
    }
  };

  // handler function to finish resetting a password
  const handleResetSubmit = () => {
    if (!code.trim()) {
      setErrorMsg("Reset code cannot be empty.");
      return;
    }
    setShowTypeCode(false);
    setShowTypeResentCode(false);
    setShowTypeNewPassword(true);
  };

  // handler function to enter in the new password using the working approach
  const handleNewPassSubmit = async () => {
    setErrorMsg('\u00A0')
    if (!code.trim()) {
      setErrorMsg("Reset code cannot be empty.");
      return;
    }
    try {
      if (newPassword.trim() == confirmPassword.trim()) {
        await signIn
          ?.attemptFirstFactor({
            strategy: 'reset_password_email_code',
            code,
            password: newPassword,
          })
        setShowTypeNewPassword(false);
        setShowResetSuccess(true);
      } else {
        setErrorMsg("Passwords must match")
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        Array.isArray((error as { errors?: unknown }).errors)
      ) {
        const firstError = (error as { errors: { code: string; longMessage?: string }[] }).errors[0];
    
        switch (firstError.code) {
          case "form_password_pwned":
            setErrorMsg("Password too weak");
            break;
          default:
            setErrorMsg(firstError.longMessage || "An error occurred. Please try again.");
        }
      } else {
        console.error("Unexpected error format:", error);
        setErrorMsg("An unexpected error occurred.");
      }
    }    
  };

  // handler function that redirects to WelcomeBack
  const handleLogin = () => {
    setShowResetSuccess(false);
    setShowWelcomeBack(true);
  };

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
        {showWelcomeBack ? (
          <div>
            {/* Welcome Back prompt */}
            <div className="text-5xl text-white py-8">Welcome Back!</div>

            {/* Username Input */}
            <div className="py-5">
              <div className="flex justify-between text-l align-bottom">
                <label className="block mb-2 text-2xl text-white">Username</label>
                {emptyUsernameError ? (
                    <div className="text-[#ff8585]">Username cannot be empty</div>
                ) : usernameError ? (
                    <div className="text-[#ff8585]">Username not found</div>
                ) : null}
              </div>
              <input
                type="text"
                id="username"
                className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400"
                defaultValue={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>

            {/* Password Input */}
            <div className="pt-5">
              <div className="flex justify-between text-l align-bottom">
                <label className="block mb-2 text-2xl text-white">Password</label>
                {emptyPasswordError ? (
                    <div className="text-[#ff8585]">Password cannot be empty</div>
                ) : passwordError ? (
                    <div className="text-[#ff8585]">Incorrect password</div>
                ) : null}
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400"
                defaultValue={password || ""}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />

              {/* Show / Hide Password */}
              <div className="flex w-full justify-end mt-[-34px] pr-[10px] cursor-pointer">
                {showPassword ? (
                  <FiEye className="w-5 h-5 text-white" onClick={() => setShowPassword(false)} />
                ) : (
                  <FiEyeOff className="w-5 h-5 text-white" onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>

            {/* Forgot Password Button */}
            <div className="mt-[10px] mb-5">
              <button className="font-crimson left-0 text-neutral-300 ml-[6px] mt-2 normal-case" onClick={handleForgotPassword}>
                Forgot Password?
              </button>
            </div>
          
            {/* Sign In Button */}
            <div className="mt-[35px]">
              <button 
                className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl py-2 rounded-md" 
                onClick={handleSignIn}
              >
                Sign In
              </button>
            </div>
          </div>
        ) : null}

        {/* SHOW EMAIL MODULE */}
        {showTypeEmail ? (
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
              <div className="text-5xl text-white py-8">Reset Password</div>
              {/* Text */}
              <div className="py-5">
                <label className="block mb-2 text-xl text-white"> Please enter your email address so </label>
                <label className="block mb-2 text-xl text-white"> we can send you a reset code. </label>
              </div>
              {/* Email Input */}
              <div className="pt-5">
                <label className="block mb-2 text-2xl text-white">Email</label>
                <input
                  type="email"
                  id="password-reset"
                  className="w-full bg-gray bg-opacity-30 text-white border-2 rounded-md border-light-green focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400"
                  placeholder="Email"
                  defaultValue={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />    
              </div>
              {/* Send Code Button */}
              <div className="pt-5">
                <button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl py-2 rounded-md" onClick={handleSendCode}>
                  Send Code
                </button>
                <div className="text-[#ff8585] mt-10px">{errorMsg}</div>
              </div>
              <button 
                className="absolute flex items-center gap-1 text-neutral-300 text-lg font-crimson normal-case"
                onClick={handleGoBack}
              >
                <IoMdArrowRoundBack /> Back
              </button>
            </div>
          </div>
        ) : null}

        {/* SHOW SEND CODE MODULE */}
        {showTypeCode ? (
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
              <div className="text-5xl text-white py-8">Reset Password</div>
              {/* Text */}
              <div className="py-5">
                <label className="block mb-2 text-xl text-white"> A code has been sent to your email, please</label>
                <label className="block mb-2 text-xl text-white"> check and put in the code below.</label>
              </div>
              {/* Reset Code Input */}
              <div className="pt-5">
                <label className="block mb-2 text-2xl text-white">Reset Code</label>
                <input
                  type="text"
                  id="reset-code"
                  className="w-full bg-gray bg-opacity-30 border-2 text-white rounded-md border-light-green focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400"
                  placeholder="Reset Code"
                  onChange={(e) => setCode(e.target.value)}
                  required
                />    
              </div>
              {/* Resend Buttons */}
              <div className="mt-[10px] mb-5">
                <div className="left-0 text-neutral-300 ml-[6px] normal-case" onClick={handleResendCode}>
                  Didn&apos;t receive a code?
                  <button className="left-0 text-[16px] text-neutral-300 ml-[6px] normal-case font-crimson font-bold" onClick={handleResendCode}>
                    Resend Code
                  </button>
                </div>
              </div>
              {/* Submit button */}
              <div className="pt-5">
                <button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl py-2 rounded-md mb-2" onClick={handleResetSubmit}>
                  Submit
                </button>
              </div>
              <button 
                className="absolute flex items-center gap-1 text-neutral-300 text-lg font-crimson normal-case"
                onClick={handleGoBack}
              >
                <IoMdArrowRoundBack /> Back
              </button>
            </div>
          </div>
        ) : null}

        {/* SHOW RESENT CODE MODULE */}
        {showTypeResentCode ? (
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
              <div className="text-5xl text-white py-8">Reset Password</div>
              {/* Text */}
              <div className="py-5">
                <label className="block mb-2 text-xl text-white"> A new code has been sent to your email,</label>
                <label className="block mb-2 text-xl text-white"> please check and put in the code below.</label>
              </div>
              {/* Reset Code Input */}
              <div className="pt-5">
                <label className="block mb-2 text-2xl text-white">Reset Code</label>
                <input
                  type="text"

                  id="reset-code"
                  className="w-full bg-gray bg-opacity-30 border-2 text-white rounded-md border-light-green focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400"
                  placeholder="Reset Code"
                  onChange={(e) => setCode(e.target.value)}
                  required
                />    
              </div>
              {/* Resend Buttons */}
              <div className="mt-[10px] mb-5">
                <div className="left-0 text-neutral-300 ml-[6px] normal-case" onClick={handleResendCode}>
                  Didn&apos;t receive a code?
                  <button className="left-0 text-[16px] text-neutral-300 ml-[6px] normal-case font-crimson font-bold" onClick={handleResendCode}>
                    Resend Code
                  </button>
                </div>
                {confirmationMsg && (
                    <div className="text-[#85ff85] mt-2 ml-[6px]">{confirmationMsg}</div>
                )}
              </div>
              {/* Submit button */}
              <div className="pt-5">
                <button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl rounded-md py-2" onClick={handleResetSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* SHOW NEW PASSWORD MODULE */}
        {showTypeNewPassword ? (
          <div className="size-auto">
            <div className="text-5xl text-white py-8">Reset Password</div>
            {/* New Password Field */}
            <div className="py-5 relative">
              <label className="block mb-2 text-2xl text-white">New Password</label>
              <input
                type={showNewPasswordVisible ? "text" : "password"}
                id="new-password"
                className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400"
                placeholder="New Password"
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pt-9 cursor-pointer">
                {showNewPasswordVisible ? (
                  <FiEye className="w-5 h-5 text-white" onClick={() => setShowNewPasswordVisible(false)} />
                ) : (
                  <FiEyeOff className="w-5 h-5 text-white" onClick={() => setShowNewPasswordVisible(true)} />
                )}
              </div>
            </div>
            {/* Confirm New Password Field */}
            <div className="pt-5 relative">
              <label className="block mb-2 text-2xl text-white">Confirm New Password</label>
              <input
                id="confirm-password"
                type={showConfirmPasswordVisible ? "text" : "password"}
                className="w-full bg-gray bg-opacity-30 border-2 rounded-md border-light-green text-white focus:border-2 focus:rounded-md focus:border-dark-green focus:ring-0 placeholder-neutral-400"
                placeholder="Confirm New Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />    
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pt-14 cursor-pointer">
                {showConfirmPasswordVisible ? (
                  <FiEye className="w-5 h-5 text-white" onClick={() => setShowConfirmPasswordVisible(false)} />
                ) : (
                  <FiEyeOff className="w-5 h-5 text-white" onClick={() => setShowConfirmPasswordVisible(true)} />
                )}
              </div>
            </div>
            <div className="mt-[35px]">
              <button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl rounded-md py-2" onClick={handleNewPassSubmit}>
                Submit
              </button>
              <div className="text-[#ff8585] w-full mt-2">{errorMsg}</div>
            </div>
          </div>
        ) : null}

        {showResetSuccess ? (
          <div>
            {/* Reset password title */}
            <div className="text-5xl text-white py-8">Reset Password</div>
            {/* Text */}
            <div className="py-5">
              <label className="block mb-2 text-xl text-white">Your password has been successfully reset!</label>
              <label className="block mb-2 text-xl text-white">Return to login page to enter your account.</label>
            </div>
            {/* Login Button */}
            <div className="pt-5">
              <button className="w-full normal-case font-crimson crimson-regular bg-light-green text-white text-xl rounded-md py-2" onClick={handleLogin}>
                Log In
              </button>
            </div>
          </div>
        ) : null}
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