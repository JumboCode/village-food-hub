import React from "react";
import NavBar from "@app/components/NavBar";
import { DemographicsSpreadsheet } from "@app/components/DemographicsSpreadsheet";

const InternalViewDemographicsPage: React.FC = () => {
    const demographicsItems = [
        ["2024-01-01", "(415)273-3832", "Tanisha", "10 winthrop st", 2, 3, 1],
        ["2024-01-02", "(344)343-3343", "Emily", "2 Medford ave", 2, 4, 3],
        ["2004-01-03", "(234)382-8392", "Karen", "15 Lane ave", 2, 5, 7],
        ["2024-01-03", "(234)338-2362", "Baren", "15 Lane ave", 4, 5, 7],
        ["2024-01-05", "(234)322-4392", "Kathy", "15 Lane ave", 1, 2, 7],
        ["2023-01-03", "(234)383-1392", "Bob", "15 Lane ave", 2, 6, 7],
        ["1999-01-03", "(323)438-5392", "Tyler", "15 Lane ave", 2, 5, 9],
    ];

    return (
        <div className="p-4">
            <h1 className="text-3xl font-[40px] font-bold mb-4">Demographic Responses</h1>
            <DemographicsSpreadsheet demographicsItems={demographicsItems} />
        </div>
    );
};

export default function DemographicsPage() {
    return (
        <>
            <NavBar />
            <InternalViewDemographicsPage />
        </>
    );
}