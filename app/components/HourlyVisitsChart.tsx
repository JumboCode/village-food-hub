'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

interface HourlyVisitsChartProps {
    lastWeek: number[];
    lastSixtyDays: number[];
}


const HourlyVisitsChart: React.FC<HourlyVisitsChartProps> = ({ lastWeek, lastSixtyDays }) => {
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
                    boxWidth: 0,
                    generateLabels: function(chart: any) {
                        return chart.data.datasets.map((dataset: any, i: number) => {
                            const meta = chart.getDatasetMeta(i);
                            const fadedColor = 'rgba(128, 128, 128, 0.5)';
                            const visibleColor = (i === 0)
                            ? '#24593D'
                            : 'rgb(137, 175, 132)';

                            return {
                                datasetIndex: i,
                                text: (i === 0 ? dataset.label + '          ' : dataset.label),
                                fillStyle: dataset.backgroundColor,
                                hidden: meta.hidden,
                                fontColor: meta.hidden ? fadedColor : visibleColor,
                                textDecoration: 'none',
                                fontStyle: 'normal',
                                strokeStyle: null,
                            };
                        });
                    },
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
                    font: {
                        size: 8,
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#000',
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };
    
    return <Chart type="bar" data={data} options={options} />;
};

export default HourlyVisitsChart;
