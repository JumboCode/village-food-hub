"use client"
import React, { useEffect, useState } from "react";
import NavBar from "@app/components/NavBar";
import { DemographicsSpreadsheet } from "@app/components/DemographicsSpreadsheet";
import { SearchBar, RunReportButton } from "@app/components/InternalViewButtons";
import DateRangeModal from "@app/components/DateRangeModal"
import ProgressBar from "@app/components/ProgressBar"
import deleteIcon from '@app/images/delete.png';
import crossIcon from '@app/images/cross-svgrepo-com.svg';
import Image from 'next/image';

// Define a type for the structure of each record in demographicsData
interface DemographicsRecord {
    lastVisitDate: string;
    phoneNumber: string;
    name: string;
    address: string;
    householdSize: number;
    takeCount: number;
    donateCount: number;
    previousVisitDates: string[];
}

// Define the type for the demographics state
const demographicsData: DemographicsRecord[] = [];

// make a new modal 
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
          .then((items) => { 
            setDemographics(items);
            setFilteredDemographics(items);
        })
      }, []);
      
    const [showModal, setShowModal] = useState(false);
    
    const openModal = (): void => {
        setShowModal(true);
    };
    
    const closeModal = (): void => {
        setShowModal(false);
    };
    
    const handleRunReport = (startDate: Date, endDate: Date) => {
        downloadCSV(startDate, endDate);
    };

    const filterDate = (data: DemographicsRecord[], startDate: Date, endDate: Date) => {
        if (!startDate || !endDate) {
            return [];
        }
        
        return data
        .map((record) => {
            let visitCount = 0;
            if (record.previousVisitDates && Array.isArray(record.previousVisitDates)) {
                visitCount = record.previousVisitDates
                    .map(dateStr => new Date(dateStr)) 
                    .filter(date => {
                        const visitDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                        return visitDate >= start && visitDate <= end;
                    })
                    .length;
            }
            return {
                ...record,
                visitCount, 
            };
        })
        .filter(record => record.visitCount > 0);
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
                record.visitCount.toString()
            ].map(field => `"${field}"`).join(","))
        ].join("\r\n");

        const formatLocalDate = (date: Date) => {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate())
                .toISOString().split("T")[0];
        };

        const start = formatLocalDate(startDate);
        const end = formatLocalDate(endDate);
        const fileName = `${start}_to_${end}_demographics.csv`;

        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // states for the search bar
    const [searchInput, setSearchInput] = useState('');
    const [filteredDemographics, setFilteredDemographics] = useState<string[][] | null>(null);

    // when the search input is changed, refilter
    useEffect(() => {
        // filters the demographic's phone numbers, names, and addresses separately
        const phoneNumberIndices = demographics?.map((item) => item[1].toUpperCase().includes(searchInput.toUpperCase())) || [];
        const nameIndices = demographics?.map((item) => item[2].toUpperCase().includes(searchInput.toUpperCase())) || [];
        const addressIndices = demographics?.map((item) => item[3].toUpperCase().includes(searchInput.toUpperCase())) || [];

        const demoLength = demographics?.length || 0;
        const filteredDemographicsArray = [];
        // loops over the demographics and adds the ones that match the filter
        for (let i = 0; i < demoLength; i++) {
            if (phoneNumberIndices[i] || nameIndices[i] || addressIndices[i]) {
                filteredDemographicsArray.push(demographics![i]);
            }
        }
        
        // stores the filtered demographics
        setFilteredDemographics(filteredDemographicsArray);
    }, [searchInput, demographics]);

    // for the storage modal
    const [showStorageModal, setShowStorageModal] = useState(false);
    const [showStorageCancel, setShowStorageCancel] = useState(false);
    const [checkedDelete, setCheckedDelete] = useState(false);

    return (
        <div>
            <NavBar />
            <div className="py-4 px-10">
                <div className="flex flex-row justify-between mt-10 mb-6">
                    <h1 className="font-crimson text-3xl text-[40px] font-bold">Demographic Responses</h1>
                    <div className={`flex flex-row items-center ${!showStorageModal && !showModal && "space-x-4"}`}>
                        <SearchBar
                            input={searchInput}
                            setInput={setSearchInput}
                            placeholder={"Search by name, phone number, or address..."}
                        />
                        <RunReportButton onClick={openModal} />
                        {/* bar showing storage used */}
                        <button className = "flex flex-col justify-center items-center w-[60px] space-y-[-5px]" onClick={() => setShowStorageModal(true)}>
                            <ProgressBar progress={50}/>
                            <ProgressBar progress={50}/>
                            <p className="font-crimson crimson-semibold text-[16px] pt-2">500 MB</p>
                        </button>
                        {showModal && <DateRangeModal closeModal={closeModal} onRunReport={handleRunReport} /> }

                        {showStorageModal && 
                            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                                <div className={`flex flex-col w-[455px] border-2 ${showStorageCancel ? "border-[#EB2B0C]" : "border-[#7EB672]"} bg-white z-50 rounded-[7px] px-7 py-5`}>
                                    <div className="flex flex-row justify-center">
                                    <div className="flex flex-col w-3/4">
                                            <p className="font-crimson text-[32px]">Storage (50% full)</p>
                                            <div className="flex w-full h-full">
                                                <ProgressBar progress={50}/>
                                            </div>
                                            <p className="font-crimson text-[24px] text-[#828282] pb-3">500MB of 1GB storage used</p>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-[16px] text-black">Want to clean up space?</p>
                                                <div className="bg-[#B3B3B3] h-[1px]"/>
                                                <div className="flex flex-row">
                                                    <p className="text-[16px] text-black w-3/4">Demographics data</p>
                                                    <button>
                                                        <Image
                                                            src={deleteIcon}
                                                            width={18}
                                                            height={18}
                                                            alt="delete Icon"
                                                            className="py-0.5"
                                                            onClick={() => setShowStorageCancel(true)}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="bg-[#B3B3B3] h-[1px]"/>
                                                <p className="text-[16px] text-black">Inventory Data</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-start w-1/4">
                                            <button>
                                                <Image
                                                    src={crossIcon}
                                                    width={18}
                                                    height={18}
                                                    alt="cross Icon"
                                                    className=""
                                                    onClick={() => setShowStorageModal(false)}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                        
                                    {showStorageCancel &&
                                        <div className="flex flex-col justify-center items-center">
                                            <div className="flex flex-col pt-2">
                                                <p className="text-[24px] font-crimson">Confirm you want to clear the data from:</p>
                                            </div>
                                            <div className = "flex flex-row space-x-2">
                                                <input 
                                                id="default-checkbox" 
                                                type="checkbox" 
                                                className="w-6 h-6 bg-[#bdbdbd] border-[#bdbdbd] rounded checked:bg-banner-green text-3xl"
                                                checked={checkedDelete}
                                                onChange={() => setCheckedDelete(!checkedDelete)}
                                                />
                                                <p className="text-[24px] font-crimson">Demographics</p>
                                            </div>

                                                <button
                                                    className="flex text-gray hover:bg-white font-serif w-[117px] height-[46px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                                                    onClick={() => setShowStorageCancel(false)}
                                                >
                                                    Cancel
                                                </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {/* Pass the correctly typed demographics data to DemographicsSpreadsheet */}
                <DemographicsSpreadsheet demographicsItems={filteredDemographics || []} />
            </div>
        </div>
    );
};

export default InternalViewDemographicsPage;