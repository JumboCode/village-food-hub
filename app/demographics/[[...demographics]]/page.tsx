"use client"
import React, { useEffect, useState } from "react";
import NavBar from "@app/components/NavBar";
import { DemographicsSpreadsheet } from "@app/components/DemographicsSpreadsheet";
import { SearchBar, RunReportButton } from "@app/components/InternalViewButtons";
import DateRangeModal from "@app/components/DateRangeModal"

// Define a type for the structure of each record in demographicsData
interface DemographicsRecord {
    lastVisitDate: string;
    phoneNumber: string;
    name: string;
    address: string;
    householdSize: number;
    takeCount: number;
    donateCount: number;
}

// Define the type for the demographics state
const demographicsData: DemographicsRecord[] = [];

function getDemographics() {
    
    try {
        return fetch("/../api/demographics", { method: 'GET' })
        .then((response) => {
            if (!response.ok) throw response;
            return response.json();
        })
        .then((data) => {
            demographicsData.push(...data);  // Spread the fetched data into the demographicsData array
            return data;
        })
        .then((demographicsData) => {

                const rearrangedData = demographicsData.map((record: DemographicsRecord) => {
                    const arr = [new Date(record.lastVisitDate).toLocaleString("en-US", {timeZone: "America/New_York"}).split('T')[0], record.phoneNumber, record.name, record.address, record.householdSize == 11 ? "10+" : record.householdSize.toString(), record.takeCount, record.donateCount];
                    return arr;
                });

                return rearrangedData;
            });


    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
        
}

const InternalViewDemographicsPage: React.FC = () => {
    // Define the state to store demographics data with an appropriate type
    const [demographics, setDemographics] = useState<string[][] | null>(null);

    useEffect(() => {
        getDemographics()
          .then((items) => { setDemographics(items) })
      }, []);
      
    const [showModal, setShowModal] = useState(false);
    
    const openModal = (): void => {
        setShowModal(true);
    };
    
    const closeModal = (): void => {
        setShowModal(false);
    };

    const handleRunReport = (startDate: Date, endDate: Date) => {
        // Default implementation that does nothing
        console.log("Run report from", startDate, "to", endDate);
    };

    return (
        <div>
            <NavBar />
            <div className="py-4 px-10">
                <div className="flex flex-row justify-between mt-10 mb-6">
                    <h1 className="font-crimson text-3xl text-[40px] font-bold">Demographic Responses</h1>
                    <div className="flex flex-row">
                        <SearchBar/>
                        <RunReportButton onClick={openModal} />
                        {showModal && <DateRangeModal closeModal={closeModal} onRunReport={handleRunReport} /> }
                    </div>
                </div>
                {/* Pass the correctly typed demographics data to DemographicsSpreadsheet */}
                <DemographicsSpreadsheet demographicsItems={demographics || []} />
            </div>
        </div>
    );
};

export default InternalViewDemographicsPage;