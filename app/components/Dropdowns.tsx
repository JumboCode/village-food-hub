//implements rounded dropdown menu
import { useEffect, useState } from 'react';

interface NameDropdownProps {
    options: string[];
    onSelect?: (selected: string) => void;
    fetchUrl: string;
    filterName: string;
    disabled: boolean;
}

export function NameDropdown({ options = [], onSelect  = () => {}, fetchUrl, filterName, disabled}: NameDropdownProps) {
    const [items, setItems] = useState<string[]>(options);

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const fetchedItems = await response.json();
                    const itemNames = fetchedItems.map((item: any) => item[filterName]);
                    const uniqueItemName: string[] = Array.from(new Set(itemNames));
                    setItems(uniqueItemName);
                }
            } catch (error) {
                console.error('Failed to fetch items', error);
            }
        }

        fetchItems();
    }, [fetchUrl]);
    
    useEffect(() => {
        console.log('Items state updated:', items);
    }, [items]);
    
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
    )
}