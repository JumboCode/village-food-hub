import Link from 'next/link';

export default function OnboardingLandingPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <h1 className="text-4xl mb-8">Onboarding Buttons</h1>
      <Link href="/onboarding/EmilyDanielPage" className="text-blue-500 hover:underline">
        Emily & Daniel
      </Link>
      <Link href="/onboarding/ZoyaEllaPage" className="text-blue-500 hover:underline">
        Zoya & Ella
      </Link>
      <Link href="/onboarding/AmandaAlexPage" className="text-blue-500 hover:underline">
        Amanda & Alex 
      </Link>
      <Link href="/onboarding/VanessaTanishaPage" className="text-blue-500 hover:underline">
        Vanessa & Tanisha
      </Link>
    </div>
  );
}