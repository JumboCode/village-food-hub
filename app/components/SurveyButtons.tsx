"use client"

// needed for special characters
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function ButtonExit() {
    return (
        <div>
            <button className="bg-red hover:bg-dark-red text-white font-serif 
            py-2 px-8 rounded-full text-[36px]">{ "EXIT" } <FontAwesomeIcon className='pl-2' icon={faX} />
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
                className="bg-light-green hover:bg-dark-green text-white font-serif py-2 px-8 rounded-full text-[36px]">
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
            <button className="bg-transparent text-gray hover:text-black font-serif py-2 px-8 rounded-full text-[36px]">
            <FontAwesomeIcon className='pl-2' icon={faArrowLeft} /> { "BACK" }
            </button>
        </div>
    );
}

export function ButtonCancel() {
    return (
        <div>
            <button className="bg-transparent text-gray hover:text-black font-serif py-2 px-8 rounded-full">
                { "CANCEL" }
            </button>
        </div>
    );
}