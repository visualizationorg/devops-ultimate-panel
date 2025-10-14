import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    LineController,
    BarController,
    PieController
} from 'chart.js';

// Tüm gerekli bileşenleri register et
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
    PieController
);

// Varsayılan chart options
export const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        }
    }
};

// Özel chart options
export const lineChartOptions = {
    ...defaultOptions,
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                drawBorder: false
            }
        }
    }
};

export const barChartOptions = {
    ...defaultOptions,
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

export const pieChartOptions = {
    ...defaultOptions,
    cutout: '0%'
}; 
