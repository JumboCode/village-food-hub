import Link from 'next/link';
import Header from "./components/DemographicsSurveyBanner";

export default function Home() {
  return (
    <>
      {/* <div className="flex flex-col justify-center items-center h-screen">
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </Link>
      </div> */}
      <Header/>
    </>
  );
}