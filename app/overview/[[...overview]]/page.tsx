'use client';
import React, { useState, useEffect } from "react";
import { NavBar } from '@app/components/NavBar';
import { useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import HourlyVisitsChart from '@app/components/HourlyVisitsChart';
import LoadingAnimation from "@app/components/LoadingAnimation";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DemographicsItem {
  lastVisitDate: string;
  householdSize: number;
  previousVisitDates: string[];
}

interface InventoryItem {
  name: string;
  categoryName: string;
  history: { date: string; action: string }[];
}

const hasAccess = (user: UserResource | null): boolean => {
  const role = user?.publicMetadata?.role;
  return role === 'Admin' || role === 'Staff';
};

const OverviewPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const isAuthorized = user && hasAccess(user);

  const [numResponses, setNumResponses] = useState<number | null>(null);
  const [numNewIndividuals, setNumNewIndividuals] = useState<number | null>(null);

  // house size
  const [houseSizeDistr, setHouseSizeDistr] = useState<number[] | null>(null);
  
  // visits tracker
  const [vistsLastWeek, setVisitsLastWeek] = useState<number[]>([]);
  const [vistsLastSixtyDays, setVisitsLastSixtyDays] = useState<number[]>([]);
  const [rawVisitsLastWeek, setRawVisitsLastWeek] = useState<number[]>([]);
  const [rawVisitsLastSixtyDays, setRawVisitsLastSixtyDays] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'average' | 'raw'>('raw');
  const [visitFrequencyData, setVisitFrequencyData] = useState<number[] | null>(null);
  const [numCookedMealsDisplay, setNumCookedMealsDisplay] = useState<string | null>(null);

  // unique items distributed
  const [uniqueItems, setUniqueItems] = useState<string | null>(null);
  
  // loading buffers
  const [isLoading12, setIsLoading12] = useState<boolean>(true);
  const [isLoading3, setIsLoading3] = useState<boolean>(false);
  const [isLoading4, setIsLoading4] = useState<boolean>(true);
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
      const avgLastWeek = new Array(24).fill(0);
      const avgLastSixtyDays = new Array(24).fill(0);
      const rawWeek = new Array(24).fill(0);
      const rawSixty = new Array(24).fill(0);
  
      try {
        const response = await fetch("../api/demographics");
        if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
  
        const data: DemographicsItem[] = await response.json();
        const currentMonthLocal = new Date().getMonth();
        const currentYearLocal = new Date().getFullYear();
  
        const servedThisMonth = data.filter(item => {
          const visitDate = new Date(item.lastVisitDate);
          return visitDate.getMonth() === currentMonthLocal && visitDate.getFullYear() === currentYearLocal;
        });
  
        setNumResponses(servedThisMonth.length);
  
        const visitCountsArray = new Array(10).fill(0);
        servedThisMonth.forEach(record => {
          const size = record.householdSize;
          if (size >= 1 && size <= 9) {
            visitCountsArray[size - 1] += 1;
          } else {
            visitCountsArray[9] += 1;
          }
        });
  
        setHouseSizeDistr(visitCountsArray);
  
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        const sixtyAgo = new Date(today);
        sixtyAgo.setDate(today.getDate() - 60);
  
        data.forEach((item) => {
          const visitDate = new Date(item.lastVisitDate);
          const hour = visitDate.getHours();
  
          if (visitDate >= weekAgo) {
            rawWeek[hour] += 1;
            avgLastWeek[hour] += 1 / 7;
          }
          if (visitDate >= sixtyAgo) {
            rawSixty[hour] += 1;
            avgLastSixtyDays[hour] += 1 / 60;
          }
        });
  
        setVisitFrequencyData(visitCountsArray);
  
        const newIndividuals = data.filter(item => {
          const lastVisit = new Date(item.lastVisitDate);
          const isLastVisitThisMonth =
            lastVisit.getMonth() === currentMonthLocal && lastVisit.getFullYear() === currentYearLocal;
        
          if (!isLastVisitThisMonth) return false;
        
          const allVisitsThisMonth =
            item.previousVisitDates &&
            item.previousVisitDates.length > 0 &&
            item.previousVisitDates.every(dateStr => {
              const prevDate = new Date(dateStr);
              return (
                prevDate.getMonth() === currentMonthLocal &&
                prevDate.getFullYear() === currentYearLocal
              );
            });
        
          // If no previous visits or all visits are in this month
          return item.previousVisitDates.length === 0 || allVisitsThisMonth;
        });
        
        setNumNewIndividuals(newIndividuals.length);
  
      } catch (error) {
        console.error("Error fetching data:", error);
        setNumResponses(0);
        setNumNewIndividuals(0);
        setVisitFrequencyData(new Array(10).fill(0));
      } finally {
        setRawVisitsLastWeek(rawWeek);
        setRawVisitsLastSixtyDays(rawSixty);
        setVisitsLastWeek(avgLastWeek);
        setVisitsLastSixtyDays(avgLastSixtyDays);
        setIsLoading12(false);
        setIsLoading4(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("../api/inventory");
        if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);

        const json = await response.json();
        const data: InventoryItem[] = json.data;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const filteredData = data.filter(item => {
          if (!item.history || typeof item.history !== 'object') return false;
          if (item.categoryName == "Cooked Meals") {
            return Object.values(item.history).some((subActionsArray) => {
              if (!Array.isArray(subActionsArray)) return false;
            
              return subActionsArray.some((subAction: { action: string; date: string; quantityChanged: number }) => {
                if (subAction.action !== 'remove') return false;
            
                const actionDate = new Date(subAction.date);
                return (
                  actionDate.getMonth() === currentMonth &&
                  actionDate.getFullYear() === currentYear
                );
              });
            });            
          }
        });

        let totalMeals = 0;
        filteredData.forEach(record => {
          if (!record.history || typeof record.history !== 'object') return;
          const history = Object.values(record.history).flat() as {
            date: string;
            action: string;
            quantityChanged: number;
          }[];
          
          history.forEach((element) => {
            if (element.action === "remove") {
              totalMeals += element.quantityChanged;
            }
          });              
        });
        setNumCookedMealsDisplay(String(totalMeals) + "+");
      } catch (error) {
        console.error("Error fetching data:", error);
        setNumCookedMealsDisplay(String(0));
      } 
    };

    fetchInventoryData();
  }, []);

  const householdSizeData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    datasets: [
      {
        data: houseSizeDistr,
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
              Welcome back, {user.firstName}! Here is an overview of{" "}
              <span className="text-light-green">this month</span> !
            </div>
          
          )}

          <div className="bg-light-green bg-opacity-20 p-6 rounded-xl shadow-inner mt-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Unique Individuals Served */}
              <StatCard title="Number of Unique Individuals Served" isLoading={isLoading12} value={numResponses} />

              {/* Household Size Pie Chart */}
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading12 || !houseSizeDistr ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
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

              {/* New Individuals Served - Placeholder */}
              <StatCard title="Number of First Time Visitors Served" isLoading={isLoading3} value={numNewIndividuals} />

              {/* Average Visits per week and last 60 days */}
              <div className="bg-white p-6 rounded-lg h-80 flex flex-col items-center justify-center shadow-md">
                {isLoading4 || !vistsLastWeek || !vistsLastSixtyDays ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                ) : (
                  <>
                    <div className="text-lg text-black font-crimson">Hourly Visit Stats</div>

                    {/* toggle buttons for raw visits and average visits */}
                    <div className="flex justify-center space-x-4 mb-2 pt-4">
                      <button
                        className={`px-3 py-1 rounded-full font-semibold ${
                          viewMode === 'raw' ? 'bg-dark-green text-white' : 'bg-gray-200 text-black'
                        }`}
                        onClick={() => setViewMode('raw')}
                      >
                        Raw Count
                      </button>
                      <button
                        className={`px-3 py-1 rounded-full font-semibold ${
                          viewMode === 'average' ? 'bg-dark-green text-white' : 'bg-gray-200 text-black'
                        }`}
                        onClick={() => setViewMode('average')}
                      >
                        Average
                      </button>
                    </div>

                    <div className="w-full h-full flex justify-center">
                      <HourlyVisitsChart
                        lastWeek={viewMode === 'average' ? vistsLastWeek : rawVisitsLastWeek}
                        lastSixtyDays={viewMode === 'average' ? vistsLastSixtyDays : rawVisitsLastSixtyDays}
                        viewMode={viewMode}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Cooked Meals */}
              <StatCard title="Number of Cooked Meals Served" isLoading={isLoading5} value={numCookedMealsDisplay} />

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
        <div className="text-5xl font-semibold font-crimson text-black mt-2">{value}</div>
      </>
    )}
  </div>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
);

export default OverviewPage;