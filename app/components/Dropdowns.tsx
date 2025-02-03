import { useEffect, useState } from 'react';

interface FetchedItem {
    [key: string]: string | string[];
}

interface NameDropdownProps {
    options?: string[];
    onSelect?: (selected: string) => void;
    fetchUrl?: string;
    filterName: string;
    currentDropdown?: string;
    disabled?: boolean;
    filterValue?: string;
    value?: string;
}

export function NameDropdown({
    options = [],
    onSelect = () => {},
    fetchUrl,
    filterName,
    currentDropdown,
    disabled,
    filterValue,
    value
}: NameDropdownProps) {
    const [items, setItems] = useState<string[]>(options);

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch(fetchUrl || '');
                if (response.ok) {
                    const fetchedItems: FetchedItem[] = await response.json();  // Explicitly type the fetched items
                    const itemNames = fetchedItems.map((item) => item[filterName] as string);

                    // If a filter is provided, filter the items based on the filter value
                    const filteredItems = filterValue
                        ? fetchedItems
                            // Apply filter
                            .filter((item) => item[filterName] === filterValue)
                            // Display list flattened
                            .flatMap((item) => currentDropdown && Array.isArray(item[currentDropdown]) ? item[currentDropdown] : [])
                        : itemNames;

                    const uniqueItemName: string[] = Array.from(new Set(filteredItems));
                    setItems(uniqueItemName);
                } else {
                    throw new Error('Failed to fetch items');
                }
            } catch (error) {
                console.error('Failed to fetch items', error);
            }
        }

        if (fetchUrl) {
            fetchItems();
        }
    }, [fetchUrl, filterName, filterValue, currentDropdown]);

    return (
        <div className="font-crimson">
            <select
                className="select select-bordered w-full max-w-m -mt-10 rounded-xl border-light-gray"
                value={value || ''} 
                onChange={(e) => onSelect(e.target.value)}
                disabled={disabled}
            >
                <option disabled value="" />
                {items.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}