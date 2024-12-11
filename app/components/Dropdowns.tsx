//implements rounded dropdown menu
import { useEffect, useState } from 'react';

interface NameDropdownProps {
    options: string[];
    onSelect?: (selected: string) => void;
    fetchUrl?: string;
    filterName: string;
    disabled?: boolean;
    filterValue?: String
}

export function NameDropdown({ options = [], onSelect  = () => {}, fetchUrl, filterName, disabled, filterValue}: NameDropdownProps) {
    const [items, setItems] = useState<string[]>(options);
    //const [filteredItems, setFilteredItems] = useState<string[]>([]);
    
    useEffect(() => {
        async function fetchItems() {
            console.log("category chosen: ", filterValue);
            if (!fetchUrl) return;
            try {
                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const fetchedItems = await response.json();
                    const itemNames = fetchedItems.map((item: any) => item[filterName]);
                    
                    // If filterValue (category) is provided, filter the items based on category
                    const filteredItems = filterValue
                        ? fetchedItems
                            .filter((item: any) => item.category === filterValue)
                            .map((item: any) => item[filterName])
                        : itemNames;

                    /*if (filterValue) {
                        setFilteredItems(fetchedItems
                            .filter((item: any) => item.category === filterValue) // Filter items by category
                            .map((item: any) => item[filterName]));
                        }*/
                        
                    const uniqueItemName: string[] = Array.from(new Set(itemNames));
                    setItems(uniqueItemName);
                } else {
                    throw new Error('Failed to fetch items');
                }
            } catch (error) {
                console.error('Failed to fetch items', error);
            }
        }

        fetchItems();
    }, [fetchUrl, filterName, filterValue]);
    
    // useEffect(() => {
    //     console.log('Items state updated:', items);
    // }, [items]);
    
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