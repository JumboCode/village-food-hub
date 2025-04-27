const Checkbox = ({ state, setState }: { state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>> }) => {
    
    function updateState () {
        setState(!state);
    }

    return (
        <div className="flex items-center mb-4">
            <input 
                id="default-checkbox" 
                type="checkbox" 
                value="" 
                className="w-8 h-8 bg-[#bdbdbd] border-[#bdbdbd] rounded checked:bg-banner-green text-3xl"
                onClick={updateState}
            />
        </div>
    );
};

export default Checkbox;