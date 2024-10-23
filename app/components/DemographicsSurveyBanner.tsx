// This is where you will implement the green banner (demographics survey banner)
// which will be displayed on the top of the page for the user to take the survey.

// Write your code here

export default function Banner() {
    const myStyles = {
        // display: 'flex',
        // flex-direction: 'row',
        // align-items: 'center',
        // padding: '0px',

        position: 'absolute',
        width: '1440px',
        height: '135px',
        left: '0px',
        top: '0px',

        background: '#24593D',
        // box-shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
   };
   
    return (
      <div style={myStyles} className="banner">
        <div className="banner-content">
          <h1>Demographic Survey</h1>
        </div>
      </div>
    );
}
  
    
// textAlign: 'center',
// marginTop: '2rem',
// color: 'white',
// backgroundColor: '#24593D',
// height: '135px',