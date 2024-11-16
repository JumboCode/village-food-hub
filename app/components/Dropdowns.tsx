//implements rounded dropdown menu
export function NameDropdown() {
    return (
        <select 
            className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray" 
            defaultValue=""
        >
            <option disabled value=""/>
            <option>Placeholder</option>
        </select>
    )
}