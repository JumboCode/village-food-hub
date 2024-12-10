import React from "react";
import NavBar from "@app/components/NavBar";
import { DemographicsSpreadsheet } from "@app/components/DemographicsSpreadsheet";

const InternalViewDemographicsPage: React.FC = () => {
    const demographicsItems = [
        ["2024-01-01", "415273832", "Tanisha", 10, "pcs"],
        ["2024-01-02", "344343343", "Emily", 20, "kg"],
        ["2024-01-03", "234382392", "Karen", 15, "pcs"],
    ];

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Demographic Responses</h1>
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