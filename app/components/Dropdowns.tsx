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
  defaultValue?: string;
}

export function NameDropdown({
  options = [],
  onSelect = () => {},
  fetchUrl,
  filterName,
  currentDropdown,
  disabled,
  filterValue,
  defaultValue
}: NameDropdownProps) {
  const [items, setItems] = useState<string[]>(options);
  const [selected, setSelected] = useState<string>(defaultValue || "");
 
  useEffect(() => {
    async function fetchItems() {
      if (!fetchUrl) return; // Prevents fetching if fetchUrl is not provided

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('Failed to fetch items');

        const fetchedItems = await response.json();
        const itemNames = fetchedItems.map((item: FetchedItem) => item[filterName] as string);

        const filteredItems = filterValue
            ? fetchedItems
                .filter((item: FetchedItem) => item[filterName] === filterValue)
                .flatMap((item: FetchedItem) => (currentDropdown ? (item[currentDropdown] as string[] ?? []) : []))
            : itemNames;

        // Exclude empty or whitespace-only items.
        const nonEmptyItems = filteredItems.filter(
          (item: string) => item && item.trim() !== ''
        );

        setItems(Array.from(new Set(nonEmptyItems)));

        // Ensure previously selected value is retained if available
        if (defaultValue && nonEmptyItems.includes(defaultValue)) {
          setSelected(defaultValue);
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
      value={selected}
      onChange={(e) => {
        setSelected(e.target.value);
        onSelect(e.target.value);
      }}
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