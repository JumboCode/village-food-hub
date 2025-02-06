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
                    const arr = [record.lastVisitDate.split('T')[0], record.phoneNumber, record.name, record.address, record.householdSize, record.takeCount, record.donateCount];
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
        downloadCSV(startDate, endDate);
        console.log("Run report from", startDate, "to", endDate);
    };

    const filterDate = (data:DemographicsRecord[], startDate: Date, endDate: Date) => {
        if (!startDate || !endDate) {
            return[];
        }
        return data.filter((record) => {
            const visitDate = new Date(record.lastVisitDate);
            return visitDate >= startDate && visitDate <= endDate;
        });
    };

    const downloadCSV = (startDate: Date, endDate: Date) => {
        const filteredData = filterDate(demographicsData, startDate, endDate);
        const headers = ["Phone Number", "Name", "Address", "Household Size", "Number of Receives"];
        const rows = [
            headers.join(","), 
            ...filteredData.map(record => [
                record.phoneNumber, 
                record.name, 
                record.address, 
                record.householdSize.toString(), 
                record.takeCount.toString()
            ].map(field => `"${field}"`).join(","))
        ].join("\r\n");

        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];
        const fileName = `${start}_-_${end}demographics.csv`;

        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


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