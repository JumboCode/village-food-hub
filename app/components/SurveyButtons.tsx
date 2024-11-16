"use client"

// needed for special characters
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from "react";

export function ButtonExit() {
    const handleClick = () => {
        window.location.href = '../../unsaved-thank-you';
    };
    
    return (
        <div>
            <button 
                onClick={handleClick} 
                className="bg-red hover:bg-dark-red text-white font-serif 
                    py-2 px-8 rounded-full text-[30px]">
                { "EXIT" } 
                <FontAwesomeIcon className='pl-2' icon={faX} />
            </button>
        </div>
    );
}

export function ButtonExit_ExitModal() {
    const handleClick = () => {
        window.location.href = '../../volunteer-unsaved';
    };
    
    return (
        <div>
            <button 
                onClick={handleClick} 
                className="bg-red hover:bg-dark-red text-white font-serif 
                    py-2 px-8 rounded-full text-[30px]">
                { "EXIT" } 
                <FontAwesomeIcon className='pl-2' icon={faX} />
            </button>
        </div>
    );
}

export function ButtonExitAnyway() {
    return (
        <div>
            <button className="bg-red hover:bg-dark-red text-white font-serif py-2 px-8 rounded-full">
                { "EXIT ANYWAY" } <FontAwesomeIcon className='pl-2' icon={faX} />
            </button>
        </div>
    );
}

export function ButtonNext() {
    return (
        <div>
            <button
                className="bg-light-green hover:bg-dark-green text-white font-serif py-2 px-8 rounded-full text-[30px]">
                { "NEXT" } <FontAwesomeIcon className='pl-2' icon={faArrowRight} />
            </button>
        </div>
    );
}

export function ButtonSubmit() {
    return (
        <div>
            <button className="bg-light-green hover:bg-dark-green text-white font-serif py-2 px-8 rounded-full">
                { "SUBMIT" } <FontAwesomeIcon className='pl-2' icon={faArrowRight} />
            </button>
        </div>
    );
}

export function ButtonBack() {
    return (
        <div>
            <button className="bg-transparent text-gray hover:text-black font-serif py-2 px-8 rounded-full text-[30px]">
            <FontAwesomeIcon className='pl-2' icon={faArrowLeft} /> { "BACK" }
            </button>
        </div>
    );
}

export function ButtonCancel() {
    return (
        <div>
            <button className="bg-transparent text-gray hover:text-black font-serif py-2 px-8 rounded-full text-[30px]">
                { "CANCEL" }
            </button>
        </div>
    );
}