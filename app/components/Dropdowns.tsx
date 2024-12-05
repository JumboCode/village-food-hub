//implements rounded dropdown menu
interface dropdownProps {
    options: string[];
    onChange?: (e : any) => void;
}

export function NameDropdown( { options = [], onChange, onSelect } : dropdownProps ) {
    return (
        <select 
            className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray"
            onChange={onChange} 
            defaultValue="">
            <option disabled value=""/>
            {options.map((option, index) => (
                <option key={index} value={option}>
                {option}
                </option>
            ))}
        </select>
    )
}