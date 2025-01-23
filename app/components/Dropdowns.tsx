//implements rounded dropdown menu
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
    // console.log("filterValue:", filterValue)
    const [units, setUnits] = useState<string[]>(options);
    
    useEffect(() => {
        async function fetchItems() {
            // console.log("category chosen:", filterValue);
            if (!fetchUrl) return;
            try {
                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const fetchedItems = await response.json();
                    const itemNames = fetchedItems.map((item: any) => item[filterName]);
                    
                    // If filterValue (category) is provided, filter the items based on category
                    const filteredItems = filterValue
                        ? fetchedItems
                            .filter((item: any) => {
                                // console.log(`Filtering item:${item.name}`);
                                // console.log("filterValue:", filterValue);
                                // console.log("filterName:", filterName);
                                // console.log("current item:", item);
                                // console.log("current item filterName:", item[filterName]);
                                return item[filterName] === filterValue;
                            })
                            .flatMap((item: any) => item[currentDropdown])
                        : itemNames;
                    // console.log("filtered items:", filteredItems)

                    const uniqueItemName: string[] = Array.from(new Set(filteredItems));
                    setItems(uniqueItemName);
                    const uniqueUnitName: string[] = Array.from(new Set(filteredItems));
                    console.log("unique unit name:", uniqueUnitName);
                    // setUnits(uniqueUnitName);
                } else {
                    throw new Error('Failed to fetch items');
                }
            } catch (error) {
                console.error('Failed to fetch items', error);
            }
        }

        fetchItems();
    }, [fetchUrl, filterName, filterValue, currentDropdown]);
    
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