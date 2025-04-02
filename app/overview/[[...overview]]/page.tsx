'use client';
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { NavBar } from '@app/components/NavBar';
import { useUser } from "@clerk/nextjs";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const OverviewPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [num_responses, setNumResponses] = useState<number | null>(null);
  const [isLoading1, setIsLoading1] = useState<boolean>(true);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [isLoading3, setIsLoading3] = useState<boolean>(false);
  const [isLoading4, setIsLoading4] = useState<boolean>(false);
  const [isLoading5, setIsLoading5] = useState<boolean>(false);
  const [isLoading6, setIsLoading6] = useState<boolean>(false);

  interface DataItem {
    lastVisitDate: string;
  }

  interface ResponseItem {
    householdSize: number;
  }

  const fetchDemographicsCount = async () => {
    try {
      const response = await fetch("../api/demographics");
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
  
      const data = await response.json();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
  
      const filteredData = data.filter((item: DataItem) => {
        const visitDate = new Date(item.lastVisitDate);
        return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
      });
  
      return filteredData.length;
    } catch (error) {
      console.error("Error fetching demographics count:", error);
      return 0;
    }
  };
  
  useEffect(() => {
    fetchDemographicsCount().then(count => {
      setNumResponses(count);
      setIsLoading1(false);
    });
  }, []);

  interface VisitFrequencyData {
    frequency: number;
  }

  const [visitFrequencyData, setVisitFrequencyData] = useState<VisitFrequencyData[] | null>(null);
  const fetchVisitFrequency = async () => {
    try {
      const response = await fetch("../api/demographics");
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
  
      const data = await response.json();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
  
      const filteredData = data.filter((item: DataItem) => {
        const visitDate = new Date(item.lastVisitDate);
        return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
      });
  
      const visitCountsArray = new Array(10).fill(0);
  
      filteredData.forEach((record: ResponseItem) => {
        const frequency = record.householdSize;
        if (frequency == 11) {
          visitCountsArray[9] += 1;
        } else if (frequency >= 1 && frequency <= 9) {
          visitCountsArray[frequency - 1] += 1;
        }
      });
  
      return visitCountsArray;
    } catch (error) {
      console.error("Error fetching visit frequency:", error);
      return null;
    }
  };  

  useEffect(() => {
    fetchVisitFrequency().then((data) => {
      setVisitFrequencyData(data);
      setIsLoading2(false);
    });
  }, []);
  

  const householdSizeData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    datasets: [
      {
        data: visitFrequencyData,
        // IDK HOW TO GET THESE TO USE GLOBALS.CSS IM SORRY
        backgroundColor: ["#3498DB", "#507c0c", "#24593D", "#EB2B0C",
          "#C31C01", "#3851BC", "#293b8b", "#828282",
          "#000000", "#FFFFFF"
        ],
        borderWidth: 1, // 0 looks ugly
      },
    ],
  };
  
  return (
    <div>
      <NavBar />
      <div className="px-10">
        <div className="mt-10 mb-6 flex flex-col">
        {user && isLoaded && 
        <div className="text-[40px] relative overflow-x-auto font-crimson font-bold">
          Welcome back, {user.firstName}! Here is an overview of this month!
        </div>}
        <div className="grid grid-cols-3 gap-4"> 
          <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md border-t-4 border-light-green">
            {isLoading1 ? (
                <div className="flex justify-center items-center bg-transparent">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                </div>
              ) : (
                <>
                  <div className="text-lg text-black font-crimson">Number of Unique Individuals Served</div>
                  <div className="text-5xl font-bold text-black mt-2">{num_responses}</div>
                </>
              )}
            </div>
          <div className="bg-light-green text-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
            {isLoading2 ? (
              <div className="flex justify-center items-center bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
              </div>
            ) : (
              <>
                <div className="text-lg text-white font-crimson">Household Size</div>
                <Pie data={householdSizeData} options={{ maintainAspectRatio: false, responsive: true, plugins: {legend: {labels: {color: "#FFFFFF",},},}}}/>
              </>
            )}
          </div>
          <div className="bg-gradient-to-br from-gray-200 to-gray-100 p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-lg">
            {isLoading3 ? (
              <div className="flex justify-center items-center bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
              </div>
            ) : (
              <>
                <div className="text-lg text-black font-crimson">Take-Leave Ratio</div>
              </>
            )}
          </div>
          <div className="bg-gradient-to-br from-dark-green to-light-green p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-lg">
            {isLoading4 ? (
              <div className="flex justify-center items-center bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
              </div>
            ) : (
              <>
                <div className="text-lg text-black font-crimson">Number of New Individuals Served</div>
              </>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-xl border border-light-green">
            {isLoading5 ? (
              <div className="flex justify-center items-center bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
              </div>
            ) : (
              <>
                <div className="text-lg text-black font-crimson">Number of Cooked Meals Served</div>
              </>
            )}
          </div>
          <div className="bg-gradient-to-br from-light-green to-dark-green p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-lg">
            {isLoading6 ? (
              <div className="flex justify-center items-center bg-transparent">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
              </div>
            ) : (
              <>
                <div className="text-lg text-black font-crimson">Number of Unique Items Distributed</div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;