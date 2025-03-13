"use client"
import React, { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import NavBar from "@app/components/NavBar";
import { DemographicsSpreadsheet } from "@app/components/DemographicsSpreadsheet";
import { SearchBar, RunReportButton } from "@app/components/InternalViewButtons";
import DateRangeModal from "@app/components/DateRangeModal";
import ProgressBar from "@app/components/ProgressBar";
import crossIcon from '@app/images/cross-svgrepo-com.svg';
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";

// Define a type for the structure of each record returned by the API
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

// A simple fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Error fetching data");
    return res.json();
  });

// Neon fetch function remains the same
async function fetchNeonData() {
  try {
    // setIsLoading(true);
    const response = await fetch("/api/neon");
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return data.storageSize.project.written_data_bytes;
  } catch (error) {
    console.error("Error fetching Neon data:", error);
  } 
  // finally {
  //   setIsLoading(false);
  // }
}

const InternalViewDemographicsPage: React.FC = () => {
  // Use SWR to fetch the raw demographics data
  const { data: demographicsRawData, error: demographicsError } = useSWR<DemographicsRecord[]>('/api/demographics', fetcher);

  // Transform raw data into the format expected by the spreadsheet:
  // [date, phoneNumber, name, address, householdSize, takeCount, donateCount]
  const transformedDemographics = useMemo(() => {
    if (!demographicsRawData) return [];
    return demographicsRawData.map((record) => [
      record.lastVisitDate.split("T")[0],
      record.phoneNumber,
      record.name,
      record.address,
      record.householdSize.toString(),
      record.takeCount.toString(),
      record.donateCount.toString(),
    ]);
  }, [demographicsRawData]);

  // Local state for filtered data (based on search)
  const [filteredDemographics, setFilteredDemographics] = useState<string[][]>([]);
  const [searchInput, setSearchInput] = useState("");

  // Update filtered demographics when the search input or transformed data changes
  useEffect(() => {
    const filtered = transformedDemographics.filter((item) =>
      item[1].toUpperCase().includes(searchInput.toUpperCase()) ||
      item[2].toUpperCase().includes(searchInput.toUpperCase()) ||
      item[3].toUpperCase().includes(searchInput.toUpperCase())
    );
    setFilteredDemographics(filtered);
  }, [searchInput, transformedDemographics]);

  // Modal states for running reports
  const [showModal, setShowModal] = useState(false);
  const openModal = (): void => setShowModal(true);
  const closeModal = (): void => setShowModal(false);

  // Function to filter data by date using the raw data from SWR
  const filterDate = (data: DemographicsRecord[], startDate: Date, endDate: Date) => {
    if (!startDate || !endDate) return [];
    return data
      .map((record) => {
        let visitCount = 0;
        if (record.previousVisitDates && Array.isArray(record.previousVisitDates)) {
          visitCount = record.previousVisitDates
            .map((dateStr) => new Date(dateStr))
            .filter((date) => {
              const visitDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
              const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
              return visitDate >= start && visitDate <= end;
            }).length;
        }
        return { ...record, visitCount };
      })
      .filter((record) => record.visitCount > 0);
  };

  // Download CSV using raw data for filtering
  const downloadCSV = (startDate: Date, endDate: Date) => {
    const filteredData = filterDate(demographicsRawData || [], startDate, endDate);
    const headers = ["Phone Number", "Name", "Address", "Household Size", "Number of Receives"];
    const rows = [
      headers.join(","),
      ...filteredData.map((record) =>
        [
          record.phoneNumber,
          record.name,
          record.address,
          record.householdSize.toString(),
          record.visitCount.toString(),
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\r\n");

    const formatLocalDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split("T")[0];

    const start = formatLocalDate(startDate);
    const end = formatLocalDate(endDate);
    const fileName = `${start}_to_${end}_demographics.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunReport = (startDate: Date, endDate: Date) => {
    downloadCSV(startDate, endDate);
    setShowModal(false)
  };

  // States and logic for the storage modal remain unchanged
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showStorageCancel, setShowStorageCancel] = useState(false);
  const [checkedDelete, setCheckedDelete] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storagePercent, setStoragePercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get storage bytes and update state
  const getBytes = async () => {
    const bytes = await fetchNeonData();
    const mb = Number((bytes / (1024 * 1024)).toFixed(1));
    // Calculate percent as (used MB / 1000 MB) * 100
    const percent = Number(((mb / 1000) * 100).toFixed(1));
    console.log(mb, percent);
    setStorageUsed(mb);
    setStoragePercent(percent);
  };

  // Fetch storage info on mount and whenever raw demographics data changes
  useEffect(() => {
    getBytes();
  }, [demographicsRawData]);

  return (
    <div>
      <NavBar />
      <div className="py-4 px-10">
        <div className="flex flex-row justify-between mt-10 mb-6">
          <h1 className="font-crimson text-3xl text-[40px] font-bold">Demographic Responses</h1>
          <div className="flex flex-row items-center space-x-4">
            <SearchBar
              input={searchInput}
              setInput={setSearchInput}
              placeholder={"Search by name, phone number, or address..."}
            />
            <RunReportButton onClick={openModal} />
            {/* Button showing storage used with dynamic progress */}
            <button
              className="flex flex-col justify-center items-center w-[60px] space-y-[-5px]"
              onClick={() => setShowStorageModal(true)}
            >
              <ProgressBar progress={storagePercent} />
              <p className="font-crimson crimson-semibold text-[16px] pt-2">{storageUsed} MB</p>
            </button>
            {showModal && <DateRangeModal closeModal={closeModal} onRunReport={handleRunReport} />}

            {showStorageModal && (
              <div className="fixed inset-[-100px] flex items-center justify-center bg-opacity-50 bg-black z-50">
                <div className={`flex flex-col w-[455px] border-2 ${showStorageCancel ? "border-[#EB2B0C]" : "border-[#7EB672]"} bg-white z-50 rounded-[7px] px-7 py-5`}>
                  <div className="flex flex-row justify-center">
                    <div className="flex flex-col w-3/4">
                      <p className="font-crimson text-[32px]">{`Storage (${storagePercent}% full)`}</p>
                      <div className="flex w-full h-full">
                        <ProgressBar progress={storagePercent} />
                      </div>
                      <p className="font-crimson text-[24px] text-[#828282] pb-3">
                        {storageUsed} MB of 1GB storage used
                      </p>
                      <div className="flex flex-col space-y-1">
                        <p className="text-[16px] text-black">Want to clean up space?</p>
                        <div className="bg-[#B3B3B3] h-[1px]" />
                        <div className="flex flex-row">
                          <p className="text-[16px] text-black w-3/4">Demographics data</p>
                          <MdDeleteOutline
                              size={24}
                              className="cursor-pointer"
                              onClick={() => {
                                console.log("in here");
                                fetchNeonData();
                                setShowStorageCancel(true);
                              }}
                          />
                        </div>
                        <div className="bg-[#B3B3B3] h-[1px]" />
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
                          onClick={() => {
                            setShowStorageModal(false);
                            setShowStorageCancel(false);
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  {showStorageCancel && (
                    <div className="flex flex-col justify-start items-center">
                      <div className="flex pt-2 ml-[-10px]">
                        <p className="text-[24px] font-crimson">Confirm you want to clear the data from:</p>
                      </div>
                      <div className="flex flex-row space-x-4 w-full h-full justify-start items-center pb-2">
                        <input
                          id="default-checkbox"
                          type="checkbox"
                          className="w-6 h-6 border-[#828282] border-[1px] rounded checked:bg-light-green text-3xl"
                          checked={checkedDelete}
                          onChange={() => setCheckedDelete(!checkedDelete)}
                        />
                        <p className="text-[24px] font-crimson">Demographics</p>
                      </div>
                      <div className="flex flex-row space-x-4">
                        {/* Cancel Button */}
                        <button
                          className="flex items-center text-gray hover:bg-white font-serif w-[100px] h-[40px] rounded-[8px] border-[1px] border-gray text-[20px] justify-center"
                          onClick={() => setShowStorageCancel(false)}
                        >
                          Cancel
                        </button>

                        {/* Delete Button */}
                        {checkedDelete && (
                          <div>
                            <button
                              className="flex items-center text-white bg-red hover:bg-dark-red font-serif w-[100px] h-[40px] rounded-[8px] border-[1px] text-[20px] justify-center"
                              onClick={() => console.log("just pressed delete")}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Render the spreadsheet using the filtered demographics */}
        <DemographicsSpreadsheet demographicsItems={filteredDemographics} />
      </div>
    </div>
  );
};

export default InternalViewDemographicsPage;