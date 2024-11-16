'use client'

// Importing icons
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ButtonExit component with proper props
interface ButtonProps {
  onClick?: () => void; // onClick is optional for some buttons
  disabled?: boolean;   // disabled is optional
}

export function ButtonExit({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-red hover:bg-dark-red text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick} // Handle onClick
        disabled={disabled} // Handle disabled state
      >
        { "EXIT" } <FontAwesomeIcon className='pl-3' icon={faX} />
      </button>
    </div>
  );
}

export function ButtonExitAnyway({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-red hover:bg-dark-red text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick} // Handle onClick
        disabled={disabled} // Handle disabled state
      >
        { "EXIT ANYWAY" } <FontAwesomeIcon className='pl-3' icon={faX} />
      </button>
    </div>
  );
}

export function ButtonNext({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button
        className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick} // Handle onClick
        disabled={disabled} // Handle disabled state
      >
        { "NEXT" } <FontAwesomeIcon className='pl-3' icon={faArrowRight} />
      </button>
    </div>
  );
}

export function ButtonSubmit({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick} // Handle onClick
        disabled={disabled} // Handle disabled state
      >
        { "SUBMIT" } <FontAwesomeIcon className='pl-3' icon={faArrowRight} />
      </button>
    </div>
  );
}

export function ButtonBack({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-transparent text-gray hover:text-black font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick} // Handle onClick
        disabled={disabled} // Handle disabled state
      >
        <FontAwesomeIcon className='pr-3' icon={faArrowLeft} /> { "BACK" }
      </button>
    </div>
  );
}

export function ButtonCancel({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-transparent text-gray hover:text-black font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { "CANCEL" }
      </button>
    </div>
  );
}
