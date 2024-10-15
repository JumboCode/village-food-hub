import Image from "next/image";
import WeatherButton from './components/Button';

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* <h1 className="text-4xl">Village Food Hub!</h1> */}
      <WeatherButton label="Get Weather" />
    </div>
  );
}
