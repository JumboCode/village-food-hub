'use client';

import {
    Chart as ChartJS,
    Chart as ChartJSInstance,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineController,
    BarController,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    PointElement,
    LineElement,
    LineController,
    Tooltip,
    Legend
);

interface HourlyVisitsChartProps {
    lastWeek: number[];
    lastSixtyDays: number[];
    viewMode: 'average' | 'raw';
}


const HourlyVisitsChart: React.FC<HourlyVisitsChartProps> = ({ lastWeek, lastSixtyDays, viewMode }) => {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const data = {
        labels,
        datasets: [
            {
                type: 'line' as const,
                label: 'Last 2 Months',
                data: lastSixtyDays,
                borderColor: '#24593D',
                backgroundColor: '#24593D',
                borderWidth: 2,
                tension: 0.3,
                fill: false,
                pointRadius: 2,
            },
            {
                type: 'bar' as const,
                label: 'Last Week',
                data: lastWeek,
                backgroundColor: 'rgb(188, 215, 186)',
                borderRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    color: '#000',
                    font: {
                      weight: 'bold' as const,
                    }                  
                },                  
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            x: {
              ticks: {
                color: '#000',
                font: { size: 8 },
              },
              title: {
                display: true,
                text: viewMode === 'raw' ? 'Visit Count' : 'Average Visits per Day',
                color: '#000',
                font: { size: 12, weight: 'bold' as const },
              },
            },
            y: {
                beginAtZero: true,
                ticks: {
                  color: '#000',
                  font: { size: 10 },
                },
                title: {
                  display: true,
                  text: viewMode === 'raw' ? 'Visit Count' : 'Average Visits per Day',
                  color: '#000',
                  font: { size: 12, weight: 'bold' as const },
                },
            },
        },          
    };
    
    return <Chart type="bar" data={data} options={options} />;
};

export default HourlyVisitsChart;
