//implements rounded dropdown menu

interface NameDropdownProps {
    options: string[];
}

export function NameDropdown({ options }: NameDropdownProps) {
    return (
        <select 
            className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray" 
            defaultValue=""
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