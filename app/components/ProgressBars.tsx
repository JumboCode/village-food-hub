const ProgressBar = ({ progress }) => {
  const container = {
    height: '10px',
    width: '80%',
    backgroundColor: '#e0e0df',
    overflow: 'hidden',
  };

  const fill = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor:'#65a30cff' ,
  };

  return (
    <div style={container}>
      <div style={fill}>
      </div>
    </div>
  );
};


export default ProgressBar;
