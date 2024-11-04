const ProgressBar = ({ progress }) => {
  return (
    <div className="h-2.5 w-4/5 bg-gray-300 overflow-hidden">
      <div
        className="h-full bg-light-green"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;