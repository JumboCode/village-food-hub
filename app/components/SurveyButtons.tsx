// This is where you will implement the survey buttons (there are 6 total)

// Write your code here
"use client"

// needed for special characters
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function ButtonExit() {
    return (
        <div>
            <button className="bg-red-700 hover:bg-red-800 text-white font-serif 
            py-2 px-8 rounded-full">{ "EXIT" } <FontAwesomeIcon className='pl-2' icon={faX} />
            </button>
        </div>
    );
  }

export function ButtonExitAnyway() {
    return (
        <div>
            <button className="bg-red-700 hover:bg-red-800 text-white font-serif py-2 px-8 rounded-full">
                { "EXIT ANYWAY" } <FontAwesomeIcon className='pl-2' icon={faX} />
            </button>
        </div>
    );
}

export function ButtonNext() {
    return (
        <div>
            <button
                className="bg-lime-600 hover:bg-lime-700 text-white font-serif py-2 px-8 rounded-full">
                { "NEXT" } <FontAwesomeIcon className='pl-2' icon={faArrowRight} />
            </button>
        </div>
    );
}

export function ButtonSubmit() {
    return (
        <div>
            <button className="bg-lime-600 hover:bg-lime-700 text-white font-serif py-2 px-8 rounded-full">
                { "SUBMIT" } <FontAwesomeIcon className='pl-2' icon={faArrowRight} />
            </button>
        </div>
    );
}

export function ButtonBack() {
    return (
        <div>
            <button className="bg-gray-300 hover:bg-gray-700 text-black font-serif py-2 px-8 rounded-full">
            <FontAwesomeIcon className='pl-2' icon={faArrowLeft} /> { "BACK" }
            </button>
        </div>
    );
}

export function ButtonCancel() {
    return (
        <div>
            <button className="bg-gray-300 hover:bg-gray-700 text-black font-serif py-2 px-8 rounded-full">
                { "CANCEL" }
            </button>
        </div>
    );
}