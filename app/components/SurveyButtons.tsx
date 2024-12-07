'use client'

import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonExit({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-red hover:bg-dark-red text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
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
        onClick={onClick}
        disabled={disabled}
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
        onClick={onClick}
        disabled={disabled}
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
        onClick={onClick}
        disabled={disabled}
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
        onClick={onClick}
        disabled={disabled}
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


export function ButtonRemove({ onClick, disabled }: ButtonProps) {
  return (
      <div>
          <button 
            className="w-[175px] bg-red hover:bg-dark-red text-white font-serif py-2 px-8 rounded-full"
            onClick={onClick}
            disabled={disabled}
        >
              { "REMOVE" }
          </button>
      </div>
  );
}

export function ButtonAdd({ onClick, disabled }: ButtonProps) {
  return (
      <div>
          <button 
            className="w-[175px] bg-light-green hover:bg-dark-green text-white font-serif py-2 px-8 rounded-full"
            onClick={onClick}
            disabled={disabled}
          >
              { "ADD" }
          </button>
      </div>
  );
}

export function ButtonEdit({ onClick, disabled }: ButtonProps) {
  return (
      <div>
          <button 
            className="bg-transparent text-gray hover:text-black font-serif py-2 px-8 rounded-full"
            onClick={onClick}
            disabled={disabled}
          >
          <FontAwesomeIcon className='pl-2' icon={faArrowLeft} /> { "EDIT" }
          </button>
      </div>
  );
}

export function YesProceed ({ onClick, disabled }: ButtonProps) {
    return (
        <div>
            <button 
            className="w-[300px] bg-light-green hover:bg-dark-green text-white font-serif py-2 px-8 rounded-full"
            onClick={onClick}
              disabled={disabled}
            >
                { "Yes, proceed to survey" }
            </button>
        </div>
    );
  }

export function NoDone ({ onClick, disabled }: ButtonProps) {
    return (
        <div>
            <button 
            className="w-[300px] bg-red hover:bg-dark-red text-white font-serif py-2 px-8 rounded-full"
            onClick={onClick}
              disabled={disabled}
            >
                { "No, I'm done" }
            </button>
        </div>
    );
  }