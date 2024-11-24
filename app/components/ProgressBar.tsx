const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="h-2.5 w-full bg-light-gray overflow-hidden">
      <div
        className="h-full bg-light-green"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;