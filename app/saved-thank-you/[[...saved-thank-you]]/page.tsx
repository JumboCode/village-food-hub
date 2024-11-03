// This is where you will call your components!
// Write your code here
import React from 'react';
import './page.css';
import Banner from '../../components/DemographicsSurveyBanner';

// /Users/amandawu/Jumbocode/village-food-hub/app/saved-thank-you/[[...saved-thank-you]]/page.tsx
export default function SavedThankYou() {
    // const pagestyle: React.CSSProperties = {
    //         backgroundColor: "white",
    // };
    
    return (
        <div> 
            <Banner />
            <h1 className="header" >Thank you for saving your progress!</h1>
        </div>
        );
}

//make page white