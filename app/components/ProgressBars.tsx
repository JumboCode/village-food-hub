

const ProgressBar = ({ progress }) => {
  const container = {
    height: '20px',
    width: '100%',
    backgroundColor: '#e0e0df',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const fill = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor:'#90a955' ,
  };

  return (
    <div style={container}>
      <div style={fill}>
      </div>
    </div>
  );
};


export default ProgressBar;
