'use client';
import React, { useState, useEffect } from "react";
import { NavBar } from '@app/components/NavBar';
import { useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import LoadingAnimation from "@app/components/LoadingAnimation";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataItem {
  lastVisitDate: string;
  householdSize: number;
}

interface InventoryItem {
  name: string;
  history: { date: string; action: string }[];
}

const hasAccess = (user: UserResource | null): boolean => {
  const role = user?.publicMetadata?.role;
  return role === 'Admin' || role === 'Staff';
};

const OverviewPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const isAuthorized = user && hasAccess(user);

  const [num_responses, setNumResponses] = useState<number | null>(null);
  const [uniqueItems, setUniqueItems] = useState<string | null>(null);
  const [visitFrequencyData, setVisitFrequencyData] = useState<number[] | null>(null);

  const [isLoading12, setIsLoading12] = useState<boolean>(true);
  const [isLoading3, setIsLoading3] = useState<boolean>(false);
  const [isLoading4, setIsLoading4] = useState<boolean>(false);
  const [isLoading5, setIsLoading5] = useState<boolean>(false);
  const [isLoading6, setIsLoading6] = useState<boolean>(true);



  useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const response = await fetch("../api/inventory");
        if (!response.ok) throw new Error("Error fetching inventory");
  
        const raw = await response.json();
        const data = raw.data;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const uniqueItems = new Set<string>();
  
        // Loop through the data array
        for (const item of data) {
          // Ensure the item is valid and has the required properties
          if (item && item.history && typeof item.history === "object") {
            // Loop through each entry in 'history' and validate that it's an array
            for (const events of Object.values(item.history)) {
              if (Array.isArray(events)) {
                // Loop through each event
                for (const event of events) {
                  const eventDate = new Date(event.date);
                  const isCurrentMonth =
                    eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
                  if (isCurrentMonth && event.action === "remove") {
                    uniqueItems.add(event.itemName); // Add item to set if it matches conditions
                    break; // Break once we've found a valid event for that item
                  }
                }
              }
            }
          }
        }
  
        // Update the state with the count of unique items
        const count = uniqueItems.size;
        const distributedCount = count > 0 ? `${count}` : "0";
        setUniqueItems(distributedCount);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setUniqueItems("--");
      } finally {
        setIsLoading6(false);
      }
    };
  
    fetchDistributionData();
  }, []);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("../api/demographics");
        if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);

        const data: DataItem[] = await response.json();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const filteredData = data.filter(item => {
          const visitDate = new Date(item.lastVisitDate);
          return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
        });

        setNumResponses(filteredData.length);

        const visitCountsArray = new Array(10).fill(0);
        filteredData.forEach(record => {
          const size = record.householdSize;
          if (size >= 1 && size <= 9) {
            visitCountsArray[size - 1] += 1;
          } else {
            visitCountsArray[9] += 1;
          }
        });

        setVisitFrequencyData(visitCountsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNumResponses(0);
        setVisitFrequencyData(new Array(10).fill(0));
      } finally {
        setIsLoading12(false);
      }
    };

    fetchData();
  }, []);

  const householdSizeData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    datasets: [
      {
        data: visitFrequencyData,
        backgroundColor: [
          "#3498DB", "#507c0c", "#24593D", "#EB2B0C", "#C31C01", "#3851BC",
          "#293b8b", "#828282", "#000000", "#ffe070"
        ],
        borderWidth: 1,
      },
    ],
  };

  if (!isLoaded) return <LoadingAnimation />;
  if (!isAuthorized) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="px-10">
        <div className="mt-10 mb-6 flex flex-col">
          {user && (
            <div className="text-[40px] relative overflow-x-auto font-crimson font-bold">
              Welcome back, {user.firstName}! Here is an overview of this month!
            </div>
          )}

          <div className="bg-light-green bg-opacity-20 p-6 rounded-xl shadow-inner mt-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Unique Individuals Served */}
              <StatCard title="Number of Unique Individuals Served" isLoading={isLoading12} value={num_responses} />

              {/* Household Size Pie Chart */}
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading12 || !visitFrequencyData ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="text-lg text-black font-crimson">Household Size</div>
                    <Pie
                      data={householdSizeData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            labels: { color: "#000000" },
                          },
                        },
                      }}
                    />
                  </>
                )}
              </div>

              {/* Placeholder Cards */}
              <StatCard title="Number of New Individuals Served" isLoading={isLoading3} value="--" />
              <StatCard title="TBD" isLoading={isLoading4} value="--" />
              <StatCard title="Number of Cooked Meals Served" isLoading={isLoading5} value="8+" /> {/* TODO: remove hardcoded 8+ */}

              {/* Unique Items Distributed */}
              <StatCard title="Number of Unique Items Distributed" isLoading={isLoading6} value={uniqueItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, isLoading, value }: { title: string; isLoading: boolean; value: string | number | null }) => (
  <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
    {isLoading ? (
      <Spinner />
    ) : (
      <>
        <div className="text-lg text-black font-crimson">{title}</div>
        <div className="text-3xl font-semibold font-crimson text-black mt-2">{value}</div>
      </>
    )}
  </div>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
);

export default OverviewPage;
