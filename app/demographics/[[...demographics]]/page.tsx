"use client"
import React, { useEffect } from "react";
import NavBar from "@app/components/NavBar";
import { DemographicsSpreadsheet } from "@app/components/DemographicsSpreadsheet";


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
            <div className="p-4">
                <h1 className="font-crimson text-3xl font-[40px] font-bold m-4 mt-8">Demographic Responses</h1>
                <DemographicsSpreadsheet demographicsItems={demographics} />
            </div>
        </div>
    );
};

export default InternalViewDemographicsPage;
