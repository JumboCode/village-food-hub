//implements rounded dropdown menu
interface dropdownProps {
    options: string[];
    onChange?: (e: any) => void;
    setSubmitDisabled?: (disabled: boolean) => void;
    value?: string;
}

export function NameDropdown({ options = [], onChange, setSubmitDisabled, value }: dropdownProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(e);
        }
        if (setSubmitDisabled) {
            setSubmitDisabled(e.target.value === "");
        }
    };

    return (
        <select 
            className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray"
            onChange={handleChange} 
            value={value || ""}
        >
            <option disabled value=""></option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}