import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';

function AddUnit({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return ( 
      <div className='flex justify-evenly mb-4'>
          <div className="font-crimson text-3xl">Units</div>
          <input
              type="text"
              onChange={onChange}
              className="flex w-64 h-12 bg-inherit rounded-xl border-4 border-gray-200 justify-center"
          />
      </div>     
    );
}

interface UnitBoxesProps {
    icon: StaticImageData;
}

const UnitBoxes: React.FC<UnitBoxesProps> = ({ icon }) => {
    const [unitCount, setUnitCount] = useState(1);
    const [unitValues, setUnitValues] = useState<string[]>(Array(5).fill(""));

    const addUnit = () => {
        setUnitCount((prev) => (prev === 5 ? 5 : prev + 1));
    };

    const handleInputChange = (index: number, value: string) => {
        const newValues = [...unitValues];
        newValues[index] = value;
        setUnitValues(newValues);
    };

    return (
        <div className="p-4 flex">
            <div className='flex-col'>
                {[...Array(unitCount)].map((_, index) => (
                    <AddUnit key={index} onChange={(e) => handleInputChange(index, e.target.value)} />
                ))}
            </div>

            <button onClick={addUnit} className="mt-2 self-end">
                <Image src={icon} width={18} height={18} alt="Add Unit" />
            </button>
        </div>
    );
};

export default UnitBoxes