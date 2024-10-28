// This is where you will implement the progress bars (there are 5 total)

// Write your code here
"use client"

import React from 'react';

const ProgressBar = ({ value, max }) => {
    return (
        <progress value={value} max={max} style={{ width: '100%' }} />
    );
};
export default ProgressBar;
