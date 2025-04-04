'use client'

import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonExit({ onClick, disabled }: ButtonProps) {
  const [exit, setexit] = useState([
      "EXIT",
    ]);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {
        const defaultexit = [
          "EXIT",
        ];
        const newexit = [...defaultexit];
        if (language !== "en") {
          for (let i = 0; i < defaultexit.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultexit[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newexit[i] = translationArray.map(t => t[0]).join('');
          }
        }
        setexit(newexit);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      <button 
        className="bg-red hover:bg-dark-red text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { exit[0] } <FontAwesomeIcon className='pl-3' icon={faX} />
      </button>
    </div>
  );
}

export function ButtonDelete({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-red hover:bg-dark-red text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { "Delete" } 
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
  const [next, setnext] = useState([
    "NEXT",
  ]);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {
        const defaultnext = [
          "NEXT",
        ];
        const newnext = [...defaultnext];
        if (language !== "en") {
          for (let i = 0; i < defaultnext.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultnext[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newnext[i] = translationArray.map(t => t[0]).join('');
          }
        }
        setnext(newnext);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      <button
        className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { next[0] } <FontAwesomeIcon className='pl-3' icon={faArrowRight} />
      </button>
    </div>
  );
}

export function ButtonSubmit({ onClick, disabled }: ButtonProps) {
  const [submit, setsubmit] = useState([
    "SUBMIT",
  ]);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {
        const defaultsubmit = [
          "SUBMIT",
        ];
        const newsubmit = [...defaultsubmit];
        if (language !== "en") {
          for (let i = 0; i < defaultsubmit.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultsubmit[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newsubmit[i] = translationArray.map(t => t[0]).join('');
          }
        }
        setsubmit(newsubmit);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  
  return (
    <div>
      <button 
        className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { submit[0] } <FontAwesomeIcon className='pl-3' icon={faArrowRight} />
      </button>
    </div>
  );
}

export function ButtonSave({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="bg-light-green hover:bg-dark-green text-white font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { "SAVE" }
      </button>
    </div>
  );
}

export function ButtonBack({ onClick, disabled }: ButtonProps) {
  const [back, setback] = useState([
    "BACK",
  ]);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {
        const defaultback = [
          "BACK",
        ];
        const newback = [...defaultback];
        if (language !== "en") {
          for (let i = 0; i < defaultback.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultback[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newback[i] = translationArray.map(t => t[0]).join('');
          }
        }
        setback(newback);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  
  return (
    <div>
      <button 
        className="bg-transparent text-gray hover:text-black font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        <FontAwesomeIcon className='pr-3' icon={faArrowLeft} /> { back[0] }
      </button>
    </div>
  );
}

export function ButtonCancel({ onClick, disabled }: ButtonProps) {
  const [cancel, setcancel] = useState([
    "CANCEL",
  ]);

  useEffect(() => {
    const language = localStorage.getItem("language") || "en";
    (async () => {
      try {
        const defaultcancel = [
          "CANCEL",
        ];
        const newcancel = [...defaultcancel];
        if (language !== "en") {
          for (let i = 0; i < defaultcancel.length; i++) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(defaultcancel[i])}`;
            const response = await fetch(url);
            const data = await response.json();
            // Cast data[0] as string[][] and map over it.
            const translationArray = data[0] as string[][];
            newcancel[i] = translationArray.map(t => t[0]).join('');
          }
        }
        setcancel(newcancel);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  
  return (
    <div>
      <button 
        className="bg-transparent text-gray hover:text-black font-serif py-3 px-8 rounded-full text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { cancel[0] }
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