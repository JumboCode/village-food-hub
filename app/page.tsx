import Button from '../src/components/Button';

export default function Home() {
  return (
    <div className="flex align-middle text-center justify-center items-center h-screen bg-slate-100 text-red-400 w-50 border-4 border-blue-500 p-4 rounded-lg">
      <Button label="Click here for the weather!!!"/>
    </div>
  );
}