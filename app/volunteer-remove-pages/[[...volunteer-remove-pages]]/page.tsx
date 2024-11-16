'use client'

import React, { useState } from 'react';
import VolunteerRemoveDetailsModule from '@app/components/volunteer-pages-modules/VolunteerRemoveDetailsModule';
import VolunteerRemoveConfirmModule from '@app/components/volunteer-pages-modules/VolunteerRemoveConfirmModule';
import { ButtonExit, ButtonBack, ButtonNext } from '@app/components/SurveyButtons';
import UpdateInventoryBanner from '@app/components/UpdateInventoryBanner';

type Step = 'details' | 'confirm';

const VolunteerRemovePages: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('details');

  const handleNext = () => {
    console.log('Next clicked, transitioning to confirm');
    setCurrentStep('confirm');
  };

  const handleBack = () => {
    console.log('Back clicked, currentStep:', currentStep);
    if (currentStep === 'confirm') {
      setCurrentStep('details');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Imported Banner */}
      <UpdateInventoryBanner />

      {/* Back and Exit buttons */}
      <div className="flex flex-row h-full w-full justify-between px-32 py-10">
        <ButtonBack onClick={handleBack} />
        <ButtonExit />
      </div>

      {/* Page content (Remove Details or Remove Confirm) */}
      <div className="flex justify-center w-full h-full">
        {/* Conditional rendering based on currentStep */}
        {currentStep === 'details' && (
          <div className="w-4/5 h-4/5">
            <VolunteerRemoveDetailsModule />
          </div>
        )}
        {currentStep === 'confirm' && (
          <div className="w-4/5 h-4/5">
            <VolunteerRemoveConfirmModule />
          </div>
        )}
      </div>

      {/* Next Button */}
      {currentStep === 'details' && (
        <div className="flex justify-center mt-8">
          <ButtonNext onClick={handleNext} />
        </div>
      )}
    </div>
  );
};

export default VolunteerRemovePages;