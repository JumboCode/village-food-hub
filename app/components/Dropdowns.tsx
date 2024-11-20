//implements rounded dropdown menu
interface dropdownProps {
    onChange?: (e : any) => void;
}

export function NameDropdown( { onChange } : dropdownProps ) {
    return (
        <select 
            className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray"
            onChange={onChange} 
            defaultValue=""
        >
            <option disabled value=""/>
            <option>Placeholder</option>
        </select>
    )
}