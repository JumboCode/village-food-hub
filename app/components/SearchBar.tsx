import Image from 'next/image';
import searchSymbol from "@app/images/searchSymbol.svg"

const SearchBar = ({}: {}) => {
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
              <input className="pl-3 focus:outline-none text-[24px] crimson-bold" placeholder="Search.."></input>
            </div>
          </div>
        );
      };
      
export default SearchBar;