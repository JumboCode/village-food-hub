"use client"
import React, { useEffect } from "react";
import NavBar from "@app/components/NavBar";
import { DemographicsSpreadsheet } from "@app/components/DemographicsSpreadsheet";
import { SearchBar, RunReportButton } from "@app/components/InternalViewButtons";


const demographicsData = [];

function getDemographics() {
    
    try {
        return fetch("/../api/demographics", { method: 'GET' })
        .then((response) => {
            if (!response.ok) throw response;
            return response.json();
        })
        .then((data) => {
            demographicsData.push(data);
            return data;
        })
        .then((demographicsData) => {

                const rearrangedData = demographicsData.map((record: any) => {
                    const arr = [record.lastVisitDate.split('T')[0], record.phoneNumber, record.name, record.address, record.householdSize, record.takeCount, record.donateCount];
                    return arr
                });


                return rearrangedData;
            });


    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
        
}


const InternalViewDemographicsPage: React.FC = () => {
    const [demographics, setDemographics] = React.useState<any>();
      useEffect(() => {
        getDemographics()
          .then((items: any) => { setDemographics(items) })
      }, []);
    return (
        <div>
            <NavBar />
            <div className="py-4 px-10">
                <div className="flex flex-row justify-between mt-10 mb-6">
                    <h1 className="font-crimson text-3xl text-[40px] font-bold">Demographic Responses</h1>
                    <div className="flex flex-row">
                        <SearchBar/>
                        <RunReportButton/>
                    </div>
                </div>
                <DemographicsSpreadsheet demographicsItems={demographics} />
            </div>
        </div>
    );
};

export default InternalViewDemographicsPage;
