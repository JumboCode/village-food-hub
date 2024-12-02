//implements rounded dropdown menu

interface NameDropdownProps {
    options: string[];
    onSelect?: (selected: string) => void;
}

export function NameDropdown({ options = [], onSelect  = () => {} }: NameDropdownProps) {
    return (
        <select 
            className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray" 
            defaultValue=""
            onChange={(e) => onSelect(e.target.value)}
        >
            <option disabled value=""/>
            {options.map((option, index) => (
                    <option key={index} value={option}>
                    {option}
                    </option>
            ))}
        </select>
    )
}