import Image from "next/image";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        {/* <h1 className="text-4xl">Village Food Hub!</h1> */}
        <Button label={"Check Weather"}/>
      </div>

      
    </div>

    
  );
}
