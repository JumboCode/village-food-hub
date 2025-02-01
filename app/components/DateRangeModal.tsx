'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";


interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function RunReportConfirmButton({ onClick, disabled }: ButtonProps) {
  return (
    <button className="border-1 border-[#7EB672] font-crimson rounded-xl ml-6 h-[54px] shadow-lg bg-[#7EB672]"
            onClick={onClick}
            disabled={disabled}
    >
      <div className="flex flex-row py-2 px-4">
        <div className="text-[20px] relative overflow-x-auto crimson-bold font-crimson text-white">
          Run Report
        </div>
      </div>
    </button>
  );
}

export function CancelButton({ onClick, disabled }: ButtonProps) {
  return (
    <div>
      <button 
        className="border-[#828282] border-[1px] text-gray font-serif py-2.5 px-4 rounded-xl text-[20px]"
        onClick={onClick}
        disabled={disabled}
      >
        { "CANCEL" }
      </button>
    </div>
  );
}

const CustomDatePickerInput = ({ value, onClick, onChange }: any) => (
  <div className="relative w-full">
    <input
      type="text"
      value={value}
      onClick={onClick}
      onChange={onChange}
      className="w-full rounded-xl border-[#E1E1E1] text-[26px] pr-10 p-2 focus:ring focus:ring-blue-300 text-[#828282]"
    />
    <FaCalendarAlt
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6 cursor-pointer text-[#7EB672]"
      onClick={onClick}
    />
  </div>
);


interface DateRangeModalProps {
  closeModal: () => void;
  onRunReport: (startDate: Date, endDate: Date) => void;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({ closeModal }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black 
                    bg-opacity-50 z-50">  
      <div className="g-modal-gray font-crimson
                    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    pt-8 shadow-lg rounded-lg bg-white p-6 pt-4 border-2 border-[#7EB672]"> 
        <div className="text-[32px] font-crimson mb-2"> Date Range</div>
        <div className="flex flex-row gap-x-4"> 
          <div> 
            <div className="flex flex-row items-center gap-x-2">
              <div className="text-[24px] font-crimson"> From </div>
              <div className="text-[16px] font-crimson"> (MM/DD/YY) </div> 
            </div>
            <div className="w-[170px] rounded-xl">
              <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  customInput={<CustomDatePickerInput />}
                />
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center gap-x-2">
              <div className="text-[24px] font-crimson"> Through </div>
              <div className="text-[16px] font-crimson"> (MM/DD/YY) </div> 
            </div>
            <div className="relative w-[170px] rounded-xl">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                customInput={<CustomDatePickerInput />}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-row justify-center mt-8">
          <CancelButton/>
          <RunReportConfirmButton/>
        </div>
      </div>
    </div>
  )
}
        
export default DateRangeModal;