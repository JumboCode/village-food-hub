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
  previousVisitDates: string[];
}

// Role-based access check
const hasAccess = (user: UserResource | null): boolean => {
  const role = user?.publicMetadata?.role;
  return role === 'Admin' || role === 'Staff';
};

const OverviewPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const isAuthorized = user && hasAccess(user);

  const [num_responses, setNumResponses] = useState<number | null>(null);
  const [numNewIndividuals, setNumNewIndividuals] = useState<number | null>(null);
  const [visitFrequencyData, setVisitFrequencyData] = useState<number[] | null>(null);

  const [isLoading12, setIsLoading12] = useState<boolean>(true);
  const [isLoading3, setIsLoading3] = useState<boolean>(false);
  const [isLoading4, setIsLoading4] = useState<boolean>(false);
  const [isLoading5, setIsLoading5] = useState<boolean>(false);
  const [isLoading6, setIsLoading6] = useState<boolean>(false);

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
            visitCountsArray[9] += 1; // 10+ category
          }
        });

        setVisitFrequencyData(visitCountsArray);
        
        const servedThisMonth = data.filter(item => {
          const visitDate = new Date(item.lastVisitDate);
          return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
        });
        
        const newIndividuals = servedThisMonth.filter(item => {
          // If there are no previous visits, we consider this individual new.
          if (!item.previousVisitDates || item.previousVisitDates.length === 0) return true;
          // Otherwise, check that every previous visit is in the current month/year.
          return item.previousVisitDates.every(dateStr => {
            const prevDate = new Date(dateStr);
            return prevDate.getMonth() === currentMonth && prevDate.getFullYear() === currentYear;
          });
        });
        setNumNewIndividuals(newIndividuals.length);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNumResponses(0);
        setNumNewIndividuals(0);
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

  if (!isLoaded) {
    return <LoadingAnimation />;
  }

  if (!isAuthorized) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-red-600 text-2xl font-bold">Unauthorized Access</h1>
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
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading12 ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                ) : (
                  <>
                    <div className="text-lg text-black font-crimson">Number of Unique Individuals Served</div>
                    <div className="text-5xl font-bold font-crimson text-black mt-2">{num_responses}</div>
                  </>
                )}
              </div>

              {/* Household Size Pie Chart */}
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading12 || !visitFrequencyData ? (
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
                            labels: {
                              color: "#000000",
                            },
                          },
                        },
                      }}
                    />
                  </>
                )}
              </div>

              {/* New Individuals Served - Placeholder */}
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading3 ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                ) : (
                  <>
                    <div className="text-lg text-black font-crimson">Number of New Individuals Served</div>
                    <div className="text-5xl font-bold font-crimson text-black mt-2">
                      {numNewIndividuals}
                    </div>
                  </>
                )}
              </div>

              {/* TBD Placeholder */}
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading4 ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                ) : (
                  <>
                    <div className="text-lg text-black font-crimson">TBD</div>
                    <div className="text-3xl font-semibold font-crimson text-black mt-2">--</div>
                  </>
                )}
              </div>

              {/* Cooked Meals */}
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading5 || numNewIndividuals === null ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                ) : (
                  <>
                    <div className="text-lg text-black font-crimson">Number of Cooked Meals Served</div>
                    <div className="text-5xl font-bold font-crimson text-black mt-2">
                      {numNewIndividuals}
                    </div>
                  </>
                )}
              </div>

              {/* Unique Items Distributed */}
              <div className="bg-white p-6 rounded-lg h-48 flex flex-col items-center justify-center shadow-md">
                {isLoading6 ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
                ) : (
                  <>
                    <div className="text-lg text-black font-crimson">Number of Unique Items Distributed</div>
                    <div className="text-3xl font-semibold font-crimson text-black mt-2">--</div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OverviewPage;