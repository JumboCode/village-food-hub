import Image from 'next/image';
import searchSymbol from "@app/images/searchSymbol.svg"
import filterSymbol from "@app/images/filterSymbol.svg"

export const SearchBar = ({}: {}) => {
  return (
    <div className = "border-2 border-[#D9D9D9] rounded-xl shadow-lg w-[400px] h-[54px]">
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
      
export const FilterButton = ({} : {}) => {
  return (
    <button className="border-2 border-[#D9D9D9] font-crimson rounded-xl ml-9 h-[54px] shadow-lg">
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