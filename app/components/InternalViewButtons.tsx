import Image from 'next/image';
import searchSymbol from "@app/images/searchSymbol.svg"
import filterSymbol from "@app/images/filterSymbol.svg"
import saveSymbol from "@app/images/saveSymbol.svg"

export const SearchBar = () => {
  return (
    <div className = "border-2 border-[#D9D9D9] rounded-xl w-[400px] h-[54px]">
      <div className = "flex flex-row py-2 px-2 items-center">
        <Image
            src={searchSymbol}
            alt="search button"
            className="pl-2"
            width={24}
            height={29.14}
        />
        <input
            className="pl-3 font-crimson placeholder:font-crimson text-[24px] focus:outline-none"
            placeholder="Search.."
          >
        </input>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  onClick?: () => void;
}
      
export const FilterButton = ({ onClick } : FilterButtonProps) => {
  return (
    <button className="border-2 border-[#D9D9D9] font-crimson rounded-xl ml-9 h-[54px]" onClick={onClick}>
      <div className="flex flex-row py-2 px-3">
        <Image
          src={filterSymbol}
          alt="filter button"
          width={24}
          height={29.14}
        />
        <div className="text-[20px] relative overflow-x-auto crimson-bold font-crimson pl-2">
          Filter
        </div>
      </div>
    </button>
  );
};


interface RunReportButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}


export const RunReportButton = ({ onClick, disabled }: RunReportButtonProps) => {
  return (
    <button className="border-2 border-[#7EB672] font-crimson rounded-xl ml-9 h-[54px] bg-[#7EB672]"
            onClick={onClick}
            disabled={disabled}
    >
      <div className="flex flex-row py-2 px-3">
        <Image
          src={saveSymbol}
          alt="Run Report button"
          width={24}
          height={29.14}
        />
        <div className="text-[20px] relative overflow-x-auto crimson-bold font-crimson text-white pl-2">
          Run Report
        </div>
      </div>
    </button>
  );
};