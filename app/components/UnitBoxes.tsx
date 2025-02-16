import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';

function AddUnitBox({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className='flex ml-[5%] mb-2'>
            <div className="font-crimson text-[30px] w-24 items-center">Units</div>
            <input
                type="text"
                onChange={onChange}
                className="flex w-[242px] h-[50px] rounded-[13px] border-[3px] border-[#E1E1E1] justify-center self-center"
            />
        </div>
    );
}

interface UnitBoxesProps {
    icon: StaticImageData;
    onUnitsChange?: (units: string[]) => void;
}

const UnitBoxes: React.FC<UnitBoxesProps> = ({ icon, onUnitsChange }) => {
    const [unitCount, setUnitCount] = useState(1);
    const [unitValues, setUnitValues] = useState<string[]>(Array(5).fill(""));

    const addUnit = () => {
        setUnitCount((prev) => (prev === 5 ? 5 : prev + 1));
    };

    const handleInputChange = (index: number, value: string) => {
        const newValues = [...unitValues];
        newValues[index] = value;
        setUnitValues(newValues);
        onUnitsChange?.(newValues);
    };

    return (
        <div className="flex flex-col">
            {[...Array(unitCount)].map((_, index) => (
                <div key={index} className="flex">
                    <AddUnitBox onChange={(e) => handleInputChange(index, e.target.value)} />
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

export default UnitBoxes