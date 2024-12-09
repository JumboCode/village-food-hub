//implements rounded dropdown menu
import { useEffect, useState } from 'react';
// import {getAllCategories} from '@app/api/categories/route';

interface NameDropdownProps {
    options: string[];
    onSelect?: (selected: string) => void;
    fetchUrl: string;
}

export function NameDropdown({ options = [], onSelect  = () => {}, fetchUrl}: NameDropdownProps) {
    const [items, setItems] = useState<string[]>(options);

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const fetchedItems = await response.json();
                    const itemNames = fetchedItems.map((item: { name: string }) => item.name);
                    setItems(itemNames);
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