import { useEffect, useState } from 'react';

interface NameDropdownProps {
    options: string[];
    onSelect?: (selected: string) => void;
    fetchUrl?: string;
    filterName: string;
    currentDropdown: string;
    disabled?: boolean;
    filterValue?: string;
}

export function NameDropdown({ options = [], onSelect  = () => {}, fetchUrl, filterName, currentDropdown, disabled, filterValue}: NameDropdownProps) {
    const [items, setItems] = useState<string[]>(options);
    
    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const fetchedItems = await response.json();
                    const itemNames = fetchedItems.map((item: any) => item[filterName]);
                    
                    // If filterValue (category) is provided, filter the items based on category
                    const filteredItems = filterValue
                        ? fetchedItems
                            .filter((item: any) => {
                                return item[filterName] === filterValue;
                            })
                            .flatMap((item: any) => item[currentDropdown])
                        : itemNames;

                    const uniqueItemName: string[] = Array.from(new Set(filteredItems));
                    setItems(uniqueItemName);
                    const uniqueUnitName: string[] = Array.from(new Set(filteredItems));
                    console.log("unique unit name:", uniqueUnitName);
                } else {
                    throw new Error('Failed to fetch items');
                }
            } catch (error) {
                console.error('Failed to fetch items', error);
            }
        }

        fetchItems();
    }, [fetchUrl, filterName, filterValue, currentDropdown]);
    
    return (
        <select 
            className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray" 
            defaultValue=""
            onChange={(e) => onSelect(e.target.value)}
            disabled={disabled}
        >
            <option disabled value=""/>
            {items.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
            ))}
        </select>
    );
}