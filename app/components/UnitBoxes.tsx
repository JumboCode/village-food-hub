import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

interface AddUnitBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function AddUnitBox({ value, onChange }: AddUnitBoxProps) {
  return (
    <div className='flex ml-[5%] mb-2'>
      <div className="font-crimson text-[28px] w-24 items-center">Units</div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="flex w-[242px] h-[50px] rounded-[13px] border-[3px] border-[#E1E1E1] justify-center self-center"
      />
    </div>
  );
}

interface UnitBoxesProps {
  icon: StaticImageData;
  onUnitsChange?: (units: string[]) => void;
  initialUnits?: string[];
}

const UnitBoxes: React.FC<UnitBoxesProps> = ({ icon, onUnitsChange, initialUnits = [] }) => {
  // Set unitCount to the length of initialUnits (or 1 if none provided)
  const [unitCount, setUnitCount] = useState(initialUnits.length > 0 ? initialUnits.length : 1);
  // Prepopulate unitValues with initialUnits; fill up to 5 slots with empty strings if needed.
  const [unitValues, setUnitValues] = useState<string[]>(
    initialUnits.length > 0 ? [...initialUnits, ...Array(5 - initialUnits.length).fill("")] : Array(5).fill("")
  );

  useEffect(() => {
    if (initialUnits.length > 0) {
      setUnitCount(initialUnits.length);
      setUnitValues([...initialUnits, ...Array(5 - initialUnits.length).fill("")]);
    }
  }, [initialUnits]);

  const addUnit = () => {
    setUnitCount((prev) => (prev === 5 ? 5 : prev + 1));
  };

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...unitValues];
    newValues[index] = value;
    setUnitValues(newValues);
    // Return only the filled boxes up to unitCount
    onUnitsChange?.(newValues.slice(0, unitCount));
  };

  return (
    <div className="flex flex-col">
      {[...Array(unitCount)].map((_, index) => (
        <div key={index} className="flex">
          <AddUnitBox 
            value={unitValues[index] || ""} 
            onChange={(e) => handleInputChange(index, e.target.value)} 
          />
          {index === unitCount - 1 && unitCount < 5 && (
            <button onClick={addUnit} className='ml-2'>
              <Image src={icon} width={18} height={18} alt="Add Unit" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UnitBoxes;