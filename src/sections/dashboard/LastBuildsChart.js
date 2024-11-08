import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// third-party
import ApexCharts from 'react-apexcharts';
import moment from 'moment';

const pat = process.env.REACT_APP_API_PAT;
const token = btoa(`:${pat}`);
const organization = 'nadidurna1';

// ==============================|| LAST BUILDS CHART ||============================== //

const LastBuildsChart = () => {
  const theme = useTheme();
  const { mode } = useConfig();

  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    const fetchProjectsAndBuilds = async () => {
      try {
        // Organizasyondaki projeleri çek
        const projectsResponse = await axios.get(
          `https://dev.azure.com/${organization}/_apis/projects?api-version=7.0`,
          {
            headers: {
              'Authorization': `Basic ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        const projects = projectsResponse.data.value;

        // Her proje için API çağrılarını paralel yap
        const buildPromises = projects.map(project =>
          axios.get(
            `https://dev.azure.com/${organization}/${project.name}/_apis/build/builds?api-version=7.0&$top=20`,
            {
              headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
              },
            }
          )
        );

        const buildResponses = await Promise.all(buildPromises);

        // Gelen sonuçları birleştir
        let allBuilds = buildResponses.flatMap(response => response.data.value);

        // Build'leri başlangıç zamanına göre sıralayıp ilk 20 tanesini seç
        const sortedBuilds = allBuilds
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
          .slice(0, 20);

        setBuilds(sortedBuilds);
      } catch (error) {
        console.error('Error fetching builds:', error);
      }
    };

    fetchProjectsAndBuilds();
  }, []);

  // Build sürelerini hesapla (sayı olarak)
  const buildDurations = builds.map((build) => {
    const startTime = moment(build.startTime);
    const finishTime = moment(build.finishTime);
    const duration = finishTime.diff(startTime, 'seconds');
    // const duration = (finishTime - startTime) / 1000 / 60; // Süreyi dakikaya çeviriyoruz
    return {
      name: build.project.name, // Proje adını kullanıyoruz
      duration: parseFloat(duration.toFixed(2)), // Süreyi sayısal olarak döndürüyoruz
    };
  });

  // ApexCharts options ve series ayarları
  const chartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: buildDurations.map(build => build.name), // Proje adlarını göster
      title: {
        text: 'Project Name'
      }
    },
    yaxis: {
      title: {
        text: 'Duration (seconds)'
      }
    },
    title: {
      text: 'Last 20 Builds',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    }
  };

  const chartSeries = [{
    name: 'Duration',
    data: buildDurations.map(build => build.duration) // Sayısal veri olarak süre
  }];

  return (
  <ApexCharts
    options={chartOptions}
    series={chartSeries}
    type="bar"
    height={350}
  />)
};

export default LastBuildsChart;
